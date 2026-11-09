import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TourismRoute } from '../types/tourism';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Compass,
  Car,
  Navigation,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface RouteDetailsModalProps {
  route: TourismRoute | null;
  onClose: () => void;
  onExploreOnMap: (routeId: string) => void;
}

export const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({
  route,
  onClose,
  onExploreOnMap
}) => {
  const { language, t } = useLanguage();

  if (!route) return null;

  const title = language === 'fr' && route.nameFr ? route.nameFr : route.name;
  const description =
    language === 'fr' && route.descriptionFr ? route.descriptionFr : route.description;
  const startPoint =
    language === 'fr' && route.startPointFr ? route.startPointFr : route.startPoint;
  const endPoint =
    language === 'fr' && route.endPointFr ? route.endPointFr : route.endPoint;
  const duration =
    language === 'fr' && route.durationFr ? route.durationFr : route.duration;
  const season =
    language === 'fr' && route.suitableSeasonFr
      ? route.suitableSeasonFr
      : route.suitableSeason;
  const transport =
    language === 'fr' && route.transportModeFr
      ? route.transportModeFr
      : route.transportMode;

  const sortedStops = route.stops
    ? route.stops.slice().sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Cover Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
          <img
            src={route.coverImage}
            alt={title}
            className="w-full h-full object-cover filter brightness-75"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 start-6 end-6 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/80 text-white text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>{route.character}</span>
              <span>•</span>
              <span>{route.type}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
              {title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{t('routeDistance')}</div>
                <div className="text-sm font-bold text-stone-900">{route.distanceKm} كم</div>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{t('routeDuration')}</div>
                <div className="text-sm font-bold text-stone-900">{duration}</div>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{t('routeSeason')}</div>
                <div className="text-sm font-bold text-stone-900">{season}</div>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{t('routeTransport')}</div>
                <div className="text-sm font-bold text-stone-900">{transport}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-base font-bold text-stone-900 mb-2">
              {language === 'ar' ? 'الوصف العام للمسلك' : 'Description du Circuit'}
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed bg-amber-50/50 p-4 rounded-2xl border border-amber-100/60">
              {description}
            </p>
          </div>

          {/* Start and End Point */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex-1">
              <div className="text-xs text-amber-800 font-semibold mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>{t('routeStart')}:</span>
              </div>
              <div className="text-sm font-bold text-stone-800">{startPoint}</div>
            </div>
            <div className="hidden sm:block text-stone-300 self-center">➔</div>
            <div className="flex-1">
              <div className="text-xs text-amber-800 font-semibold mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>{t('routeEnd')}:</span>
              </div>
              <div className="text-sm font-bold text-stone-800">{endPoint}</div>
            </div>
          </div>

          {/* Detailed Stops / Stages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>{t('stopsCount')}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">
                  {sortedStops.length} {language === 'ar' ? 'محطات' : 'étapes'}
                </span>
              </h4>
            </div>

            <div className="space-y-4">
              {sortedStops.map((stop, index) => {
                const stopName =
                  language === 'fr' && stop.nameFr ? stop.nameFr : stop.name;
                const stopDesc =
                  language === 'fr' && stop.descriptionFr
                    ? stop.descriptionFr
                    : stop.description;

                return (
                  <div
                    key={stop.id}
                    className="p-4 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-white shadow-xs transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {stop.imageUrl && (
                        <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                          <img
                            src={stop.imageUrl}
                            alt={stopName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-amber-700 text-white font-bold text-xs flex items-center justify-center">
                              {stop.order || index + 1}
                            </span>
                            <h5 className="font-bold text-sm text-stone-900">{stopName}</h5>
                          </div>
                          <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md" dir="ltr">
                            {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed mb-3">
                          {stopDesc}
                        </p>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${stop.latitude},${stop.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
                          >
                            <Navigation className="w-3 h-3 text-amber-700" />
                            <span>{t('getDirections')}</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-stone-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition cursor-pointer"
            >
              {t('close')}
            </button>
            <button
              onClick={() => {
                onExploreOnMap(route.id);
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>{t('exploreRouteOnMap')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
