import React, { useState } from 'react';
import { Brain, Sparkles, AlertCircle, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { analyzeTacticsWithAI, AIAnalysisResponse } from '../../lib/api';
import { AIResponseSchema } from '../../types/schemas';
import { FORMATIONS, TRANSLATIONS } from '../../lib/tactics';

export default function TacticsAICoachTab() {
  const addAiHistory = useAppStore(state => state.addAiHistory);
  const aiHistory = useAppStore(state => state.aiHistory);
  const clearAiHistory = useAppStore(state => state.clearAiHistory);
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Form states
  const [userFormation, setUserFormation] = useState('4-3-3');
  const [opponentFormation, setOpponentFormation] = useState('4-2-2-2');
  const [score, setScore] = useState('1-2');
  const [possession, setPossession] = useState(48);
  const [shots, setShots] = useState(7);
  const [shotsOnTarget, setShotsOnTarget] = useState(3);
  const [passAccuracy, setPassAccuracy] = useState(82);
  const [problem, setProblem] = useState('conceding counters');
  const [notes, setNotes] = useState('');

  // Execution states
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysisResponse | null>(null);

  const triggerAICoach = async () => {
    setLoading(true);
    setErrorText('');
    setCurrentAnalysis(null);

    const requestPayload = {
      userFormation,
      opponentFormation,
      score,
      possession,
      shots,
      shotsOnTarget,
      passAccuracy,
      problem,
      notes: notes.trim()
    };

    try {
      const response = await analyzeTacticsWithAI(requestPayload);

      // Validate & Try Repair if required
      let validatedResponse: any = null;
      const parseResult = AIResponseSchema.safeParse(response);
      
      if (parseResult.success) {
        validatedResponse = parseResult.data;
      } else {
        console.warn('Backend returned data of divergent format, attempting to repair JSON properties:', parseResult.error);
        // Repair/normalise safely
        validatedResponse = {
          summary: response.summary || 'Analytical diagnostic could not be synthesized into expected formats. Review core statistics.',
          weaknesses: Array.isArray(response.weaknesses) ? response.weaknesses : ['Lax spatial tracking'],
          strengths: Array.isArray(response.strengths) ? response.strengths : ['Reasonable team build-up speeds'],
          recommendedFormation: response.recommendedFormation || '4-1-4-1',
          counterInstructions: Array.isArray(response.counterInstructions) ? response.counterInstructions : ['Maintain structural positioning'],
          subTactics: Array.isArray(response.subTactics) ? response.subTactics : ['Deploy low block options'],
          riskLevel: ['Low', 'Medium', 'High'].includes(response.riskLevel) ? response.riskLevel : 'Medium'
        };
      }

      setCurrentAnalysis(validatedResponse);
      
      // Save to Zustand History Stack
      addAiHistory(requestPayload, validatedResponse);

    } catch (err: any) {
      console.error('Critical neural diagnostic failure:', err);
      setErrorText(err.message || 'Server communication drop. Please review network configs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="ai-coach-tab">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-orbitron text-white leading-tight">🤖 {t('tactics_generator')}</h2>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en'
              ? 'Submit match statistics into the serverless Gemini neural node to derive core tactical alignments'
              : 'أرسل بيانات المباراة بالتفصيل إلى وحدة جيمني للمعالجة، لتحصل على إرشادات تكتيكية للرد على الثغرات'}
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl text-primary font-orbitron font-extrabold text-[10px] tracking-wide animate-pulse" style={{ color: themeAccent, borderColor: `${themeAccent}30` }}>
          SECURE ENDPOINT
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Input Deck */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <div className="border-b border-border/40 pb-2">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest">🧠 SEED DECK STATISTICS</h3>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">My Formation</label>
              <select 
                value={userFormation} 
                onChange={e => setUserFormation(e.target.value)} 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary font-orbitron font-bold"
              >
                {FORMATIONS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Opponent Formation</label>
              <select 
                value={opponentFormation} 
                onChange={e => setOpponentFormation(e.target.value)} 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary font-orbitron font-bold"
              >
                {FORMATIONS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Scoreline</label>
              <input 
                type="text" 
                value={score} 
                onChange={e => setScore(e.target.value)} 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 font-mono text-white text-center rounded-xl outline-none focus:border-primary font-bold" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Possession %</label>
              <input 
                type="number" 
                min="15" 
                max="85" 
                value={possession} 
                onChange={e => setPossession(parseInt(e.target.value) || 50)} 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 font-mono text-white text-center rounded-xl outline-none focus:border-primary font-bold" 
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[9px] font-bold text-center text-gray-400 uppercase mb-1 font-orbitron">Pass Accuracy %</label>
              <input 
                type="number" 
                min="30" 
                max="100" 
                value={passAccuracy} 
                onChange={e => setPassAccuracy(parseInt(e.target.value) || 80)} 
                className="w-full text-center bg-slate-900 border border-border/60 text-xs py-2 rounded-lg text-white font-mono font-bold outline-none" 
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-center text-gray-400 uppercase mb-1 font-orbitron">Shots</label>
              <input 
                type="number" 
                min="0" 
                value={shots} 
                onChange={e => setShots(parseInt(e.target.value) || 0)} 
                className="w-full text-center bg-slate-900 border border-border/60 text-xs py-2 rounded-lg text-white font-mono font-bold outline-none" 
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-center text-gray-400 uppercase mb-1 font-orbitron">On Target</label>
              <input 
                type="number" 
                min="0" 
                value={shotsOnTarget} 
                onChange={e => setShotsOnTarget(parseInt(e.target.value) || 0)} 
                className="w-full text-center bg-slate-900 border border-border/60 text-xs py-2 rounded-lg text-white font-mono font-bold outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Major Tactical Sickness</label>
            <select 
              value={problem} 
              onChange={e => setProblem(e.target.value)} 
              className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-primary font-bold"
            >
              <option value="conceding counters">Conceding counters via wings</option>
              <option value="losing midfield">Losing midfield control lines</option>
              <option value="no finishing">Lack of finishing / missing post</option>
              <option value="weak wings">Fragile lateral wing coverage</option>
              <option value="slow build-up">Sluggish spacing transition blocks</option>
              <option value="bad defense">Porous backline / header weakness</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Tactical Notes</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              placeholder="Explain specific details like 'They subbed in dynamic players' or 'GK is saving headers'..." 
              className="w-full bg-slate-900 border border-border/70 text-xs px-3 py-2 rounded-xl text-white outline-none focus:border-primary h-16 resize-none" 
            />
          </div>

          <button 
            type="button" 
            onClick={triggerAICoach}
            disabled={loading}
            className={`w-full text-navyBg font-black py-3 rounded-xl font-orbitron uppercase text-xs tracking-wider transition ${
              loading ? 'bg-zinc-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-400 to-teal-500 hover:brightness-110 cursor-pointer shadow-lg'
            }`}
            style={!loading ? { backgroundImage: `linear-gradient(to right, ${themeAccent}, #10b981)` } : {}}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                <span>CONTRACTING GEMINI ADVISOR...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <Brain className="w-4.5 h-4.5" />
                <span>{language === 'en' ? 'COMPILE NEURAL DIAGNOSTICS' : 'طلب التحليل من جيمني'}</span>
              </span>
            )}
          </button>
        </div>

        {/* Right Output Deck */}
        <div className="lg:col-span-7 space-y-4">
          {errorText && (
            <div className="bg-rose-950/90 border border-rose-500/30 text-rose-200 p-4 rounded-2xl text-xs font-semibold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <div>
                <p className="font-bold uppercase tracking-widest font-orbitron">{language === 'en' ? 'Neural Link Error' : 'خطأ في الربط والتشخيص'}</p>
                <p className="mt-1">{errorText}</p>
              </div>
            </div>
          )}

          {currentAnalysis ? (
            <div className="bg-[#0b0f19]/70 border border-border p-5 rounded-2xl shadow-md space-y-4 animate-fadeIn">
              <div className="border-b border-border/40 pb-2 flex justify-between items-center">
                <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Diagnostic Response
                </h3>
                <span className={`text-[9px] font-black font-orbitron px-2 py-0.5 rounded ${
                  currentAnalysis.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-400' :
                  currentAnalysis.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {currentAnalysis.riskLevel} Risk Index
                </span>
              </div>

              <div className="text-xs leading-relaxed text-gray-300 bg-slate-900/60 p-4 rounded-xl border border-border/30 font-semibold">
                {currentAnalysis.summary}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-border/30 space-y-2">
                  <span className="text-[9px] font-black font-orbitron text-rose-400 tracking-wider block uppercase">Detected Blind-spots</span>
                  <ul className="list-disc pl-4 text-[11px] text-gray-400 leading-relaxed font-semibold space-y-1">
                    {currentAnalysis.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
                  </ul>
                </div>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-border/30 space-y-2">
                  <span className="text-[9px] font-black font-orbitron text-emerald-400 tracking-wider block uppercase">Tactical Merits</span>
                  <ul className="list-disc pl-4 text-[11px] text-gray-400 leading-relaxed font-semibold space-y-1">
                    {currentAnalysis.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/15 rounded-xl">
                <span className="text-[10px] font-black font-orbitron text-emerald-400 uppercase tracking-widest">Recommended Meta-counter setup</span>
                <span className="text-xs font-black font-orbitron text-emerald-200 bg-emerald-950 px-3 py-1 rounded border border-emerald-500/30 font-bold uppercase">{currentAnalysis.recommendedFormation}</span>
              </div>

              <div className="space-y-3.5 text-xs text-gray-300 font-semibold">
                <div className="p-3.5 bg-slate-900/40 rounded-xl border border-border/50 space-y-1">
                  <span className="text-[9px] font-black font-orbitron text-primary uppercase tracking-wider block">Special Player Roles & Assignments</span>
                  <ul className="list-decimal pl-4 space-y-1 text-gray-400 text-[11px]">
                    {currentAnalysis.counterInstructions.map((ci, idx) => <li key={idx}>{ci}</li>)}
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-900/40 rounded-xl border border-border/50 space-y-1">
                  <span className="text-[9px] font-black font-orbitron text-amber-400 uppercase tracking-wider block">Specific Sub-tactics instructions</span>
                  <ul className="list-decimal pl-4 space-y-1 text-gray-400 text-[11px]">
                    {currentAnalysis.subTactics.map((st, idx) => <li key={idx}>{st}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-border/80 p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-3">
              <Brain className="w-12 h-12 text-gray-600 animate-pulse" />
              <div>
                <p className="text-gray-400 text-sm font-bold">{language === 'en' ? 'Awaiting Diagnostic Parameters' : 'بانتظار إحصائيات المباراة لتشخيصها'}</p>
                <p className="text-xs text-gray-500 mt-1">{language === 'en' ? 'Press compile to route parameters securely to Gemini servers.' : 'اضغط على تفعيل التحليل لإرسال الإحصائيات وبدأ التحليل الفني لثغرات خطتك.'}</p>
              </div>
            </div>
          )}

          {/* AI History Logs view */}
          {aiHistory.length > 0 && (
            <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-3 select-none">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="text-xs font-black font-orbitron text-gray-300 uppercase tracking-wider">🗄️ PERSISTED ADVISORY HISTORY ({aiHistory.length})</span>
                <button 
                  onClick={clearAiHistory}
                  className="text-[9px] text-rose-455 hover:text-rose-400 font-bold border border-rose-500/20 bg-rose-500/5 px-2 py-1 rounded transition cursor-pointer"
                >
                  Clear History
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {aiHistory.map(hist => (
                  <div 
                    key={hist.id} 
                    onClick={() => {
                      setCurrentAnalysis(hist.response);
                      setUserFormation(hist.request.userFormation);
                      setOpponentFormation(hist.request.opponentFormation);
                      setScore(hist.request.score);
                      setPossession(hist.request.possession);
                      setShots(hist.request.shots);
                      setShotsOnTarget(hist.request.shotsOnTarget);
                      setPassAccuracy(hist.request.passAccuracy);
                      setProblem(hist.request.problem);
                    }}
                    className="p-3 bg-slate-900/50 hover:bg-slate-900 border border-border/50 hover:border-gray-600 transition p-2.5 rounded-xl text-[11px] font-semibold text-gray-400 flex justify-between items-center cursor-pointer"
                  >
                    <span>{hist.request.userFormation} vs {hist.request.opponentFormation} • Weakness: <b className="text-[#00d4ff]">{hist.request.problem}</b></span>
                    <span className="text-[9px] font-mono text-gray-500">{new Date(hist.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
