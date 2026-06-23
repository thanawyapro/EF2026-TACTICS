// src/components/tactics/TacticsAICoachTab.tsx
import React, { useState } from 'react';
import { Brain, Sparkles, AlertCircle, RefreshCw, Layers, CheckCircle2, Sliders } from 'lucide-react';
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

  // Simplified MVP inputs only
  const [userFormation, setUserFormation] = useState('4-3-3');
  const [opponentFormation, setOpponentFormation] = useState('4-2-2-2');
  const [matchResult, setMatchResult] = useState<'W' | 'L' | 'D'>('L');
  const [problem, setProblem] = useState('conceding counters via wings');

  // Progressive disclosure: Advanced options hidden by default
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Optional fields
  const [possession, setPossession] = useState(48);
  const [shots, setShots] = useState(7);
  const [shotsOnTarget, setShotsOnTarget] = useState(3);
  const [passAccuracy, setPassAccuracy] = useState(82);
  const [notes, setNotes] = useState('');

  // Execution states
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysisResponse | null>(null);

  const triggerAICoach = async () => {
    setLoading(true);
    setErrorText('');
    setCurrentAnalysis(null);

    const scorePlaceholder = matchResult === 'W' ? '2-1' : matchResult === 'D' ? '1-1' : '1-2';

    const requestPayload = {
      userFormation,
      opponentFormation,
      score: scorePlaceholder,
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
        validatedResponse = {
          summary: response.summary || 'Analytical diagnostic completed. Avoid aggressive pass lines.',
          weaknesses: Array.isArray(response.weaknesses) ? response.weaknesses : ['Lax spatial tracking'],
          strengths: Array.isArray(response.strengths) ? response.strengths : ['Reasonable team build-up speeds'],
          recommendedFormation: response.recommendedFormation || '4-1-4-1',
          counterInstructions: Array.isArray(response.counterInstructions) ? response.counterInstructions : ['Maintain structural positioning'],
          subTactics: Array.isArray(response.subTactics) ? response.subTactics : ['Deploy low block options'],
          riskLevel: ['Low', 'Medium', 'High'].includes(response.riskLevel) ? response.riskLevel : 'Medium'
        };
      }

      setCurrentAnalysis(validatedResponse);
      addAiHistory(requestPayload, validatedResponse);

    } catch (err: any) {
      console.error('Critical neural diagnostic failure:', err);
      setErrorText(err.message || 'Unable to connect to coach servers. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const problemOptions = [
    { value: 'conceding counters via wings', labelEn: 'Conceding counters via wings', labelAr: 'بستقبل مرتدات من الأطราف' },
    { value: 'losing midfield control lines', labelEn: 'Losing midfield control lines', labelAr: 'بخسر نص الملعب والسيطرة' },
    { value: 'lack of finishing', labelEn: 'Lack of finishing / missing chances', labelAr: 'مش بعرف أوصل للمرمى أو أسجل' },
    { value: 'isolated strike forward', labelEn: 'Isolated target strike forward', labelAr: 'المهاجم معزول لوحده تماماً' },
    { value: 'leaky backline gaps', labelEn: 'Porous backline / header gaps', labelAr: 'الدفاع بيتفتح بسهولة وفيه مساحات' }
  ];

  return (
    <div className="space-y-6 select-none font-sans" data-testid="analyze-match-tab">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-orbitron text-white leading-tight">
            📊 {language === 'en' ? 'Analyze Match' : 'حلّل ماتشك'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en'
              ? 'Enter simple match info to receive clear tactical advice from your coach.'
              : 'اكتب اللي حصل في مباراتك الأخيرة عشان تاخد نصيحة تكتيكية جاهزة.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Input Deck */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <div className="border-b border-border/40 pb-2">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest">📋 MATCH OUTLINE</h3>
          </div>

          {/* Formations selection */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 font-orbitron">My Formation</label>
              <select 
                value={userFormation} 
                onChange={e => setUserFormation(e.target.value)} 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-cyan-400 font-orbitron font-bold cursor-pointer"
              >
                {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <span className="text-[9px] text-gray-500 block mt-1">{language === 'en' ? 'e.g. 4-3-3' : 'مثال: 3-3-4'}</span>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 font-orbitron">Opponent Formation</label>
              <select 
                value={opponentFormation} 
                onChange={e => setOpponentFormation(e.target.value)} 
                className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-cyan-400 font-orbitron font-bold cursor-pointer"
              >
                {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <span className="text-[9px] text-gray-500 block mt-1">{language === 'en' ? 'e.g. 4-2-2-2' : 'مثال: 2-2-2-4'}</span>
            </div>
          </div>

          {/* Match results buttons */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest font-orbitron">Result</label>
            <div className="flex gap-2">
              {[
                { key: 'W', labelAr: 'فوز (W)', labelEn: 'Win (W)', color: 'border-emerald-500/45 text-emerald-400' },
                { key: 'D', labelAr: 'تعادل (D)', labelEn: 'Draw (D)', color: 'border-amber-500/45 text-amber-400' },
                { key: 'L', labelAr: 'خسارة (L)', labelEn: 'Loss (L)', color: 'border-rose-500/45 text-rose-400' }
              ].map(res => (
                <button
                  key={res.key}
                  type="button"
                  onClick={() => setMatchResult(res.key as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    matchResult === res.key
                      ? 'bg-slate-900 border-l-4 font-black'
                      : 'bg-slate-950/20 border-border/50 text-gray-400'
                  }`}
                  style={matchResult === res.key ? { borderColor: themeAccent, color: themeAccent } : {}}
                >
                  {language === 'en' ? res.labelEn : res.labelAr}
                </button>
              ))}
            </div>
          </div>

          {/* Sickness selection */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest font-orbitron">Main Problem</label>
            <select 
              value={problem} 
              onChange={e => setProblem(e.target.value)} 
              className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-cyan-400 font-bold cursor-pointer"
            >
              {problemOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {language === 'en' ? opt.labelEn : opt.labelAr}
                </option>
              ))}
            </select>
          </div>

          {/* Progressive disclosure hidden by default */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[11px] font-black font-orbitron text-gray-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" style={{ color: themeAccent }} />
              <span>{showAdvanced 
                ? (language === 'en' ? '[- Hide More Details]' : '[- إخفاء التفاصيل المتقدمة]') 
                : (language === 'en' ? '[+ Add More Details]' : '[+ إضافة تفاصيل اختيارية]')}</span>
            </button>

            {showAdvanced && (
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-border/40 text-xs">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Possession (%)</label>
                    <input 
                      type="number" 
                      min="15" 
                      max="85" 
                      value={possession}
                      onChange={e => setPossession(parseInt(e.target.value) || 50)}
                      className="w-full bg-slate-900 border border-border/60 rounded-xl py-2 px-3 text-white font-mono text-center font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Pass Accuracy (%)</label>
                    <input 
                      type="number" 
                      min="30" 
                      max="100" 
                      value={passAccuracy}
                      onChange={e => setPassAccuracy(parseInt(e.target.value) || 80)}
                      className="w-full bg-slate-900 border border-border/60 rounded-xl py-2 px-3 text-white font-mono text-center font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Shots</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={shots}
                      onChange={e => setShots(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-border/60 rounded-xl py-2 px-3 text-white font-mono text-center font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Shots on Target</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={shotsOnTarget}
                      onChange={e => setShotsOnTarget(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-border/60 rounded-xl py-2 px-3 text-white font-mono text-center font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Match Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Describe extra observations like keeper failures..."
                    className="w-full bg-slate-900 border border-border/60 rounded-xl py-2 px-3 text-white h-16 resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button 
            type="button" 
            onClick={triggerAICoach}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-navyBg font-black font-orbitron uppercase text-xs tracking-wider transition ${
              loading ? 'bg-zinc-700 text-gray-400 cursor-not-allowed animate-pulse' : 'hover:brightness-110 cursor-pointer shadow-lg'
            }`}
            style={!loading ? { backgroundColor: themeAccent } : {}}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{language === 'en' ? 'CONSULTING COACH...' : 'جاري فحص المباراة...'}</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <Brain className="w-4.5 h-4.5" />
                <span>{language === 'en' ? 'ANALYZE NOW' : 'حلّل المباراة الآن'}</span>
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
                <p className="font-bold uppercase tracking-widest font-orbitron">{language === 'en' ? 'Link Error' : 'حدث خطأ في الاتصال'}</p>
                <p className="mt-1">{errorText}</p>
              </div>
            </div>
          )}

          {currentAnalysis ? (
            <div className="bg-[#0b0f19]/70 border border-border p-5 rounded-2xl shadow-md space-y-4 animate-fadeIn select-text">
              <div className="border-b border-border/40 pb-2 flex justify-between items-center">
                <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> 
                  <span>{language === 'en' ? 'COACH ANALYSIS ADVICE' : 'نصائح وتوجيهات الكابتن'}</span>
                </h3>
                <span className={`text-[9px] font-black font-orbitron px-2 py-0.5 rounded ${
                  currentAnalysis.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {currentAnalysis.riskLevel} {language === 'en' ? 'Risk level' : 'مستوى الخطورة'}
                </span>
              </div>

              {/* Actionable items */}
              <div className="text-xs leading-relaxed text-gray-300 bg-slate-900/60 p-4 rounded-xl border border-border/30 font-semibold">
                {currentAnalysis.summary}
              </div>

              <div className="bg-slate-900/40 p-4 rounded-xl border border-border/30 space-y-2">
                <span className="text-[10px] font-black font-orbitron text-rose-450 tracking-wider block uppercase">🚨 {language === 'en' ? 'WEAK SPOTS DETECTED' : 'ثغرات تكتيكية مكتشفة'}</span>
                <div className="space-y-1.5 pt-0.5">
                  {currentAnalysis.weaknesses.map((w, idx) => (
                    <div key={idx} className="text-xs font-semibold text-gray-300 bg-slate-950/20 px-3 py-1.5 rounded-lg border border-rose-500/5">
                      • {w}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/40 p-4 rounded-xl border border-border/30 space-y-2">
                <span className="text-[10px] font-black font-orbitron text-emerald-400 tracking-wider block uppercase">💡 {language === 'en' ? 'PROPOSED SQUAD CORRECTIONS' : 'خطوات الإصلاح الفوري بالخطة'}</span>
                <div className="space-y-1.5 pt-0.5">
                  {currentAnalysis.counterInstructions.map((ci, idx) => (
                    <div key={idx} className="text-xs font-semibold text-gray-300 bg-slate-950/20 px-3 py-1.5 rounded-lg border border-emerald-500/5">
                      ✓ {ci}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended formation */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/15 rounded-xl">
                <span className="text-[10px] font-black font-orbitron text-emerald-400 uppercase tracking-widest">{language === 'en' ? 'REMEDY FORMATION PRESET' : 'التشكيل الأنسب للتصحيح'}</span>
                <span className="text-xs font-black font-orbitron text-emerald-200 bg-emerald-950 px-3 py-1 rounded border border-emerald-500/30 font-bold uppercase">{currentAnalysis.recommendedFormation}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-border/80 p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-3">
              <Brain className="w-12 h-12 text-gray-600 animate-pulse" />
              <div>
                <p className="text-gray-400 text-sm font-bold">{language === 'en' ? 'Awaiting Match Parameters' : 'بانتظار إحصائيات مباراتك للتشخيص'}</p>
                <p className="text-xs text-gray-500 mt-1">{language === 'en' ? 'Configure form on left and hit analyze button.' : 'حدد خيارات خطتك ومشكلتك وسينتج تطبيق المدرب علاجات تكتيكية مباشرة.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
