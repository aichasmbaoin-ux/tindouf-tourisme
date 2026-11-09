import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  TourismRoute,
  Hotel,
  TravelAgency,
  Artisan,
  TouristSite,
  DirectorateInfo,
  HomepageSettings
} from '../types/tourism';
import {
  INITIAL_ROUTES,
  INITIAL_HOTELS,
  INITIAL_AGENCIES,
  INITIAL_ARTISANS,
  INITIAL_SITES,
  INITIAL_DIRECTORATE_INFO,
  INITIAL_HOMEPAGE_SETTINGS
} from '../data/initialData';

// Firestore collection paths
export const COLLECTIONS = {
  ROUTES: 'tourism_routes',
  STOPS: 'route_stops',
  HOTELS: 'hotels',
  AGENCIES: 'travel_agencies',
  ARTISANS: 'artisans',
  SITES: 'tourist_sites',
  DIRECTORATE: 'directorate_info',
  SETTINGS: 'homepage_settings'
};

// -------------------------------------------------------------
// Resilient Local Cache Helpers (Guaranteeing instant UI persistence)
// -------------------------------------------------------------
function sanitizeHotel(h: Hotel): { hotel: Hotel; wasRepaired: boolean } {
  const isUrlLike = (str?: string) =>
    !!str &&
    (str.startsWith('http://') ||
      str.startsWith('https://') ||
      str.includes('.jpg') ||
      str.includes('.jpeg') ||
      str.includes('.png') ||
      str.includes('.webp') ||
      str.includes('imgix.net') ||
      str.includes('.net/'));

  if (isUrlLike(h.name)) {
    let candidateImageUrl = h.name.trim();
    if (!candidateImageUrl.startsWith('http')) {
      candidateImageUrl = `https://${candidateImageUrl}`;
    }
    const orig = INITIAL_HOTELS.find(
      (ih) =>
        ih.id === h.id ||
        (h.address && ih.address.includes(h.address)) ||
        (h.managerName && ih.managerName === h.managerName)
    );

    return {
      hotel: {
        ...h,
        name: orig ? orig.name : 'نزل الطريق موتيل الخيمة',
        nameFr: orig ? orig.nameFr : 'Motel Routier El Khaima',
        imageUrl: candidateImageUrl || h.imageUrl
      },
      wasRepaired: true
    };
  }

  return { hotel: h, wasRepaired: false };
}

function getLocalCache<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`tindouf_db_${key}`);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    if (key === COLLECTIONS.DIRECTORATE && parsed) {
      let updated = false;
      if (parsed.logoUrl?.includes('unsplash.com') || !parsed.logoUrl) {
        parsed.logoUrl = INITIAL_DIRECTORATE_INFO.logoUrl;
        updated = true;
      }
      if (!parsed.headquartersImageUrl || parsed.headquartersImageUrl.includes('unsplash.com')) {
        parsed.headquartersImageUrl = INITIAL_DIRECTORATE_INFO.headquartersImageUrl;
        updated = true;
      }
      if (updated) {
        localStorage.setItem(`tindouf_db_${key}`, JSON.stringify(parsed));
      }
    }
    if (key === COLLECTIONS.HOTELS && Array.isArray(parsed)) {
      let anyRepaired = false;
      const cleanHotels = parsed.map((h: Hotel) => {
        const { hotel, wasRepaired } = sanitizeHotel(h);
        if (wasRepaired) anyRepaired = true;
        return hotel;
      });
      if (anyRepaired) {
        localStorage.setItem(`tindouf_db_${key}`, JSON.stringify(cleanHotels));
      }
      return cleanHotels as T;
    }
    return parsed;
  } catch {
    return defaultValue;
  }
}

function setLocalCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`tindouf_db_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// In-memory active listeners for instant state propagation
type Listener<T> = (data: T) => void;
const listeners = {
  routes: new Set<Listener<TourismRoute[]>>(),
  hotels: new Set<Listener<Hotel[]>>(),
  agencies: new Set<Listener<TravelAgency[]>>(),
  artisans: new Set<Listener<Artisan[]>>(),
  sites: new Set<Listener<TouristSite[]>>(),
  directorate: new Set<Listener<DirectorateInfo>>(),
  settings: new Set<Listener<HomepageSettings>>()
};

/**
 * Seed initial official Tindouf data into Firestore if not present
 */
export async function seedInitialDataIfNeeded(force = false): Promise<void> {
  try {
    // Also initialize local cache with authentic dataset
    if (force || !localStorage.getItem(`tindouf_db_${COLLECTIONS.HOTELS}`)) {
      setLocalCache(COLLECTIONS.ROUTES, INITIAL_ROUTES);
      setLocalCache(COLLECTIONS.HOTELS, INITIAL_HOTELS);
      setLocalCache(COLLECTIONS.AGENCIES, INITIAL_AGENCIES);
      setLocalCache(COLLECTIONS.ARTISANS, INITIAL_ARTISANS);
      setLocalCache(COLLECTIONS.SITES, INITIAL_SITES);
      setLocalCache(COLLECTIONS.DIRECTORATE, INITIAL_DIRECTORATE_INFO);
      setLocalCache(COLLECTIONS.SETTINGS, INITIAL_HOMEPAGE_SETTINGS);
    }

    const routesSnap = await getDocs(collection(db, COLLECTIONS.ROUTES)).catch(() => null);
    if (routesSnap && !routesSnap.empty && !force) {
      return; // Already populated in cloud
    }

    console.log('Seeding initial official Tindouf dataset to Firestore...');

    // 1. Seed Routes and their Stops
    for (const route of INITIAL_ROUTES) {
      const { stops, ...routeData } = route;
      await setDoc(doc(db, COLLECTIONS.ROUTES, route.id), {
        ...routeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).catch(err => console.warn('Seed route skip:', err));

      if (stops && stops.length > 0) {
        for (const stop of stops) {
          await setDoc(doc(db, COLLECTIONS.STOPS, stop.id), {
            ...stop,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }).catch(err => console.warn('Seed stop skip:', err));
        }
      }
    }

    // 2. Seed Hotels
    for (const hotel of INITIAL_HOTELS) {
      await setDoc(doc(db, COLLECTIONS.HOTELS, hotel.id), {
        ...hotel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).catch(err => console.warn('Seed hotel skip:', err));
    }

    // 3. Seed Agencies
    for (const agency of INITIAL_AGENCIES) {
      await setDoc(doc(db, COLLECTIONS.AGENCIES, agency.id), {
        ...agency,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).catch(err => console.warn('Seed agency skip:', err));
    }

    // 4. Seed Artisans
    for (const artisan of INITIAL_ARTISANS) {
      await setDoc(doc(db, COLLECTIONS.ARTISANS, artisan.id), {
        ...artisan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).catch(err => console.warn('Seed artisan skip:', err));
    }

    // 5. Seed Tourist Sites
    for (const site of INITIAL_SITES) {
      await setDoc(doc(db, COLLECTIONS.SITES, site.id), {
        ...site,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).catch(err => console.warn('Seed site skip:', err));
    }

    // 6. Seed Directorate Info
    await setDoc(doc(db, COLLECTIONS.DIRECTORATE, INITIAL_DIRECTORATE_INFO.id), {
      ...INITIAL_DIRECTORATE_INFO,
      updatedAt: new Date().toISOString()
    }).catch(err => console.warn('Seed directorate skip:', err));

    // 7. Seed Homepage Settings
    await setDoc(doc(db, COLLECTIONS.SETTINGS, INITIAL_HOMEPAGE_SETTINGS.id), {
      ...INITIAL_HOMEPAGE_SETTINGS,
      updatedAt: new Date().toISOString()
    }).catch(err => console.warn('Seed settings skip:', err));

    console.log('Official Tindouf dataset successfully initialized in Firestore.');
  } catch (err) {
    console.error('Error during dataset seeding:', err);
  }
}

/**
 * Subscribe to all tourist routes with real-time onSnapshot
 */
export function subscribeToRoutes(
  onUpdate: (routes: TourismRoute[]) => void,
  onError?: (err: unknown) => void
) {
  listeners.routes.add(onUpdate);
  // Emit current local cache immediately
  const initialLocal = getLocalCache<TourismRoute[]>(COLLECTIONS.ROUTES, INITIAL_ROUTES);
  onUpdate(initialLocal);

  const q = query(collection(db, COLLECTIONS.ROUTES));
  const unsub = onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        onUpdate(getLocalCache<TourismRoute[]>(COLLECTIONS.ROUTES, INITIAL_ROUTES));
        return;
      }

      // Fetch all stops
      let allStops: Record<string, any[]> = {};
      try {
        const stopsSnap = await getDocs(collection(db, COLLECTIONS.STOPS));
        stopsSnap.forEach((d) => {
          const stop = { id: d.id, ...d.data() } as any;
          if (!allStops[stop.routeId]) {
            allStops[stop.routeId] = [];
          }
          allStops[stop.routeId].push(stop);
        });
        Object.keys(allStops).forEach((k) => {
          allStops[k].sort((a, b) => (a.order || 0) - (b.order || 0));
        });
      } catch (e) {
        console.warn('Could not fetch stops:', e);
      }

      const routes = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as TourismRoute;
        const initialMatching = INITIAL_ROUTES.find((r) => r.id === docSnap.id);
        const stops = allStops[docSnap.id] || initialMatching?.stops || [];
        return {
          ...data,
          id: docSnap.id,
          stops
        };
      });

      setLocalCache(COLLECTIONS.ROUTES, routes);
      onUpdate(routes);
    },
    (error) => {
      console.warn('Routes subscription fallback to local cache:', error);
      onUpdate(getLocalCache<TourismRoute[]>(COLLECTIONS.ROUTES, INITIAL_ROUTES));
      if (onError) onError(error);
    }
  );

  return () => {
    listeners.routes.delete(onUpdate);
    unsub();
  };
}

/**
 * Subscribe to hotels
 */
export function subscribeToHotels(
  onUpdate: (hotels: Hotel[]) => void,
  onError?: (err: unknown) => void
) {
  listeners.hotels.add(onUpdate);
  // Emit current local cache immediately
  const initialLocal = getLocalCache<Hotel[]>(COLLECTIONS.HOTELS, INITIAL_HOTELS);
  onUpdate(initialLocal);

  const q = query(collection(db, COLLECTIONS.HOTELS));
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(getLocalCache<Hotel[]>(COLLECTIONS.HOTELS, INITIAL_HOTELS));
        return;
      }
      const list = snapshot.docs.map((docSnap) => {
        const rawHotel = { ...docSnap.data(), id: docSnap.id } as Hotel;
        const { hotel, wasRepaired } = sanitizeHotel(rawHotel);
        if (wasRepaired) {
          setDoc(doc(db, COLLECTIONS.HOTELS, hotel.id), {
            ...hotel,
            updatedAt: new Date().toISOString()
          }).catch((err) => console.warn('Auto-repair hotel sync error:', err));
        }
        return hotel;
      });
      setLocalCache(COLLECTIONS.HOTELS, list);
      onUpdate(list);
    },
    (error) => {
      console.warn('Hotels subscription fallback to local cache:', error);
      onUpdate(getLocalCache<Hotel[]>(COLLECTIONS.HOTELS, INITIAL_HOTELS));
      if (onError) onError(error);
    }
  );

  return () => {
    listeners.hotels.delete(onUpdate);
    unsub();
  };
}

/**
 * Subscribe to travel agencies
 */
export function subscribeToAgencies(
  onUpdate: (agencies: TravelAgency[]) => void,
  onError?: (err: unknown) => void
) {
  listeners.agencies.add(onUpdate);
  const initialLocal = getLocalCache<TravelAgency[]>(COLLECTIONS.AGENCIES, INITIAL_AGENCIES);
  onUpdate(initialLocal);

  const q = query(collection(db, COLLECTIONS.AGENCIES));
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(getLocalCache<TravelAgency[]>(COLLECTIONS.AGENCIES, INITIAL_AGENCIES));
        return;
      }
      const list = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id
      })) as TravelAgency[];
      setLocalCache(COLLECTIONS.AGENCIES, list);
      onUpdate(list);
    },
    (error) => {
      console.warn('Agencies subscription fallback to local cache:', error);
      onUpdate(getLocalCache<TravelAgency[]>(COLLECTIONS.AGENCIES, INITIAL_AGENCIES));
      if (onError) onError(error);
    }
  );

  return () => {
    listeners.agencies.delete(onUpdate);
    unsub();
  };
}

/**
 * Subscribe to artisans
 */
export function subscribeToArtisans(
  onUpdate: (artisans: Artisan[]) => void,
  onError?: (err: unknown) => void
) {
  listeners.artisans.add(onUpdate);
  const initialLocal = getLocalCache<Artisan[]>(COLLECTIONS.ARTISANS, INITIAL_ARTISANS);
  onUpdate(initialLocal);

  const q = query(collection(db, COLLECTIONS.ARTISANS));
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(getLocalCache<Artisan[]>(COLLECTIONS.ARTISANS, INITIAL_ARTISANS));
        return;
      }
      const list = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id
      })) as Artisan[];
      setLocalCache(COLLECTIONS.ARTISANS, list);
      onUpdate(list);
    },
    (error) => {
      console.warn('Artisans subscription fallback to local cache:', error);
      onUpdate(getLocalCache<Artisan[]>(COLLECTIONS.ARTISANS, INITIAL_ARTISANS));
      if (onError) onError(error);
    }
  );

  return () => {
    listeners.artisans.delete(onUpdate);
    unsub();
  };
}

/**
 * Subscribe to tourist sites
 */
export function subscribeToSites(
  onUpdate: (sites: TouristSite[]) => void,
  onError?: (err: unknown) => void
) {
  listeners.sites.add(onUpdate);
  const initialLocal = getLocalCache<TouristSite[]>(COLLECTIONS.SITES, INITIAL_SITES);
  onUpdate(initialLocal);

  const q = query(collection(db, COLLECTIONS.SITES));
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(getLocalCache<TouristSite[]>(COLLECTIONS.SITES, INITIAL_SITES));
        return;
      }
      const list = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id
      })) as TouristSite[];
      setLocalCache(COLLECTIONS.SITES, list);
      onUpdate(list);
    },
    (error) => {
      console.warn('Sites subscription fallback to local cache:', error);
      onUpdate(getLocalCache<TouristSite[]>(COLLECTIONS.SITES, INITIAL_SITES));
      if (onError) onError(error);
    }
  );

  return () => {
    listeners.sites.delete(onUpdate);
    unsub();
  };
}

/**
 * Subscribe to directorate info
 */
export function subscribeToDirectorateInfo(
  onUpdate: (info: DirectorateInfo) => void
) {
  listeners.directorate.add(onUpdate);
  const initialLocal = getLocalCache<DirectorateInfo>(COLLECTIONS.DIRECTORATE, INITIAL_DIRECTORATE_INFO);
  onUpdate(initialLocal);

  const ref = doc(db, COLLECTIONS.DIRECTORATE, INITIAL_DIRECTORATE_INFO.id);
  const unsub = onSnapshot(
    ref,
    (docSnap) => {
      if (docSnap.exists()) {
        const info = { ...docSnap.data(), id: docSnap.id } as DirectorateInfo;
        if (!info.logoUrl || info.logoUrl.includes('unsplash.com')) {
          info.logoUrl = INITIAL_DIRECTORATE_INFO.logoUrl;
        }
        if (!info.headquartersImageUrl || info.headquartersImageUrl.includes('unsplash.com')) {
          info.headquartersImageUrl = INITIAL_DIRECTORATE_INFO.headquartersImageUrl;
        }
        setLocalCache(COLLECTIONS.DIRECTORATE, info);
        onUpdate(info);
      } else {
        onUpdate(getLocalCache<DirectorateInfo>(COLLECTIONS.DIRECTORATE, INITIAL_DIRECTORATE_INFO));
      }
    },
    () => {
      onUpdate(getLocalCache<DirectorateInfo>(COLLECTIONS.DIRECTORATE, INITIAL_DIRECTORATE_INFO));
    }
  );

  return () => {
    listeners.directorate.delete(onUpdate);
    unsub();
  };
}

/**
 * Subscribe to homepage settings
 */
export function subscribeToHomepageSettings(
  onUpdate: (settings: HomepageSettings) => void
) {
  listeners.settings.add(onUpdate);
  const initialLocal = getLocalCache<HomepageSettings>(COLLECTIONS.SETTINGS, INITIAL_HOMEPAGE_SETTINGS);
  onUpdate(initialLocal);

  const ref = doc(db, COLLECTIONS.SETTINGS, INITIAL_HOMEPAGE_SETTINGS.id);
  const unsub = onSnapshot(
    ref,
    (docSnap) => {
      if (docSnap.exists()) {
        const s = { ...docSnap.data(), id: docSnap.id } as HomepageSettings;
        setLocalCache(COLLECTIONS.SETTINGS, s);
        onUpdate(s);
      } else {
        onUpdate(getLocalCache<HomepageSettings>(COLLECTIONS.SETTINGS, INITIAL_HOMEPAGE_SETTINGS));
      }
    },
    () => {
      onUpdate(getLocalCache<HomepageSettings>(COLLECTIONS.SETTINGS, INITIAL_HOMEPAGE_SETTINGS));
    }
  );

  return () => {
    listeners.settings.delete(onUpdate);
    unsub();
  };
}

// -------------------------------------------------------------
// Mutation operations with Guaranteed Persistence
// -------------------------------------------------------------

export async function saveRoute(route: TourismRoute): Promise<void> {
  const existing = getLocalCache<TourismRoute[]>(COLLECTIONS.ROUTES, INITIAL_ROUTES);
  const idx = existing.findIndex((r) => r.id === route.id);
  let updatedList: TourismRoute[];
  if (idx >= 0) {
    updatedList = [...existing];
    updatedList[idx] = { ...route, updatedAt: new Date().toISOString() };
  } else {
    updatedList = [{ ...route, updatedAt: new Date().toISOString() }, ...existing];
  }
  setLocalCache(COLLECTIONS.ROUTES, updatedList);
  listeners.routes.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.ROUTES}/${route.id}`;
  try {
    const { stops, ...routeData } = route;
    await setDoc(doc(db, COLLECTIONS.ROUTES, route.id), {
      ...routeData,
      updatedAt: new Date().toISOString()
    });

    if (stops && stops.length > 0) {
      for (const stop of stops) {
        await setDoc(doc(db, COLLECTIONS.STOPS, stop.id), {
          ...stop,
          routeId: route.id,
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.warn('Firestore route write warn:', error);
  }
}

export async function deleteRoute(routeId: string): Promise<void> {
  const existing = getLocalCache<TourismRoute[]>(COLLECTIONS.ROUTES, INITIAL_ROUTES);
  const updatedList = existing.filter((r) => r.id !== routeId);
  setLocalCache(COLLECTIONS.ROUTES, updatedList);
  listeners.routes.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.ROUTES}/${routeId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.ROUTES, routeId));
  } catch (error) {
    console.warn('Firestore route delete warn:', error);
  }
}

