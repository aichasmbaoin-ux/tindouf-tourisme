import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed as PWA or in full screen display)
    const isStandalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://'));
    setIsInstalled(!!isStandalone);

    // Detect OS & Browser environments
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(ua);
      const isAndroidDevice = /android/.test(ua);
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);

      // Detect in-app webviews (WhatsApp, Facebook, Instagram, Messenger, Telegram webview, Line)
      const inApp =
        /fban|fbav|instagram|messenger|whatsapp|wv|line|micromessenger/.test(ua) ||
        (isAndroidDevice && ua.includes('version/4.0'));
      setIsInAppBrowser(inApp);

      // Check if early prompt was already captured in window.__pwaInstallPrompt
      if ((window as any).__pwaInstallPrompt) {
        setDeferredPrompt((window as any).__pwaInstallPrompt);
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaInstallPrompt = e;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handlePromptAvailable = (e: any) => {
      if (e.detail) {
        setDeferredPrompt(e.detail as BeforeInstallPromptEvent);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      (window as any).__pwaInstallPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-prompt-available', handlePromptAvailable);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-available', handlePromptAvailable);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<'accepted' | 'dismissed' | 'manual_required'> => {
    let promptEvent =
      deferredPrompt ||
      (typeof window !== 'undefined' ? (window as any).__pwaInstallPrompt : null);

    // If prompt is not ready immediately, wait up to 1200ms
    if (!promptEvent && typeof window !== 'undefined') {
      promptEvent = await new Promise((resolve) => {
        let timer: any;
        const handler = (e: any) => {
          clearTimeout(timer);
          window.removeEventListener('pwa-prompt-available', handler);
          resolve(e.detail || (window as any).__pwaInstallPrompt);
        };
        window.addEventListener('pwa-prompt-available', handler);
        timer = setTimeout(() => {
          window.removeEventListener('pwa-prompt-available', handler);
          resolve((window as any).__pwaInstallPrompt || null);
        }, 1200);
      });
    }

    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          if (typeof window !== 'undefined') {
            (window as any).__pwaInstallPrompt = null;
          }
          return 'accepted';
        }
        return 'dismissed';
      } catch (err) {
        console.error('Error during PWA prompt:', err);
        return 'manual_required';
      }
    }
    return 'manual_required';
  };

  return {
    isInstallable: !!deferredPrompt || isIOS || isAndroid || isInAppBrowser,
    hasNativePrompt: !!deferredPrompt || (typeof window !== 'undefined' && !!(window as any).__pwaInstallPrompt),
    isInstalled,
    isIOS,
    isAndroid,
    isInAppBrowser,
    install,
  };
}

