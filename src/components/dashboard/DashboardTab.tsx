import React from 'react';
import { LayoutGrid, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { TRANSLATIONS } from '../../lib/tactics';

export default function DashboardTab() {
  const matches = useAppStore(state => state.matches);
  const profiles = useAppStore(state => state.profiles);
  const activeProfileId = useAppStore(state => state.activeProfileId);
  const themeAccent = useAppStore(state => state.themeAccent);
  const language = useAppStore(state => state.language);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const activeProf = profiles.find(p => p.id === activeProfileId);

  // Compute stats
  const total = matches.length;
  const wins = matches.filter(m => m.result === 'W').length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  let totalGoals = 0;
  let totalConceded = 0;
  matches.forEach(m => {
    totalGoals += m.myGoals;
    totalConceded += m.opponentGoals;
  });

  // Calculate trends
  const lastFive = matches.slice(0, 5); // recent logs are prepended in store

  return (
    <div className="space-y-6" data-testid="dashboard-tab">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-orbitron text-white leading-tight">⚡ {t('welcome_back')}</h2>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en' 
              ? 'Review active setup parameters, tactical alignments, and team records'
              : 'مراجعة المعايير النشطة، وتوازنات خطتك التكتيكية، وإحصائيات سجل الفريق'}
          </p>
        </div>
        {activeProf && (
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" style={{ backgroundColor: themeAccent }}></span>
            <div>
              <p className="text-[9px] uppercase font-black text-gray-300 font-orbitron tracking-widest leading-none">
                {language === 'en' ? 'ACTIVE PROFILE' : 'الملف التكتيكي النشط'}
              </p>
              <p className="text-xs font-black font-orbitron text-primary mt-1.5 leading-none" style={{ color: themeAccent }}>{activeProf.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-border/70 p-5 rounded-2xl shadow-md space-y-2 hover:border-primary/20 transition-all">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider font-orbitron">{t('matches_analyzed')}</p>
          <div className="flex justify-between items-baseline">
            <h3 className="text-3xl font-black font-orbitron text-white">{total}</h3>
            <span className="text-[9px] text-gray-500 font-bold font-mono">MATCH CARDS</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-border/70 p-5 rounded-2xl shadow-md space-y-2 hover:border-primary/20 transition-all">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider font-orbitron">{t('win_rate')}</p>
          <div className="flex justify-between items-baseline">
            <h3 className="text-3xl font-black font-orbitron text-primary" style={{ color: themeAccent, textShadow: `0 0 12px ${themeAccent}30` }}>{winRate}%</h3>
            <span className="text-[9px] text-gray-500 font-bold font-mono">WINS / TOTAL</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-border/70 p-5 rounded-2xl shadow-md space-y-2 hover:border-primary/20 transition-all">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider font-orbitron">
            {language === 'en' ? 'Scored vs Conceded' : 'الأهداف المسجلة والمستقبلة'}
          </p>
          <div className="flex justify-between items-baseline">
            <h3 className="text-3xl font-black font-orbitron text-white">{totalGoals} / {totalConceded}</h3>
            <span className={`text-[9px] font-black uppercase font-orbitron ${totalGoals >= totalConceded ? 'text-emerald-400' : 'text-rose-400'}`}>
              Net: {totalGoals - totalConceded}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-border/70 p-5 rounded-2xl shadow-md space-y-2 hover:border-primary/20 transition-all">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider font-orbitron">
            {language === 'en' ? 'Squad Status' : 'حالة الفريق'}
          </p>
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-black font-orbitron text-amber-400 uppercase">UNLOCKED</h3>
            <span className="text-[9px] text-gray-500 font-bold font-mono">VIP ADVISOR</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Active Profile Review */}
        <div className="bg-[#0b0f19]/70 border border-border/80 p-5 rounded-2xl shadow-md space-y-4 md:col-span-7">
          <h3 className="text-sm font-black font-orbitron text-white border-b border-border/50 pb-2 flex items-center gap-2">
            <span>🛡️</span> {language === 'en' ? 'ACTIVE ALIGNMENT REVIEW' : 'تفاصيل الخطة المفعلة حالياً'}
          </h3>
          {activeProf ? (
            <div className="space-y-4 text-xs font-semibold leading-relaxed">
              <div>
                <p className="text-[9px] uppercase font-black text-gray-400 font-mono tracking-wider">
                  {language === 'en' ? 'PROFILE ID / NAME' : 'اسم الملف النشط'}
                </p>
                <p className="text-sm font-bold mt-1 text-white">{activeProf.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] uppercase font-black text-gray-400 font-mono tracking-wider">
                    {language === 'en' ? 'FORMATION STACK' : 'توزيع التشكيل بالخريطة'}
                  </p>
                  <p className="text-xs font-bold font-orbitron text-gray-200 mt-1 bg-slate-900 px-2.5 py-1 rounded border border-border/40 inline-block uppercase">{activeProf.formation}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-gray-400 font-mono tracking-wider">
                    {language === 'en' ? 'PLAYSTYLE ALIGNMENT' : 'أسلوب اللعب التكتيكي'}
                  </p>
                  <p className="text-xs font-bold text-amber-400 mt-1 bg-amber-400/10 px-2.5 py-1 rounded inline-block">{activeProf.playstyle}</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-gray-400 font-mono tracking-wider">
                  {language === 'en' ? 'PRIMARY TACTICAL FOCUS' : 'الإرشادات والتعليمات الفنية المفصلة'}
                </p>
                <p className="text-xs leading-relaxed text-gray-300 mt-1.5 bg-slate-900/40 p-3 rounded-xl border border-border/30">{activeProf.details}</p>
              </div>
              {activeProf.subTactics && activeProf.subTactics.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase font-black text-gray-400 font-mono mb-2 tracking-wider">
                    {language === 'en' ? 'Activated Sub-Tactical Nodes' : 'خيارات التكتيكات الفرعية النشطة'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProf.subTactics.map((st, i) => (
                      <span key={i} className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded border border-cyan-500/15 font-bold font-orbitron">{st}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-6">
              {language === 'en' ? 'No active profile chosen. Load one from Quick Profiles Deck.' : 'لا يوجد ملف نشط محدد. قم بتفعيل أحد الملفات من قائمة الحزم السريعة.'}
            </p>
          )}
        </div>

        {/* Recent form log list */}
        <div className="bg-[#0b0f19]/70 border border-border/80 p-5 rounded-2xl shadow-md space-y-4 md:col-span-5">
          <h3 className="text-sm font-black font-orbitron text-white border-b border-border/50 pb-2 flex items-center justify-between">
            <span>🏟️ {language === 'en' ? 'RECENT FORM' : 'السجل الأخير'}</span>
            <span className="text-[9px] text-gray-500 font-mono font-bold uppercase">{language === 'en' ? 'LATEST 5' : 'آخر ٥ جهود'}</span>
          </h3>
          {lastFive.length > 0 ? (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {lastFive.map(m => (
                <div key={m.id} className="flex items-center justify-between p-2.5 bg-slate-900/40 border border-border/60 hover:border-gray-700 transition rounded-xl text-xs">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-gray-200 font-orbitron">{m.myFormation} vs {m.opponentFormation}</p>
                    <p className="text-[9px] text-gray-500 font-bold font-mono">{m.date} • {m.matchType}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{m.possession}% POS</span>
                    <span className={`text-[11px] font-black font-orbitron px-2 py-0.5 rounded ${
                      m.result === 'W' ? 'bg-emerald-500/20 text-emerald-400' :
                      m.result === 'L' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-slate-700/30 text-slate-400'
                    }`}>
                      {m.myGoals} - {m.opponentGoals}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-slate-900/20 border border-dashed border-border/40 rounded-xl">
              <p className="text-xs text-gray-500 leading-normal">
                {language === 'en' ? 'No matches mapped. Visit Match Report to insert logs.' : 'لم يتم العثور على مباريات سابقة. قم بإضافة سجل جديد من تبويب تقارير المباريات!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Meta Alert Advice Card */}
      <div className="bg-gradient-to-r from-cyan-950/20 to-slate-900/20 border border-cyan-500/20 p-5 rounded-2xl space-y-2 shadow-inner">
        <h4 className="text-xs font-black font-orbitron text-cyan-400 tracking-widest uppercase flex items-center gap-2">
          <span>🔔</span> {t('meta_warning')} 4-2-2-2 LONG BALL OVERLOADS
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed max-w-2xl font-semibold">
          {language === 'en' 
            ? 'The prevailing metagame heavily exploits physical forwards crossing long vertical balls over deep defensive layouts. To counteract, anchor your central defensive line and switch your defensive line sub-tactics to target individual marks aggressively.'
            : 'يعتمد أسلوب لعب ميتا اللعبة السائد بكثافة على العرضيات الطويلة الموجهة للمهاجمين طوال القامة والبدنيين. للتصدي بكفاءة، قم بتثبيت مدافع الارتكاز وبث تكتيك "خط دفاع عميق" لتقييد المساحات المتاحة.'}
        </p>
      </div>
    </div>
  );
}
