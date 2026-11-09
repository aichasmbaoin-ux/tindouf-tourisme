import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { useLanguage } from '../context/LanguageContext';
import {
  TourismRoute,
  Hotel,
  TravelAgency,
  Artisan,
  TouristSite
} from '../types/tourism';
import {
  Compass,
  MapPin,
  Building,
  Briefcase,
  Hammer,
  Navigation,
  Phone,
  Layers,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface InteractiveMapProps {
  routes: TourismRoute[];
  hotels: Hotel[];
  agencies: TravelAgency[];
  artisans: Artisan[];
  sites: TouristSite[];
  selectedRouteId?: string | null;
  onSelectRoute?: (routeId: string | null) => void;
}

interface MapMarkerItem {
  id: string;
  type: 'route_stop' | 'site' | 'hotel' | 'agency' | 'artisan';
  title: string;
  categoryLabel: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  phone?: string;
  address?: string;
  routeId?: string;
  order?: number;
}

// Polyline component using Google Maps JS API and useMap hook
const RoutePolyline: React.FC<{ path: { lat: number; lng: number }[]; color?: string }> = ({
  path,
  color = '#d97706'
}) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || path.length < 2) {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      return;
    }

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: 4
      });
      polylineRef.current.setMap(map);
    } else {
      polylineRef.current.setPath(path);
      polylineRef.current.setOptions({ strokeColor: color });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, path, color]);

  return null;
};

