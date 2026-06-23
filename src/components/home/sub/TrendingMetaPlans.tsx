// src/components/home/sub/TrendingMetaPlans.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Star, ChevronDown, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { getCachedMetaPlans, MetaPlan } from '../../../data/metaPlans';

export default function TrendingMetaPlans() {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  const [plans, setPlans] = useState<MetaPlan[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  useEffect(() => {
    // Loaded strictly from 24h cached local/static metaPlans
    const cached = getCachedMetaPlans();
    setPlans(cached);
  }, []);

  const toggleExpand = (formation: string) => {
    setExpandedPlan(expandedPlan === formation ? null : formation);
  };

  return (
    <div className="bg-slate-900/40 p-5 rounded-3xl border border-border/80 space-y-4 select-none" data-testid="trending-meta-plans">
      <div className="flex items-center justify-between border-b border-border/30 pb-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black font-orbitron text-white uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{language === 'ar' ? '🔥 تشكيلات الميتا المتصدرة حالياً' : '🔥 Trending Meta Plans'}</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-mono font-bold leading-none">
            {language === 'ar' ? 'تحديث تلقائي للميتا كل 24 ساعة (محفوظ مؤقتاً)' : 'Auto-recalculates every 24 hours (Cached)'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plans.map((plan) => {
          const isExpanded = expandedPlan === plan.formation;
          return (
            <div 
              key={plan.formation}
              className="bg-[#040813] border border-border/60 hover:border-cyan-500/20 rounded-2xl p-4 transition-all duration-300"
            >
              <div 
                onClick={() => toggleExpand(plan.formation)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/10 text-cyan-400 font-black font-orbitron px-2.5 py-1rounded border border-cyan-500/20 text-xs rounded">
                    {plan.formation}
                  </div>
                  <div>
                    <span className="text-xs text-white pb-0.5 font-bold block">
                      {language === 'ar' ? plan.playstyleAr : plan.playstyle}
                    </span>
                    <span className="text-[9px] text-[#a855f7] bg-[#a855f7]/10 px-2 py-0.5 rounded font-black font-mono uppercase">
                      {plan.recommendationLevel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-emerald-400">
                    {plan.rating}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-3 pt-3 border-t border-border/30 space-y-3"
                  >
                    {/* Advantages */}
                    <div className="text-[11.5px] leading-relaxed space-y-1">
                      <span className="font-extrabold text-[#10b981] block uppercase text-[8.5px] tracking-wider">
                        {language === 'ar' ? '✅ المميزات والمبررات التكتيكية (Pros):' : '✅ Tactical Pros:'}
                      </span>
                      <p className="text-gray-300 font-semibold">{language === 'ar' ? plan.prosAr : plan.pros}</p>
                    </div>

                    {/* Disadvantages */}
                    <div className="text-[11.5px] leading-relaxed space-y-1">
                      <span className="font-extrabold text-[#f43f5e] block uppercase text-[8.5px] tracking-wider">
                        {language === 'ar' ? '❌ العيوب والاحتياطات (Cons):' : '❌ Tactical Cons:'}
                      </span>
                      <p className="text-gray-300 font-semibold">{language === 'ar' ? plan.consAr : plan.cons}</p>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1">
                      <span className="font-extrabold text-cyan-400 block uppercase text-[8.5px] tracking-wider">
                        {language === 'ar' ? '📌 تفاصيل هيكلية رئيسية:' : '📌 Core Structure Parameters:'}
                      </span>
                      <ul className="text-[11px] text-gray-400 font-semibold space-y-0.5 list-disc list-inside">
                        {(language === 'ar' ? plan.highlightsAr : plan.highlights).map((hl, i) => (
                          <li key={i}>{hl}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
