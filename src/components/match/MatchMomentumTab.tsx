import React, { useState } from 'react';
import { ShieldAlert, Zap, Radio, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { TRANSLATIONS } from '../../lib/tactics';

export default function MatchMomentumTab() {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Questionnaire States
  const [lagInput, setLagInput] = useState(3); // 1-5 scale (input responsiveness level)
  const [heavyTurn, setHeavyTurn] = useState(false); // players turning slow
  const [aiStiffness, setAiStiffness] = useState(false); // defensive AI positioning porous
  const [woodworkHit, setWoodworkHit] = useState(false); // repeated iron/post hits
  const [solved, setSolved] = useState(false);

  const computeMomentumRating = () => {
    let score = lagInput * 10;
    if (heavyTurn) score += 20;
    if (aiStiffness) score += 25;
    if (woodworkHit) score += 15;
    return Math.min(100, score);
  };

  const score = computeMomentumRating();

  const getDeflectionMitigationAdvice = () => {
    if (score < 30) {
      return {
        level: 'Normal Flow (Balanced)',
        color: '#10b981',
        instructions: [
          'Continue executing your base tactical playstyle without excessive changes.',
          'Utilize traditional lateral overlaps and run overlaps safely.',
          'Focus on timed, delicate final passes to CF slot-holders.'
        ]
      };
    } else if (score < 65) {
      return {
        level: 'Medium Deflection (Middling Inertia)',
        color: '#f59e0b',
        instructions: [
          'De-escalate high counter-pressing. Switch to regular standard depth parameters.',
          'Commit to 2-touch passes; avoid taking unnecessary solo dribbles in midfielders area.',
          'Call individual marking triggers to anchor the DM lines strictly.'
        ]
      };
    } else {
      return {
        level: 'Severe Deflection (Sluggish / Script Active)',
        color: '#ef4444',
        instructions: [
          'Initiate high physical recycling logic. Do not build up directly through central defensive fields.',
          'Apply the deep-defensive line sub-tactic immediately. Narrow your pitch footprint to 35-40 units.',
          'Sub out players whose stamina metrics dropped below 60%. Fresh substitute units run faster and regain control parameters.',
          'Refrain from double-tap team pressing commands. Team pressing during severe latency invites massive spatial holes.'
        ]
      };
    }
  };

  const advice = getDeflectionMitigationAdvice();

  return (
    <div className="space-y-6 select-none font-sans" data-testid="momentum-tab">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-orbitron text-white leading-tight">📡 Momentum Diagnostic Lab</h2>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en'
              ? 'Evaluate spatial rigidities, pass sensitivities, and active game deflection rates'
              : 'شخص معدل ثقل التحركات وتأخر الاستجابة بالملعب لتفادي وتجاوز المشاكل في الأوقات الحاسمة'}
          </p>
        </div>
        <Radio className="w-5 h-5 text-red-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Diagnostic Input Survey */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/40 pb-2">🩺 INPUT DIAGNOSIS</h3>

          <div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-2 font-orbitron">
              <span>Input Responsiveness Delay</span>
              <span className="text-primary font-mono font-black" style={{ color: themeAccent }}>Lvl {lagInput}/5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={lagInput} 
              onChange={e => setLagInput(parseInt(e.target.value) || 3)} 
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
              style={{ accentColor: themeAccent }}
            />
          </div>

          <div className="space-y-2.5">
            <div 
              className="flex items-center justify-between p-3 bg-slate-900/60 border border-border/60 rounded-xl cursor-pointer"
              onClick={() => setHeavyTurn(!heavyTurn)}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-black font-orbitron text-gray-300 uppercase block">Heavy Axis Turns</span>
                <span className="text-[9px] text-gray-500 leading-none">Do players feel like trucks turning?</span>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                heavyTurn ? 'bg-primary border-primary text-slate-950' : 'border-border bg-slate-900'
              }`} style={heavyTurn ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}>
                {heavyTurn && <span className="w-2 h-2 rounded bg-slate-950" />}
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-3 bg-slate-900/60 border border-border/60 rounded-xl cursor-pointer"
              onClick={() => setAiStiffness(!aiStiffness)}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-black font-orbitron text-gray-300 uppercase block">Defensive Gaps</span>
                <span className="text-[9px] text-gray-500 leading-none">Porous defensive lines without triggers</span>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                aiStiffness ? 'bg-primary border-primary text-slate-950' : 'border-border bg-slate-900'
              }`} style={aiStiffness ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}>
                {aiStiffness && <span className="w-2 h-2 rounded bg-slate-950" />}
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-3 bg-slate-900/60 border border-border/60 rounded-xl cursor-pointer"
              onClick={() => setWoodworkHit(!woodworkHit)}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-black font-orbitron text-gray-300 uppercase block">Consecutive Unlucky Shots</span>
                <span className="text-[9px] text-gray-500 leading-none">Hitting woodwork or missing hollow nets</span>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                woodworkHit ? 'bg-primary border-primary text-slate-950' : 'border-border bg-slate-900'
              }`} style={woodworkHit ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}>
                {woodworkHit && <span className="w-2 h-2 rounded bg-slate-950" />}
              </div>
            </div>
          </div>
        </div>

        {/* Right Solved Mitigation Deck */}
        <div className="lg:col-span-7 bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <div className="pb-2 border-b border-border/40 flex items-center justify-between font-orbitron">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">🧬 DIAGNOSTIC CALIBRATION OUTPUTS</h3>
            <span className="text-xs font-black px-2.5 py-0.5 rounded border" style={{ color: advice.color, borderColor: `${advice.color}35`, backgroundColor: `${advice.color}10` }}>
              {advice.level}
            </span>
          </div>

          <div className="space-y-4 font-sans text-xs text-gray-300 leading-normal font-semibold">
            {/* Index Gauge Circle */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 p-4 rounded-xl border border-border/50">
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full border border-dashed border-border/60 shrink-0 select-none">
                <p className="text-xl font-bold font-orbitron text-white">{score}%</p>
              </div>
              <div>
                <span className="text-[9.5px] font-black font-orbitron text-[#ea580c] uppercase block">ACTIVE DEFLECTION index</span>
                <p className="text-xs text-gray-400 leading-normal mt-1 font-semibold">
                  A rating representing physical and spatial interference factors. Higher values specify heavy lag override conditions requiring structured caution gameplay rules.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-[9px] font-black font-orbitron text-cyan-400 tracking-wider block uppercase">📋 ON-FIELD SYSTEM OVERRIDES</span>
              <div className="space-y-2">
                {advice.instructions.map((inst, index) => (
                  <div key={index} className="flex gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-border/45 hover:border-gray-700 transition">
                    <span className="text-primary font-bold" style={{ color: themeAccent }}>#{index + 1}</span>
                    <span className="text-gray-300 text-xs font-semibold">{inst}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
