import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TouristSite, SiteCategoryType } from '../types/tourism';
import {
  Building,
  MapPin,
  Navigation,
  Compass,
  Star,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SitesSectionProps {
  sites: TouristSite[];
  onShowOnMap: (lat: number, lng: number) => void;
}

export const SitesSection: React.FC<SitesSectionProps> = ({ sites, onShowOnMap }) => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [inspectedSite, setInspectedSite] = useState<TouristSite | null>(null);

  const publishedSites = sites.filter((s) => s.isPublished !== false);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: t('allCategories') },
    { id: 'historical', label: t('filterHistorical') },
    { id: 'natural', label: t('filterNatural') },
    { id: 'cultural', label: t('filterCultural') },
    { id: 'religious', label: t('filterReligious') },
    { id: 'archaeological', label: t('filterArchaeological') }
  ];

  const filteredSites = publishedSites.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <section id="sites" className="py-20 bg-stone-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3">
            <Building className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ar' ? 'التراث المادي والطبيعي' : 'Patrimoine Matériel & Naturel'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
            {t('sitesSectionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {t('sitesSectionSubtitle')}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredSites.map((site) => {
            const name =
              language === 'fr' && site.nameFr ? site.nameFr : site.name;
            const description =
              language === 'fr' && site.descriptionFr
                ? site.descriptionFr
                : site.description;

            return (
              <div
                key={site.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Cover */}
                <div className="relative h-56 overflow-hidden bg-stone-900">
                  <img
                    src={site.imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

                  {/* Category Pill */}
                  <div className="absolute top-3 start-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-800/90 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
                      {site.category}
                    </span>
                  </div>

                  {site.isFeatured && (
                    <div className="absolute top-3 end-3 flex items-center gap-1 bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs">
                      <Star className="w-3 h-3 fill-white" />
                      <span>{t('featuredSite')}</span>
                    </div>
                  )}

                  {/* Title */}
                  <div className="absolute bottom-3 start-4 end-4 text-white">
                    <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
                      {name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{site.address}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-stone-100">
                    <button
                      onClick={() => setInspectedSite(site)}
                      className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-stone-600" />
                      <span>{language === 'ar' ? 'عرض التفاصيل' : 'Détails'}</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t('getDirections')}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Site Inspection Modal */}
      {inspectedSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="relative h-64 bg-stone-900">
              <img
                src={inspectedSite.imageUrl}
                alt={inspectedSite.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setInspectedSite(null)}
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute bottom-4 start-4 end-4 text-white">
                <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-semibold mb-2 inline-block">
                  {inspectedSite.category}
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {language === 'fr' && inspectedSite.nameFr
                    ? inspectedSite.nameFr
                    : inspectedSite.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{inspectedSite.address}</span>
                <span className="ms-auto font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md" dir="ltr">
                  {inspectedSite.latitude.toFixed(4)}, {inspectedSite.longitude.toFixed(4)}
                </span>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                {language === 'fr' && inspectedSite.descriptionFr
                  ? inspectedSite.descriptionFr
                  : inspectedSite.description}
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setInspectedSite(null)}
                  className="px-5 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
                >
                  {t('close')}
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${inspectedSite.latitude},${inspectedSite.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>{t('getDirections')}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
