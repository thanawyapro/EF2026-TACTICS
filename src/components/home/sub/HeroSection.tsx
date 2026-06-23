// src/components/home/sub/HeroSection.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export default function HeroSection() {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  return (
    <div className="text-center py-6 sm:py-8 space-y-3 relative overflow-hidden select-none" data-testid="hero-section">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e172a] border border-cyan-500/15 text-cyan-400 text-[10px] font-black uppercase font-orbitron tracking-widest">
        <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
        <span>{language === 'ar' ? 'البوابة التكتيكية الحية ⚡' : 'eFootball 2026 DNA ENGINE ACTIVE ⚡'}</span>
      </div>

      <div className="space-y-1.5">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-orbitron tracking-tight text-white leading-[1.12]">
          {language === 'ar' ? (
            <>
              صانع خطط <span style={{ color: themeAccent }}>المحترفين</span> بالذكاء الاصطناعي
            </>
          ) : (
            <>
              Ultimate <span style={{ color: themeAccent }}>eFootball</span> Tactics Boss
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-sm sm:max-w-md mx-auto font-semibold leading-relaxed">
          {language === 'ar'
            ? 'احصل على أنظمة لعب الميتا المثالية، وتغلب على خطط دفاع الخصوم بكبسة زر واحدة.'
            : 'Unleash elite metadata parameters, counter any top playstyle format, and configure optimal setups instantly.'}
        </p>
      </div>
    </div>
  );
}
