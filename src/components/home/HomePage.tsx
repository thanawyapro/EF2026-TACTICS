// src/components/home/HomePage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Sparkles, FolderHeart, ShieldQuestion, Settings, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface HomePageProps {
  onNavigate: (tabId: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  return (
    <div className="space-y-6 select-none font-sans" data-testid="home-page-container">
      {/* Friendly Hero Coach Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-[#0b1329] border border-border/80 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-3 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black font-orbitron uppercase tracking-widest">
            <Sparkles className="w-3 h-3 animate-spin duration-1000" />
            <span>{language === 'en' ? 'SIMPLE eFOOTBALL COACH' : 'مدرب إي فوتبول البسيط'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide leading-tight">
            {language === 'en' ? 'What should I change in my tactics to play better?' : 'أغير إيه في خطتي عشان ألعب أحسن؟'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
            {language === 'en' 
              ? 'Get direct, simple guidelines built by competitive players. No complex analytics – just actionable advice.' 
              : 'احصل على نصائح تكتيكية واضحة ومباشرة مبنية على محرك اللعبة الفعلي. بدون تعقيدات!'}
          </p>
        </div>

        {/* Quick Wizards Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 z-10 shrink-0">
          <button
            onClick={() => onNavigate('build_plan')}
            className="px-6 py-3.5 rounded-2xl text-navyBg font-black font-orbitron text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-lg shadow-cyan-400/10 hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: themeAccent }}
          >
            {language === 'en' ? 'BUILD MY PLAN' : 'ابني خطتك'}
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onNavigate('smart_coach')}
            className="px-6 py-3.5 rounded-2xl bg-slate-950 border border-border hover:bg-slate-900 transition-all text-xs font-black font-orbitron tracking-wider text-white uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            {language === 'en' ? 'ASK SMART COACH' : 'مدربك الذكي'}
            <ShieldQuestion className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* The Three Main Promotional Wizard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Analyze Match */}
        <motion.div
          whileHover={{ y: -4, borderColor: themeAccent }}
          onClick={() => onNavigate('analyze')}
          className="bg-slate-950/40 hover:bg-[#0b1226]/50 border border-border/80 p-6 rounded-2xl shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between h-52 group"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 border border-cyan-400/20 group-hover:scale-105 transition-all">
              <FileSearch className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                {language === 'en' ? 'Analyze Match' : 'حلّل ماتشك'}
              </h3>
              <p className="text-xs text-gray-400 leading-normal font-semibold">
                {language === 'en'
                  ? 'Write down what happened in your last match and get instant guidelines.'
                  : 'اكتب اللي حصل في المباراة وخد نصائح مباشرة.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-cyan-450 uppercase font-orbitron">
            <span>{language === 'en' ? 'GO' : 'دخول'}</span>
            <ArrowRight className="w-3.5 h-3.5" style={{ color: themeAccent }} />
          </div>
        </motion.div>

        {/* Card 2: Counter Opponent */}
        <motion.div
          whileHover={{ y: -4, borderColor: themeAccent }}
          onClick={() => onNavigate('counter')}
          className="bg-slate-950/40 hover:bg-[#0b1226]/50 border border-border/80 p-6 rounded-2xl shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between h-52 group"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-400/10 flex items-center justify-center text-teal-400 border border-teal-400/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                {language === 'en' ? 'Counter Opponent' : 'خطة ضد خصم'}
              </h3>
              <p className="text-xs text-gray-400 leading-normal font-semibold">
                {language === 'en'
                  ? 'Input opponent formation and style to receive the perfect countering guide.'
                  : 'اختار تشكيلة الخصم وخد خطة مضادة.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-teal-400 uppercase font-orbitron">
            <span>{language === 'en' ? 'GO' : 'دخول'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
          </div>
        </motion.div>

        {/* Card 3: Saved Plans */}
        <motion.div
          whileHover={{ y: -4, borderColor: themeAccent }}
          onClick={() => onNavigate('plans')}
          className="bg-slate-950/40 hover:bg-[#0b1226]/50 border border-border/80 p-6 rounded-2xl shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between h-52 group"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center text-purple-400 border border-purple-400/20 group-hover:scale-105 transition-all">
              <FolderHeart className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                {language === 'en' ? 'Saved Plans' : 'خططي المحفوظة'}
              </h3>
              <p className="text-xs text-gray-400 leading-normal font-semibold">
                {language === 'en'
                  ? 'Save your custom strategies and retrieve them quickly before matches.'
                  : 'احفظ أفضل الخطط وارجعلها بسرعة.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-purple-400 uppercase font-orbitron">
            <span>{language === 'en' ? 'GO' : 'دخول'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Small Account & Settings Footer Link */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onNavigate('account_settings')}
          className="text-gray-400 hover:text-white transition text-xs font-bold font-orbitron flex items-center gap-1.5 cursor-pointer select-none bg-slate-950/50 hover:bg-slate-950 px-4 py-2 rounded-xl border border-border/60"
        >
          <Settings className="w-3.5 h-3.5" style={{ color: themeAccent }} />
          <span>{language === 'en' ? 'ACCOUNT & APP SETTINGS' : 'حسابي وإعدادات التطبيق'}</span>
        </button>
      </div>
    </div>
  );
}
