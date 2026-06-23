// src/App.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Brain, LayoutGrid, Sliders, User, TrendingUp, 
  Zap, Settings2, ShieldAlert, Globe, Activity, CloudLightning,
  Loader2, CheckCircle2, AlertTriangle, AlertCircle, Home,
  FolderHeart, Sparkles, HelpCircle, Hammer, ChevronDown, ChevronUp
} from 'lucide-react';

import { useAppStore } from './store/useAppStore';
import { useLanguage } from './hooks/useLanguage';

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
import EfootballAuditPage from './pages/EfootballAuditPage';

// Simple MVP Custom Wizard components
import HomePage from './components/home/HomePage';
import BuildPlanPage from './components/plan/BuildPlanPage';
import SmartCoachPage from './components/coach/SmartCoachPage';
import ProfessionalToolsPage from './components/tools/ProfessionalToolsPage';

export default function App() {
  const { language, changeLanguage, t, isRtl } = useLanguage();
  const themeAccent = useAppStore(state => state.themeAccent);
  const onboarded = useAppStore(state => state.onboarded);

  // Set default state to 'home' as requested for an ultra-clean simplified first-time view!
  const [activeTab, setActiveTab ] = useState('home');
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);

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
          throw new Error('Missing player formations array inside database payload.');
        }
      } catch (err: any) {
        console.error('Critical shared setup import failure:', err);
        setShareImportMsg({
          type: 'error',
          text: err.message || 'Error processing the shared URL.'
        });
      } finally {
        setImportingShare(false);
      }
    };

    fetchSharedTactic();
  }, []);

  // Identify whether current active tab is advanced
  const advancedTabs = [
    'dashboard', 'match_report', 'sub_tactics', 
    'custom_formation', 'performance_tracker', 
    'momentum_diagnostic', 'app_settings'
  ];
  const isCurrentlyInAdvanced = advancedTabs.includes(activeTab);

  const [isDevAudit, setIsDevAudit] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/dev/efootball-audit' || path.startsWith('/dev/efootball-audit')) {
        setIsDevAudit(true);
      }
    }
  }, []);

  if (isDevAudit) {
    return <EfootballAuditPage />;
  }

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
              onClick={() => setActiveTab('home')}
              className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <span className="font-black text-[#040712] text-sm tracking-tighter">EF26</span>
            </div>
            <div onClick={() => setActiveTab('home')} className="cursor-pointer">
              <h1 className="text-sm sm:text-base font-black font-orbitron text-white tracking-wider flex items-center gap-1.5 leading-none">
                <span>EF26 TACTICS</span>
                <span className="text-[8px] sm:text-[9px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/25 px-1.5 py-0.5 rounded uppercase font-black tracking-widest font-mono">MVP</span>
              </h1>
              <p className="text-[9px] text-gray-400 font-medium leading-none mt-1 hidden sm:block">
                {language === 'en' ? 'Simple Custom eFootball AI Coach & Playbook' : 'مدرب ذكي بسيط وتكتيكات دفاعية لجميع اللاعبين'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Lang switcher */}
            <button 
              onClick={() => {
                const nextLang = 
                  language === 'ar' ? 'en' :
                  language === 'en' ? 'fr' :
                  language === 'fr' ? 'es' : 'ar';
                changeLanguage(nextLang);
              }}
              className="p-2 border border-border/70 hover:border-zinc-500 bg-slate-900/50 hover:bg-zinc-900 transition text-[9px] font-black font-orbitron rounded-xl text-primary flex items-center gap-1.5 cursor-pointer max-w-20"
            >
              <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="uppercase">{language}</span>
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
      <div className="max-w-4xl mx-auto px-4 py-6 w-full flex-grow pb-28">
        
        {/* Content view portal wrapped in AnimatePresence switches */}
        <main className="space-y-6">
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

          {/* Pro-tools Warning dialog if viewing advanced section */}
          {isCurrentlyInAdvanced && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-2xl text-xs text-yellow-350 leading-relaxed font-semibold flex items-center gap-3"
            >
              <span className="text-xl">⚠️</span>
              <div>
                <span className="font-extrabold block text-white uppercase tracking-wider text-[10px] mb-0.5">
                  {language === 'en' ? 'PRO-MODE LEVEL ACCESSED' : 'وضع المحترفين للتعديل المعقد'}
                </span>
                <p>
                  {language === 'en'
                    ? 'These tools are for advanced adjustments and team monitoring. Standard players do not need them for core gameplay decisions.'
                    : 'هذه الأدوات مخصصة لتجربة المحترفين ومراجعة الإحصائيات المعقدة؛ ولا يحتاجها اللاعب العادي بشكل منتظم.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Animation View Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Simple MVP views */}
              {activeTab === 'home' && <HomePage onNavigate={setActiveTab} />}
              {activeTab === 'build_plan' && <BuildPlanPage onNavigate={setActiveTab} />}
              {activeTab === 'analyze' && <TacticsAICoachTab />}
              {activeTab === 'counter' && <MetaCounterTab />}
              {activeTab === 'smart_coach' && <SmartCoachPage onNavigate={setActiveTab} />}
              {activeTab === 'plans' && <QuickProfilesTab onNavigate={setActiveTab} />}
              {activeTab === 'account_settings' && <AccountPage />}
              {activeTab === 'tools' && <ProfessionalToolsPage onNavigate={setActiveTab} />}

              {/* Advanced original views preserved untouched */}
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'match_report' && <MatchReportTab />}
              {activeTab === 'sub_tactics' && <SubTacticsTab />}
              {activeTab === 'custom_formation' && <CustomFormationTab />}
              {activeTab === 'performance_tracker' && <PerformanceTrackerTab />}
              {activeTab === 'momentum_diagnostic' && <MatchMomentumTab />}
              {activeTab === 'app_settings' && <AppSettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Premium Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-border/80 backdrop-blur-lg z-50 py-3 px-3 shadow-2xl">
        <div className="max-w-xl mx-auto flex items-center justify-around">
          {[
            { id: 'home', label: language === 'en' ? 'Home' : 'الرئيسية', icon: Home },
            { id: 'build_plan', label: language === 'en' ? 'Build Plan' : 'ابني خطتك', icon: FolderHeart },
            { id: 'counter', label: language === 'en' ? 'Counter' : 'ضد خصم', icon: Zap },
            { id: 'smart_coach', label: language === 'en' ? 'Coach' : 'مدربك', icon: Brain, isAi: true },
            { id: 'plans', label: language === 'en' ? 'Plans' : 'خططي', icon: User },
            { id: 'account_settings', label: language === 'en' ? 'Account' : 'حسابي', icon: Settings2 },
          ].map((navItem) => {
            const Icon = navItem.icon;
            const isSelected = activeTab === navItem.id;
            return (
              <button
                key={navItem.id}
                onClick={() => setActiveTab(navItem.id)}
                className={`flex flex-col items-center gap-1 transition-all relative px-3 py-1 rounded-xl cursor-pointer ${
                  isSelected ? 'text-cyan-400 font-extrabold scale-105' : 'text-gray-400 hover:text-white'
                }`}
                style={isSelected ? { color: themeAccent } : {}}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {navItem.isAi && (
                    <span className="absolute -top-1.5 -right-2 bg-cyan-400 text-[#040712] text-[7px] font-black px-1 py-0.2 rounded-full animate-pulse leading-none">
                      AI
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight">{navItem.label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: themeAccent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Background footer label */}
      <footer className="border-t border-border/40 py-5 bg-[#03050d] text-center select-none mt-auto space-y-1">
        <p className="text-[10px] text-gray-500 font-mono font-bold tracking-wider">
          EF26 TACTICAL LABS DECK • LICENSED PRO PACK v1.0.0 • NOT AFFILIATED WITH KONAMI INC.
        </p>
        <p className="text-[9px] font-mono font-bold">
          <a href="/dev/efootball-audit" className="text-gray-600 hover:text-cyan-400/90 transition-colors">
            [ Developer Database Audit ]
          </a>
        </p>
      </footer>
    </div>
  );
}
