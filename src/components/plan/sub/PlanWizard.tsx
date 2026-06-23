// src/components/plan/sub/PlanWizard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

interface PlanWizardProps {
  step: number;
  selectedPlaystyle: string;
  onSelectPlaystyle: (style: string) => void;
  selectedProblem: string;
  onSelectProblem: (prob: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PlanWizard({
  step,
  selectedPlaystyle,
  onSelectPlaystyle,
  selectedProblem,
  onSelectProblem,
  onNext,
  onBack
}: PlanWizardProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const playstyles = [
    { id: 'Possession Game', labelAr: 'استحواذ', labelEn: 'Possession Game' },
    { id: 'Quick Counter', labelAr: 'مرتدات سريعة', labelEn: 'Quick Counter' },
    { id: 'Long Ball Counter', labelAr: 'كرة طويلة مضادة', labelEn: 'Long Ball Counter' },
    { id: 'Out Wide', labelAr: 'لعب على الأطراف', labelEn: 'Out Wide' },
    { id: 'Long Ball', labelAr: 'كرة طويلة', labelEn: 'Long Ball' },
    { id: 'unsure', labelAr: language === 'ar' ? 'اختار لي' : 'Choose for me', labelEn: 'Choose for me' }
  ];

  const problems = [
    { id: 'midfield_lost', labelAr: 'بخسر الوسط', labelEn: 'Losing midfield space' },
    { id: 'conceding_counters', labelAr: 'بستقبل مرتدات', labelEn: 'Conceding counters' },
    { id: 'cannot_score', labelAr: 'مش بوصل للمرمى', labelEn: 'Cannot penetrate defense' },
    { id: 'weak_wings', labelAr: 'الأطراف ضعيفة', labelEn: 'Flanks feel weak' },
    { id: 'leaky_defense', labelAr: 'الدفاع بيتفتح', labelEn: 'Defense gets opened up' },
    { id: 'isolated_forward', labelAr: 'المهاجم معزول', labelEn: 'Striker is isolated' },
    { id: 'random_pressing', labelAr: 'الضغط عندي عشوائي', labelEn: 'Random chaotic pressing' }
  ];

  return (
    <div className="space-y-4" data-testid="plan-wizard">
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-center text-white">
            {language === 'ar' ? 'اختار أسلوبك المفضل:' : 'Choose Your Playstyle:'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {playstyles.map((style) => {
              const isSelected = selectedPlaystyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => {
                    onSelectPlaystyle(style.id);
                    setTimeout(() => onNext(), 150);
                  }}
                  className={`py-4 px-5 rounded-2xl border text-center transition-all duration-300 h-16 flex items-center justify-center relative cursor-pointer font-bold text-sm ${
                    isSelected
                      ? 'bg-slate-900 font-extrabold shadow-md'
                      : 'bg-slate-950/40 hover:bg-slate-900/50 border-border/50'
                  }`}
                  style={isSelected ? { borderColor: themeAccent, color: themeAccent } : {}}
                >
                  <span>{language === 'ar' ? style.labelAr : style.labelEn}</span>
                  {isSelected && (
                    <div className="absolute right-3 w-5 h-5 rounded-full flex items-center justify-center bg-cyan-400 text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3.5px]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-center text-white">
            {language === 'ar' ? 'ما هي المشكلة الأساسية التي تواجهك؟' : 'What is your main issue?'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {problems.map((prob) => {
              const isSelected = selectedProblem === prob.id;
              return (
                <button
                  key={prob.id}
                  onClick={() => {
                    onSelectProblem(prob.id);
                    setTimeout(() => onNext(), 150);
                  }}
                  className={`py-4 px-5 rounded-2xl border text-center transition-all duration-300 h-16 flex items-center justify-center relative cursor-pointer font-bold text-sm ${
                    isSelected
                      ? 'bg-slate-900 font-extrabold shadow-md'
                      : 'bg-slate-950/40 hover:bg-slate-900/50 border-border/50'
                  }`}
                  style={isSelected ? { borderColor: themeAccent, color: themeAccent } : {}}
                >
                  <span>{language === 'ar' ? prob.labelAr : prob.labelEn}</span>
                  {isSelected && (
                    <div className="absolute right-3 w-5 h-5 rounded-full flex items-center justify-center bg-cyan-400 text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3.5px]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={onBack}
              className="px-5 py-3 rounded-2xl border border-border/60 text-white text-xs font-black transition hover:bg-slate-900 cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
