import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';
import { Download, Smartphone, X, CheckCircle, Share as ShareIcon, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'prominent' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useLanguage();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone mode (already installed), hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const result = await install();
    if (result === 'accepted') {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    } else if (result === 'manual_required' || isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          className={`px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-600/40 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${className}`}
          title={language === 'ar' ? 'تثبيت التطبيق على الهاتف' : 'Installer l\'application'}
        >
          <Download className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
          <span>
            {language === 'ar' ? 'تثبيت التطبيق' : 'Installer l\'application'}
          </span>
        </button>
      )}

      {variant === 'prominent' && (
        <button
          onClick={handleInstallClick}
          className={`py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 text-emerald-300" />
          <span>
            {language === 'ar'
              ? 'تثبيت التطبيق على هاتفك (يعمل بدون إنترنت)'
              : 'Installer l\'application (Fonctionne hors-ligne)'}
          </span>
        </button>
      )}

      {variant === 'card' && (
        <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-emerald-950">
                {language === 'ar' ? 'تثبيت المنصة كتطبيق على الهاتف' : 'Installer l\'application sur mobile'}
              </h5>
              <p className="text-[11px] text-emerald-800/80 mt-0.5">
                {language === 'ar'
                  ? 'يعمل بكفاءة عالية في أي مكان حتى في عمق الصحراء وبدون الحاجة لشبكة الإنترنت.'
                  : 'Accessible hors-ligne en plein désert sans connexion internet.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-200" />
            <span>{language === 'ar' ? 'تثبيت الآن' : 'Installer maintenant'}</span>
          </button>
        </div>
      )}

      {/* iOS / General Guidance Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-start space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <span>
                  {language === 'ar' ? 'طريقة تثبيت التطبيق على هاتفك' : 'Comment installer l\'application'}
                </span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'ar'
                ? 'يمكنك تثبيت تطبيق «مديرية السياحة لولاية تندوف» مباشرة على الشاشة الرئيسية لهاتفك بخطوتين بسيطتين:'
                : 'Installez l\'application directement sur l\'écran d\'accueil de votre smartphone :'}
            </p>

            {isIOS ? (
              <div className="space-y-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-800">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    {language === 'ar' ? (
                      <>
                        اضغط على زر <strong>المشاركة</strong> (Share <ShareIcon className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" />) في شريط متصفح Safari.
                      </>
                    ) : (
                      <>
                        Appuyez sur le bouton <strong>Partager</strong> (<ShareIcon className="w-3.5 h-3.5 inline text-sky-600" />) dans Safari.
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    {language === 'ar' ? (
                      <>
                        مرر للأسفل واضغط على <strong>«إضافة إلى الصفحة الرئيسية»</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-stone-700 mx-0.5" />).
                      </>
                    ) : (
                      <>
                        Faites défiler et choisissez <strong>«Sur l'écran d'accueil»</strong>.
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'خطوات التثبيت على هواتف أندرويد (Google Chrome):'
                      : 'Installation sur Android (Google Chrome) :'}
                  </span>
                </div>
                
                <div className="space-y-2 bg-white p-3 rounded-xl border border-emerald-200 text-xs text-stone-800">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <div>
                      {language === 'ar'
                        ? 'اضغط على قائمة المتصفح (النقاط الثلاث ⋮) في أعلى زاوية Chrome.'
                        : 'Appuyez sur le menu (les 3 points ⋮) en haut du navigateur.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <div>
                      {language === 'ar' ? (
                        <>
                          اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong> (Créer un raccourci).
                        </>
                      ) : (
                        <>
                          Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <div>
                      {language === 'ar'
                        ? 'اضغط «تثبيت / إضافة» وسيظهر التطبيق فوراً كأيقونة مستقلة على شاشتك الرئيسية ويعمل بدون إنترنت.'
                        : 'Appuyez sur « Ajouter » : l\'icône officielle s\'installe et fonctionne hors-ligne.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-[11px] text-amber-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'ar'
                  ? 'سيعمل التطبيق بعدها حتى أثناء انقطاع شبكة الهاتف أو الإنترنت.'
                  : 'L\'application fonctionnera ensuite même sans réseau ni internet.'}
              </span>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition cursor-pointer"
            >
              {language === 'ar' ? 'حسناً، فهمت' : 'D\'accord'}
            </button>
          </div>
        </div>
      )}

      {/* Success notification */}
      {installSuccess && (
        <div className="fixed bottom-4 end-4 z-60 bg-emerald-700 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>
            {language === 'ar'
              ? 'تم تثبيت تطبيق سياحة تندوف بنجاح على جهازك!'
              : 'Application installée avec succès !'}
          </span>
        </div>
      )}
    </>
  );
};
