import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HomepageSettings } from '../types/tourism';
import { Search, MapPin, Building, Briefcase, Hammer, Compass } from 'lucide-react';

interface HeroProps {
  settings: HomepageSettings;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: string;
  onFilterChange: (f: string) => void;
  onExploreMap: () => void;
  counts: {
    routes: number;
    hotels: number;
    agencies: number;
    artisans: number;
    sites: number;
  };
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onExploreMap,
  counts
}) => {
  const { language, t } = useLanguage();

  const title = language === 'ar' ? settings.heroTitleAr : settings.heroTitleFr;
  const subtitle = language === 'ar' ? settings.heroSubtitleAr : settings.heroSubtitleFr;

  const filterButtons = [
    { id: 'all', label: t('filterAll'), icon: Compass },
    { id: 'routes', label: t('filterRoutes'), icon: MapPin },
    { id: 'sites', label: t('filterSites'), icon: Building },
    { id: 'hotels', label: t('filterHotels'), icon: Building },
    { id: 'agencies', label: t('filterAgencies'), icon: Briefcase },
    { id: 'artisans', label: t('filterArtisans'), icon: Hammer }
  ];

  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-stone-900 text-white">
      {/* Background Image with Desert Warmth Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImageUrl || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80'}
          alt="Tindouf Sahara Landscape"
          className="w-full h-full object-cover object-center filter brightness-65 scale-105 transform duration-1000"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-black/40"></div>
        <div className="absolute inset-0 bg-radial from-amber-600/10 via-transparent to-black/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        {/* State Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{t('wilayaTitle')} - {language === 'ar' ? 'الصحراء الكبرى الجزائرية' : 'Grand Sahara Algérien'}</span>
        </div>

        {/* Welcome Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white mb-4 drop-shadow-md">
          {title}
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-lg text-amber-100/90 font-normal leading-relaxed mb-8 drop-shadow-sm">
          {subtitle}
        </p>

        {/* Comprehensive Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl border border-white/20 transition-all focus-within:ring-4 focus-within:ring-amber-500/40">
            <Search className="w-6 h-6 text-amber-800 mx-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-stone-900 placeholder:text-stone-400 text-sm sm:text-base focus:outline-none py-2 px-1"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-stone-400 hover:text-stone-600 px-2 py-1 text-xs rounded-lg cursor-pointer"
              >
                ✕
              </button>
            )}
            <button
              onClick={onExploreMap}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-semibold text-xs transition shadow-md shrink-0 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>{t('exploreOnMap')}</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterButtons.map((btn) => {
            const Icon = btn.icon;
            const isSelected = activeFilter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => onFilterChange(btn.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105'
                    : 'bg-black/40 hover:bg-black/60 text-stone-200 border border-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto pt-4 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/5">
            <div className="text-xl sm:text-2xl font-bold text-amber-400">{counts.routes}</div>
            <div className="text-xs text-stone-300">{t('statsRoutes')}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/5">
            <div className="text-xl sm:text-2xl font-bold text-amber-400">{counts.sites}</div>
            <div className="text-xs text-stone-300">{t('statsSites')}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/5">
            <div className="text-xl sm:text-2xl font-bold text-amber-400">{counts.hotels}</div>
            <div className="text-xs text-stone-300">{t('statsHotels')}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/5">
            <div className="text-xl sm:text-2xl font-bold text-amber-400">{counts.agencies}</div>
            <div className="text-xs text-stone-300">{t('statsAgencies')}</div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/5">
            <div className="text-xl sm:text-2xl font-bold text-amber-400">{counts.artisans}</div>
            <div className="text-xs text-stone-300">{t('statsArtisans')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
