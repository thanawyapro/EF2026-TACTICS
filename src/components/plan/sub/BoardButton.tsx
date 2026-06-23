// src/components/plan/sub/BoardButton.tsx
import React from 'react';
import { Activity } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

interface BoardButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function BoardButton({ isOpen, onClick }: BoardButtonProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl border text-xs font-black font-orbitron transition-all duration-300 flex items-center gap-2 cursor-pointer shadow ${
        isOpen
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : 'bg-slate-950/40 border-border/80 text-cyan-400 hover:bg-slate-900'
      }`}
      style={!isOpen ? { color: themeAccent, borderColor: `${themeAccent}40` } : {}}
    >
      <Activity className="w-4 h-4 shrink-0 animate-pulse" />
      <span>
        {isOpen 
          ? (language === 'ar' ? 'إغلاق السبورة ❌' : 'Close Board ❌') 
          : (language === 'ar' ? 'افتح السبورة التفاعلية 📋' : 'Open Tactical Board 📋')
        }
      </span>
    </button>
  );
}
