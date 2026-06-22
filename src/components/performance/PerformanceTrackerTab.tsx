import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Award, BarChart4, PieChart } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { TRANSLATIONS } from '../../lib/tactics';

export default function PerformanceTrackerTab() {
  const matches = useAppStore(state => state.matches);
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  if (matches.length === 0) {
    return (
      <div className="space-y-6" data-testid="performance-tracker-tab">
        <div className="border-b border-border pb-4">
          <h2 className="text-2xl font-black font-orbitron text-white leading-tight">📈 {t('performance_tracker')}</h2>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en'
              ? 'Visualize win rates, goal metrics, and trends across matching timelines'
              : 'تمثيل بياني تفصيلي لنسب الفوز، إحصائيات الأهداف، وأداء التشكيل تزامناً مع المباريات'}
          </p>
        </div>

        <div className="bg-slate-950/40 border border-border/80 p-20 text-center rounded-2xl flex flex-col items-center justify-center space-y-3">
          <BarChart4 className="w-12 h-12 text-gray-600 animate-pulse" />
          <div>
            <p className="text-gray-400 text-sm font-black">{language === 'en' ? 'NO TELEMETRY MATCH CARDS DEFINED' : 'لا تتوفر إحصائيات مسجلة كافية حالياً'}</p>
            <p className="text-xs text-gray-500 mt-1">{language === 'en' ? 'Log at least one match in Match Report to start graphic synthesis.' : 'سجل مباراتك الأولى في قسم تقارير المباريات لتفعيل الألواح والرسوم التحليلية!'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Formatting coordinates for Area / Line trajectory
  // Matches state is sorted latest-first, we reverse it to display chronologically (ascending date)
  const orderedMatches = [...matches].reverse();

  let cumWins = 0;
  const lineData = orderedMatches.map((m, index) => {
    if (m.result === 'W') cumWins++;
    const cumulativeWinRate = Math.round((cumWins / (index + 1)) * 100);
    return {
      name: `${m.myFormation}`,
      'Win Rate %': cumulativeWinRate,
      Scored: m.myGoals,
      Conceded: m.opponentGoals,
      Possession: m.possession
    };
  });

  // Formation efficacy mapping
  const formGroup: Record<string, { wins: number; total: number; gf: number }> = {};
  matches.forEach(m => {
    if (!formGroup[m.myFormation]) {
      formGroup[m.myFormation] = { wins: 0, total: 0, gf: 0 };
    }
    formGroup[m.myFormation].total += 1;
    formGroup[m.myFormation].gf += m.myGoals;
    if (m.result === 'W') {
      formGroup[m.myFormation].wins += 1;
    }
  });

  const barData = Object.entries(formGroup).map(([form, values]) => ({
    name: form,
    'Win Rate %': Math.round((values.wins / values.total) * 100),
    'Goals Scored Avg': parseFloat((values.gf / values.total).toFixed(1)),
    'Matches': values.total
  }));

  return (
    <div className="space-y-6 select-none font-sans" data-testid="performance-tracker-tab">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black font-orbitron text-white leading-tight">📈 {t('performance_tracker')}</h2>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'en'
            ? 'Visualize win rates, goal metrics, and trends across matching timelines'
            : 'تمثيل بياني تفصيلي لنسب الفوز، إحصائيات الأهداف، وأداء التشكيل تزامناً مع المباريات'}
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trajectory Cumulative Win Rate Line Chart */}
        <div className="bg-[#0b0f19]/70 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <div className="border-b border-border/40 pb-2">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" style={{ color: themeAccent }} /> Win Rate Development Path
            </h3>
          </div>
          <div className="h-[280px] w-full text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeAccent} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={themeAccent} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Win Rate %" stroke={themeAccent} fillOpacity={1} fill="url(#colorWinRate)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Formation Efficacy multi bar chart */}
        <div className="bg-[#0b0f19]/70 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <div className="border-b border-border/40 pb-2">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest flex items-center gap-2">
              <BarChart4 className="w-4 h-4 text-emerald-400" /> Formation Performance & Goals
            </h3>
          </div>
          <div className="h-[280px] w-full text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="Win Rate %" fill={themeAccent} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Goals Scored Avg" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Aggregate review values */}
      <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md flex flex-wrap justify-between gap-4 font-orbitron">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-black font-mono leading-none">HIGHEST EFFICIENCY FORM</p>
          <p className="text-lg font-black text-white">{barData.sort((a,b) => b['Win Rate %'] - a['Win Rate %'])[0]?.name || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-black font-mono leading-none">TOTAL GOALS REGISTERED</p>
          <p className="text-lg font-black text-emerald-400">{matches.reduce((sum,m)=>sum+m.myGoals,0)} GF</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-black font-mono leading-none">TOTAL CONCEDED REGISTERED</p>
          <p className="text-lg font-black text-rose-455" style={{ color: '#f43f5e' }}>{matches.reduce((sum,m)=>sum+m.opponentGoals,0)} GA</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-black font-mono leading-none">MOMENTUM CONFLICT RATE</p>
          <p className="text-lg font-black text-amber-500">
            {matches.length > 0 ? Math.round((matches.filter(m=>m.feltControlLoss).length / matches.length)*100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
