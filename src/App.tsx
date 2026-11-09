import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { QuotaWarningBanner } from './components/QuotaWarningBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoutesSection } from './components/RoutesSection';
import { SitesSection } from './components/SitesSection';
import { HotelsSection } from './components/HotelsSection';
import { AgenciesSection } from './components/AgenciesSection';
import { ArtisansSection } from './components/ArtisansSection';
import { InteractiveMap } from './components/InteractiveMap';
import { DirectorateSection } from './components/DirectorateSection';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { ShareModal } from './components/ShareModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  TourismRoute,
  Hotel,
  TravelAgency,
  Artisan,
  TouristSite,
  DirectorateInfo,
  HomepageSettings
} from './types/tourism';
import {
  subscribeToRoutes,
  subscribeToHotels,
  subscribeToAgencies,
  subscribeToArtisans,
  subscribeToSites,
  subscribeToDirectorateInfo,
  subscribeToHomepageSettings,
  seedInitialDataIfNeeded
} from './services/dataService';
import {
  INITIAL_ROUTES,
  INITIAL_HOTELS,
  INITIAL_AGENCIES,
  INITIAL_ARTISANS,
  INITIAL_SITES,
  INITIAL_DIRECTORATE_INFO,
  INITIAL_HOMEPAGE_SETTINGS
} from './data/initialData';