export async function saveRouteStop(stop: any): Promise<void> {
  const path = `${COLLECTIONS.STOPS}/${stop.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.STOPS, stop.id), {
      ...stop,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore stop write warn:', error);
  }
}

export async function deleteRouteStop(stopId: string): Promise<void> {
  const path = `${COLLECTIONS.STOPS}/${stopId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.STOPS, stopId));
  } catch (error) {
    console.warn('Firestore stop delete warn:', error);
  }
}

export async function saveHotel(hotel: Hotel): Promise<void> {
  // Always sanitize hotel to prevent image URLs from replacing the hotel name
  const { hotel: cleanHotel } = sanitizeHotel(hotel);

  // Update local cache & notify instantly
  const existing = getLocalCache<Hotel[]>(COLLECTIONS.HOTELS, INITIAL_HOTELS);
  const idx = existing.findIndex((h) => h.id === cleanHotel.id);
  let updatedList: Hotel[];
  if (idx >= 0) {
    updatedList = [...existing];
    updatedList[idx] = { ...cleanHotel, updatedAt: new Date().toISOString() };
  } else {
    updatedList = [{ ...cleanHotel, updatedAt: new Date().toISOString() }, ...existing];
  }
  setLocalCache(COLLECTIONS.HOTELS, updatedList);
  listeners.hotels.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.HOTELS}/${cleanHotel.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.HOTELS, cleanHotel.id), {
      ...cleanHotel,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore hotel write warn:', error);
  }
}

