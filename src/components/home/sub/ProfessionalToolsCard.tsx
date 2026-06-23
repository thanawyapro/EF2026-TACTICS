// src/components/home/sub/ProfessionalToolsCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

interface ProfessionalToolsCardProps {
  onNavigate: (tabId: string) => void;
}

export default function ProfessionalToolsCard({ onNavigate }: ProfessionalToolsCardProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  return (
    <motion.div
      whileHover={{ y: -4, borderColor: themeAccent }}
      onClick={() => onNavigate('tools')}
      className="bg-slate-950/70 border border-cyan-500/15 p-6 rounded-3xl cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 select-none shadow-xl"
    >
      {/* Background radial glow */}
      <div 
        className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-60" 
        style={{ backgroundColor: themeAccent, opacity: 0.08 }}
      />

      <div className="flex items-center gap-4 z-10">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0"
          style={{ 
            backgroundColor: `${themeAccent}12`, 
            borderColor: `${themeAccent}25`,
            color: themeAccent
          }}
        >
          <Sliders className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-white">
              {language === 'ar' ? '🛠️ بوابـة أدوات المحترفين' : '🛠️ Professional Tools Hub'}
            </h3>
            <span className="text-[8px] bg-cyan-400/15 border border-cyan-400/20 text-cyan-400 px-1.5 py-0.5 rounded font-black uppercase font-mono">
              PRO ACCESS
            </span>
          </div>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-sm sm:max-w-md">
            {language === 'ar'
              ? 'افتح محاكي رادار الميتا، وتتبع أدائك، وأطلق السبورة التكتيكية المتقدمة وباقي التحليلات.'
              : 'Unlock live playstyle efficiency index, team builder, match reports and sub-tactics parameters.'}
          </p>
        </div>
      </div>

      <div 
        className="flex items-center gap-1.5 text-xs font-black uppercase font-orbitron shrink-0 pointer-events-none"
        style={{ color: themeAccent }}
      >
        <span>{language === 'ar' ? 'دخول فوري' : 'ENTER HUB'}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}
