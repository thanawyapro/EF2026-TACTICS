// src/components/settings/LanguageSelector.tsx
import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Globe, Check } from 'lucide-react';

export default function LanguageSelector() {
  const { language, changeLanguage, t } = useLanguage();

  const options = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' }
  ] as const;

  return (
    <div className="bg-slate-950/40 border border-border/80 p-5 rounded-3xl shadow-md space-y-4 font-semibold" data-testid="language-selector">
      <div className="flex items-center gap-2 border-b border-border/45 pb-2">
        <Globe className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
          {t('settings.language')}
        </h3>
      </div>

      <p className="text-[10px] text-gray-400 leading-normal">
        {language === 'ar' 
          ? 'اختار اللغة التي ترغب في عرض واجهات التطبيق والنصائح والتحليلات الفنية بها.' 
          : 'Choose the visual language in which you want to display app controls and tactical feedback.'}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const active = language === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => changeLanguage(opt.code)}
              className={`p-3 rounded-xl text-xs font-bold border transition duration-150 cursor-pointer flex items-center justify-between ${
                active 
                  ? 'bg-primary text-navyBg border-primary font-black shadow-md' 
                  : 'bg-slate-900 border-border/50 text-gray-400 hover:text-white hover:border-zinc-500'
              }`}
            >
              <span>{opt.label}</span>
              {active && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export { LanguageSelector };
