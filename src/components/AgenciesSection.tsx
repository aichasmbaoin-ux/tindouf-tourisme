import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TravelAgency } from '../types/tourism';
import {
  Briefcase,
  User,
  MapPin,
  Phone,
  Mail,
  Navigation,
  Compass
} from 'lucide-react';

interface AgenciesSectionProps {
  agencies: TravelAgency[];
  onShowOnMap: (lat: number, lng: number) => void;
}

export const AgenciesSection: React.FC<AgenciesSectionProps> = ({ agencies, onShowOnMap }) => {
  const { language, t } = useLanguage();
  const publishedAgencies = agencies.filter((a) => a.isPublished !== false);

  return (
    <section id="agencies" className="py-20 bg-stone-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-3">
            <Briefcase className="w-4 h-4 text-purple-700" />
            <span>{language === 'ar' ? 'وكالات السياحة المعتمدة' : 'Agences de Voyages Homologuées'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
            {t('agenciesSectionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {t('agenciesSectionSubtitle')}
          </p>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedAgencies.map((agency) => {
            const agencyName =
              language === 'fr' && agency.nameFr ? agency.nameFr : agency.name;
            const address =
              language === 'fr' && agency.addressFr ? agency.addressFr : agency.address;
            const services =
              language === 'fr' && agency.servicesDescriptionFr
                ? agency.servicesDescriptionFr
                : agency.servicesDescription;

            return (
              <div
                key={agency.id}
                className="bg-white rounded-3xl p-6 border border-stone-200/90 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Logo & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-purple-50 border border-purple-100 shrink-0">
                      <img
                        src={agency.logoUrl}
                        alt={agencyName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-stone-900 group-hover:text-purple-950 transition">
                        {agencyName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
                        <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>
                          <strong className="text-stone-800">{t('agencyManager')}:</strong> {agency.managerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Services Description */}
                  <p className="text-xs sm:text-sm text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 leading-relaxed mb-4">
                    {services}
                  </p>

                  {/* Contact Info List */}
                  <div className="space-y-2 text-xs text-stone-700 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span dir="ltr" className="font-semibold text-stone-900">
                        {agency.phone} {agency.secondaryPhone ? ` / ${agency.secondaryPhone}` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-700 shrink-0" />
                      <span className="truncate">{agency.email}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100">
                  <a
                    href={`tel:${agency.phone.replace(/[^0-9]/g, '')}`}
                    className="py-2 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition text-center shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('callNow')}</span>
                  </a>

                  <a
                    href={`mailto:${agency.email}`}
                    className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1 transition text-center"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-700" />
                    <span>{t('sendEmail')}</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${agency.latitude},${agency.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition text-center shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t('openInMaps')}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