const MainContent: React.FC = () => {
  const { language, t } = useLanguage();

  // Application Data States
  const [routes, setRoutes] = useState<TourismRoute[]>(INITIAL_ROUTES);
  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [agencies, setAgencies] = useState<TravelAgency[]>(INITIAL_AGENCIES);
  const [artisans, setArtisans] = useState<Artisan[]>(INITIAL_ARTISANS);
  const [sites, setSites] = useState<TouristSite[]>(INITIAL_SITES);
  const [directorateInfo, setDirectorateInfo] = useState<DirectorateInfo>(INITIAL_DIRECTORATE_INFO);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(INITIAL_HOMEPAGE_SETTINGS);

  // UI States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [highlightedRouteId, setHighlightedRouteId] = useState<string | null>(null);

  // Initialize and subscribe to Firestore
  useEffect(() => {
    // Attempt automatic seeding if Firestore is fresh
    seedInitialDataIfNeeded(false);

    const unsubRoutes = subscribeToRoutes(setRoutes);
    const unsubHotels = subscribeToHotels(setHotels);
    const unsubAgencies = subscribeToAgencies(setAgencies);
    const unsubArtisans = subscribeToArtisans(setArtisans);
    const unsubSites = subscribeToSites(setSites);
    const unsubDirectorate = subscribeToDirectorateInfo(setDirectorateInfo);
    const unsubSettings = subscribeToHomepageSettings(setHomepageSettings);

    return () => {
      unsubRoutes();
      unsubHotels();
      unsubAgencies();
      unsubArtisans();
      unsubSites();
      unsubDirectorate();
      unsubSettings();
    };
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreRouteOnMap = (routeId: string) => {
    setHighlightedRouteId(routeId);
    handleNavigateSection('interactive-map');
  };

  const handleShowCoordinatesOnMap = (lat: number, lng: number) => {
    handleNavigateSection('interactive-map');
  };

  // Filtered counts for statistics
  const counts = {
    routes: routes.filter((r) => r.isPublished !== false).length,
    hotels: hotels.filter((h) => h.isPublished !== false).length,
    agencies: agencies.filter((a) => a.isPublished !== false).length,
    artisans: artisans.filter((a) => a.isPublished !== false).length,
    sites: sites.filter((s) => s.isPublished !== false).length
  };

  // Search filtering logic across collections
  const filterBySearch = <T extends { name?: string; nameFr?: string; description?: string; descriptionFr?: string; fullName?: string; fullNameFr?: string; address?: string }>(items: T[]) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      const n = (item.name || item.fullName || '').toLowerCase();
      const nFr = (item.nameFr || item.fullNameFr || '').toLowerCase();
      const d = (item.description || '').toLowerCase();
      const dFr = (item.descriptionFr || '').toLowerCase();
      const a = (item.address || '').toLowerCase();
      return n.includes(q) || nFr.includes(q) || d.includes(q) || dFr.includes(q) || a.includes(q);
    });
  };

  const filteredRoutes = filterBySearch(routes);
  const filteredSites = filterBySearch(sites);
  const filteredHotels = filterBySearch(hotels);
  const filteredAgencies = filterBySearch(agencies);
  const filteredArtisans = filterBySearch(artisans);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-700 selection:text-white">
      {/* Tier 1 Maps Quota Exceeded Sticky Banner */}
      <QuotaWarningBanner />

      {/* Official Government & Wilaya Header */}
      <Navbar
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onNavigateSection={handleNavigateSection}
        logoUrl={directorateInfo?.logoUrl}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      <main>
        {/* Hero Section with Panorama & Search */}
        <div id="hero">
          <Hero
            settings={homepageSettings}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={(f) => {
              setActiveFilter(f);
              if (f === 'routes') handleNavigateSection('routes');
              else if (f === 'sites') handleNavigateSection('sites');
              else if (f === 'hotels') handleNavigateSection('hotels');
              else if (f === 'agencies') handleNavigateSection('agencies');
              else if (f === 'artisans') handleNavigateSection('artisans');
            }}
            onExploreMap={() => handleNavigateSection('interactive-map')}
            counts={counts}
          />
        </div>

        {/* Search Results Notice if Searching */}
        {searchQuery && (
          <div className="bg-amber-100/70 border-b border-amber-200 py-3 px-4 text-center text-xs sm:text-sm text-amber-900">
            <span>
              {language === 'ar' ? 'نتائج البحث عن:' : 'Résultats de recherche pour:'}{' '}
              <strong>"{searchQuery}"</strong> ({filteredRoutes.length + filteredSites.length + filteredHotels.length + filteredAgencies.length + filteredArtisans.length}{' '}
              {language === 'ar' ? 'نتيجة' : 'résultat(s)'})
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="ms-3 text-amber-800 underline font-semibold cursor-pointer"
            >
              {language === 'ar' ? 'مسح البحث' : 'Effacer'}
            </button>
          </div>
        )}

        {/* 1. Routes Section */}
        {homepageSettings.showRoutesSection !== false && (activeFilter === 'all' || activeFilter === 'routes') && (
          <RoutesSection
            routes={filteredRoutes}
            onExploreRouteOnMap={handleExploreRouteOnMap}
          />
        )}

        {/* 2. Interactive Google Maps Section */}
        {homepageSettings.showMapSection !== false && (
          <InteractiveMap
            routes={routes}
            hotels={hotels}
            agencies={agencies}
            artisans={artisans}
            sites={sites}
            selectedRouteId={highlightedRouteId}
            onSelectRoute={setHighlightedRouteId}
          />
        )}

        {/* 3. Sites Section */}
        {homepageSettings.showSitesSection !== false && (activeFilter === 'all' || activeFilter === 'sites') && (
          <SitesSection
            sites={filteredSites}
            onShowOnMap={handleShowCoordinatesOnMap}
          />
        )}

        {/* 4. Hotels Section */}
        {homepageSettings.showHotelsSection !== false && (activeFilter === 'all' || activeFilter === 'hotels') && (
          <HotelsSection
            hotels={filteredHotels}
            onShowOnMap={handleShowCoordinatesOnMap}
          />
        )}

        {/* 5. Travel Agencies Section */}
        {homepageSettings.showAgenciesSection !== false && (activeFilter === 'all' || activeFilter === 'agencies') && (
          <AgenciesSection
            agencies={filteredAgencies}
            onShowOnMap={handleShowCoordinatesOnMap}
          />
        )}

        {/* 6. Artisans Section */}
        {homepageSettings.showArtisansSection !== false && (activeFilter === 'all' || activeFilter === 'artisans') && (
          <ArtisansSection
            artisans={filteredArtisans}
            onShowOnMap={handleShowCoordinatesOnMap}
          />
        )}

        {/* 7. Official Directorate Profile */}
        <DirectorateSection info={directorateInfo} />
      </main>

      {/* Official Footer */}
      <Footer
        info={directorateInfo}
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        routes={routes}
        hotels={hotels}
        agencies={agencies}
        artisans={artisans}
        sites={sites}
        directorateInfo={directorateInfo}
        homepageSettings={homepageSettings}
      />

      {/* Share Website Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Offline Mode Indicator Banner */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
