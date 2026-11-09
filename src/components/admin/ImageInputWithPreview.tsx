import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Image as ImageIcon, CheckCircle, AlertCircle, X, Sparkles, Upload, RefreshCw } from 'lucide-react';

interface ImageInputWithPreviewProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  suggestions?: string[];
}

export const ImageInputWithPreview: React.FC<ImageInputWithPreviewProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  required = false,
  suggestions
}) => {
  const { language } = useLanguage();
  const [loadError, setLoadError] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset load error whenever the value changes
  useEffect(() => {
    setLoadError(false);
  }, [value]);

  const fallbackImage =
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80';

  const defaultSuggestions = suggestions || [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80'
  ];

  const handleUrlChange = (rawText: string) => {
    let clean = (rawText || '').trim();
    // Remove wrapping quotes if user pasted with quotes
    clean = clean.replace(/^["']|["']$/g, '');
    setLoadError(false);
    onChange(clean);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Optimize and compress for optimal storage
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          handleUrlChange(compressed);
        } else {
          handleUrlChange(src);
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        handleUrlChange(src);
        setIsUploading(false);
      };
      img.src = src;
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2.5 bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/80">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-stone-900">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex items-center gap-1.5 flex-wrap">
          {value && (
            <button
              type="button"
              onClick={() => handleUrlChange('')}
              className="text-[11px] text-stone-500 hover:text-red-600 flex items-center gap-0.5 px-2 py-0.5 rounded-md hover:bg-red-50 transition cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>{language === 'ar' ? 'مسح' : 'Effacer'}</span>
            </button>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-[11px] text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer border border-emerald-300"
          >
            {isUploading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Upload className="w-3 h-3 text-emerald-700" />
            )}
            <span>{language === 'ar' ? 'رفع صورة من جهازك' : 'Téléverser une image'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-[11px] text-amber-800 bg-amber-100/70 hover:bg-amber-200 px-2 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer border border-amber-300/60"
          >
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>{language === 'ar' ? 'صور مقترحة' : 'Suggestions'}</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2.5 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={language === 'ar' ? 'الصق رابط الصورة هنا، أو اضغط زر رفع صورة أعلاه' : placeholder}
          required={required}
          className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          dir="ltr"
        />

        {value ? (
          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-emerald-600/40 bg-stone-100 shrink-0 shadow-xs relative group">
            <img
              src={loadError ? fallbackImage : value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setLoadError(true)}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <span className="text-[10px] text-white font-semibold">{language === 'ar' ? 'معاينة' : 'Aperçu'}</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50/50 hover:bg-amber-100/70 flex flex-col items-center justify-center text-amber-800 shrink-0 cursor-pointer transition"
            title={language === 'ar' ? 'اضغط لاختيار صورة' : 'Choisir une image'}
          >
            <Upload className="w-4 h-4 text-amber-700" />
            <span className="text-[9px] font-bold mt-0.5">{language === 'ar' ? 'اختيار' : 'Parcourir'}</span>
          </button>
        )}
      </div>

      {value && (
        <div className="flex items-center justify-between text-[11px] px-1">
          {loadError ? (
            <span className="text-amber-800 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الرابط لا يظهر مباشرة، سيتم استخدام صورة بديلة تلقائياً.' : 'Lien inaccessible, image par défaut utilisée.'}</span>
            </span>
          ) : (
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تم تعيين ومعاينة الصورة بنجاح.' : 'Image prête et validée.'}</span>
            </span>
          )}
        </div>
      )}

      {/* Suggested images dropdown / tray */}
      {showSuggestions && (
        <div className="pt-2.5 border-t border-amber-200">
          <div className="text-[11px] font-semibold text-stone-700 mb-2">
            {language === 'ar' ? 'اختر من الصور المعتمدة لولاية تندوف:' : 'Sélectionnez une image suggérée :'}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
            {defaultSuggestions.map((sUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleUrlChange(sUrl);
                  setShowSuggestions(false);
                }}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer hover:scale-105 ${
                  value === sUrl ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-stone-200'
                }`}
              >
                <img src={sUrl} alt="Suggestion" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
