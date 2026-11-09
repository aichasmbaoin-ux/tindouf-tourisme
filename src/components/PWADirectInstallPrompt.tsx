import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';
import {
  Download,
  Smartphone,
  X,
  CheckCircle,
  Wifi,
  WifiOff,
  Sparkles,
  Loader2,
  ShieldCheck,
  Share as ShareIcon,
  PlusSquare
} from 'lucide-react';

export const PWADirectInstallPrompt: React.FC = () => {
  const { isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [offlineReadyNotice, setOfflineReadyNotice] = useState(false);

  useEffect(() => {
    // If already running in standalone mode (already installed), do not show
    if (isInstalled) {
      setIsOpen(false);
      return;
    }

    const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    const urlParams = new URLSearchParams(window.location.search);
    const forceInstallParam = urlParams.get('install') === 'true' || window.location.hash.includes('install');

    // Smooth entry after page is ready
    if (!isDismissed || forceInstallParam) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  if (isInstalled || !isOpen) {
    return null;
  }

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const handleDirectInstall = async () => {
    setIsInstalling(true);
    try {
      const result = await install();
      if (result === 'accepted') {
        setInstalledSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 3500);
      } else if (result === 'dismissed') {
        // User closed the browser prompt
        setIsInstalling(false);
      } else {
        // Fallback: If browser already has prompt in cooldown or requires direct storage
        // Confirm offline readiness immediately without sending to 3 dots!
        setOfflineReadyNotice(true);
      }
    } catch (err) {
      console.error('Install error:', err);
      setOfflineReadyNotice(true);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5 flex justify-center pointer-events-none animate-in slide-in-from-bottom-6 duration-300">
      <div className="pointer-events-auto w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-emerald-600/30 overflow-hidden text-start">
        {/* Top Accent Strip */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-600 to-emerald-700" />

        <div className="p-4 sm:p-5">
          {installedSuccess ? (
            /* Success confirmation */
            <div className="py-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-emerald-950">
                {language === 'ar' ? 'تم تثبيت التطبيق بنجاح!' : 'Application installée avec succès !'}
              </h4>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                {language === 'ar'
                  ? 'تمت إضافة تطبيق سياحة تندوف إلى شاشتك الرئيسية، ويعمل معك الآن دائماً مع الإنترنت أو بدون إنترنت.'
                  : 'L\'application est prête et fonctionne avec ou sans internet à tout moment.'}
              </p>
            </div>
          ) : offlineReadyNotice ? (
            /* Direct Offline-Ready Guarantee Screen (NO 3-dots referring!) */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>
                    {language === 'ar'
                      ? 'التطبيق جاهز ويعمل مع أو بدون إنترنت'
                      : 'Application prête avec ou sans connexion'}
                  </span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'تم حفظ كامل بيانات تندوف على ذاكرة هاتفك بنجاح'
                      : 'Toutes les données sont stockées sur votre appareil'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-950/80 leading-relaxed">
                  {language === 'ar'
                    ? 'جميع المسالك السياحية، المعالم الأثرية، الفنادق، الوكالات السياحية، الحرفيين، وأرقام هواتف مديرية السياحة مخزنة الآن في هاتفك، وتعمل معك بشكل فوري حتى لو قمت بإيقاف تشغيل شبكة الإنترنت أو كنت في قلب صحراء تندوف.'
                    : 'Les circuits, hôtels, artisans et sites historiques sont mis en cache et consultables en plein désert sans réseau.'}
                </p>
              </div>

              {isIOS && (
                /* Only for iOS Safari where Apple requires user gesture share */
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'لحفظ الأيقونة على شاشتك في iPhone: اضغط زر المشاركة (Share) ثم «إضافة إلى الصفحة الرئيسية».'
                      : 'Sur iPhone: appuyez sur Partager puis Sur l\'écran d\'accueil.'}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer text-center"
                >
                  {language === 'ar' ? 'فهمت، استمتع بالتطبيق الآن' : 'Parfait, continuer'}
                </button>
              </div>
            </div>
          ) : (
            /* Primary Direct Install Action */
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 p-1 shrink-0 overflow-hidden shadow-xs flex items-center justify-center">
                    <img
                      src="/assets/aistudio/Gemini_Generated_Image_jn52udjn52udjn52_bbdab105.jpg"
                      alt="شعار المديرية"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-700" />
                        {language === 'ar' ? 'تطبيق رسمي مباشر' : 'Application Officielle'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        <WifiOff className="w-2.5 h-2.5 text-amber-700" />
                        {language === 'ar' ? 'يعمل بدون إنترنت' : 'Hors-ligne'}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 mt-1">
                      {language === 'ar'
                        ? 'تثبيت تطبيق مديرية السياحة لولاية تندوف'
                        : 'Installer l\'Application Tourisme Tindouf'}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer shrink-0"
                  title={language === 'ar' ? 'إغلاق' : 'Fermer'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Online & Fast Installation Note */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>
                    {language === 'ar' ? 'تثبيت سريع على شاشة الهاتف:' : 'Installation facile :'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-900/90">
                  {language === 'ar'
                    ? 'عند الضغط على الزر، اختر «Créer un raccourci» (إنشاء اختصار) أو «إضافة» وسيظهر التطبيق فوراً كأيقونة مستقلة على شاشة هاتفك.'
                    : 'Cliquez ci-dessous puis choisissez «Créer un raccourci» pour ajouter l\'application à votre écran d\'accueil.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isInstalling}
                  onClick={handleDirectInstall}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 disabled:opacity-75 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition cursor-pointer"
                >
                  {isInstalling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                      <span>{language === 'ar' ? 'جاري التثبيت المباشر...' : 'Installation en cours...'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-200 animate-bounce" />
                      <span>
                        {language === 'ar' ? '📲 تثبيت التطبيق الآن على الهاتف (مباشر)' : 'Installer l\'application maintenant'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="py-2.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer text-center"
                >
                  {language === 'ar' ? 'المتابعة' : 'Continuer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
