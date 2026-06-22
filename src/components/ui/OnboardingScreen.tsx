import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ShieldAlert, Sliders, ChevronRight, Activity, Zap, Play } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function OnboardingScreen() {
  const setOnboarded = useAppStore(state => state.setOnboarded);
  const language = useAppStore(state => state.language);
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: language === 'en' ? 'Welcome to EF26 Tactical Labs' : 'مرحباً بك في معامل تكتيكات إي فوتبول ٢٦',
      desc: language === 'en' 
        ? 'Your elite companion for tactical mapping, meta counters, momentum diagnostics, and deep on-field adjustments in eFootball 2026.' 
        : 'رابطتك الفنية الأولى لتوزيع مراكز اللاعبين، وصد الثغرات الشائعة، وتشخيص الزخم والتحريكات داخل الملعب.',
      icon: Activity,
      color: 'from-cyan-400 to-blue-600',
    },
    {
      title: language === 'en' ? 'Identify and Counter the Meta' : 'كشف الخطط الشائعة والتصدي لها والموازنة',
      desc: language === 'en'
        ? 'Unearth robust counters for aggressive playstyle loops, and fine-tune team formations to neutralize standard 4-2-2-2 and AMF through-ball overrides.'
        : 'اكتشف حركات مضادة لتشكيلات الخصوم الأكثر شيوعاً، وعزز توازن فريقك الفني لإيقاف هجمات التمرير البيني وعرضيات الميتا.',
      icon: Zap,
      color: 'from-amber-400 to-orange-500',
    },
    {
      title: language === 'en' ? 'Neural On-Field Diagnostics' : 'التحليل والتشخيص الفوري بالذكاء الاصطناعي',
      desc: language === 'en'
        ? 'Submit real matches telemetry through the secure Google Gemini serverless advisor to isolate spatial stiffness, counter strategies, and sub-tactics protocols.'
        : 'أرسل بيانات وإحصائيات مباراتك مباشرة عبر وحدة تحليل جيمني الآمنة لاكتشاف مسببات ثقل التحركات وعلاج ثغرات الهجمات المرتدة.',
      icon: Brain,
      color: 'from-emerald-400 to-teal-500',
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setOnboarded(true);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const current = slides[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 bg-[#040712] flex items-center justify-center p-4 z-[9999] select-none" data-testid="onboarding-screen">
      <div className="absolute inset-0 bg-radial-gradient from-[#0d1326] to-[#040712] pointer-events-none opacity-80" />
      
      <div className="bg-slate-950/80 border border-border/80 p-8 rounded-3xl max-w-lg w-full shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-[450px]">
        {/* Dynamic Background Spotlight */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br ${current.color} opacity-10 filter blur-3xl`} />
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black font-orbitron text-primary border border-primary/20 bg-primary/10 px-2 py-0.5 rounded tracking-wider uppercase">EF26 LABS</span>
            <span className="text-[10px] text-gray-400 font-mono font-bold">V1.0.0</span>
          </div>
          <button 
            onClick={() => setOnboarded(true)}
            className="text-xs text-gray-500 hover:text-white font-bold transition cursor-pointer"
          >
            {language === 'en' ? 'Skip Intro' : 'تخطي المقدمة'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col items-center text-center justify-center space-y-4"
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${current.color} rounded-2xl flex items-center justify-center text-navyBg shadow-lg`}>
              <Icon className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-black font-orbitron text-white uppercase tracking-wider">{current.title}</h2>
              <p className="text-xs text-gray-400 leading-relaxed font-semibold max-w-sm">{current.desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="border-t border-border/30 pt-6 mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-5 bg-primary' : 'w-1.5 bg-gray-800'}`} 
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button 
                onClick={handlePrev}
                className="bg-surface2 hover:bg-zinc-800 border border-border/60 text-gray-300 hover:text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                {language === 'en' ? 'Back' : 'السابق'}
              </button>
            )}
            
            <button 
              onClick={handleNext}
              className="bg-gradient-to-r from-primary to-secondary text-navyBg font-black font-orbitron text-xs px-5 py-2.5 rounded-xl transition hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <span>{step === slides.length - 1 ? (language === 'en' ? 'ENTER STATION' : 'دخول المنصة') : (language === 'en' ? 'NEXT' : 'التالي')}</span>
              {step === slides.length - 1 ? <Play className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
