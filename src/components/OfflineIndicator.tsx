import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../context/LanguageContext';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 start-4 z-50 flex items-center gap-2.5 rounded-2xl bg-amber-900/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-white shadow-2xl border border-amber-600/50 animate-bounce duration-1000">
      <div className="w-6 h-6 rounded-lg bg-amber-700/80 flex items-center justify-center shrink-0">
        <WifiOff className="w-3.5 h-3.5 text-amber-200" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="font-bold text-amber-100">
            {language === 'ar' ? 'وضع العمل بدون إنترنت نشط' : 'Mode Hors-ligne Actif'}
          </span>
        </div>
        <div className="text-[10px] text-amber-200/90 font-normal">
          {language === 'ar'
            ? 'تطبيق تندوف يعمل بكفاءة وتصفح البيانات متاح بالكامل محلياً'
            : 'Toutes les données et circuits sont accessibles sans connexion'}
        </div>
      </div>
    </div>
  );
};