export async function deleteHotel(hotelId: string): Promise<void> {
  const existing = getLocalCache<Hotel[]>(COLLECTIONS.HOTELS, INITIAL_HOTELS);
  const updatedList = existing.filter((h) => h.id !== hotelId);
  setLocalCache(COLLECTIONS.HOTELS, updatedList);
  listeners.hotels.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.HOTELS}/${hotelId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.HOTELS, hotelId));
  } catch (error) {
    console.warn('Firestore hotel delete warn:', error);
  }
}

export async function saveAgency(agency: TravelAgency): Promise<void> {
  const existing = getLocalCache<TravelAgency[]>(COLLECTIONS.AGENCIES, INITIAL_AGENCIES);
  const idx = existing.findIndex((a) => a.id === agency.id);
  let updatedList: TravelAgency[];
  if (idx >= 0) {
    updatedList = [...existing];
    updatedList[idx] = { ...agency, updatedAt: new Date().toISOString() };
  } else {
    updatedList = [{ ...agency, updatedAt: new Date().toISOString() }, ...existing];
  }
  setLocalCache(COLLECTIONS.AGENCIES, updatedList);
  listeners.agencies.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.AGENCIES}/${agency.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.AGENCIES, agency.id), {
      ...agency,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore agency write warn:', error);
  }
}

