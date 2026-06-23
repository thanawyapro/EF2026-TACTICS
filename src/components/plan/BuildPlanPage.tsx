// src/components/plan/BuildPlanPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { buildPlanDeterministically } from '../../lib/planBuilder';
import { validatePlan } from '../../lib/tacticValidation';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, RefreshCw, Save, AlertTriangle, ShieldCheck
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
  
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Localization Dictionary
  const dict = {
    step1Title: {
      ar: "اختار أسلوبك",
      en: "Choose Your Playstyle",
      fr: "Votre style de jeu",
      es: "Elige tu estilo de juego"
    },
    step2Title: {
      ar: "إيه مشكلتك؟",
      en: "What is your main issue?",
      fr: "Quel est votre problème ?",
      es: "¿Cuál es tu problema?"
    },
    step3Title: {
      ar: "خطتك جاهزة",
      en: "Your Plan is Ready!",
      fr: "Votre plan tactique est prêt !",
      es: "¡Tu plan táctico está listo!"
    },
    unsureBtn: {
      ar: "اختار لي",
      en: "Choose for me",
      fr: "Décidez pour moi",
      es: "Elige por mí"
    },
    cardFormation: {
      ar: "التشكيل",
      en: "Formation",
      fr: "Formation",
      es: "Alineación"
    },
    cardPlaystyle: {
      ar: "أسلوب الفريق",
      en: "Team Playstyle",
      fr: "Style d'équipe",
      es: "Estilo de equipo"
    },
    cardDoThis: {
      ar: "اعمل كده",
      en: "Do This",
      fr: "Action de jeu",
      es: "Qué hacer"
    },
    cardWatchOut: {
      ar: "خلي بالك",
      en: "Watch Out",
      fr: "Attention",
      es: "Cuidado"
    },
    advancedToggle: {
      ar: "تفاصيل متقدمة",
      en: "Advanced Details",
      fr: "Détails avancés",
      es: "Detalles avanzados"
    },
    btnSave: {
      ar: "احفظ الخطة",
      en: "Save Plan",
      fr: "Enregistrer la tactique",
      es: "Guardar táctica"
    },
    btnEdit: {
      ar: "عدّل الاختيارات",
      en: "Modify Choices",
      fr: "Modifier les choix",
      es: "Modificar opciones"
    },
    btnNew: {
      ar: "ابني خطة جديدة",
      en: "Build New Plan",
      fr: "Nouveau plan",
      es: "Nuevo plan"
    },
    savedOk: {
      ar: "تم الحفظ بنجاح! جاري التوجيه...",
      en: "Plan saved successfully! Redirecting...",
      fr: "Tactique enregistrée ! Redirection...",
      es: "¡Táctica guardada con éxito! Redirigiendo..."
    }
  };

  const getTranslation = (key: keyof typeof dict) => {
    return dict[key][language as 'en' | 'ar' | 'fr' | 'es'] || dict[key]['ar'];
  };

  // eFootball Playstyle Buttons list
  const playstyles = [
    { id: 'Possession Game', labelAr: 'استحواذ', labelEn: 'Possession Game' },
    { id: 'Quick Counter', labelAr: 'مرتدات سريعة', labelEn: 'Quick Counter' },
    { id: 'Long Ball Counter', labelAr: 'دفاع ثم هجمة', labelEn: 'Long Ball Counter' },
    { id: 'Out Wide', labelAr: 'لعب على الأطراف', labelEn: 'Out Wide' },
    { id: 'Long Ball', labelAr: 'كرات طويلة', labelEn: 'Long Ball' },
    { id: 'unsure', labelAr: getTranslation('unsureBtn'), labelEn: getTranslation('unsureBtn') },
  ];

  // Common Beginner/Intermediate Issues
  const problems = [
    { id: 'midfield_lost', labelAr: 'بخسر الوسط', labelEn: 'Losing midfield space' },
    { id: 'conceding_counters', labelAr: 'بستقبل مرتدات', labelEn: 'Conceding counters' },
    { id: 'cannot_score', labelAr: 'مش بوصل للمرمى', labelEn: 'Cannot penetrate default block' },
    { id: 'weak_wings', labelAr: 'الأطراف ضعيفة', labelEn: 'Flanks feel weak' },
    { id: 'leaky_defense', labelAr: 'الدفاع بيتفتح', labelEn: 'Defense gets opened up' },
    { id: 'isolated_forward', labelAr: 'المهاجم معزول', labelEn: ' striker is isolated' },
    { id: 'random_pressing', labelAr: 'الضغط عندي عشوائي', labelEn: 'Random chaotic pressing' }
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

  // Compile plan and validate
  const plan = step === 3 ? buildPlanDeterministically(selectedPlaystyle, selectedProblem) : null;
  const validation = plan ? validatePlan(plan.formation, plan.playstyle, plan.individualInstructions, plan.individualInstructions) : null;

  const handleSaveTactic = () => {
    if (!plan) return;

    const payload = {
      id: 'p_wizard_' + Date.now().toString(),
      name: language === 'ar' ? `خطة مدرب: ${plan.playstyleAr}` : `Coach Plan: ${plan.playstyle}`,
      formation: plan.formation,
      playstyle: plan.playstyle,
      details: language === 'ar' ? plan.explanationAr : plan.explanation,
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
    <div className="font-sans space-y-6 max-w-xl mx-auto py-2" data-testid="build-plan-wizard">
      {/* Wizard Header Status */}
      {step < 3 && (
        <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-border/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 border border-cyan-400/50 flex items-center justify-center text-[10px] font-black">
              {step}
            </div>
            <span className="text-xs font-bold text-gray-300">
              {step === 1 ? getTranslation('step1Title') : getTranslation('step2Title')}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-500">
            {step} / 2
          </span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-center text-white font-orbitron py-1">
              {getTranslation('step1Title')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {playstyles.map((style) => {
                const isSelected = selectedPlaystyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedPlaystyle(style.id);
                      // Faster Flow - auto transition to Step 2 if you click buttons
                      setTimeout(() => {
                        setStep(2);
                      }, 180);
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

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                disabled={!selectedPlaystyle}
                className="px-6 py-3.5 rounded-2xl font-black font-orbitron text-xs uppercase transition-all duration-300 disabled:opacity-30 cursor-pointer flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: selectedPlaystyle ? themeAccent : '#3b82f640', color: selectedPlaystyle ? '#000' : '#888' }}
              >
                <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-center text-white font-orbitron py-1">
              {getTranslation('step2Title')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {problems.map((prob) => {
                const isSelected = selectedProblem === prob.id;
                return (
                  <button
                    key={prob.id}
                    onClick={() => {
                      setSelectedProblem(prob.id);
                      // Easy instant generation on step 2 click
                      setTimeout(() => {
                        setStep(3);
                      }, 180);
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
                onClick={handleBack}
                className="px-5 py-3.5 rounded-2xl border border-border/60 text-white text-xs font-black font-orbitron uppercase transition hover:bg-slate-900 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedProblem}
                className="px-6 py-3.5 rounded-2xl font-black font-orbitron text-xs uppercase transition-all duration-300 disabled:opacity-30 cursor-pointer flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: selectedProblem ? themeAccent : '#3b82f640', color: selectedProblem ? '#000' : '#888' }}
              >
                <span>{language === 'ar' ? 'اعرض الخطة' : 'Show Plan'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && plan && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="text-center py-1">
              <Sparkles className="w-7 h-7 text-cyan-400 mx-auto animate-pulse mb-1.5" />
              <h2 className="text-lg font-black font-orbitron text-white uppercase tracking-wider">
                {getTranslation('step3Title')}
              </h2>
            </div>

            {/* Output Display Cards strictly matching: التشكيل, أسلوب الفريق, اعمل كده, خلي بالك */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: التشكيل */}
              <div className="bg-slate-900/80 border border-border/70 p-4.5 rounded-2xl space-y-1">
                <span className="block text-[10px] font-black uppercase text-cyan-400 font-orbitron tracking-widest">
                  📊 {getTranslation('cardFormation')}
                </span>
                <div className="text-3xl font-black font-orbitron text-white py-1">
                  {plan.formation}
                </div>
              </div>

              {/* Card 2: أسلوب الفريق */}
              <div className="bg-slate-900/80 border border-border/70 p-4.5 rounded-2xl space-y-1">
                <span className="block text-[10px] font-black uppercase text-cyan-400 font-orbitron tracking-widest">
                  ⚔️ {getTranslation('cardPlaystyle')}
                </span>
                <div className="text-base font-black text-white py-2.5">
                  {language === 'ar' ? plan.playstyleAr : plan.playstyle}
                </div>
              </div>
            </div>

            {/* Card 3: اعمل كده */}
            <div className="bg-slate-900/80 border border-border/70 p-5 rounded-2xl space-y-3">
              <span className="block text-[10px] font-black uppercase text-emerald-400 font-orbitron tracking-widest border-b border-border/30 pb-1.5">
                💡 {getTranslation('cardDoThis')}
              </span>
              <div className="space-y-3.5 text-xs text-gray-300">
                <div className="space-y-1 leading-relaxed">
                  <span className="font-extrabold text-[#11b981] block uppercase">{language === 'ar' ? 'الشق الهجومي:' : 'Attacking Idea:'}</span>
                  <p className="font-semibold text-gray-400">{language === 'ar' ? plan.attackingIdeaAr : plan.attackingIdea}</p>
                </div>
                <div className="space-y-1 leading-relaxed">
                  <span className="font-extrabold text-[#11b981] block uppercase">{language === 'ar' ? 'التنظيم الدفاعي:' : 'Defensive Idea:'}</span>
                  <p className="font-semibold text-gray-400">{language === 'ar' ? plan.defensiveIdeaAr : plan.defensiveIdea}</p>
                </div>
                <div className="pt-2">
                  <span className="font-extrabold text-cyan-300 block mb-1 uppercase">{language === 'ar' ? 'التعليمات الفردية الفورية:' : 'Individual Instructions:'}</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(language === 'ar' ? plan.individualInstructionsAr : plan.individualInstructions).map((inst, index) => (
                      <span key={index} className="bg-slate-950 border border-border/60 text-[10px] font-bold text-gray-300 px-2.5 py-1 rounded-xl">
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: خلي بالك */}
            <div className="bg-slate-900/80 border border-border/70 p-5 rounded-2xl space-y-2.5">
              <span className="block text-[10px] font-black uppercase text-amber-500 font-orbitron tracking-widest border-b border-border/30 pb-1.5">
                ⚠️ {getTranslation('cardWatchOut')}
              </span>
              <div className="text-xs text-gray-300 space-y-2 font-semibold">
                <p className="leading-relaxed">
                  {language === 'ar' ? plan.whatToAvoidAr : plan.whatToAvoid}
                </p>
                {validation && validation.warnings.length > 0 && (
                  <div className="bg-amber-500/5 text-amber-400 p-3 rounded-xl border border-amber-500/15 leading-normal text-[11px]">
                    {validation.warnings.map((warn, i) => (
                      <p key={i}>• {warn}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expander Section: تفاصيل متقدمة */}
            <div className="border-t border-border/20 pt-3">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-black text-gray-400 hover:text-white transition uppercase font-orbitron select-none cursor-pointer flex items-center justify-center mx-auto gap-1"
              >
                <span>{showAdvanced ? '[- إخفاء التفاصيل المتقدمة]' : `[+ عرض ${getTranslation('advancedToggle')}]`}</span>
              </button>

              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-950/80 p-4 border border-border/60 rounded-2xl space-y-3.5 mt-3.5 overflow-hidden text-xs text-gray-300"
                >
                  <div className="space-y-1">
                    <span className="block text-[10px] text-gray-500 font-black uppercase">عناصر التشكيل والوظائف المناسبة:</span>
                    <p className="font-semibold text-gray-400">
                      {language === 'ar' ? plan.roleRecommendationsAr.join(' / ') : plan.roleRecommendations.join(' / ')}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] text-gray-500 font-black uppercase">متى تحول التكتيك لفرعي (Sub-Tactic)؟</span>
                    <p className="font-semibold text-gray-400">
                      {language === 'ar' ? plan.whenToSwitchSubTacticAr : plan.whenToSwitchSubTactic}
                    </p>
                  </div>

                  <div className="bg-cyan-500/5 text-cyan-400/90 p-3 rounded-xl border border-cyan-500/10 text-[11px] leading-relaxed">
                    💡 {language === 'ar' ? "صمم هذا المعيار ليتوافق مع أحدث حزم فاعلية المرتدات والتمريرات الطويلة داخل اللعبة." : "Tailored to align with real eFootball dynamic game variables."}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bottom buttons controls */}
            <div className="space-y-3 pt-3">
              {saveSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-2xl text-center text-xs font-bold font-orbitron leading-none flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{getTranslation('savedOk')}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 p-4 rounded-2xl border border-border/80 hover:bg-slate-900 transition-all font-bold text-xs font-orbitron uppercase text-white flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{getTranslation('btnNew')}</span>
                </button>

                <button
                  onClick={handleSaveTactic}
                  disabled={saveSuccess}
                  className="flex-2 p-4 rounded-2xl text-navyBg font-black font-orbitron text-xs uppercase tracking-wider transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: themeAccent }}
                >
                  <Save className="w-4.5 h-4.5" />
                  <span>{getTranslation('btnSave')}</span>
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full text-center py-2.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold font-orbitron select-none cursor-pointer"
              >
                {getTranslation('btnEdit')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
