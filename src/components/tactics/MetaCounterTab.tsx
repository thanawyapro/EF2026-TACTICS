import React, { useState } from 'react';
import { Zap, AlertTriangle, ChevronRight, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { META_FORMATIONS, TRANSLATIONS } from '../../lib/tactics';

export default function MetaCounterTab() {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  
  const [activeMetaId, setActiveMetaId] = useState<string | null>(null);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <div className="space-y-6 select-none font-sans" data-testid="meta-counter-tab">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black font-orbitron text-white leading-tight">⚔️ Meta Counter Deck</h2>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'en'
            ? 'Discover strict counters, pre-match setups, and live tactical overlays to neutralize prevailing models'
            : 'اكتشف خطط مضادة، وتعليمات ما قبل المباراة لتصدى ومنع أساليب ميتا اللعبة الشائعة'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {META_FORMATIONS.map(meta => {
          const isOpen = activeMetaId === meta.id;
          return (
            <div 
              key={meta.id} 
              className="bg-[#0b0f19]/70 border border-border/80 p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="pr-2">
                  <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">{meta.name}</h3>
                  <span className="text-[9px] text-[#eab308] uppercase font-black font-orbitron mt-1 block">POPULARITY ACCORDING TO DATA: {meta.popularity}</span>
                </div>
                <div className="bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/20 px-2 py-1 rounded text-[9px] font-black font-orbitron whitespace-nowrap">⚠️ THREAT</div>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-border/40 text-xs text-gray-300 leading-normal font-semibold">
                <span className="text-[8px] font-black font-orbitron tracking-widest text-[#ef4444] block mb-1 uppercase">DANGER MECHANIC DESC</span>
                <span>{meta.dangerDesc}</span>
              </div>

              {isOpen ? (
                <div className="space-y-4 font-sans border-t border-border/60 pt-4 animate-fadeIn">
                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 rounded-xl">
                    <span className="text-[9px] font-black font-orbitron tracking-wider text-emerald-400 uppercase">BEST STRUCTURAL COUNTER</span>
                    <span className="text-xs font-black font-orbitron bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/25">{meta.counterForm}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs leading-relaxed text-gray-300 font-semibold">
                    <div className="p-3.5 bg-slate-900 rounded-xl border border-border/60">
                      <span className="text-[8.5px] font-black font-orbitron tracking-wider text-primary block mb-1 uppercase" style={{ color: themeAccent }}>PRE-MATCH SQUAD INSTRUCTIONS</span>
                      <span>{meta.preMatchSettings}</span>
                    </div>

                    <div className="p-3.5 bg-slate-900 rounded-xl border border-border/60">
                      <span className="text-[8.5px] font-black font-orbitron tracking-wider text-amber-500 block mb-1 uppercase">IN-GAME LIVE ADJUSTMENTS</span>
                      <span>{meta.inGameAdj}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveMetaId(null)}
                    className="w-full bg-slate-900 hover:bg-zinc-800 border border-border/60 font-bold font-orbitron py-2.5 rounded-xl text-xs text-gray-300 hover:text-white transition cursor-pointer"
                  >
                    CLOSE BRIEFING
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setActiveMetaId(meta.id);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-navyBg font-black font-orbitron py-3 rounded-xl text-xs transition uppercase tracking-wider hover:brightness-110 cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ backgroundImage: `linear-gradient(to right, ${themeAccent}, #a855f7)` }}
                >
                  <Eye className="w-4 h-4" />
                  <span>{language === 'en' ? 'REVEAL COUNTER FORMULATION' : 'كشف التكتيك المضاد'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