export async function deleteAgency(agencyId: string): Promise<void> {
  const existing = getLocalCache<TravelAgency[]>(COLLECTIONS.AGENCIES, INITIAL_AGENCIES);
  const updatedList = existing.filter((a) => a.id !== agencyId);
  setLocalCache(COLLECTIONS.AGENCIES, updatedList);
  listeners.agencies.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.AGENCIES}/${agencyId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.AGENCIES, agencyId));
  } catch (error) {
    console.warn('Firestore agency delete warn:', error);
  }
}

export async function saveArtisan(artisan: Artisan): Promise<void> {
  const existing = getLocalCache<Artisan[]>(COLLECTIONS.ARTISANS, INITIAL_ARTISANS);
  const idx = existing.findIndex((a) => a.id === artisan.id);
  let updatedList: Artisan[];
  if (idx >= 0) {
    updatedList = [...existing];
    updatedList[idx] = { ...artisan, updatedAt: new Date().toISOString() };
  } else {
    updatedList = [{ ...artisan, updatedAt: new Date().toISOString() }, ...existing];
  }
  setLocalCache(COLLECTIONS.ARTISANS, updatedList);
  listeners.artisans.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.ARTISANS}/${artisan.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.ARTISANS, artisan.id), {
      ...artisan,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore artisan write warn:', error);
  }
}

