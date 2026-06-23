// src/components/ui/BottomActionBar.tsx
import React from 'react';

interface BottomActionBarProps {
  children: React.ReactNode;
}

export function BottomActionBar({ children }: BottomActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-border/60 p-3.5 sm:relative sm:border-none sm:bg-transparent sm:p-0">
      <div className="max-w-xl mx-auto sm:max-w-none">
        {children}
      </div>
    </div>
  );
}
export default BottomActionBar;
