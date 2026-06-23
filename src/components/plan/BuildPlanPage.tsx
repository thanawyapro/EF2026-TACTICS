// src/components/plan/BuildPlanPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { buildPlanDeterministically } from '../../lib/planBuilder';
import { validatePlan } from '../../lib/tacticValidation';
import { 
  Sparkles, Shield, Compass, AlertTriangle, Check, ArrowRight, ArrowLeft, RefreshCw, Save
} from 'lucide-react';
import { TacticalProfileSchema } from '../../types/schemas';

interface BuildPlanPageProps {
  onNavigate: (tabId: string) => void;
}

export default function BuildPlanPage({ onNavigate }: BuildPlanPageProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  const addProfile = useAppStore(state => state.addProfile);

  const [step, setStep] = useState<number>(1);
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  
  // Advanced settings toggled
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Predefined options
  const playstyleOptions = [
    { id: 'Possession Game', nameAr: 'استحواذ', nameEn: 'Possession Game', desc: 'استحواذ وبناء منظم على الأرض' },
    { id: 'Quick Counter', nameAr: 'مرتدات سريعة', nameEn: 'Quick Counter', desc: 'هجوم عمودي ومرتدات خاطفة' },
    { id: 'Long Ball Counter', nameAr: 'دفاع ثم هجمة', nameEn: 'Long Ball Counter', desc: 'تراجع وثبات ثم هجوم عميق' },
    { id: 'Out Wide', nameAr: 'لعب على الأطراف', nameEn: 'Out Wide', desc: 'توسيع الملعب وعرضيات للمهاجم' },
    { id: 'Long Ball', nameAr: 'كرات طويلة', nameEn: 'Long Ball', desc: 'كرات طويلة مباشرة لرأس الحربة المحطة' },
    { id: 'unsure', nameAr: 'مش عارف، اختار ليُ', nameEn: 'Not Sure, Choose for me', desc: 'دع المدرب يفحص مشكلتك ويقرر الأفضل' }
  ];

  const problemOptions = [
    { id: 'midfield_lost', nameAr: 'بخسر نص الملعب', nameEn: 'Losing midfield space' },
    { id: 'conceding_counters', nameAr: 'بستقبل مرتدات', nameEn: 'Conceding quick counters' },
    { id: 'cannot_score', nameAr: 'مش بعرف أوصل للمرمى', nameEn: 'Cannot penetrate default block' },
    { id: 'weak_wings', nameAr: 'الأطراف ضعيفة', nameEn: 'Flanks are empty and loose' },
    { id: 'leaky_defense', nameAr: 'الدفاع بيتفتح', nameEn: 'Defense has massive open gaps' },
    { id: 'isolated_forward', nameAr: 'المهاجم معزول', nameEn: 'Forward feels completely isolated' },
    { id: 'random_pressing', nameAr: 'الضغط عندي عشوائي', nameEn: 'Pressing feels unorganized' },
    { id: 'unsure_instructions', nameAr: 'مش عارف أختار تعليمات فردية', nameEn: 'Unsure about individual instructions' }
  ];

  const handleNext = () => {
    if (step === 1 && !selectedPlaystyle) return;
    if (step === 2 && !selectedProblem) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleReset = () => {
    setSelectedPlaystyle('');
    setSelectedProblem('');
    setStep(1);
    setShowAdvanced(false);
    setSaveSuccess(false);
  };

  // Build the plan deterministically
  const plan = step === 3 ? buildPlanDeterministically(selectedPlaystyle, selectedProblem) : null;
  const validation = plan ? validatePlan(plan.formation, plan.playstyle, plan.individualInstructions, plan.individualInstructions) : null;

  const handleSaveTactic = () => {
    if (!plan) return;

    const payload = {
      id: 'p_wizard_' + Date.now().toString(),
      name: language === 'en' ? `Wizard: ${plan.playstyle}` : `الخطة المعايرة: ${plan.playstyleAr}`,
      formation: plan.formation,
      playstyle: plan.playstyle,
      details: language === 'en' ? plan.explanation : plan.explanationAr,
      isCustom: true,
      subTactics: plan.individualInstructions
    };

    const verified = TacticalProfileSchema.safeParse(payload);
    if (verified.success) {
      addProfile(verified.data);
      setSaveSuccess(true);
      setTimeout(() => {
        onNavigate('plans');
      }, 1500);
    }
  };

  return (
    <div className="font-sans space-y-6 select-none" data-testid="build-plan-wizard">
      {/* Title block */}
      <div className="border-b border-border/60 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-orbitron text-white leading-tight">
            🛡️ {language === 'en' ? 'Build Your Plan' : 'ابني خطتك'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en'
              ? 'Formulate custom tactical layouts in a fast 3-step wizard based on actual game mechanics.'
              : 'صمم استراتيجيتك الدفاعية والهجومية في ٣ خطوات كفؤة خالية من التعقيد.'}
          </p>
        </div>
        
        {step < 3 && (
          <span className="text-[10px] font-black font-orbitron bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-3 py-1 rounded-xl">
            {language === 'en' ? `STEP ${step} OF 2` : `الخطوة ${step} من ٢`}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-slate-950/40 p-4 border border-border/40 rounded-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-orbitron">
                {language === 'en' ? '1. Choose your preferred playstyle:' : '١. اختار أسلوب لعبك المفضل:'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'en' ? 'Select how you enjoy pass orchestration or attacks:' : 'حدد كيف تفضل تسيير الهجمات والسيطرة على ريتم خصومك:'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {playstyleOptions.map((opt) => {
                const isSelected = selectedPlaystyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedPlaystyle(opt.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#0f1930] hover:bg-[#0f1930]' 
                        : 'bg-slate-950/30 hover:bg-slate-950/65'
                    }`}
                    style={isSelected ? { borderColor: themeAccent } : { borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center justify-between w-full h-8">
                      <span className="text-sm font-black text-white">
                        {language === 'en' ? opt.nameEn : opt.nameAr}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-cyan-400 text-[#040712]">
                          <Check className="w-3 h-3 stroke-[3px]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 font-semibold mt-1">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                disabled={!selectedPlaystyle}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-[#040712] text-xs font-black font-orbitron tracking-wider uppercase transition-all duration-300 disabled:opacity-40 cursor-pointer flex items-center gap-2"
                style={{ backgroundImage: `linear-gradient(to right, ${themeAccent}, #3b82f6)` }}
              >
                <span>{language === 'en' ? 'CONTINUE' : 'التالي'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-slate-950/40 p-4 border border-border/40 rounded-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-orbitron">
                {language === 'en' ? '2. What is your main problem during matches?' : '٢. ما هي مشكلتك الأساسية داخل الملعب؟'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'en' ? 'Determine where leaks typically occur or where control is lost:' : 'حدد مناطق تكرار الفشل التكتيكي أو استقبال الأهداف:'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {problemOptions.map((opt) => {
                const isSelected = selectedProblem === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedProblem(opt.id)}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#0f1930] hover:bg-[#0f1930]' 
                        : 'bg-slate-950/30 hover:bg-slate-950/65'
                    }`}
                    style={isSelected ? { borderColor: themeAccent } : { borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-xs font-black text-white">
                      {language === 'en' ? opt.nameEn : opt.nameAr}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-cyan-400 text-[#040712] shrink-0 ml-2">
                        <Check className="w-3 h-3 stroke-[3px]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handleBack}
                className="px-5 py-3 rounded-xl border border-border text-white text-xs font-black font-orbitron tracking-wider uppercase transition hover:bg-slate-900 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'en' ? 'BACK' : 'السابق'}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedProblem}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-[#040712] text-xs font-black font-orbitron tracking-wider uppercase transition-all duration-300 disabled:opacity-40 cursor-pointer flex items-center gap-2"
                style={{ backgroundImage: `linear-gradient(to right, ${themeAccent}, #3b82f6)` }}
              >
                <span>{language === 'en' ? 'ANALYZE & BUILD' : 'عرض الخطة'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && plan && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Main simple tactical outline */}
            <div className="bg-[#0c1224] border border-[#1b2a4d] rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h3 className="text-base sm:text-lg font-black text-white font-orbitron uppercase tracking-wider">
                  {language === 'en' ? 'Your Tailored Blueprint' : 'الخطة الجاهزة ليك'}
                </h3>
              </div>

              {/* Recommended Formation and playstyle summary badges */}
              <div className="grid grid-cols-2 gap-3 select-text">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-border/40 flex flex-col justify-center text-center">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">{language === 'en' ? 'RECOMMENDED FORMATION' : 'التشكيل المقترح'}</span>
                  <span className="text-xl sm:text-2xl font-black text-cyan-400 font-orbitron mt-0.5">{plan.formation}</span>
                </div>
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-border/40 flex flex-col justify-center text-center">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">{language === 'en' ? 'RECOMMENDED PLAYSTYLE' : 'أسلوب اللعب المقترح'}</span>
                  <span className="text-base sm:text-lg font-black text-white mt-0.5">{language === 'en' ? plan.playstyle : plan.playstyleAr}</span>
                </div>
              </div>

              {/* Attacking / Defensive core ideas */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col gap-1 text-xs text-white">
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">💡 {language === 'en' ? 'Attacking Instruction' : 'الشق الهجومي والتحركات'}</span>
                  <p className="font-semibold text-gray-300 leading-normal bg-slate-950/30 p-3 rounded-xl border border-emerald-500/10">
                    {language === 'en' ? plan.attackingIdea : plan.attackingIdeaAr}
                  </p>
                </div>

                <div className="flex flex-col gap-1 text-xs text-white">
                  <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">🛡️ {language === 'en' ? 'Defensive Protection' : 'التأمين والتنظيم الدفاعي'}</span>
                  <p className="font-semibold text-gray-300 leading-normal bg-slate-950/30 p-3 rounded-xl border border-amber-500/10">
                    {language === 'en' ? plan.defensiveIdea : plan.defensiveIdeaAr}
                  </p>
                </div>
              </div>

              {/* Friendly Simple Coach Explanation */}
              <div className="bg-cyan-500/5 border border-cyan-400/20 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-cyan-400 font-black font-orbitron uppercase tracking-widest block">{language === 'en' ? "COACH'S COMMENT" : "تعليق المدرب الكابتن"}</span>
                <p className="text-xs text-gray-350 leading-relaxed font-semibold">
                  {language === 'en' ? plan.explanation : plan.explanationAr}
                </p>
              </div>

              {/* Progress and switches */}
              <div className="border-t border-border/40 pt-4 flex flex-col gap-3">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-black text-gray-400 hover:text-white transition uppercase font-orbitron self-start flex items-center gap-1 cursor-pointer"
                >
                  <span>{showAdvanced 
                    ? (language === 'en' ? '[- Hide Advanced Details]' : '[- إخفاء التفاصيل المتقدمة]')
                    : (language === 'en' ? '[+ Show Advanced Details]' : '[+ عرض التفاصيل المتقدمة]')}</span>
                </button>

                {showAdvanced && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-border/60 overflow-hidden text-xs text-gray-300"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 tracking-wider block">INDIVIDUAL INSTRUCTIONS:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(language === 'en' ? plan.individualInstructions : plan.individualInstructionsAr).map((inst, idx) => (
                          <span key={idx} className="bg-slate-900 border border-border px-2 px-2.5 py-1 rounded-md text-[10px] font-black text-cyan-300">{inst}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-500 tracking-wider block">RECOMMENDED ROLES COMBINATIONS:</span>
                      <p className="font-semibold text-gray-450 mt-1">
                        {language === 'en' ? plan.roleRecommendations.join(', ') : plan.roleRecommendationsAr.join('، ')}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#f87171] tracking-wider block">WHAT TO AVOID IN GAMEPLAY:</span>
                      <p className="font-semibold text-gray-450 mt-0.5">
                        {language === 'en' ? plan.whatToAvoid : plan.whatToAvoidAr}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-500 tracking-wider block">SUB-TACTIC CONVERSION SIGNAL:</span>
                      <p className="font-semibold text-emerald-450 mt-0.5">
                        {language === 'en' ? plan.whenToSwitchSubTactic : plan.whenToSwitchSubTacticAr}
                      </p>
                    </div>

                    {/* Warnings and validations (Deterministic errors engine) */}
                    {validation && validation.warnings.length > 0 && (
                      <div className="bg-yellow-500/5 border border-yellow-500/20 p-3 rounded-lg space-y-1 mt-2">
                        <span className="text-[9px] font-black uppercase text-yellow-500 tracking-widest flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>RISK ADVISORY FOR BEGINNERS</span>
                        </span>
                        {validation.warnings.map((warn, i) => (
                          <p key={i} className="text-[11px] text-yellow-300 leading-normal font-semibold">• {warn}</p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Buttons control footer */}
            <div className="flex flex-col sm:flex-row shadow-md gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 p-3.5 rounded-xl border border-border text-xs font-black font-orbitron uppercase text-white hover:bg-slate-900 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'en' ? 'START OVER' : 'إعادة تصميم'}</span>
              </button>

              <button
                onClick={handleSaveTactic}
                disabled={saveSuccess}
                className="flex-3 p-3.5 rounded-xl text-navyBg font-black font-orbitron uppercase text-xs tracking-wider transition hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: themeAccent }}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{language === 'en' ? 'SAVED SUCCESSFULLY' : 'تم الحفظ بنجاح'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{language === 'en' ? 'SAVE TO MY PLANS' : 'حفظ كخطة معتمدة'}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
