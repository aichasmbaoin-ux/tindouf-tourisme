import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Hotel } from '../types/tourism';
import {
  Building,
  User,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Star,
  CheckCircle2
} from 'lucide-react';

interface HotelsSectionProps {
  hotels: Hotel[];
  onShowOnMap: (lat: number, lng: number) => void;
}

export const HotelsSection: React.FC<HotelsSectionProps> = ({ hotels, onShowOnMap }) => {
  const { language, t } = useLanguage();
  const publishedHotels = hotels.filter((h) => h.isPublished !== false);

  return (
    <section id="hotels" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-3">
            <Building className="w-4 h-4 text-blue-700" />
            <span>{language === 'ar' ? 'الإيواء الفندقي المعتمد' : 'Hébergements Agréés'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
            {t('hotelsSectionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {t('hotelsSectionSubtitle')}
          </p>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedHotels.map((hotel) => {
            let hotelName =
              language === 'fr' && hotel.nameFr ? hotel.nameFr : hotel.name;
            if (hotelName && (hotelName.startsWith('http') || hotelName.includes('.jpg') || hotelName.includes('.png') || hotelName.includes('.net') || hotelName.includes('imgix'))) {
              hotelName = language === 'fr' ? 'Motel Routier El Khaima' : 'نزل الطريق موتيل الخيمة';
            }
            const address =
              language === 'fr' && hotel.addressFr ? hotel.addressFr : hotel.address;
            const description =
              language === 'fr' && hotel.descriptionFr
                ? hotel.descriptionFr
                : hotel.description;

            return (
              <div
                key={hotel.id}
                className="bg-stone-50 rounded-3xl overflow-hidden border border-stone-200/80 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Photo & Stars */}
                <div className="relative h-48 overflow-hidden bg-stone-200">
                  <img
                    src={hotel.imageUrl}
                    alt={hotelName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  {/* Stars Badge */}
                  <div className="absolute top-3 end-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300 text-xs">
                    {Array.from({ length: hotel.stars || 2 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-300" />
                    ))}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 start-4 end-4 text-white">
                    <h3 className="text-lg font-bold text-white drop-shadow-md">
                      {hotelName}
                    </h3>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5 text-xs text-stone-700">
                    {/* Manager */}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        <strong className="text-stone-900">{t('manager')}:</strong> {hotel.managerName}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{address}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span dir="ltr" className="font-semibold text-stone-900">
                        {hotel.phone} {hotel.secondaryPhone ? ` / ${hotel.secondaryPhone}` : ''}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-700 shrink-0" />
                      <span className="truncate text-stone-600">{hotel.email}</span>
                    </div>

                    {/* Description */}
                    <p className="text-stone-600 line-clamp-2 pt-2 border-t border-stone-200/60 leading-relaxed">
                      {description}
                    </p>

                    {/* Amenities pills */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {hotel.amenities.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-stone-200"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-200/70">
                    <a
                      href={`tel:${hotel.phone.replace(/[^0-9]/g, '')}`}
                      className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('callNow')}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hotel.latitude},${hotel.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{t('openInMaps')}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
