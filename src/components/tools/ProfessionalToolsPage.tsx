// src/components/tools/ProfessionalToolsPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, ShieldAlert, TrendingUp, LayoutGrid, FileText, Activity, Sliders, RefreshCw, Layers
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

// Existing professional tab imports
import DashboardTab from '../dashboard/DashboardTab';
import MatchReportTab from '../match/MatchReportTab';
import SubTacticsTab from '../tactics/SubTacticsTab';
import CustomFormationTab from '../formation/CustomFormationTab';
import PerformanceTrackerTab from '../performance/PerformanceTrackerTab';
import MatchMomentumTab from '../match/MatchMomentumTab';

interface ProfessionalToolsPageProps {
  onNavigate: (tabId: string) => void;
}

export default function ProfessionalToolsPage({ onNavigate }: ProfessionalToolsPageProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  const [activeSubTab, setActiveSubTab] = useState<string>('radar');

  // Meta Radar local state with cache support
  const [radarData, setRadarData] = useState(() => {
    try {
      const saved = localStorage.getItem('ef26_meta_radar_cache_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      quickCounter: 94,
      longBallCounter: 92,
      possessionGame: 85,
      outWide: 78,
      longBall: 65,
      cachedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
  });
  
  const [isUpdatingRadar, setIsUpdatingRadar] = useState(false);

  const handleRefreshRadar = () => {
    setIsUpdatingRadar(true);
    setTimeout(() => {
      const updated = {
        quickCounter: Math.floor(Math.random() * 5) + 91,
        longBallCounter: Math.floor(Math.random() * 5) + 89,
        possessionGame: Math.floor(Math.random() * 8) + 80,
        outWide: Math.floor(Math.random() * 10) + 72,
        longBall: Math.floor(Math.random() * 15) + 55,
        cachedAt: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };
      localStorage.setItem('ef26_meta_radar_cache_data', JSON.stringify(updated));
      setRadarData(updated);
      setIsUpdatingRadar(false);
    }, 1000);
  };

  const tabsList = [
    { id: 'radar', name: language === 'ar' ? 'رادار الميتا' : 'Meta Radar', icon: BarChart2 },
    { id: 'momentum', name: language === 'ar' ? 'ديناميكية الزخم' : 'Momentum Diagnostic', icon: ShieldAlert },
    { id: 'performance', name: language === 'ar' ? 'متتبع الأداء' : 'Performance Tracker', icon: TrendingUp },
    { id: 'dashboard', name: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: LayoutGrid },
    { id: 'reports', name: language === 'ar' ? 'تقارير المباريات' : 'Match Reports', icon: FileText },
    { id: 'squad', name: language === 'ar' ? 'محرر الفريق' : 'Squad Editor', icon: Activity },
    { id: 'sub_tactics', name: language === 'ar' ? 'التعليمات الفرعية' : 'Sub Tactics', icon: Sliders }
  ];

  return (
    <div className="space-y-6 select-none font-sans" data-testid="professional-tools-page">
      {/* Title block */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black font-orbitron text-white tracking-tight flex items-center justify-center gap-2">
          <span>{language === 'ar' ? '🛠️ أدوات المحترفين' : '🛠️ Professional Tools'}</span>
          <span className="text-[9px] bg-cyan-400/15 border border-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded uppercase font-black font-mono">PRO</span>
        </h2>
        <p className="text-xs text-gray-400 font-semibold max-w-md mx-auto">
          {language === 'ar' ? 'تحكّم في تشكيلاتك المتقدمة وراجع إحصائيات الأداء والدفاع المتكامل.' : 'Configure advanced systems, analyze tactical flow, and optimize performance parameters.'}
        </p>
      </div>

      {/* Grid selector buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {tabsList.map(tab => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 justify-center cursor-pointer ${
                isSelected 
                  ? 'bg-slate-900 text-cyan-450 border-cyan-450/40 outline-none shadow-md' 
                  : 'bg-slate-950/40 border-border/80 text-gray-400 hover:text-white'
              }`}
              style={isSelected ? { borderColor: themeAccent, color: themeAccent } : {}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[10.5px] whitespace-nowrap">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active screen portal */}
      <div className="bg-[#040712]/90 border border-border/70 rounded-3xl p-4 sm:p-6 shadow-2xl min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {/* Meta Radar Tab */}
            {activeSubTab === 'radar' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/30 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black font-orbitron text-white uppercase tracking-wider">{language === 'ar' ? '📡 رادار كفاءة خطط الميتا الحية' : '📡 Live Playstyle Efficiency indexing'}</h3>
                    <p className="text-[10px] text-gray-500 font-mono font-bold leading-none">{language === 'ar' ? `تحديث تلقائي كل 24 ساعة (محفوظ مؤقتاً: ${radarData.cachedAt})` : `Resets every 24 hours (Cached: ${radarData.cachedAt})`}</p>
                  </div>
                  <button
                    disabled={isUpdatingRadar}
                    onClick={handleRefreshRadar}
                    className="p-2 bg-slate-950 hover:bg-slate-900 text-cyan-400 border border-border/80 rounded-xl transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingRadar ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="space-y-4 font-semibold text-xs">
                  {[
                    { name: 'Quick Counter (مرتدات سريعة)', val: radarData.quickCounter, color: '#00d4ff' },
                    { name: 'Long Ball Counter (كرة طويلة مضادة) 🆕', val: radarData.longBallCounter, color: '#10b981' },
                    { name: 'Possession Game (استحواذ اللعب)', val: radarData.possessionGame, color: '#f59e0b' },
                    { name: 'Out Wide (لعب على الأطراف)', val: radarData.outWide, color: '#a855f7' },
                    { name: 'Long Ball (كرات طويلة كلاسيكية)', val: radarData.longBall, color: '#ec4899' }
                  ].map(style => (
                    <div key={style.name} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{style.name}</span>
                        <span style={{ color: style.color }} className="font-extrabold font-mono">{style.val}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${style.val}%`, backgroundColor: style.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'momentum' && <MatchMomentumTab />}
            {activeSubTab === 'performance' && <PerformanceTrackerTab />}
            {activeSubTab === 'dashboard' && <DashboardTab />}
            {activeSubTab === 'reports' && <MatchReportTab />}
            {activeSubTab === 'squad' && <CustomFormationTab />}
            {activeSubTab === 'sub_tactics' && <SubTacticsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
