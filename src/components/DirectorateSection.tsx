import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DirectorateInfo } from '../types/tourism';
import {
  Building2,
  MapPin,
  Phone,
  Printer,
  Mail,
  Clock,
  ShieldCheck,
  Facebook,
  Instagram,
  Twitter,
  ExternalLink,
  Navigation
} from 'lucide-react';

interface DirectorateSectionProps {
  info: DirectorateInfo;
}

export const DirectorateSection: React.FC<DirectorateSectionProps> = ({ info }) => {
  const { language, t } = useLanguage();

  const officialName =
    language === 'fr' && info.officialNameFr ? info.officialNameFr : info.officialNameAr;
  const state =
    language === 'fr' && info.stateFr ? info.stateFr : info.stateAr;
  const ministry =
    language === 'fr' && info.ministryFr ? info.ministryFr : info.ministryAr;

  return (
    <section id="directorate" className="py-20 bg-stone-900 text-white scroll-mt-20 relative overflow-hidden">
      {/* Decorative sahara texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-white shadow-2xl shadow-emerald-950/40 border-3 border-emerald-600 mb-5 relative group hover:scale-105 transition-transform duration-300 overflow-hidden flex items-center justify-center">
            <img
              src={info.logoUrl || '/assets/aistudio/Gemini_Generated_Image_jn52udjn52udjn52_bbdab105.jpg'}
              alt="شعار مديرية السياحة والصناعة التقليدية لولاية تندوف"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <Building2 className="w-4 h-4" />
            <span>{ministry}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {officialName}
          </h2>
          <p className="text-sm text-amber-200/80 font-medium">{state}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Institutional Mission */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {language === 'ar' ? 'المهام والاختصاصات' : 'Missions & Attributions'}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed mb-6">
                {t('jurisdiction')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-amber-200">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{t('workingHours')}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h3 className="text-xl font-bold text-white mb-4">
              {language === 'ar' ? 'بيانات التواصل الرسمي' : 'Coordonnées Officielles'}
            </h3>

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-400">{t('officialAddress')}</div>
                <div className="text-sm font-semibold text-white">{info.address}</div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-400">{t('officialPhone')}</div>
                <a
                  href={`tel:${info.phone}`}
                  className="text-sm font-semibold text-white hover:text-emerald-300 transition"
                  dir="ltr"
                >
                  {info.phone}
                </a>
              </div>
            </div>

            {/* Fax */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-400">{t('officialFax')}</div>
                <div className="text-sm font-semibold text-white" dir="ltr">
                  {info.fax}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-400">{t('officialEmail')}</div>
                <a
                  href={`mailto:${info.email}`}
                  className="text-sm font-semibold text-white hover:text-purple-300 transition break-all"
                >
                  {info.email}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-xs text-stone-400 mb-3">{t('socialMedia')}</div>
              <div className="flex items-center gap-3">
                {info.facebook && (
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/30 text-xs font-semibold transition"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>{info.facebook}</span>
                  </a>
                )}
                {info.instagram && (
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/30 text-xs font-semibold transition"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>{info.instagram}</span>
                  </a>
                )}
                {info.twitter && (
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-600/30 hover:bg-sky-600 text-sky-200 hover:text-white border border-sky-500/30 text-xs font-semibold transition"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>{info.twitter}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Map Directions Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {language === 'ar' ? 'مقر المديرية على الخريطة' : 'Localisation du Siège'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-6">
                {language === 'ar'
                  ? 'يقع مقر مديرية السياحة والصناعة التقليدية بحي المستقبل بوسط مدينة تندوف بالقرب من مختلف المصالح الولائية.'
                  : 'Le siège est idéalement situé au quartier El Moustakbal au cœur de la ville de Tindouf.'}
              </p>

              <div className="rounded-2xl overflow-hidden h-48 sm:h-52 bg-stone-800 border border-white/10 relative group shadow-lg">
                <img
                  src={info.headquartersImageUrl || '/assets/aistudio/_____________cbbb6806.jfif'}
                  alt="مقر مديرية السياحة والصناعة التقليدية لولاية تندوف"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/directorate_headquarters.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-3.5">
                  <div className="flex items-center gap-2 text-xs text-white drop-shadow-md">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold">{info.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${info.latitude},${info.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Navigation className="w-4 h-4 text-amber-200" />
                <span>{t('getDirections')}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
