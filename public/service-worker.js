// Service Worker for "مديرية السياحة والصناعة التقليدية لولاية تندوف"
// High-Reliability PWA Service Worker for Mobile & Desktop Browsers
const CACHE_NAME = 'tindouf-tourism-pwa-v3';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/assets/aistudio/Gemini_Generated_Image_jn52udjn52udjn52_bbdab105.jpg',
  '/assets/aistudio/_____________cbbb6806.jfif'
];

// Install Event: Cache essential shell and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('Precache partial fallback:', err);
      });
    })
  );
});

// Activate Event: Claim clients and purge obsolete caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Message Event: Allow skip waiting triggered from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Mandatory Fetch Handler required by modern Chromium for PWA installability
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Filter out non-GET or chrome-extension requests
  if (!req.url.startsWith('http') || req.method !== 'GET') {
    return;
  }

  // Do NOT cache Google Maps API script or sensitive auth tokens
  if (req.url.includes('maps.googleapis.com') || req.url.includes('identitytoolkit.googleapis.com') || req.url.includes('securetoken.googleapis.com')) {
    event.respondWith(fetch(req));
    return;
  }

  // HTML Page Navigation requests
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const fallbackIndex = await caches.match('/index.html') || await caches.match('/');
          if (fallbackIndex) return fallbackIndex;
          const fallbackOffline = await caches.match('/offline.html');
          return fallbackOffline || new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // Static Assets (Images, scripts, styles, fonts)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Stale-While-Revalidate: Return cached immediately, fetch fresh copy in background
        fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            }
          })
          .catch(() => {
            // Background network fail is safe since cached is returned
          });
        return cached;
      }

      // Not in cache: fetch from network and cache
      return fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return new Response('', { status: 408, statusText: 'Offline asset unavailable' });
        });
    })
  );
});
