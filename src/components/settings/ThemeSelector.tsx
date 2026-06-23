// src/components/settings/ThemeSelector.tsx
import React from 'react';
import { useTheme } from '../../theme/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { Palette, Check } from 'lucide-react';

export default function ThemeSelector() {
  const { themeId, selectTheme, allThemes } = useTheme();
  const { language, t } = useLanguage();

  return (
    <div className="bg-slate-950/40 border border-border/80 p-5 rounded-3xl shadow-md space-y-4 font-semibold animate-fadeIn" data-testid="theme-selector-card">
      <div className="flex items-center gap-2 border-b border-border/45 pb-2">
        <Palette className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
          {t('settings.proThemes')}
        </h3>
      </div>

      <p className="text-[10px] text-gray-400 leading-normal">
        {t('settings.proThemesDesc')}
      </p>

      <div className="space-y-2.5">
        {allThemes.map((opt) => {
          const active = themeId === opt.id;
          const name = 
            language === 'ar' ? opt.nameAr :
            language === 'fr' ? opt.nameFr :
            language === 'es' ? opt.nameEs : opt.nameEn;
          const desc = 
            language === 'ar' ? opt.descriptionAr :
            language === 'fr' ? opt.descriptionFr :
            language === 'es' ? opt.descriptionEs : opt.descriptionEn;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => selectTheme(opt.id as any)}
              className={`w-full p-3.5 rounded-2xl border transition duration-150 flex items-center justify-between cursor-pointer gap-3 ${
                active 
                  ? 'bg-slate-900 border-primary font-black shadow-md' 
                  : 'bg-slate-900/40 border-border/40 text-gray-400 hover:text-white hover:border-zinc-500'
              }`}
            >
              <div className="space-y-1 text-left flex-1 min-w-0 pr-2 leading-snug">
                <span className="text-xs font-black text-white block">{name}</span>
                <span className="text-[10px] text-gray-450 block truncate leading-tight">{desc}</span>
              </div>

              {/* Dynamic Theme Color Swatches preview */}
              <div className="flex items-center gap-1.5 shrink-0 flex-row-reverse">
                <div className="w-5 h-5 flex items-center justify-center">
                  {active && <Check className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex items-center -space-x-1">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: opt.colors.bg }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: opt.colors.primary }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: opt.colors.secondary }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export { ThemeSelector };
