import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DirectorateInfo } from '../types/tourism';
import { Compass, MapPin, Phone, Mail, Shield, Heart, Share2 } from 'lucide-react';

interface FooterProps {
  info: DirectorateInfo;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenShare?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ info, onNavigateSection, onOpenAdmin, onOpenShare }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Institutional Info & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 border border-emerald-600/50 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
                <img
                  src={info.logoUrl || '/assets/aistudio/Gemini_Generated_Image_jn52udjn52udjn52_bbdab105.jpg'}
                  alt="شعار مديرية السياحة والصناعة التقليدية لولاية تندوف"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm leading-snug">
                  {t('appTitle')}
                </h3>
                <div className="text-[11px] text-amber-400 font-medium">{t('wilayaTitle')}</div>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {t('republicTitle')}
              <br />
              {t('ministryTitle')}
            </p>
            <div className="text-xs text-stone-400">
              {language === 'ar'
                ? 'المنصة الرقمية الموحدة للتعريف بالمقدرات السياحية الطبيعية والتاريخية ودعم الحرفيين بولاية تندوف.'
                : 'Portail officiel pour la valorisation des atouts touristiques, culturels et artisanaux de Tindouf.'}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {language === 'ar' ? 'أقسام المنصة' : 'Rubriques du Portail'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('routes')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t('navRoutes')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('sites')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t('navSites')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('hotels')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t('navHotels')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('agencies')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t('navAgencies')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('artisans')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t('navArtisans')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('interactive-map')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  {t('navMap')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {t('officialAddress')}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{info.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span dir="ltr">{info.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="truncate">{info.email}</span>
              </li>
            </ul>
          </div>

          {/* Official Admin Access */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {t('adminTitle')}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              {language === 'ar'
                ? 'فضاء مخصص لإطارات ومسيري مديرية السياحة لتحيين البيانات والمسالك.'
                : 'Espace sécurisé réservé aux administrateurs de la Direction pour la gestion du portail.'}
            </p>
            <div className="space-y-2">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 transition cursor-pointer"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{t('adminLogin')}</span>
              </button>

              {onOpenShare && (
                <button
                  onClick={onOpenShare}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 border border-emerald-700/40 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ar' ? 'مشاركة رابط المنصة' : 'Partager le portail'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>{t('copyright')}</div>
          <div className="flex items-center gap-2">
            <span>{t('algeriaStamp')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