export async function deleteArtisan(artisanId: string): Promise<void> {
  const existing = getLocalCache<Artisan[]>(COLLECTIONS.ARTISANS, INITIAL_ARTISANS);
  const updatedList = existing.filter((a) => a.id !== artisanId);
  setLocalCache(COLLECTIONS.ARTISANS, updatedList);
  listeners.artisans.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.ARTISANS}/${artisanId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.ARTISANS, artisanId));
  } catch (error) {
    console.warn('Firestore artisan delete warn:', error);
  }
}

export async function saveTouristSite(site: TouristSite): Promise<void> {
  const existing = getLocalCache<TouristSite[]>(COLLECTIONS.SITES, INITIAL_SITES);
  const idx = existing.findIndex((s) => s.id === site.id);
  let updatedList: TouristSite[];
  if (idx >= 0) {
    updatedList = [...existing];
    updatedList[idx] = { ...site, updatedAt: new Date().toISOString() };
  } else {
    updatedList = [{ ...site, updatedAt: new Date().toISOString() }, ...existing];
  }
  setLocalCache(COLLECTIONS.SITES, updatedList);
  listeners.sites.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.SITES}/${site.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.SITES, site.id), {
      ...site,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore site write warn:', error);
  }
}

export async function deleteTouristSite(siteId: string): Promise<void> {
  const existing = getLocalCache<TouristSite[]>(COLLECTIONS.SITES, INITIAL_SITES);
  const updatedList = existing.filter((s) => s.id !== siteId);
  setLocalCache(COLLECTIONS.SITES, updatedList);
  listeners.sites.forEach((fn) => fn(updatedList));

  const path = `${COLLECTIONS.SITES}/${siteId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.SITES, siteId));
  } catch (error) {
    console.warn('Firestore site delete warn:', error);
  }
}

export async function saveDirectorateInfo(info: DirectorateInfo): Promise<void> {
  setLocalCache(COLLECTIONS.DIRECTORATE, info);
  listeners.directorate.forEach((fn) => fn(info));

  const path = `${COLLECTIONS.DIRECTORATE}/${info.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.DIRECTORATE, info.id), {
      ...info,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore directorate write warn:', error);
  }
}

export async function saveHomepageSettings(settings: HomepageSettings): Promise<void> {
  setLocalCache(COLLECTIONS.SETTINGS, settings);
  listeners.settings.forEach((fn) => fn(settings));

  const path = `${COLLECTIONS.SETTINGS}/${settings.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, settings.id), {
      ...settings,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore settings write warn:', error);
  }
}
