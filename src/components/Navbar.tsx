import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  MapPin,
  Building,
  Briefcase,
  Hammer,
  Map as MapIcon,
  Shield,
  Menu,
  X,
  Globe,
  Info,
  LogOut,
  Share2
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection?: string;
  logoUrl?: string;
  onOpenShare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onNavigateSection, logoUrl, onOpenShare }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: t('navHome'), icon: Compass },
    { id: 'routes', label: t('navRoutes'), icon: MapPin },
    { id: 'sites', label: t('navSites'), icon: Building },
    { id: 'hotels', label: t('navHotels'), icon: Building },
    { id: 'agencies', label: t('navAgencies'), icon: Briefcase },
    { id: 'artisans', label: t('navArtisans'), icon: Hammer },
    { id: 'interactive-map', label: t('navMap'), icon: MapIcon },
    { id: 'directorate', label: t('navDirectorate'), icon: Info }
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  const effectiveLogoUrl = logoUrl || '/assets/aistudio/Gemini_Generated_Image_jn52udjn52udjn52_bbdab105.jpg';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      {/* Top Algerian Official Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-amber-800 to-amber-950 text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>{t('republicTitle')}</span>
            <span className="hidden md:inline text-white/50">|</span>
            <span className="hidden md:inline">{t('ministryTitle')}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-200 font-semibold">{t('wilayaTitle')}</span>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 transition text-xs font-semibold"
              title="Changer de langue / تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ar' ? 'Français' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Official Title */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 text-start group cursor-pointer"
          >
            <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 border-2 border-emerald-700/40 shadow-md shadow-emerald-950/10 group-hover:scale-105 group-hover:border-emerald-600 transition transform shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src={effectiveLogoUrl}
                alt="شعار مديرية السياحة والصناعة التقليدية لولاية تندوف"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-stone-900 leading-tight">
                {t('appTitle')}
              </h1>
              <p className="text-xs text-amber-800 font-medium hidden sm:block">
                {language === 'ar' ? 'بوابة السياحة والصناعة التقليدية' : 'Portail Officiel du Tourisme & de l\'Artisanat'}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="px-3 py-2 rounded-lg text-xs xl:text-sm font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/80 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-amber-700" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Admin & Action Controls */}
          <div className="flex items-center gap-2">
            {/* PWA Install Button */}
            <PWAInstallButton variant="navbar" />

            {/* Share Website Button */}
            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-700/30 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title={language === 'ar' ? 'مشاركة رابط الموقع' : 'Partager le site'}
              >
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">{language === 'ar' ? 'مشاركة' : 'Partager'}</span>
              </button>
            )}

            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenAdmin}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:from-amber-800 hover:to-amber-950 transition cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-amber-300" />
                  <span>{t('adminTitle')}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-red-50 hover:text-red-700 transition"
                  title={t('adminLogout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="px-3 py-1.5 rounded-xl border border-amber-800/20 text-amber-900 hover:bg-amber-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Shield className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">{t('adminLogin')}</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-3 transition"
              >
                <Icon className="w-5 h-5 text-amber-700" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {onOpenShare && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShare();
              }}
              className="w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-800 hover:bg-emerald-50 flex items-center gap-3 transition border-t border-stone-100 mt-2 pt-3"
            >
              <Share2 className="w-5 h-5 text-emerald-700" />
              <span>{language === 'ar' ? 'مشاركة المنصة مع الأصدقاء' : 'Partager le site avec vos amis'}</span>
            </button>
          )}

          <div className="pt-2">
            <PWAInstallButton variant="prominent" />
          </div>
        </div>
      )}
    </header>
  );
};
