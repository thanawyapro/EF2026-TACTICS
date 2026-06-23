// src/components/coach/SmartCoachPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { getSmartCoachResponse, SmartCoachResponse } from '../../lib/smartCoach';
import { 
  Sparkles, Send, Brain, AlertTriangle, Check, BookOpen, ShieldCheck, Heart, Save, RefreshCw, Loader2
} from 'lucide-react';
import { TacticalProfileSchema } from '../../types/schemas';

interface SmartCoachPageProps {
  onNavigate: (tabId: string) => void;
}

export default function SmartCoachPage({ onNavigate }: SmartCoachPageProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  const addProfile = useAppStore(state => state.addProfile);

  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<SmartCoachResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<boolean>(false);

  const suggestionChips = [
    'أنا بخسر من تشكيل معين',
    'مش عارف أختار أسلوب لعب',
    'الخطة بتتكسر في الشوط الثاني',
    'المهاجم معزول',
    'الخصم بيضغط عليا',
    'الخصم بيكسب العمق',
    'الأطراف عندي ضعيفة',
    'عايز تعليمات فردية مناسبة'
  ];

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    setSaved(false);

    try {
      // Direct call routing through local DNS first or Netlify function
      const res = await getSmartCoachResponse(
        queryText, 
        '4-3-3', 
        'Quick Counter', 
        ''
      );
      setResponse(res);
    } catch (err: any) {
      console.error(err);
      setError(language === 'en' 
        ? 'Error consulting our eFootball DNA servers. Try again.' 
        : 'حدث خطأ في الاتصال بخوادم الـ DNA. جرب مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = () => {
    if (!response || !response.saveablePlan) return;

    const planData = response.saveablePlan;
    const payload = {
      id: 'p_coach_' + Date.now().toString(),
      name: planData.name,
      formation: planData.formation,
      playstyle: planData.playstyle,
      details: planData.notes + ` | Decided: ${response.coachDecision}`,
      isCustom: true,
      subTactics: response.individualInstructions
    };

    const verified = TacticalProfileSchema.safeParse(payload);
    if (verified.success) {
      addProfile(verified.data);
      setSaved(true);
      setTimeout(() => {
        onNavigate('plans');
      }, 1500);
    }
  };

  return (
    <div className="font-sans space-y-6 select-none" data-testid="smart-coach-screen">
      {/* Page Header */}
      <div className="border-b border-border/60 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-orbitron text-white leading-tight">
            ⚽ {language === 'en' ? 'Smart Coach' : 'مدربك الذكي'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en'
              ? 'Ask any eFootball tactical question or choose common gaming hurdles.'
              : 'اسأل عن أي معطل تكتيكي يواجهك داخل اللعبة واحصل على قرارات فورية.'}
          </p>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-400/25 px-2 py-0.5 rounded uppercase font-black tracking-widest font-mono">
          {language === 'en' ? 'DNA ACTIVE' : 'محرك DNA متصل'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!response && !loading && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Suggested Question Chips */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 font-orbitron">
                {language === 'en' ? 'SUGGESTED QUESTIONS:' : 'استشارات سريعة جاهزة:'}
              </span>
              <div className="flex flex-wrap gap-2 text-right">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuestion(chip);
                      handleAsk(chip);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-border/80 hover:border-cyan-500/50 hover:bg-[#0c1224] text-gray-300 hover:text-white transition cursor-pointer select-none"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Free-text Input Bar */}
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-border/80 space-y-3">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest font-orbitron">
                {language === 'en' ? 'Ask custom question / dilemma:' : 'اكتب سؤالاً مخصصاً بنفسك:'}
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={language === 'en' ? 'Why is my striker always isolated...' : 'مثال: المهاجم معزول وعايز طريقة أخليه يسجل أهداف'}
                  className="flex-1 bg-slate-900 border border-border/80 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-cyan-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAsk(question);
                  }}
                />
                
                <button
                  onClick={() => handleAsk(question)}
                  disabled={!question.trim()}
                  className="p-3.5 rounded-xl text-navyBg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                  style={{ backgroundColor: themeAccent }}
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
            
            {/* Safe and direct instructions banner */}
            <div className="bg-[#0b0e14] p-4 rounded-xl border border-border/40 text-xs text-gray-400 font-semibold leading-normal flex items-center gap-3">
              <span className="text-xl">💡</span>
              <p>
                {language === 'en'
                  ? 'All answers conform strictly to actual eFootball team structures and tactical rules. Direct configurations, no imaginary solutions.'
                  : 'كل الحلول والتعليمات المقترحة متوافقة بالكامل مع خيارات وتحديثات اللعبة الفعلية. نحن لا نخترع حلولاً خيالية!'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <motion.div
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 space-y-3 text-center"
          >
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs font-semibold text-gray-400 animate-pulse font-orbitron">
              {language === 'en' ? 'CONSULTING DIGITAL eFOOTBALL DNA COACH...' : 'جاري تفكيك السؤال واستخراج التكتيك المناسب...'}
            </p>
          </motion.div>
        )}

        {/* Coach Response Form */}
        {response && !loading && (
          <motion.div
            key="response-display"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* The primary answer display template details */}
            <div className="bg-[#0b101f] border border-cyan-500/25 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
                <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
                  {language === 'en' ? 'COACH DIAGNOSIS' : 'قرار تشخيص المدرب'}
                </h3>
              </div>

              {/* Problem overview and reason */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-border/40">
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">1. {language === 'en' ? 'The Issue:' : 'المشكلة الأساسية:'}</span>
                  <p className="text-xs sm:text-sm font-bold text-white mt-1 leading-normal leading-relaxed">
                    {response.problem}
                  </p>
                </div>
                
                <div className="bg-slate-950/40 p-4 rounded-xl border border-border/40">
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">2. {language === 'en' ? 'Likely Reason:' : 'سببها على الأرجح في الميكانكس:'}</span>
                  <p className="text-xs sm:text-sm text-gray-300 font-semibold mt-1 leading-relaxed">
                    {response.likelyReason}
                  </p>
                </div>
              </div>

              {/* Core tactical decision */}
              <div className="bg-cyan-500/5 border border-cyan-400/25 p-4 rounded-xl">
                <span className="text-[10px] text-cyan-400 font-black tracking-widest uppercase block">3. {language === 'en' ? 'TACTICAL DECISION:' : 'القرار التكتيكي الميداني:'}</span>
                <p className="text-xs font-black sm:text-sm text-white mt-1 leading-relaxed">
                  {response.coachDecision}
                </p>
              </div>

              {/* Recommended changes array */}
              <div className="space-y-2">
                <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase block">4. {language === 'en' ? 'WHAT TO CHANGE IN SQUAD:' : 'غيّر إيه في خطتك فوراً:'}</span>
                <div className="space-y-1.5">
                  {response.recommendedChanges.map((change, idx) => (
                    <div key={idx} className="bg-slate-950/45 p-3 rounded-xl border border-emerald-500/10 text-xs text-gray-300 font-semibold leading-normal">
                      ✅ {change}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested instructions list */}
              {response.individualInstructions && response.individualInstructions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] text-amber-500 font-black tracking-widest uppercase block">5. {language === 'en' ? 'PROPOSED INDIVIDUAL INSTRUCTIONS:' : 'تعليمات فردية مقترحة (Individual Instructions):'}</span>
                  <div className="flex flex-wrap gap-2">
                    {response.individualInstructions.map((inst, idx) => (
                      <span key={idx} className="bg-slate-950 border border-amber-500/20 text-xs font-bold text-amber-300 px-3 py-1.5 rounded-lg">
                        🛡️ {inst}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning label */}
              {response.warning && (
                <div className="bg-rose-500/5 border border-rose-500/20 p-3.5 rounded-xl space-y-1">
                  <span className="text-[9px] text-rose-400 font-black uppercase tracking-widest flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>6. {language === 'en' ? 'CRITICAL PLAYING WARNING:' : 'تحذير تكتيكي خطير أثناء اللعب:'}</span>
                  </span>
                  <p className="text-[11px] text-rose-300 leading-normal font-semibold">
                    {response.warning}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Ask another question */}
              <button
                onClick={() => {
                  setResponse(null);
                  setQuestion('');
                }}
                className="flex-1 p-3.5 rounded-xl border border-border text-xs text-white font-black font-orbitron uppercase transition hover:bg-slate-900 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'en' ? 'ASK ANOTHER QUESTION' : 'اسأل سؤال تاني'}</span>
              </button>

              {/* If plan is saveable */}
              {response.saveablePlan && (
                <button
                  onClick={handleSavePlan}
                  disabled={saved}
                  className="flex-2 p-3.5 rounded-xl text-navyBg font-black font-orbitron uppercase text-xs tracking-wider transition hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: themeAccent }}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === 'en' ? 'SAVED' : 'تم الحفظ بنجاح'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{language === 'en' ? 'SAVE AS PLAN' : 'احفظ كخطة'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs font-semibold leading-normal">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
