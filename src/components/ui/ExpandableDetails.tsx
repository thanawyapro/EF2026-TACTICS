// src/components/ui/ExpandableDetails.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableDetailsProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ExpandableDetails({ title, children, defaultExpanded = false }: ExpandableDetailsProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-border/45 rounded-2xl overflow-hidden bg-slate-950/15">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-950/30 transition text-right"
      >
        <span className="text-[11px] font-black font-orbitron text-gray-300 uppercase tracking-wider">
          {title}
        </span>
        <div className="shrink-0 bg-slate-950 p-1.5 rounded-lg border border-border/30">
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-border/35 bg-slate-950/50 text-xs text-gray-300 space-y-3 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ExpandableDetails;
