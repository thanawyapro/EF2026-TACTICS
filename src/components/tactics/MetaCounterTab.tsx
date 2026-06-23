// src/components/tactics/MetaCounterTab.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, ShieldCheck, RefreshCw, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function MetaCounterTab() {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const [step, setStep] = useState<number>(1);
  const [oppFormation, setOppFormation] = useState<string>('');
  const [oppStyle, setOppStyle] = useState<string>('');
  const [userProblem, setUserProblem] = useState<string>('');

  // Localization Dictionary
  const dict = {
    step1Title: {
      ar: "أشهر تشكيلات الخصم",
      en: "Opponent Base Formation",
      fr: "Alineación de l'adversaire",
      es: "Formación del rival"
    },
    step2Title: {
      ar: "أسلوب الخصم",
      en: "Opponent Style",
      fr: "Style de jeu adverse",
      es: "Estilo de juego rival"
    },
    step3Title: {
      ar: "إيه مشكلتك معاه؟",
      en: "What is your main issue against him?",
      fr: "Quel est votre problème avec lui ?",
      es: "¿Cuál es tu problema con él?"
    },
    outputTitle: {
      ar: "السلاح المضاد لتدمير الخصم",
      en: "Antidote Counter Blueprint",
      fr: "Plan tactique anti-rival",
      es: "Plan táctico anti-rival"
    },
    bestCounter: {
      ar: "أفضل تشكيل مضاد",
      en: "Best Counter Formation",
      fr: "Meilleure tactique miroir",
      es: "Mejor alineación espejo"
    },
    defLabel: {
      ar: "طريقة إيقافه دفاعياً",
      en: "Defensive Counter Instruction",
      fr: "Comment le bloquer en défense",
      es: "Cómo frenarlo en defensa"
    },
    offLabel: {
      ar: "طريقة ضربه هجومياً",
      en: "Offensive Breakout Instruction",
      fr: "Comment le battre en attaque",
      es: "Cómo golpearlo en ataque"
    },
    instLabel: {
      ar: "التعليمات الفردية الفورية",
      en: "Proposed Individual Instructions",
      fr: "Instructions individuelles",
      es: "Instrucciones individuales"
    },
    warningLabel: {
      ar: "تحذير الكابتن",
      en: "Captain's Warning",
      fr: "Avertissement du capitaine",
      es: "Advertencia del capitán"
    },
    btnRestart: {
      ar: "جرب مع خصم تاني",
      en: "Counter Another Team",
      fr: "Contrer une autre équipe",
      es: "Probar con otro rival"
    }
  };

  const getTranslation = (key: keyof typeof dict) => {
    return dict[key][language as 'en' | 'ar' | 'fr' | 'es'] || dict[key]['ar'];
  };

  // Predefined Button Choices
  const formations = ['4-3-3', '4-2-1-3', '4-3-1-2', '5-3-2'];

  const styles = [
    { id: 'fast_direct', ar: 'سريع ومباشر', en: 'Fast & Direct' },
    { id: 'slow_build', ar: 'بيبني على الهادي', en: 'Slow Build Archetype' },
    { id: 'wing_play', ar: 'بيطير الأطراف', en: 'Wing Overlapper' },
    { id: 'park_bus', ar: 'دفاع باص أتوبيس', en: 'Rigid Low Block (Bus)' }
  ];

  const problems = [
    { id: 'cant_defend', ar: 'مش عارف أدافع ضده', en: 'Cannot handle their sudden rushes' },
    { id: 'cant_penetrate', ar: 'مش عارف أوصل لمرماه', en: 'Cannot break down their block' },
    { id: 'flanks_open', ar: 'الأطراف مستباحة', en: 'Flanks are completely exposed' },
    { id: 'central_locked', ar: 'بيقفل العمق كلياً', en: 'Central spacing feels congested' }
  ];

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleReset = () => {
    setOppFormation('');
    setOppStyle('');
    setUserProblem('');
    setStep(1);
  };

  // Compile specific static advice based on the 3 parameters
  const generateCounterAdvice = () => {
    let bestCounterFormation = '4-2-2-2';
    let defensiveInstruction = 'قم فورا بتثبيت قلبي الدفاع من دون صعود، وراقب فجوات الارتداد.';
    let offensiveInstruction = 'دوّر اللعب بالتمرير من لمسة واحدة متقنة للتسلل بين صفوف الخصم.';
    const individualInstructions: string[] = ['دفاعي ( على الارتكاز )'];
    let warning = 'احذر الاستعجال بالاندفاع الجماعي أمام المهاجمين ذوي السبرينت الناري.';

    // 1. Formation dependent advice
    if (oppFormation === '4-3-3') {
      bestCounterFormation = '4-2-2-2';
      defensiveInstruction = 'العب بوسط ملعب مائل للتضييق، واضبط قلبي دفاعك في تراجع ثابت لمنع انطلاقات الأجنحة.';
      offensiveInstruction = 'مرر بالتناوب السريع بين ثنائي الهجوم لإجبار مدافعه الوسطي على ارتكاب الأخطاء الموضعية.';
      individualInstructions.push('دفاعي (Defensive) على أحد الأظهرة للحد من انطلاقاتهم.');
      warning = 'تجنب تطبيق الضغط العالي المفتوح كلياً حتى لا يكسر خلف أظهرتك بسهولة.';
    } else if (oppFormation === '4-2-1-3') {
      bestCounterFormation = '5-3-2';
      defensiveInstruction = 'ثبّت ثنائي الارتكاز (Double Pivot) لمنع صانع ألعابه (AMF) من تمرير أي كرة لثلاثي الهجوم السريع.';
      offensiveInstruction = 'استغل ضعف أطرافهم عن طريق تمريرات الأجنحة العريضة لقلب دفاع سلحفاة لديهم.';
      individualInstructions.push('دفاعي (Defensive) لكلا لاعبي الارتكاز لمنع التفوق العددي بالعمق.');
      warning = 'احذر سحب قلبي الدفاع للتغطية المتقدمة التلقائية لأن مرتداتها خاطفة وصامتة.';
    } else if (oppFormation === '4-3-1-2') {
      bestCounterFormation = '4-2-2-2';
      defensiveInstruction = 'اغلق عمق الملعب تماما، وعين تكتيك وسط متسلل لمقاومة ريتم تمرير ميكانكس خطتهم الشهيرة.';
      offensiveInstruction = 'طير قلبي الجناحين (LMF/RMF) لبناء كرات عرضية هوائية سريعة تضرب عمقهم الضيق المتراص.';
      individualInstructions.push('التزام خط التماس (Hug the Sideline) على الجناحين لتوسيع رقعة الملعب.');
      warning = 'تجنب التمرير الأرضي المستعجل بالعمق المزدحم بمحاور ثلاثي الارتكاز للخصم.';
    } else if (oppFormation === '5-3-2') {
      bestCounterFormation = '4-2-1-3';
      defensiveInstruction = 'العق حذراً هادئاً ولا تتسرع باسترداد الحيازة بضغط بدائي؛ اعتمد على تماسك الميدبلوك لدفاعك.';
      offensiveInstruction = 'اعتمد على صانع ألعاب من ميزة لاعب ثغرات (Hole Player) لضرب المساحات النصفية الكبيرة في دفاعهم الخماسي.';
      individualInstructions.push('هدف مرتدة كلي (Counter Target) على صانع ألعابك المتقدم.');
      warning = 'العرضيات العالية ممتازة للخصم للتشتيت لتوافر ثلاثة قلوب دفاع ممتازين بالطول في صندوقهم.';
    }

    // 2. Adjustments based on style
    if (oppStyle === 'fast_direct') {
      defensiveInstruction += ' الخصم يلعب باندفاع هجومي سريع ومباشر؛ اضبط دفاعك على خط منخفض فورياً.';
    } else if (oppStyle === 'slow_build') {
      defensiveInstruction += ' الخصم صبور بالحيازة؛ لا تركض خلف الكرة وصمم على إيقاف البناء عند حافة الـ 18.';
    } else if (oppStyle === 'wing_play') {
      defensiveInstruction += ' عطل الأجنحة بنمط تغطية ثنائية مشتركة من الأظهرة والأجنحة الدفاعية المتراجعة.';
    } else if (oppStyle === 'park_bus') {
      defensiveInstruction += ' الخصم متكتل؛ حافظ على تنظيم دفاعي احتياطي لمنع المرتدة الخاطفة المعاكسة الوحيدة.';
      warning = 'تجنب تسديد كرات عشوائية مصطدمة بالأكوام البشرية المتكتلة لديهم.';
    }

    // 3. Adjustments based on problem
    if (userProblem === 'cant_defend') {
      defensiveInstruction += ' أغلق قلبي الدفاع كلياً وعين تعليمات دفاعية صارمة للأظهرة.';
    } else if (userProblem === 'cant_penetrate') {
      offensiveInstruction += ' اعتمد على التمرير السريع من لمسة واحدة (One-Two) مع صانعي اللعب للتسديد الحر.';
    } else if (userProblem === 'flanks_open') {
      defensiveInstruction += ' ثبت الأظهرة دفاعياً ومنع صعودهم للأمام لإحباط تحركات أجنحتهم السريعة.';
    } else if (userProblem === 'central_locked') {
      offensiveInstruction += ' العب كلياً عبر تفعيل الخطوط العريضة لخطوط التماس وتجنب عنق الزجاجة.';
    }

    return {
      bestCounterFormation,
      defensiveInstruction,
      offensiveInstruction,
      individualInstructions,
      warning
    };
  };

  const advice = step === 4 ? generateCounterAdvice() : null;

  return (
    <div className="font-sans space-y-6 max-w-xl mx-auto py-2" data-testid="counter-opponent-wizard">
      {/* Step header progress bar */}
      {step < 4 && (
        <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-border/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 border border-cyan-400/50 flex items-center justify-center text-[10px] font-black">
              {step}
            </div>
            <span className="text-xs font-bold text-gray-300">
              {step === 1 ? getTranslation('step1Title') : step === 2 ? getTranslation('step2Title') : getTranslation('step3Title')}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-500">
            {step} / 3
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

            <div className="grid grid-cols-2 gap-3">
              {formations.map((fName) => {
                const isSelected = oppFormation === fName;
                return (
                  <button
                    key={fName}
                    onClick={() => {
                      setOppFormation(fName);
                      setTimeout(() => {
                        setStep(2);
                      }, 180);
                    }}
                    className={`py-4 px-5 rounded-2xl border text-center transition-all duration-300 h-16 flex items-center justify-center relative cursor-pointer font-black text-base font-orbitron ${
                      isSelected
                        ? 'bg-slate-900 text-cyan-400 shadow-md font-black'
                        : 'bg-slate-950/40 hover:bg-slate-900/50 border-border/50 text-gray-100'
                    }`}
                    style={isSelected ? { borderColor: themeAccent, color: themeAccent } : {}}
                  >
                    <span>{fName}</span>
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
                disabled={!oppFormation}
                className="px-6 py-3.5 rounded-2xl font-black font-orbitron text-xs uppercase transition-all duration-300 disabled:opacity-30 cursor-pointer flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: oppFormation ? themeAccent : '#3b82f640', color: oppFormation ? '#000' : '#888' }}
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
              {styles.map((style) => {
                const isSelected = oppStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => {
                      setOppStyle(style.id);
                      setTimeout(() => {
                        setStep(3);
                      }, 180);
                    }}
                    className={`py-4 px-5 rounded-2xl border text-center transition-all duration-300 h-16 flex items-center justify-center relative cursor-pointer font-bold text-sm ${
                      isSelected
                        ? 'bg-slate-900 text-cyan-400 shadow-md'
                        : 'bg-slate-950/40 hover:bg-slate-900/50 border-border/50 text-gray-100'
                    }`}
                    style={isSelected ? { borderColor: themeAccent, color: themeAccent } : {}}
                  >
                    <span>{language === 'ar' || language === undefined ? style.ar : style.en}</span>
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
                disabled={!oppStyle}
                className="px-6 py-3.5 rounded-2xl font-black font-orbitron text-xs uppercase transition-all duration-300 disabled:opacity-30 cursor-pointer flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: oppStyle ? themeAccent : '#3b82f640', color: oppStyle ? '#000' : '#888' }}
              >
                <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-center text-white font-orbitron py-1">
              {getTranslation('step3Title')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {problems.map((prob) => {
                const isSelected = userProblem === prob.id;
                return (
                  <button
                    key={prob.id}
                    onClick={() => {
                      setUserProblem(prob.id);
                      setTimeout(() => {
                        setStep(4);
                      }, 180);
                    }}
                    className={`py-4 px-5 rounded-2xl border text-center transition-all duration-300 h-16 flex items-center justify-center relative cursor-pointer font-bold text-sm ${
                      isSelected
                        ? 'bg-slate-900 text-cyan-400 shadow-md'
                        : 'bg-slate-950/40 hover:bg-slate-900/50 border-border/50 text-gray-100'
                    }`}
                    style={isSelected ? { borderColor: themeAccent, color: themeAccent } : {}}
                  >
                    <span>{language === 'ar' || language === undefined ? prob.ar : prob.en}</span>
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
                disabled={!userProblem}
                className="px-6 py-3.5 rounded-2xl font-black font-orbitron text-xs uppercase transition-all duration-300 disabled:opacity-30 cursor-pointer flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: userProblem ? themeAccent : '#3b82f640', color: userProblem ? '#000' : '#888' }}
              >
                <span>{language === 'ar' ? 'السلاح المضاد' : 'Generate'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && advice && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="text-center py-1">
              <Zap className="w-7 h-7 text-amber-400 mx-auto animate-bounce mb-1.5" />
              <h2 className="text-lg font-black font-orbitron text-white uppercase tracking-wider">
                {getTranslation('outputTitle')}
              </h2>
            </div>

            {/* Custom structural cards for the counter instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-border/70 p-4.5 rounded-2xl space-y-1 md:col-span-1 text-center flex flex-col justify-center">
                <span className="block text-[10px] font-black uppercase text-cyan-400 font-orbitron tracking-widest">
                  📊 {getTranslation('bestCounter')}
                </span>
                <div className="text-3xl font-black font-orbitron text-white py-1">
                  {advice.bestCounterFormation}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-border/70 p-4 rounded-2xl md:col-span-2 space-y-1">
                <span className="block text-[11px] font-black uppercase text-secondary font-orbitron tracking-widest text-[#a855f7]">
                  ⚔️ {language === 'ar' ? 'معلومات الخصم الحالي' : 'Opponent Details'}
                </span>
                <div className="text-xs text-gray-300 font-semibold leading-relaxed space-y-0.5 mt-1">
                  <p>• {language === 'ar' ? 'تشكيلة الخصم صانع المشاكل:' : 'Opponent Formation:'} <span className="text-white font-black font-orbitron">{oppFormation}</span></p>
                  <p>• {language === 'ar' ? 'أسلوب لعبه التخريبي:' : 'Opponent Style:'} <span className="text-white font-bold">{language === 'ar' ? styles.find(s => s.id === oppStyle)?.ar : styles.find(s => s.id === oppStyle)?.en}</span></p>
                  <p>• {language === 'ar' ? 'المشكلة الأساسية التي تؤرقك:' : 'Your direct obstacle:'} <span className="text-white font-bold">{language === 'ar' ? problems.find(p => p.id === userProblem)?.ar : problems.find(p => p.id === userProblem)?.en}</span></p>
                </div>
              </div>
            </div>

            {/* طريقة إيقافه دفاعياً */}
            <div className="bg-slate-900/80 border border-border/70 p-5 rounded-2xl space-y-2">
              <span className="block text-[10px] font-black uppercase text-[#ef4444] font-orbitron tracking-widest border-b border-border/30 pb-1.5">
                🛡️ {getTranslation('defLabel')}
              </span>
              <p className="text-xs text-gray-300 font-semibold leading-relaxed">
                {advice.defensiveInstruction}
              </p>
            </div>

            {/* طريقة ضربه هجومياً */}
            <div className="bg-slate-900/80 border border-border/70 p-5 rounded-2xl space-y-2">
              <span className="block text-[10px] font-black uppercase text-[#10b981] font-orbitron tracking-widest border-b border-border/30 pb-1.5">
                ⚔️ {getTranslation('offLabel')}
              </span>
              <p className="text-xs text-gray-300 font-semibold leading-relaxed">
                {advice.offensiveInstruction}
              </p>
            </div>

            {/* التعليمات الفردية */}
            <div className="bg-slate-900/80 border border-border/70 p-5 rounded-2xl space-y-2.5">
              <span className="block text-[10px] font-black uppercase text-cyan-400 font-orbitron tracking-widest border-b border-border/30 pb-1.5">
                ⚙️ {getTranslation('instLabel')}
              </span>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {advice.individualInstructions.map((inst, index) => (
                  <span key={index} className="bg-slate-950 border border-cyan-500/20 text-xs font-bold text-cyan-300 px-3 py-1.5 rounded-lg">
                    🛡️ {inst}
                  </span>
                ))}
              </div>
            </div>

            {/* تحذير الكابتن */}
            <div className="bg-rose-500/5 border border-rose-500/15 p-4.5 rounded-2xl space-y-1.5">
              <span className="text-[10px] text-rose-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-450" />
                <span>🚧 {getTranslation('warningLabel')}</span>
              </span>
              <p className="text-xs text-rose-200 leading-relaxed font-semibold">
                {advice.warning}
              </p>
            </div>

            {/* Restart Button */}
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="w-full p-4 rounded-2xl border border-border/80 hover:bg-slate-900 transition-all font-bold text-xs font-orbitron uppercase text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>{getTranslation('btnRestart')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
