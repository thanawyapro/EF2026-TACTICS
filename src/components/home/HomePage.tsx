// src/components/home/HomePage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, FolderHeart, Settings, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface HomePageProps {
  onNavigate: (tabId: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  // Internationalized content mappings
  const content = {
    title: {
      ar: "EF26 Tactics",
      en: "EF26 Tactics",
      fr: "EF26 Tactics",
      es: "EF26 Tactics"
    },
    subtitle: {
      ar: "ابني خطتك في eFootball بسهولة",
      en: "Build your eFootball plan easily",
      fr: "Créez facilement votre tactique eFootball",
      es: "Crea tu táctica de eFootball fácilmente"
    },
    question: {
      ar: "عايز تعمل إيه؟",
      en: "What would you like to do?",
      fr: "Que voulez-vous faire ?",
      es: "¿Qué quieres hacer?"
    },
    btnBuild: {
      ar: "ابني خطتك",
      en: "Build Your Plan",
      fr: "Bâtir ta tactique",
      es: "Construir tu plan"
    },
    subBuild: {
      ar: "اختار أسلوبك وخد خطة جاهزة.",
      en: "Choose your playstyle and get a ready-made plan.",
      fr: "Choisissez votre style et obtenez un plan complet.",
      es: "Elige tu estilo y obtén un plan completo."
    },
    btnCounter: {
      ar: "خطة ضد خصم",
      en: "Counter Opponent",
      fr: "Contrer l'adversaire",
      es: "Contrarrestar rival"
    },
    subCounter: {
      ar: "اختار تشكيلة الخصم وخد الحل.",
      en: "Choose opponent formation and get the antidote.",
      fr: "Découvrez comment neutraliser le schéma ennemi.",
      es: "Elige la formación del rival y obtén la solución."
    },
    btnCoach: {
      ar: "مدربك الذكي",
      en: "Smart Coach",
      fr: "Entraîneur Intelligent",
      es: "Entrenador Inteligente"
    },
    subCoach: {
      ar: "اسأل المدرب وخد نصيحة مباشرة.",
      en: "Ask the coach and get direct advice.",
      fr: "Discutez avec le coach pour des astuces directes.",
      es: "Pregunta al entrenador y obtén consejos directos."
    },
    btnPlans: {
      ar: "خططي",
      en: "My Plans",
      fr: "Mes Tactiques",
      es: "Mis Tácticas"
    },
    btnAccount: {
      ar: "حسابي",
      en: "Account",
      fr: "Mon Compte",
      es: "Mi Cuenta"
    }
  };

  const current = (key: keyof typeof content) => {
    return content[key][language as 'en' | 'ar' | 'fr' | 'es'] || content[key]['ar'];
  };

  return (
    <div className="space-y-8 select-none font-sans py-4" data-testid="home-page-container">
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black font-orbitron uppercase tracking-widest mb-1 shadow-inner select-none">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>eFootball™ Tactics Coach</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-orbitron">
          {current('title')}
        </h1>
        <p className="text-sm text-gray-450 font-semibold">
          {current('subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-black text-center text-gray-300 font-orbitron uppercase tracking-wide">
          {current('question')}
        </h2>

        {/* 3 Big Premium Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Build Your Plan */}
          <motion.div
            whileHover={{ y: -4, borderColor: themeAccent }}
            onClick={() => onNavigate('build_plan')}
            className="bg-slate-900/60 hover:bg-slate-900 border border-border/80 p-6 rounded-3xl shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-56 group relative overflow-hidden"
          >
            {/* Ambient subtle light shine */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-300" />
            <div className="space-y-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-all">
                <FolderHeart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {current('btnBuild')}
                </h3>
                <p className="text-xs text-gray-400 leading-normal font-semibold">
                  {current('subBuild')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-cyan-400 uppercase font-orbitron mt-2.5">
              <span>{language === 'ar' ? 'ابدأ الآن' : 'START'}</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: Counter Opponent */}
          <motion.div
            whileHover={{ y: -4, borderColor: '#10b981' }}
            onClick={() => onNavigate('counter')}
            className="bg-slate-900/60 hover:bg-slate-900 border border-border/80 p-6 rounded-3xl shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-56 group relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
            <div className="space-y-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-all">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {current('btnCounter')}
                </h3>
                <p className="text-xs text-gray-400 leading-normal font-semibold">
                  {current('subCounter')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-emerald-400 uppercase font-orbitron mt-2.5">
              <span>{language === 'ar' ? 'ابدأ الآن' : 'START'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 3: Smart Coach */}
          <motion.div
            whileHover={{ y: -4, borderColor: '#f59e0b' }}
            onClick={() => onNavigate('smart_coach')}
            className="bg-slate-900/60 hover:bg-slate-900 border border-border/80 p-6 rounded-3xl shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-56 group relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-300" />
            <div className="space-y-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-all">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {current('btnCoach')}
                </h3>
                <p className="text-xs text-gray-400 leading-normal font-semibold">
                  {current('subCoach')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-amber-400 uppercase font-orbitron mt-2.5">
              <span>{language === 'ar' ? 'ابدأ الآن' : 'START'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Small footer buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/20">
        <button
          onClick={() => onNavigate('plans')}
          className="flex items-center gap-2 px-6 py-3 border border-border/70 hover:border-zinc-500 bg-slate-950/40 hover:bg-slate-950 transition text-xs font-black font-orbitron rounded-2xl text-purple-400 cursor-pointer shadow-md select-none"
        >
          <FolderHeart className="w-4 h-4 text-purple-400" />
          <span>{current('btnPlans')}</span>
        </button>

        <button
          onClick={() => onNavigate('account_settings')}
          className="flex items-center gap-2 px-6 py-3 border border-border/70 hover:border-zinc-500 bg-slate-950/40 hover:bg-slate-950 transition text-xs font-black font-orbitron rounded-2xl text-gray-450 cursor-pointer shadow-md select-none"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>{current('btnAccount')}</span>
        </button>
      </div>
    </div>
  );
}
