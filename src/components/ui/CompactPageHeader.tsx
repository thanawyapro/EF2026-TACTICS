// src/components/ui/CompactPageHeader.tsx
import React from 'react';

interface CompactPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function CompactPageHeader({ title, subtitle, icon }: CompactPageHeaderProps) {
  return (
    <div className="border-b border-border/40 pb-3 flex items-start gap-3 select-none">
      {icon && <div className="text-xl shrink-0 mt-0.5">{icon}</div>}
      <div className="min-w-0 flex-1">
        <h2 className="text-lg sm:text-xl font-black font-orbitron text-white leading-tight tracking-wide truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1 font-semibold leading-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
export default CompactPageHeader;
