import React, { useState } from 'react';
import { Trash2, Check, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MatchRecord, MatchRecordSchema } from '../../types/schemas';
import { FORMATIONS, TRANSLATIONS } from '../../lib/tactics';

export default function MatchReportTab() {
  const matches = useAppStore(state => state.matches);
  const addMatch = useAppStore(state => state.addMatch);
  const deleteMatch = useAppStore(state => state.deleteMatch);
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [matchType, setMatchType] = useState('Division Match');
  const [myForm, setMyForm] = useState('4-3-3');
  const [oppForm, setOppForm] = useState('4-2-2-2');
  const [myGoals, setMyGoals] = useState('1');
  const [oppGoals, setOppGoals] = useState('2');
  const [possession, setPossession] = useState(50);
  const [myShots, setMyShots] = useState('7');
  const [myOnTarget, setMyOnTarget] = useState('3');
  const [oppShots, setOppShots] = useState('6');
  const [oppOnTarget, setOppOnTarget] = useState('3');
  const [feltControlLoss, setFeltControlLoss] = useState(false);
  const [notes, setNotes] = useState('');

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');

    const goalsScored = parseInt(myGoals) || 0;
    const goalsConceded = parseInt(oppGoals) || 0;
    const shotsVal = parseInt(myShots) || 0;
    const onTargetVal = parseInt(myOnTarget) || 0;
    const oppShotsVal = parseInt(oppShots) || 0;
    const oppOnTargetVal = parseInt(oppOnTarget) || 0;

    // Cross-field Logical validations
    const validationErrors: Record<string, string> = {};
    if (onTargetVal > shotsVal) {
      validationErrors.onTarget = language === 'en' 
        ? 'On-target shots cannot exceed total shots.' 
        : 'الترديد الموجه للهدف لا يمكن أن يتخطى إجمالي التسديدات.';
    }
    if (oppOnTargetVal > oppShotsVal) {
      validationErrors.oppOnTarget = language === 'en'
        ? 'Opponent on-target shots cannot exceed their total shots.'
        : 'تسديدات الخصم الموجهة للمرمى لا يمكن أن تتجاوز إجمالي تسديداته.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result: 'W' | 'L' | 'D' = goalsScored > goalsConceded ? 'W' : goalsScored < goalsConceded ? 'L' : 'D';

    const payload = {
      id: 'm_' + Date.now().toString(),
      date,
      myFormation: myForm,
      opponentFormation: oppForm,
      myGoals: goalsScored,
      opponentGoals: goalsConceded,
      result,
      possession: Number(possession),
      myShots: shotsVal,
      onTarget: onTargetVal,
      oppShots: oppShotsVal,
      oppOnTarget: oppOnTargetVal,
      feltControlLoss,
      matchType,
      notes: notes.trim()
    };

    // Zod Validation Check
    const verified = MatchRecordSchema.safeParse(payload);
    if (!verified.success) {
      const fieldErrors: Record<string, string> = {};
      verified.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Add to Store (persists in localStorage)
    addMatch(verified.data);

    // Reset notes / success triggering
    setNotes('');
    setFeltControlLoss(false);
    setSuccessMsg(language === 'en' ? 'Match telemetry logged successfully!' : 'تم تسجيل معطيات المباراة بنجاح كابتن!');
    
    // Auto clear success message
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-6" data-testid="match-reports-tab">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black font-orbitron text-white leading-tight">📋 {t('match_report')}</h2>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'en'
            ? 'Record post-match telemetry data to generate patterns and tracking histories'
            : 'سجل إحصائيات المباراة لتتبع المنحنى واكتشاف ثغرات التحكم والخطط الموجهة ضد الميتا'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/40 pb-2 flex items-center gap-2">
            <span>🖋️</span> {language === 'en' ? 'LOG FRESH RECORD' : 'تسجيل إحصائيات المباراة الفنية'}
          </h3>

          {successMsg && (
            <div className="bg-emerald-950/90 border border-emerald-500/30 text-emerald-200 p-3.5 rounded-xl text-xs font-bold font-orbitron flex items-center gap-2 animate-fadeIn">
              <span>🟢</span>
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Match Type</label>
              <select 
                value={matchType} 
                onChange={e => setMatchType(e.target.value)} 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary font-bold"
              >
                <option>Division Match</option>
                <option>Friendly Match</option>
                <option>Co-op Match</option>
                <option>Event Tour</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">My Formation</label>
              <select 
                value={myForm} 
                onChange={e => setMyForm(e.target.value)} 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary font-orbitron font-extrabold uppercase"
              >
                {FORMATIONS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Opponent Formation</label>
              <select 
                value={oppForm} 
                onChange={e => setOppForm(e.target.value)} 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary font-orbitron font-extrabold uppercase"
              >
                {FORMATIONS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 border border-border/30 bg-slate-950/30 p-3 rounded-xl">
            <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase flex items-center font-orbitron">Final Scoreline</div>
            <div>
              <label className="block text-[9px] font-bold text-center text-gray-400 uppercase mb-1">GF</label>
              <input 
                type="number" 
                min="0" 
                value={myGoals} 
                onChange={e => setMyGoals(e.target.value)} 
                className="w-full text-center bg-slate-900 border border-border/60 text-xs py-2 rounded-lg text-white font-mono font-bold outline-none" 
              />
              {errors.myGoals && <p className="text-[8px] text-rose-400 mt-0.5">{errors.myGoals}</p>}
            </div>
            <div>
              <label className="block text-[9px] font-bold text-center text-gray-400 uppercase mb-1">GA</label>
              <input 
                type="number" 
                min="0" 
                value={oppGoals} 
                onChange={e => setOppGoals(e.target.value)} 
                className="w-full text-center bg-slate-900 border border-border/60 text-xs py-2 rounded-lg text-white font-mono font-bold outline-none" 
              />
              {errors.opponentGoals && <p className="text-[8px] text-rose-400 mt-0.5">{errors.opponentGoals}</p>}
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1 font-orbitron">
                <span>Possession Rate</span>
                <span className="text-primary font-mono font-black" style={{ color: themeAccent }}>{possession}%</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="85" 
                value={possession} 
                onChange={e => setPossession(parseInt(e.target.value) || 50)} 
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                style={{ accentColor: themeAccent }}
              />
              {errors.possession && <p className="text-[8px] text-rose-400 mt-0.5">{errors.possession}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3.5 bg-slate-950/25 p-3.5 rounded-xl border border-border/30">
              <div className="space-y-2 border-r border-border/30 pr-2">
                <span className="text-[9px] font-black font-orbitron text-cyan-400 tracking-widest uppercase block mb-1">MY SHOTS SETUP</span>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">Shots</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={myShots} 
                    onChange={e => setMyShots(e.target.value)} 
                    className="w-12 bg-slate-900 text-center text-xs text-white border border-border/60 rounded py-0.5 font-mono font-bold" 
                  />
                </div>
                {errors.myShots && <p className="text-[8px] text-rose-400 mt-0.5">{errors.myShots}</p>}

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">On Target</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={myOnTarget} 
                    onChange={e => setMyOnTarget(e.target.value)} 
                    className="w-12 bg-slate-900 text-center text-xs text-white border border-border/60 rounded py-0.5 font-mono font-bold" 
                  />
                </div>
                {errors.onTarget && <p className="text-[8px] text-rose-400 mt-0.5">{errors.onTarget}</p>}
              </div>

              <div className="space-y-2 pl-2">
                <span className="text-[9px] font-black font-orbitron text-amber-500 tracking-widest uppercase block mb-1">OPPONENT SHOTS</span>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">Shots</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={oppShots} 
                    onChange={e => setOppShots(e.target.value)} 
                    className="w-12 bg-slate-900 text-center text-xs text-white border border-border/60 rounded py-0.5 font-mono font-bold" 
                  />
                </div>
                {errors.oppShots && <p className="text-[8px] text-rose-400 mt-0.5">{errors.oppShots}</p>}

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">On Target</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={oppOnTarget} 
                    onChange={e => setOppOnTarget(e.target.value)} 
                    className="w-12 bg-slate-900 text-center text-xs text-white border border-border/60 rounded py-0.5 font-mono font-bold" 
                  />
                </div>
                {errors.oppOnTarget && <p className="text-[8px] text-rose-400 mt-0.5">{errors.oppOnTarget}</p>}
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-3 bg-rose-500/5 hover:bg-rose-500/10 transition border border-rose-500/10 hover:border-rose-500/20 rounded-xl cursor-pointer" 
              onClick={() => setFeltControlLoss(!feltControlLoss)}
            >
              <div className="space-y-0.5 select-none pr-3">
                <span className="text-[10px] font-black font-orbitron text-rose-400 uppercase block">Momentum Deflection Symptoms</span>
                <span className="text-[9px] text-gray-400 leading-none">Check if players felt sluggish or laggy at key moments</span>
              </div>
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                feltControlLoss ? 'bg-rose-500 border-rose-500 text-slate-950' : 'border-border bg-slate-900'
              }`}>
                {feltControlLoss && <Check className="w-4 h-4 text-slate-950 stroke-[3px]" />}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Match Notes / Custom Findings</label>
              <textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Opponent was attacking fast via wings. Our DM was isolated..." 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2 rounded-xl text-white outline-none focus:border-primary h-20 resize-none" 
              />
              {errors.notes && <p className="text-[8px] text-rose-400 mt-0.5">{errors.notes}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary text-navyBg font-black py-3 rounded-xl font-orbitron uppercase text-xs tracking-wider transition hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10"
            style={{ backgroundImage: `linear-gradient(to right, ${themeAccent}, #a855f7)` }}
          >
            <span>💾 LOG TACTICAL MATCH</span>
          </button>
        </form>

        {/* Right Saved Table Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border/40">
              <h3 className="text-sm font-black font-orbitron text-white">📋 LISTED PERFORMANCE Logs</h3>
              <span className="text-[10px] text-gray-500 font-mono font-bold">TOTAL: {matches.length} MATCHES</span>
            </div>

            {matches.length > 0 ? (
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                <table className="w-full min-w-[550px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 text-[10px] text-gray-400 uppercase tracking-widest font-black font-mono">
                      <th className="px-3 py-3 font-mono">Date</th>
                      <th className="px-3 py-3">Formation</th>
                      <th className="px-3 py-3">Result</th>
                      <th className="px-3 py-3">Opponent</th>
                      <th className="px-3 py-3">Type</th>
                      <th className="px-3 py-3">Control</th>
                      <th className="px-3 py-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs text-gray-300">
                    {matches.map(m => (
                      <tr key={m.id} className="hover:bg-slate-900/30 transition">
                        <td className="px-3 py-3 text-gray-400 whitespace-nowrap font-mono">{m.date}</td>
                        <td className="px-3 py-3 font-black text-primary font-orbitron uppercase" style={{ color: themeAccent }}>{m.myFormation}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black font-orbitron ${
                            m.result === 'W' ? 'bg-emerald-500/15 text-emerald-400' :
                            m.result === 'L' ? 'bg-rose-500/15 text-rose-400' :
                            'bg-gray-800 text-gray-400'
                          }`}>
                            {m.myGoals} - {m.opponentGoals}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-black text-gray-300 font-orbitron uppercase">{m.opponentFormation}</td>
                        <td className="px-3 py-3 text-gray-400 font-bold text-[10px]">{m.matchType}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                            m.feltControlLoss 
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' 
                              : 'bg-slate-800 text-gray-500 border border-border/20'
                          }`}>
                            {m.feltControlLoss ? '⚠️ CONTROL DROP' : '🟢 STEADY'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button 
                            onClick={() => {
                              deleteMatch(m.id);
                            }} 
                            style={{ color: '#f43f5e' }}
                            className="hover:text-rose-500 font-bold transition flex items-center gap-1 ml-auto text-xs bg-slate-900 border border-border/80 p-2 rounded-xl cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center border压缩 border-dashed border-border/40 rounded-xl">
                <p className="text-gray-400 text-sm font-bold">No match reports recorded yet</p>
                <p className="text-xs text-gray-500 mt-1">Use the entry deck on the left to write your first match parameters!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
