// src/components/plan/sub/SavePlanDialog.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

interface SavePlanDialogProps {
  isOpen: boolean;
}

export default function SavePlanDialog({ isOpen }: SavePlanDialogProps) {
  const language = useAppStore(state => state.language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-3xl bg-[#090d1a] border border-cyan-500/20 p-6 space-y-4 shadow-2xl text-center"
      >
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-6 h-6 animate-bounce" />
        </div>

        <div className="space-y-1.5">
          <h4 className="text-base font-black text-white">
            {language === 'ar' ? 'تم الحفظ بنجاح! 🎉' : 'Plan Saved Successfully! 🎉'}
          </h4>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            {language === 'ar' 
              ? 'تمت إضافة تكتيك خطتك التكتيكية بنجاح إلى ملفك الشخصي بالخطط المحفوظة Saved Plans.' 
              : 'The tactical profile has been integrated into your Saved Plans.'
            }
          </p>
        </div>

        <div className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest">
          {language === 'ar' ? 'جاري توجيهك حالياً...' : 'Redirecting...'}
        </div>
      </motion.div>
    </div>
  );
}
