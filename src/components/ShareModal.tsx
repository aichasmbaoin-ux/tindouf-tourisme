import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Globe,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Compute public share URL (preferring pre/preview public link over dev preview)
  const getShareUrl = (): string => {
    if (typeof window !== 'undefined') {
      const current = window.location.origin;
      if (current.includes('ais-dev-')) {
        return current.replace('ais-dev-', 'ais-pre-');
      }
      return current;
    }
    return 'https://ais-pre-sjs6m37f7jmz3yspwz2bqg-442637079154.europe-west2.run.app';
  };

  const shareUrl = getShareUrl();

  const shareTitle =
    language === 'ar'
      ? 'مديرية السياحة والصناعة التقليدية لولاية تندوف'
      : 'Direction du Tourisme et de l\'Artisanat de la Wilaya de Tindouf';

  const shareDescription =
    language === 'ar'
      ? 'اكتشف تندوف، أرض التاريخ والطبيعة والأصالة - المنصة السياحية الرقمية الرسمية لولاية تندوف.'
      : 'Découvrez Tindouf, terre d\'histoire, de nature et d\'authenticité - Portail touristique officiel.';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareTitle}\n${shareDescription}\n${shareUrl}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-amber-800 to-amber-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-200">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'ar' ? 'مشاركة المنصة السياحية' : 'Partager le Portail'}
              </h3>
              <p className="text-xs text-amber-200/80">
                {language === 'ar' ? 'أرسل الرابط لأصدقائك وعائلتك' : 'Partagez avec vos amis et proches'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Site Preview Card */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 border border-emerald-600/40 shadow-xs shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_jn52udjn52udjn52_bbdab105.jpg"
                alt="شعار المديرية"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-stone-900 truncate">{shareTitle}</h4>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{shareDescription}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-semibold mt-1">
                <Globe className="w-3 h-3 text-emerald-600" />
                <span className="truncate" dir="ltr">{shareUrl}</span>
              </div>
            </div>
          </div>

          {/* Copy URL Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {language === 'ar' ? 'رابط المشاركة المباشر' : 'Lien direct de partage'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                dir="ltr"
                className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-sm ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-700 hover:bg-amber-800 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تم النسخ!' : 'Copié !'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{language === 'ar' ? 'نسخ' : 'Copier'}</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>
                  {language === 'ar'
                    ? 'تم نسخ الرابط إلى الحافظة! يمكنك الآن لصقه وإرساله لأصدقائك.'
                    : 'Lien copié dans le presse-papier !'}
                </span>
              </p>
            )}
          </div>

          {/* Social Share Buttons */}
          <div>
            <div className="text-xs font-semibold text-stone-700 mb-2.5">
              {language === 'ar' ? 'مشاركة سريعة عبر التطبيقات:' : 'Partage rapide :'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition"
              >
                <Send className="w-5 h-5 text-sky-600" />
                <span>Telegram</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span>Facebook</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 text-xs font-semibold transition"
              >
                <Twitter className="w-5 h-5 text-stone-700" />
                <span>X / Twitter</span>
              </a>
            </div>
          </div>

          {/* Native System Share for mobile devices */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-700" />
              <span>
                {language === 'ar' ? 'المزيد من خيارات المشاركة في هاتفك' : 'Plus d\'options de partage'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
