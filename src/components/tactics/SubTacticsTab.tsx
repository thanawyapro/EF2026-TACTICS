import React, { useState } from 'react';
import { Sliders, Zap, ShieldAlert, Award } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { FORMATIONS, TRANSLATIONS } from '../../lib/tactics';

export default function SubTacticsTab() {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const [subForm, setSubForm] = useState('4-3-3');
  const [subPlay, setSubPlay] = useState('Counter Attack');
  const [subProb, setSubProb] = useState('losing midfield');

  const getSubTacticsSolution = () => {
    switch(subProb) {
      case 'losing midfield':
        return {
          off: 'Turn on Tiki-Taka. Assign centremost attackers to False 9 or deep support role loops.',
          def: 'Switch to a narrow defensive shape. Apply a high central trap line.',
          sub: 'Replace a tired winger with a physically robust Box-to-Box CMF around min 60.',
          warn: 'Avoid direct long vertical passes through the center. Shift play to wide areas.'
        };
      case 'conceding counters':
        return {
          off: 'Anchor fullbacks (LB/RB) to stay deep. Turn on Early Cross parameters.',
          def: 'Deploy the Deep Defensive Line sub-tactic immediately. Minimize pressing rate parameters.',
          sub: 'Infuse a fast defender with high physical and sprint parameters at min 70.',
          warn: 'Do not trigger your center backs (CBs) to rush up under high defensive lines.'
        };
      case 'no finishing':
        return {
          off: 'Activate Wing Overload parameters. Assign wingers to Roaming Winger roles to slice the penalty box.',
          def: 'Apply heavy counters on high-tempo transition paths.',
          sub: 'Introduce a Super-sub Goal Poacher CF to challenge aerial duel segments at min 65.',
          warn: 'Avoid crossing from deep angles if opponent deploy a 3-CB fortress setup.'
        };
      case 'weak wings':
        return {
          off: 'Turn on Inverted Fullbacks and feed passing lines diagonally via central playmakers.',
          def: 'Tight-mark the opponent wide wingers. Instruct central DMFs to drift outwards.',
          sub: 'Deploy fresh lateral fullbacks with high stamina metrics under min 65.',
          warn: 'Do not allow opponents to establish lateral isolation with a single central defender.'
        };
      case 'slow build-up':
        return {
          off: 'Turn on 1-Touch Pass parameters. Switch transition paths from central to wide wing blocks.',
          def: 'Apply high counter-pressing. Trap immediately upon turnover fields.',
          sub: 'Deploy an agile, creative playmaker inside the AMF area under min 60.',
          warn: 'Do not recycle the ball slowly across CB lines. Speed up the physical key triggers.'
        };
      default:
        return {
          off: 'Keep positions compact. Turn on Tiki-Taka.',
          def: 'Apply deep defensive layers, narrow structure.',
          sub: 'Sub in stamina-heavy midfielders min 70.',
          warn: 'Do not overload frontlines blindly.'
        };
    }
  };

  const sol = getSubTacticsSolution();

  return (
    <div className="space-y-6 select-none font-sans" data-testid="sub-tactics-tab">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black font-orbitron text-white leading-tight">🛠️ {t('sub_tactics')}</h2>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'en'
            ? 'Diagnose on-pitch weaknesses and synthesize dynamic defensive/offensive directions'
            : 'تشخيص وتعديل خطوت اللعب والارتكاز بالربط بين الدفاع والهجوم وعلاج ثغرات الهجمات المرتدة'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Parameters Selectors Block */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest mb-1 pb-2 border-b border-border/40">🛠️ INPUT PARAMETERS</h3>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Active Setup Formation</label>
            <select 
              value={subForm} 
              onChange={e => setSubForm(e.target.value)} 
              className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary font-orbitron font-bold"
            >
              {FORMATIONS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Playstyle Alignment</label>
            <select 
              value={subPlay} 
              onChange={e => setSubPlay(e.target.value)} 
              className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary font-bold"
            >
              <option>Counter Attack</option>
              <option>Possession</option>
              <option>Long Ball Overload</option>
              <option>High Press</option>
              <option>Park the Bus</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Primary Threat Faced</label>
            <select 
              value={subProb} 
              onChange={e => setSubProb(e.target.value)} 
              className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary font-bold animate-pulse"
              style={{ borderColor: `${themeAccent}40` }}
            >
              <option value="losing midfield">Losing midfield lines / possession</option>
              <option value="conceding counters">Conceding speedy counters</option>
              <option value="no finishing">Lack of finishing & box control</option>
              <option value="weak wings">Wing attacks leakage</option>
              <option value="slow build-up">Sluggish transition speed</option>
            </select>
          </div>
        </div>

        {/* Diagnostic Solutions Panel */}
        <div className="lg:col-span-7 bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <div className="pb-2 border-b border-border/40 flex items-center justify-between">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest">🧬 CALIBRATED MITIGATION DIRECTIONS</h3>
            <span className="text-[9px] text-[#00d4ff] bg-[#00d4ff]/10 px-2 py-0.5 rounded font-black font-mono border border-cyan-500/25 select-none" style={{ color: themeAccent, borderColor: `${themeAccent}30` }}>STANDARDS APPROVED</span>
          </div>

          <div className="space-y-4 text-xs text-gray-300 leading-relaxed font-semibold">
            <div className="p-3.5 bg-slate-900 border border-border/50 rounded-xl space-y-1 hover:border-emerald-500/30 transition-all">
              <span className="text-[8.5px] font-black font-orbitron text-[#10b981] uppercase tracking-wider block">⚔️ ATTACKING VARIANCE STRATEGY</span>
              <span>{sol.off}</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-border/50 rounded-xl space-y-1 hover:border-rose-500/30 transition-all">
              <span className="text-[8.5px] font-black font-orbitron text-rose-400 uppercase tracking-wider block">🛡️ DEFENSIVE COMPACT OVERRIDE</span>
              <span>{sol.def}</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-border/50 rounded-xl space-y-1 hover:border-amber-500/30 transition-all">
              <span className="text-[8.5px] font-black font-orbitron text-amber-500 uppercase tracking-wider block">🔄 TIMED REPLACEMENT SEQUENCE</span>
              <span>{sol.sub}</span>
            </div>

            <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1.5">
              <span className="text-[8.5px] font-black font-orbitron text-rose-400 uppercase tracking-wider block">⚠️ ON-FIELD CRITICAL CAVEAT</span>
              <span className="text-[11px] font-bold text-gray-400">{sol.warn}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
