import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Artisan } from '../types/tourism';
import {
  Hammer,
  MapPin,
  Phone,
  Tag,
  Navigation,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

interface ArtisansSectionProps {
  artisans: Artisan[];
  onShowOnMap: (lat: number, lng: number) => void;
}

export const ArtisansSection: React.FC<ArtisansSectionProps> = ({ artisans, onShowOnMap }) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewProductImage, setPreviewProductImage] = useState<string | null>(null);

  const publishedArtisans = artisans.filter((a) => a.isPublished !== false);

  const categories = ['all', ...Array.from(new Set(publishedArtisans.map((a) => a.craftCategory)))];

  const filtered = publishedArtisans.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.craftCategory === selectedCategory;
  });

  return (
    <section id="artisans" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-900 text-xs font-bold mb-3">
            <Hammer className="w-4 h-4 text-rose-700" />
            <span>{language === 'ar' ? 'سجل الحرفيين التقليديين بولاية تندوف' : 'Registre des Artisans de Tindouf'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
            {t('artisansSectionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {t('artisansSectionSubtitle')}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? t('allCategories') : cat}
            </button>
          ))}
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((artisan) => {
            const name =
              language === 'fr' && artisan.fullNameFr
                ? artisan.fullNameFr
                : artisan.fullName;
            const craft =
              language === 'fr' && artisan.craftTypeFr
                ? artisan.craftTypeFr
                : artisan.craftType;
            const description =
              language === 'fr' && artisan.craftDescriptionFr
                ? artisan.craftDescriptionFr
                : artisan.craftDescription;
            const address =
              language === 'fr' && artisan.addressFr
                ? artisan.addressFr
                : artisan.address;

            return (
              <div
                key={artisan.id}
                className="bg-stone-50 rounded-3xl overflow-hidden border border-stone-200/90 hover:border-rose-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Category Badge */}
                  <div className="relative h-48 overflow-hidden bg-stone-200">
                    <img
                      src={artisan.imageUrl}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

                    {/* Category pill */}
                    <div className="absolute top-3 start-3">
                      <span className="px-3 py-1 rounded-full bg-rose-700/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
                        {artisan.craftCategory}
                      </span>
                    </div>

                    {/* Name & Craft overlay */}
                    <div className="absolute bottom-3 start-4 end-4 text-white">
                      <h3 className="text-lg font-bold text-white drop-shadow-md">{name}</h3>
                      <div className="text-xs text-rose-200 font-medium truncate">{craft}</div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-white p-3.5 rounded-2xl border border-stone-100">
                      {description}
                    </p>

                    {/* Product Thumbnails Gallery if available */}
                    {artisan.productImages && artisan.productImages.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold text-stone-500 mb-1 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>{t('productGallery')}:</span>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {artisan.productImages.map((pImg, idx) => (
                            <button
                              key={idx}
                              onClick={() => setPreviewProductImage(pImg)}
                              className="w-14 h-14 rounded-xl overflow-hidden border border-stone-200 shrink-0 hover:scale-105 transition"
                            >
                              <img
                                src={pImg}
                                alt="Product thumbnail"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs text-stone-700 pt-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span dir="ltr" className="font-semibold text-stone-900">
                          {artisan.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0">
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-200/80">
                    <a
                      href={`tel:${artisan.phone.replace(/[^0-9]/g, '')}`}
                      className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('callNow')}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${artisan.latitude},${artisan.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{t('openInMaps')}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox for product image */}
      {previewProductImage && (
        <div
          onClick={() => setPreviewProductImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden bg-black">
            <img
              src={previewProductImage}
              alt="Artisan Product Preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};
