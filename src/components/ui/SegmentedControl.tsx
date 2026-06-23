// src/components/ui/SegmentedControl.tsx
import React from 'react';

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, selectedValue, onChange }: SegmentedControlProps) {
  return (
    <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-border/50 select-none">
      {options.map((opt) => {
        const active = selectedValue === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
              active
                ? 'bg-primary text-navyBg font-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
export default SegmentedControl;