// Camera Controller helper
const MapCameraController: React.FC<{
  target: { lat: number; lng: number } | null;
  zoom?: number;
}> = ({ target, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    if (map && target) {
      map.panTo(target);
      if (zoom) map.setZoom(zoom);
    }
  }, [map, target, zoom]);
  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  routes,
  hotels,
  agencies,
  artisans,
  sites,
  selectedRouteId: externalSelectedRouteId,
  onSelectRoute
}) => {
  const { language, t } = useLanguage();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [selectedItem, setSelectedItem] = useState<MapMarkerItem | null>(null);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(externalSelectedRouteId || null);
  const [panTarget, setPanTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [targetZoom, setTargetZoom] = useState<number>(14);

  const mapsApiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBCZPU1pYcQKl4gGAB8pblzm03CvrFMVxk';

  // Sync external route selection
  useEffect(() => {
    if (externalSelectedRouteId) {
      setActiveRouteId(externalSelectedRouteId);
      // center on first stop of route if available
      const r = routes.find((rt) => rt.id === externalSelectedRouteId);
      if (r && r.stops && r.stops.length > 0) {
        setPanTarget({ lat: r.stops[0].latitude, lng: r.stops[0].longitude });
        setTargetZoom(13);
      }
    }
  }, [externalSelectedRouteId, routes]);

  // Aggregate all items into markers
  const allMarkers: MapMarkerItem[] = useMemo(() => {
    const list: MapMarkerItem[] = [];

    // Route stops
    routes.forEach((route) => {
      if (route.stops) {
        route.stops.forEach((stop) => {
          list.push({
            id: stop.id,
            type: 'route_stop',
            title: language === 'fr' && stop.nameFr ? stop.nameFr : stop.name,
            categoryLabel: `${t('filterRoutes')}: ${language === 'fr' && route.nameFr ? route.nameFr : route.name}`,
            description: language === 'fr' && stop.descriptionFr ? stop.descriptionFr : stop.description,
            latitude: stop.latitude,
            longitude: stop.longitude,
            imageUrl: stop.imageUrl || route.coverImage,
            routeId: route.id,
            order: stop.order
          });
        });
      }
    });

    // Sites
    sites.forEach((site) => {
      list.push({
        id: site.id,
        type: 'site',
        title: language === 'fr' && site.nameFr ? site.nameFr : site.name,
        categoryLabel: t('filterSites'),
        description: language === 'fr' && site.descriptionFr ? site.descriptionFr : site.description,
        latitude: site.latitude,
        longitude: site.longitude,
        imageUrl: site.imageUrl,
        address: site.address
      });
    });

    // Hotels
    hotels.forEach((hotel) => {
      list.push({
        id: hotel.id,
        type: 'hotel',
        title: language === 'fr' && hotel.nameFr ? hotel.nameFr : hotel.name,
        categoryLabel: t('filterHotels'),
        description: language === 'fr' && hotel.descriptionFr ? hotel.descriptionFr : hotel.description,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        imageUrl: hotel.imageUrl,
        phone: hotel.phone,
        address: language === 'fr' && hotel.addressFr ? hotel.addressFr : hotel.address
      });
    });

    // Agencies
    agencies.forEach((agency) => {
      list.push({
        id: agency.id,
        type: 'agency',
        title: language === 'fr' && agency.nameFr ? agency.nameFr : agency.name,
        categoryLabel: t('filterAgencies'),
        description:
          language === 'fr' && agency.servicesDescriptionFr
            ? agency.servicesDescriptionFr
            : agency.servicesDescription,
        latitude: agency.latitude,
        longitude: agency.longitude,
        imageUrl: agency.logoUrl,
        phone: agency.phone,
        address: language === 'fr' && agency.addressFr ? agency.addressFr : agency.address
      });
    });

    // Artisans
    artisans.forEach((artisan) => {
      list.push({
        id: artisan.id,
        type: 'artisan',
        title: language === 'fr' && artisan.fullNameFr ? artisan.fullNameFr : artisan.fullName,
        categoryLabel: `${t('filterArtisans')} (${artisan.craftCategory})`,
        description:
          language === 'fr' && artisan.craftDescriptionFr
            ? artisan.craftDescriptionFr
            : artisan.craftDescription,
        latitude: artisan.latitude,
        longitude: artisan.longitude,
        imageUrl: artisan.imageUrl,
        phone: artisan.phone,
        address: language === 'fr' && artisan.addressFr ? artisan.addressFr : artisan.address
      });
    });

    return list;
  }, [routes, sites, hotels, agencies, artisans, language, t]);

  // Filter markers
  const filteredMarkers = useMemo(() => {
    return allMarkers.filter((item) => {
      // Type match
      if (filterType !== 'all') {
        if (filterType === 'routes' && item.type !== 'route_stop') return false;
        if (filterType === 'sites' && item.type !== 'site') return false;
        if (filterType === 'hotels' && item.type !== 'hotel') return false;
        if (filterType === 'agencies' && item.type !== 'agency') return false;
        if (filterType === 'artisans' && item.type !== 'artisan') return false;
      }
      // If a specific route is selected, show only stops of that route or other non-stop points
      if (activeRouteId && item.type === 'route_stop' && item.routeId !== activeRouteId) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    });
  }, [allMarkers, filterType, activeRouteId, searchQuery]);

  // Active route path coordinates for polyline
  const activeRoutePolylinePath = useMemo(() => {
    if (!activeRouteId) return [];
    const r = routes.find((rt) => rt.id === activeRouteId);
    if (!r || !r.stops || r.stops.length < 2) return [];
    return r.stops
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((s) => ({ lat: s.latitude, lng: s.longitude }));
  }, [routes, activeRouteId]);

  // Marker icon color helper
  const getMarkerStyling = (type: MapMarkerItem['type']) => {
    switch (type) {
      case 'route_stop':
        return { bg: 'bg-amber-600', border: 'border-amber-300', icon: MapPin };
      case 'site':
        return { bg: 'bg-emerald-700', border: 'border-emerald-300', icon: Building };
      case 'hotel':
        return { bg: 'bg-blue-600', border: 'border-blue-300', icon: Building };
      case 'agency':
        return { bg: 'bg-purple-600', border: 'border-purple-300', icon: Briefcase };
      case 'artisan':
        return { bg: 'bg-rose-600', border: 'border-rose-300', icon: Hammer };
      default:
        return { bg: 'bg-stone-700', border: 'border-stone-300', icon: MapPin };
    }
  };

  // User geolocation handler
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPanTarget({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setTargetZoom(15);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          alert(language === 'ar' ? 'تعذر تحديد موقعك الحالي.' : 'Impossible d\'obtenir votre position.');
        }
      );
    }
  };

  const handleSelectRouteFromList = (routeId: string) => {
    const newRoute = activeRouteId === routeId ? null : routeId;
    setActiveRouteId(newRoute);
    if (onSelectRoute) onSelectRoute(newRoute);
    if (newRoute) {
      const r = routes.find((rt) => rt.id === newRoute);
      if (r && r.stops && r.stops.length > 0) {
        setPanTarget({ lat: r.stops[0].latitude, lng: r.stops[0].longitude });
        setTargetZoom(13);
      }
    }
  };

  return (
    <section id="interactive-map" className="py-16 bg-stone-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Google Maps JavaScript API</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t('mapTitle')}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              {t('mapSubtitle')}
            </p>
          </div>

          {/* Quick Route Highlighter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-700 shrink-0">
              {t('showRoutePath')}:
            </label>
            <select
              value={activeRouteId || ''}
              onChange={(e) => handleSelectRouteFromList(e.target.value)}
              className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            >
              <option value="">{t('allCategories')}</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {language === 'fr' && r.nameFr ? r.nameFr : r.name} ({r.stops?.length || 0} {t('stopsCount')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map Control Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-200/80 mb-4 flex flex-wrap items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: t('mapFilterAll') },
              { id: 'routes', label: t('mapFilterRoutes') },
              { id: 'sites', label: t('mapFilterSites') },
              { id: 'hotels', label: t('mapFilterHotels') },
              { id: 'agencies', label: t('mapFilterAgencies') },
              { id: 'artisans', label: t('mapFilterArtisans') }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition cursor-pointer ${
                  filterType === f.id
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box & Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-stone-400 absolute start-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl ps-8 pe-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Satellite / Roadmap Toggle */}
            <button
              onClick={() =>
                setMapTypeId((prev) => (prev === 'roadmap' ? 'hybrid' : 'roadmap'))
              }
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                mapTypeId === 'hybrid'
                  ? 'bg-amber-700 text-white border-amber-800'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title={mapTypeId === 'roadmap' ? t('mapSatellite') : t('mapRoadmap')}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">
                {mapTypeId === 'roadmap' ? t('mapSatellite') : t('mapRoadmap')}
              </span>
            </button>

            {/* My Location */}
            <button
              onClick={handleLocateMe}
              className="p-2 rounded-xl bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title={t('myLocation')}
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">{t('myLocation')}</span>
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[580px] lg:h-[650px] rounded-3xl overflow-hidden shadow-xl border border-stone-300">
          <APIProvider apiKey={mapsApiKey} language={language}>
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={{ lat: 27.671, lng: -8.145 }}
              defaultZoom={13}
              mapTypeId={mapTypeId}
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
              {/* Dynamic Camera Controller */}
              <MapCameraController target={panTarget} zoom={targetZoom} />

              {/* Active Route Polyline Path */}
              {activeRoutePolylinePath.length > 1 && (
                <RoutePolyline path={activeRoutePolylinePath} color="#b45309" />
              )}

              {/* Render Markers */}
              {filteredMarkers.map((marker) => {
                const styling = getMarkerStyling(marker.type);
                const isSelected = selectedItem?.id === marker.id;

                return (
                  <AdvancedMarker
                    key={`${marker.type}_${marker.id}`}
                    position={{ lat: marker.latitude, lng: marker.longitude }}
                    onClick={() => setSelectedItem(marker)}
                    title={marker.title}
                  >
                    <div
                      className={`relative flex items-center justify-center cursor-pointer transition-all duration-200 transform ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-2xl ${styling.bg} border-2 ${styling.border} text-white shadow-lg flex items-center justify-center`}
                      >
                        {marker.type === 'route_stop' && marker.order ? (
                          <span className="text-xs font-bold leading-none">{marker.order}</span>
                        ) : (
                          <styling.icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 w-2 h-2 bg-black/40 rotate-45"></div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Marker InfoWindow Popup */}
              {selectedItem && (
                <InfoWindow
                  position={{ lat: selectedItem.latitude, lng: selectedItem.longitude }}
                  onCloseClick={() => setSelectedItem(null)}
                  headerContent={
                    <div className="font-bold text-sm text-stone-900 pe-4">
                      {selectedItem.title}
                    </div>
                  }
                >
                  <div className="max-w-xs text-start p-1">
                    {/* Badge */}
                    <div className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
                      {selectedItem.categoryLabel}
                    </div>

                    {/* Image Thumbnail */}
                    {selectedItem.imageUrl && (
                      <div className="w-full h-28 rounded-lg overflow-hidden mb-2 bg-stone-100">
                        <img
                          src={selectedItem.imageUrl}
                          alt={selectedItem.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-stone-600 line-clamp-3 mb-2 leading-relaxed">
                      {selectedItem.description}
                    </p>

                    {/* Address & Phone */}
                    {selectedItem.address && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-700 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{selectedItem.address}</span>
                      </div>
                    )}
                    {selectedItem.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-700 mb-2">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span dir="ltr">{selectedItem.phone}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedItem.latitude},${selectedItem.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-1.5 px-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>{t('getDirections')}</span>
                      </a>
                      {selectedItem.phone && (
                        <a
                          href={`tel:${selectedItem.phone}`}
                          className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition"
                          title={t('callNow')}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Floating Route Navigator Widget */}
          {activeRouteId && (
            <div className="absolute top-4 start-4 z-20 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-stone-200">
              {(() => {
                const curRoute = routes.find((r) => r.id === activeRouteId);
                if (!curRoute) return null;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                        {t('routesSectionTitle')}
                      </div>
                      <button
                        onClick={() => {
                          setActiveRouteId(null);
                          if (onSelectRoute) onSelectRoute(null);
                        }}
                        className="text-stone-400 hover:text-stone-600 text-xs px-1 rounded-sm"
                      >
                        ✕
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 mb-1">
                      {language === 'fr' && curRoute.nameFr ? curRoute.nameFr : curRoute.name}
                    </h4>
                    <p className="text-xs text-stone-500 mb-3 line-clamp-2">
                      {language === 'fr' && curRoute.descriptionFr
                        ? curRoute.descriptionFr
                        : curRoute.description}
                    </p>

                    {/* Stops List */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pe-1">
                      {curRoute.stops?.map((stop) => (
                        <button
                          key={stop.id}
                          onClick={() => {
                            setPanTarget({ lat: stop.latitude, lng: stop.longitude });
                            setTargetZoom(16);
                            setSelectedItem({
                              id: stop.id,
                              type: 'route_stop',
                              title: language === 'fr' && stop.nameFr ? stop.nameFr : stop.name,
                              categoryLabel: `${t('stageNumber')} ${stop.order}`,
                              description:
                                language === 'fr' && stop.descriptionFr
                                  ? stop.descriptionFr
                                  : stop.description,
                              latitude: stop.latitude,
                              longitude: stop.longitude,
                              imageUrl: stop.imageUrl || curRoute.coverImage,
                              routeId: curRoute.id,
                              order: stop.order
                            });
                          }}
                          className="w-full text-start p-1.5 rounded-lg hover:bg-amber-50 text-xs flex items-center justify-between group transition"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-amber-600 text-white font-bold flex items-center justify-center text-[10px]">
                              {stop.order}
                            </span>
                            <span className="font-medium text-stone-800 group-hover:text-amber-900">
                              {language === 'fr' && stop.nameFr ? stop.nameFr : stop.name}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
