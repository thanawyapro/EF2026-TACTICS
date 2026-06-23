// src/components/ui/ChoiceGrid.tsx
import React from 'react';

interface ChoiceGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function ChoiceGrid({ children, columns = 2 }: ChoiceGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4'
  }[columns];

  return (
    <div className={`grid gap-3 ${gridCols}`}>
      {children}
    </div>
  );
}
export default ChoiceGrid;
