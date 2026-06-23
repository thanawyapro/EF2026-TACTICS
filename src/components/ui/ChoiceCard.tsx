// src/components/ui/ChoiceCard.tsx
import React from 'react';

interface ChoiceCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  badge?: string;
  testId?: string;
}

export function ChoiceCard({ label, description, selected, onClick, badge, testId }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`relative w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
        selected
          ? 'bg-primary/10 border-primary text-white shadow-glow-primary'
          : 'bg-slate-950/40 border-border/60 text-gray-400 hover:text-white hover:border-zinc-500'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-black font-orbitron ${selected ? 'text-primary' : 'text-gray-200'}`}>
          {label}
        </span>
        {badge && (
          <span className="text-[9px] font-black uppercase bg-slate-900 border border-border/80 px-2 py-0.5 rounded-full text-gray-400">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="text-[10px] text-gray-400 mt-1 lines-clamp-2 leading-relaxed font-semibold">
          {description}
        </p>
      )}
    </button>
  );
}
export default ChoiceCard;
