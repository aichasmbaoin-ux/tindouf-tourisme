import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TourismRoute } from '../types/tourism';
import { RouteDetailsModal } from './RouteDetailsModal';
import {
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Navigation,
  Layers,
  Calendar
} from 'lucide-react';

interface RoutesSectionProps {
  routes: TourismRoute[];
  onExploreRouteOnMap: (routeId: string) => void;
}

export const RoutesSection: React.FC<RoutesSectionProps> = ({
  routes,
  onExploreRouteOnMap
}) => {
  const { language, t } = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState<TourismRoute | null>(null);

  const publishedRoutes = routes.filter((r) => r.isPublished !== false);

  return (
    <section id="routes" className="py-20 bg-stone-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
            <Compass className="w-4 h-4 text-amber-700" />
            <span>{t('wilayaTitle')} - {language === 'ar' ? 'مسارات موثقة' : 'Itinéraires Homologués'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
            {t('routesSectionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {t('routesSectionSubtitle')}
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {publishedRoutes.map((route) => {
            const title =
              language === 'fr' && route.nameFr ? route.nameFr : route.name;
            const description =
              language === 'fr' && route.descriptionFr
                ? route.descriptionFr
                : route.description;
            const duration =
              language === 'fr' && route.durationFr ? route.durationFr : route.duration;
            const season =
              language === 'fr' && route.suitableSeasonFr
                ? route.suitableSeasonFr
                : route.suitableSeason;

            return (
              <div
                key={route.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Cover */}
                <div className="relative h-64 overflow-hidden bg-stone-900">
                  <img
                    src={route.coverImage}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Character & Type Tags */}
                  <div className="absolute top-4 start-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
                      {route.character}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                      {route.type}
                    </span>
                  </div>

                  {/* Title and Key Points */}
                  <div className="absolute bottom-4 start-4 end-4 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1 text-white drop-shadow-md">
                      {title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-amber-200 font-medium">
                      <span>{route.startPoint} ➔ {route.endPoint}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metrics Bar */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-stone-50 border border-stone-100 mb-4 text-center">
                      <div>
                        <div className="text-[11px] text-stone-500">{t('routeDistance')}</div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900">
                          {route.distanceKm} كم
                        </div>
                      </div>
                      <div className="border-x border-stone-200">
                        <div className="text-[11px] text-stone-500">{t('routeDuration')}</div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900">
                          {duration}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-stone-500">{t('routeStages')}</div>
                        <div className="text-xs sm:text-sm font-bold text-amber-800">
                          {route.stops?.length || route.stagesCount} {language === 'ar' ? 'محطات' : 'étapes'}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                      {description}
                    </p>

                    {/* Season Tag */}
                    <div className="flex items-center gap-2 text-xs text-stone-600 mb-6">
                      <Calendar className="w-4 h-4 text-amber-700" />
                      <span>{t('routeSeason')}: <strong className="text-stone-900">{season}</strong></span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-4 border-t border-stone-100">
                    <button
                      onClick={() => setSelectedRoute(route)}
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-amber-800/20 text-amber-900 hover:bg-amber-50 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span>{t('viewRouteDetails')}</span>
                    </button>

                    <button
                      onClick={() => onExploreRouteOnMap(route.id)}
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 text-amber-300" />
                      <span>{t('exploreRouteOnMap')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedRoute && (
        <RouteDetailsModal
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
          onExploreOnMap={onExploreRouteOnMap}
        />
      )}
    </section>
  );
};
