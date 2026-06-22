import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Brain, LayoutGrid, Sliders, User, TrendingUp, 
  Zap, Settings2, ShieldAlert, Globe, Activity, CloudLightning,
  Loader2, CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';

import { useAppStore } from './store/useAppStore';
import { TRANSLATIONS } from './lib/tactics';

// Modular Sub-components Imports
import OnboardingScreen from './components/ui/OnboardingScreen';
import DashboardTab from './components/dashboard/DashboardTab';
import MatchReportTab from './components/match/MatchReportTab';
import TacticsAICoachTab from './components/tactics/TacticsAICoachTab';
import MetaCounterTab from './components/tactics/MetaCounterTab';
import SubTacticsTab from './components/tactics/SubTacticsTab';
import CustomFormationTab from './components/formation/CustomFormationTab';
import QuickProfilesTab from './components/profiles/QuickProfilesTab';
import PerformanceTrackerTab from './components/performance/PerformanceTrackerTab';
import MatchMomentumTab from './components/match/MatchMomentumTab';
import AppSettingsTab from './components/settings/AppSettingsTab';
import AccountPage from './pages/AccountPage';

export default function App() {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  const onboarded = useAppStore(state => state.onboarded);
  const setLanguage = useAppStore(state => state.setLanguage);

  const [activeTab, setActiveTab] = useState('dashboard');

  // Shared tactic import states
  const [importingShare, setImportingShare] = useState<boolean>(false);
  const [shareImportMsg, setShareImportMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    if (!shareId) return;

    const fetchSharedTactic = async () => {
      setImportingShare(true);
      setShareImportMsg(null);
      try {
        const { supabase, isSupabaseConfigured } = await import('./lib/supabaseClient');
        if (!isSupabaseConfigured || !supabase) {
          throw new Error('Supabase client is not fully configured on this environment.');
        }

        const { data, error } = await supabase
          .from('shared_tactics')
          .select('*')
          .eq('id', shareId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Selected shared tactics snapshot was not found.');

        const updateCustomCoords = useAppStore.getState().updateCustomCoords;
        if (data.formation && Array.isArray(data.players)) {
          updateCustomCoords(data.formation, data.players);
          setActiveTab('custom_formation');
          setShareImportMsg({
            type: 'success',
            text: `Successfully resolved and imported shared "${data.formation}" squad design from Supabase!`
          });

          const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.pushState({ path: newUrl }, '', newUrl);
        } else {
          throw new Error('Missing player formations array inside database snapshot payload.');
        }
      } catch (err: any) {
        console.error('Critical shared setup import failure:', err);
        setShareImportMsg({
          type: 'error',
          text: err.message || 'Error processing the shared URL parameters.'
        });
      } finally {
        setImportingShare(false);
      }
    };

    fetchSharedTactic();
  }, []);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const isRtl = language === 'ar';

  return (
    <div className={`min-h-screen flex flex-col font-sans text-white/90 selection:bg-cyan-500/20 ${isRtl ? 'rtl' : 'ltr'}`} style={{ direction: isRtl ? 'rtl' : 'ltr', scrollBehavior: 'smooth' }}>
      
      {/* Visual background ambient lines */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-60 bg-[radial-gradient(circle_at_50%_-10%,_rgba(13,19,38,0.7),_rgba(4,7,18,1)_85%)]" />

      {/* Onboarding checklist screens overlay */}
      {!onboarded && <OnboardingScreen />}

      {/* Primary header panel */}
      <header className="bg-slate-950/80 border-b border-border/70 backdrop-blur-md sticky top-0 z-45 select-none transition-all">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              style={{ boxShadow: `0 4px 20px ${themeAccent}30` }}
              className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105"
            >
              <span className="font-black text-[#040712] text-sm tracking-tighter">EF26</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black font-orbitron text-white tracking-wider flex items-center gap-1.5 leading-none">
                <span>EF26 TACTICS</span>
                <span className="text-[8px] sm:text-[9px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/25 px-1.5 py-0.5 rounded uppercase font-black tracking-widest font-mono">LABS</span>
              </h1>
              <p className="text-[9px] text-gray-400 font-medium leading-none mt-1 hidden sm:block">AI Coach & Meta-Counter Deck for Competitive eFootball</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick header lang switcher toggle */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="p-2 border border-border/70 hover:border-zinc-600 bg-slate-900/50 hover:bg-zinc-900 transition text-[10px] font-bold font-orbitron rounded-xl text-gray-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Pulsing indicator node */}
            <div 
              className="w-2.5 h-2.5 rounded-full animate-pulse transition-all duration-300" 
              style={{ backgroundColor: themeAccent, boxShadow: `0 0 12px ${themeAccent}` }} 
            />
          </div>
        </div>
      </header>

      {/* Primary Layout Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Responsive Side Menu navigation card */}
        <nav className="lg:col-span-3 bg-[#080d1a]/85 border border-border/85 p-3.5 sm:p-5 rounded-2xl shadow-xl space-y-1">
          <div className="px-2 pb-2.5 border-b border-border/40 mb-3 select-none">
            <span className="text-[9px] uppercase font-black font-orbitron text-gray-500 tracking-widest">TACTICAL LABS DECKS</span>
          </div>

          {[
            { id: 'dashboard', label: t('dashboard'), icon: LayoutGrid },
            { id: 'match_report', label: t('match_report'), icon: FileText },
            { id: 'tactics_generator', label: t('tactics_generator'), icon: Brain, isAi: true },
            { id: 'meta_counter', label: t('meta_counter'), icon: Zap },
            { id: 'sub_tactics', label: t('sub_tactics'), icon: Sliders },
            { id: 'custom_formation', label: t('custom_formation'), icon: Activity },
            { id: 'quick_profiles', label: t('quick_profiles'), icon: User },
            { id: 'performance_tracker', label: t('performance_tracker'), icon: TrendingUp },
            { id: 'momentum_diagnostic', label: 'Momentum Diagnostic', icon: ShieldAlert },
            { id: 'cloud_sync', label: t('cloud_sync'), icon: CloudLightning },
            { id: 'app_settings', label: t('app_settings'), icon: Settings2 },
          ].map(navItem => {
            const Icon = navItem.icon;
            const isSelected = activeTab === navItem.id;
            return (
              <button
                key={navItem.id}
                onClick={() => setActiveTab(navItem.id)}
                className={`w-full p-3 rounded-xl hover:text-white transition-all text-xs font-bold font-orbitron flex items-center justify-between cursor-pointer group select-none ${
                  isSelected 
                    ? 'bg-slate-900 border-l-4 border-primary pl-3.5' 
                    : 'text-gray-400 hover:bg-slate-900/35 border-l-4 border-transparent'
                }`}
                style={isSelected ? { borderLeftColor: themeAccent, color: themeAccent } : {}}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5 transition group-hover:scale-110" />
                  <span>{navItem.label}</span>
                </div>
                {navItem.isAi && (
                  <span className="text-[8.5px] font-black font-orbitron bg-cyan-400/15 border border-cyan-400/20 text-cyan-400 px-1 py-0.5 rounded leading-none animate-pulse">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Content view portal wrapped in AnimatePresence switches */}
        <main className="lg:col-span-9 space-y-6">
          {importingShare && (
            <div className="bg-[#0b0f19]/80 border border-cyan-500/30 p-4.5 rounded-2xl animate-pulse flex items-center gap-3 text-xs font-bold font-orbitron select-none text-cyan-400 bg-surface">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: themeAccent }} />
              <span>RETRIEVING SHARED TACTICAL PITCH SNAPSHOT FROM SUPABASE CLOUD...</span>
            </div>
          )}

          {shareImportMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 shadow-md ${
                shareImportMsg.type === 'success' 
                  ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-950/80 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {shareImportMsg.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span>{shareImportMsg.text}</span>
              </div>
              <button 
                onClick={() => setShareImportMsg(null)}
                className="text-[10px] uppercase font-orbitron font-extrabold px-2.5 py-1 bg-slate-900 border border-border/60 hover:text-white rounded-lg transition-all cursor-pointer select-none"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'match_report' && <MatchReportTab />}
              {activeTab === 'tactics_generator' && <TacticsAICoachTab />}
              {activeTab === 'meta_counter' && <MetaCounterTab />}
              {activeTab === 'sub_tactics' && <SubTacticsTab />}
              {activeTab === 'custom_formation' && <CustomFormationTab />}
              {activeTab === 'quick_profiles' && <QuickProfilesTab />}
              {activeTab === 'performance_tracker' && <PerformanceTrackerTab />}
              {activeTab === 'momentum_diagnostic' && <MatchMomentumTab />}
              {activeTab === 'cloud_sync' && <AccountPage />}
              {activeTab === 'app_settings' && <AppSettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Visual background footer label */}
      <footer className="border-t border-border/40 py-5 bg-[#03050d] text-center select-none mt-auto">
        <p className="text-[10px] text-gray-500 font-mono font-bold tracking-wider">
          EF26 TACTICAL LABS DECK • LICENSED PRO PACK v1.0.0 • NOT AFFILIATED WITH KONAMI INC.
        </p>
      </footer>
    </div>
  );
}
