// src/components/ui/TacticalBoard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, RefreshCw, Sparkles, ShieldCheck, AlertTriangle, Info, Play, Save } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PlayerNode } from '../../types/schemas';
import { FORMATIONS, COORDS, TRANSLATIONS } from '../../lib/tactics';

interface TacticalBoardProps {
  initialFormation?: string;
  onSave?: (formation: string, players: PlayerNode[]) => void;
}

export default function TacticalBoard({ initialFormation = '4-3-3', onSave }: TacticalBoardProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  const customCoords = useAppStore(state => state.customCoords);
  const updateCustomCoords = useAppStore(state => state.updateCustomCoords);

  const [selectedFormation, setSelectedFormation] = useState(initialFormation);
  const [localPlayers, setLocalPlayers] = useState<PlayerNode[]>([]);
  const [selectedPlayerIdx, setSelectedPlayerIdx] = useState<number | null>(null);
  const [activePlayerIdx, setActivePlayerIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<PlayerNode[][]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    problems: string[];
    fixingSteps: string[];
    weaknesses: string[];
    risk: 'Low' | 'Medium' | 'High';
  } | null>(null);

  const pitchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const base = customCoords[selectedFormation] || COORDS[selectedFormation] || COORDS['4-3-3'];
    setLocalPlayers(JSON.parse(JSON.stringify(base)));
    setSelectedPlayerIdx(null);
    setHistory([]);
    setAnalysisResult(null);
  }, [selectedFormation, customCoords]);

  // Handle Dragging
  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    setActivePlayerIdx(idx);
    setSelectedPlayerIdx(idx);
    setHistory(prev => [...prev.slice(-10), JSON.parse(JSON.stringify(localPlayers))]);
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (idx: number, e: React.PointerEvent) => {
    if (activePlayerIdx !== idx || !pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const xVal = ((e.clientX - rect.left) / rect.width) * 100;
    const yVal = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.round(Math.max(4, Math.min(96, xVal)));
    const clampedY = Math.round(Math.max(4, Math.min(96, yVal)));

    setLocalPlayers(prev => {
      const cloned = [...prev];
      cloned[idx] = { ...cloned[idx], x: clampedX, y: clampedY };
      return cloned;
    });
  };

  const handlePointerUp = (idx: number, e: React.PointerEvent) => {
    if (activePlayerIdx === idx) {
      setActivePlayerIdx(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handleRoleChange = (role: string) => {
    if (selectedPlayerIdx === null) return;
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(localPlayers))]);
    setLocalPlayers(prev => {
      const cloned = [...prev];
      cloned[selectedPlayerIdx] = { ...cloned[selectedPlayerIdx], r: role };
      return cloned;
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setLocalPlayers(prev);
    setHistory(old => old.slice(0, -1));
  };

  // 100% Real Coordinate Spacing & Isolated Player AI analysis
  const runAiAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      // Geometry calculations 
      const problems: string[] = [];
      const fixingSteps: string[] = [];
      const weaknesses: string[] = [];
      let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

      // 1. Check isolated attackers (e.g. CF high up, no MF close behind)
      const forwards = localPlayers.filter(p => ['CF', 'SS', 'LWF', 'RWF'].includes(p.r));
      const midfielders = localPlayers.filter(p => ['AMF', 'CMF', 'DMF', 'LMF', 'RMF'].includes(p.r));

      let isolatedForward = false;
      for (const f of forwards) {
        // Find nearest midfielder
        let minDist = 999;
        for (const m of midfielders) {
          const dist = Math.sqrt(Math.pow(f.x - m.x, 2) + Math.pow(f.y - m.y, 2));
          if (dist < minDist) minDist = dist;
        }
        if (minDist > 38) {
          isolatedForward = true;
          problems.push(language === 'ar' 
            ? `المهاجم رأس الحربة (${f.r}) معزول تماماً عن خط الدعم والوسط بمسافة هندسية (${Math.round(minDist)}).`
            : `Attacker (${f.r}) is isolated from supports with coordinate distance gap (${Math.round(minDist)}).`
          );
        }
      }

      // 2. Check exposed flanks (unsupported wings)
      const leftWingers = localPlayers.filter(p => p.x < 24);
      const rightWingers = localPlayers.filter(p => p.x > 76);
      if (leftWingers.length === 0) {
        problems.push(language === 'ar' 
          ? 'الناحية اليسرى خالية كلياً من أجنحة أو أظهرة داعمة لعرض الملعب.' 
          : 'Left wing is completely empty without positional width coverage.'
        );
        weaknesses.push(language === 'ar' ? 'سيعاني فريقك في إيقاف مرتدات الخصم العريضة' : 'Highly exposed to lateral counter outbreaks');
      }
      if (rightWingers.length === 0) {
        problems.push(language === 'ar' 
          ? 'الناحية اليمنى خالية تماماً ولا يوجد تغطية عرضية للأطراف.' 
          : 'Right wing is completely empty without positional width coverage.'
        );
        weaknesses.push(language === 'ar' ? 'الأطراف اليمنى مكشوفة للمهاجمين المندفعين' : 'Flank space is vulnerable on the right');
      }

      // 3. Check giant midfield gaps (distance between DEF and MID)
      const defenders = localPlayers.filter(p => ['CB', 'LB', 'RB', 'DMF'].includes(p.r));
      const highMidfields = localPlayers.filter(p => ['AMF', 'LMF', 'RMF', 'SS', 'CF'].includes(p.r));
      
      let centralGap = true;
      for (const d of defenders) {
        for (const hm of highMidfields) {
          const dist = Math.sqrt(Math.pow(d.x - hm.x, 2) + Math.pow(d.y - hm.y, 2));
          if (dist < 28) {
            centralGap = false;
          }
        }
      }
      if (centralGap && localPlayers.filter(p => p.r === 'DMF' || p.r === 'CMF').length < 2) {
        problems.push(language === 'ar'
          ? 'فجوة واسعة في وسط الملعب (Midfield Link Missing). خط الدفاع متباعد ومنفصل تماماً عن صناعة اللعب.'
          : 'Severe vertical void detected (Missing Midfield Link). Safe transition will fail.'
        );
        weaknesses.push(language === 'ar' ? 'سوف تخسر الكرات الثانية بسهولة ضد الدفاعات المتراصة' : 'Prone to direct tackle turnovers');
      }

      // Pro fixes recommendations based on calculated triggers
      if (isolatedForward) {
        fixingSteps.push(language === 'ar' 
          ? 'أعد وضع صانع لعب AMF أو مهاجم وهمي SS متراجع لدعم رأس الحربة وتسهيل التمريرات البينية.'
          : 'Relocate an AMF closer or downgrade a forward to SS playmaker to create a passing link.'
        );
        riskLevel = 'Medium';
      }
      if (leftWingers.length === 0 || rightWingers.length === 0) {
        fixingSteps.push(language === 'ar'
          ? 'ثبت ظهير الجنب (LB/RB) على التكتيك الدفاعي لتجنب طيرانهم العشوائي وترك الأجنحة خالية.'
          : 'Configure fullback individual instruction to Defensive to maintain minimal side containment.'
        );
        riskLevel = 'High';
      }
      if (centralGap) {
        fixingSteps.push(language === 'ar'
          ? 'طالب لاعباً من الصندوق للصندوق (Box-to-Box) بحرية التحرك وسحب تمركز الارتكاز DMF للأمام.'
          : 'Use an Orchestrator or Box-to-Box dynamic pivot to securely bridge transition.'
        );
      }

      // Default fallback indicators
      if (problems.length === 0) {
        problems.push(language === 'ar' ? 'التوزيع الهندسي مثالي في ميكانيكا الضغط والمسافات البينية.' : 'Calculated node distances indicate ideal space distribution.');
        fixingSteps.push(language === 'ar' ? 'حافظ على هذا التشكيل الهجومي المتزن.' : 'Keep this balanced transition flow intact.');
        riskLevel = 'Low';
      }

      setAnalysisResult({
        problems,
        fixingSteps,
        weaknesses,
        risk: riskLevel
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  const savePositions = () => {
    updateCustomCoords(selectedFormation, localPlayers);
    if (onSave) onSave(selectedFormation, localPlayers);
  };

  const resetPositions = () => {
    const base = COORDS[selectedFormation] || COORDS['4-3-3'];
    setLocalPlayers(JSON.parse(JSON.stringify(base)));
    setHistory([]);
    setAnalysisResult(null);
  };

  const roles = ['GK', 'CB', 'LB', 'RB', 'DMF', 'CMF', 'AMF', 'LMF', 'RMF', 'SS', 'CF', 'LWF', 'RWF'];

  return (
    <div className="space-y-4" data-testid="tactical-board-component">
      {/* Selector & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold">{language === 'ar' ? 'تعديل التشكيل:' : 'Formation:'}</span>
          <select
            value={selectedFormation}
            onChange={(e) => setSelectedFormation(e.target.value)}
            className="bg-slate-950 border border-border/80 px-2 py-1.5 rounded-xl text-xs text-cyan-400 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {FORMATIONS.map(form => (
              <option key={form} value={form}>{form}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-1.5 border border-border bg-slate-950 text-gray-400 disabled:opacity-30 rounded-lg cursor-pointer hover:bg-slate-900 transition"
            title={language === 'ar' ? 'تراجع' : 'Undo step'}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetPositions}
            className="p-1.5 border border-border bg-slate-950 text-gray-400 rounded-lg cursor-pointer hover:bg-slate-900 transition"
            title={language === 'ar' ? 'إعادة تعيين' : 'Reset default'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={savePositions}
            className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-600 font-bold text-slate-950 text-xs rounded-xl flex items-center gap-1 cursor-pointer transition shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'حفظ المواقع' : 'Save board'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pitch canvas */}
        <div className="lg:col-span-2 space-y-2">
          <div 
            ref={pitchRef}
            className="relative bg-gradient-to-b from-green-950 to-emerald-950 border-2 border-emerald-500/30 h-[340px] sm:h-[400px] rounded-3xl overflow-hidden shadow-inner flex items-center justify-center select-none"
          >
            {/* Field cosmetics */}
            <div className="absolute inset-0 border-4 border-white/5 m-3 rounded-2xl pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 border-b border-x border-white/5 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 border-t border-x border-white/5 pointer-events-none" />

            {/* Render Players Circles */}
            {localPlayers.map((p, idx) => {
              const isSelected = selectedPlayerIdx === idx;
              return (
                <div
                  key={idx}
                  onPointerDown={(e) => handlePointerDown(idx, e)}
                  onPointerMove={(e) => handlePointerMove(idx, e)}
                  onPointerUp={(e) => handlePointerUp(idx, e)}
                  className={`absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center cursor-move select-none transition-shadow ${
                    isSelected 
                      ? 'bg-slate-950 text-white border-2' 
                      : 'bg-slate-900/90 text-gray-100 border'
                  }`}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: 'translate(-50%, -50%)',
                    borderColor: isSelected ? themeAccent : '#22d3ee90',
                    boxShadow: isSelected ? `0 0 14px ${themeAccent}` : '0 1px 3px rgba(0,0,0,0.5)',
                    touchAction: 'none'
                  }}
                >
                  <span className="text-[10px] font-black leading-none">{p.r}</span>
                  <span className="text-[7.5px] scale-90 opacity-60 font-mono tracking-tight">{p.x},{p.y}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-500 font-semibold text-center italic">
            💡 {language === 'ar' ? 'اسحب الدوائر لتغيير أماكن اللاعبين على الميدان.' : 'Drag player circles to update coordinates on physical field layout.'}
          </p>
        </div>

        {/* Selected Player Role Setting & AI Advisor */}
        <div className="space-y-4">
          {/* Role selector panel */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-border/80 space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">
              {language === 'ar' ? '⚙️ تهيئة مركز اللاعب المختار' : '⚙️ Selected Node Parameters'}
            </h4>
            {selectedPlayerIdx !== null ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-900/60 px-3 py-2 rounded-xl">
                  <span className="text-xs font-bold text-gray-300">
                    {language === 'ar' ? `اللاعب النقطي #${selectedPlayerIdx + 1}` : `Node #${selectedPlayerIdx + 1}`}
                  </span>
                  <span className="text-xs font-mono font-black" style={{ color: themeAccent }}>
                    {localPlayers[selectedPlayerIdx].r} ({localPlayers[selectedPlayerIdx].x}%, {localPlayers[selectedPlayerIdx].y}%)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {roles.map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`py-1 rounded-lg text-[9px] font-black border uppercase transition cursor-pointer select-none ${
                        localPlayers[selectedPlayerIdx]?.r === role
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                          : 'bg-slate-950 hover:bg-slate-900 text-gray-400 border-border/80'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-semibold italic text-center py-4">
                {language === 'ar' ? 'اضغط على أي لاعب على السبورة لتعديل دوره أو مركزه التكتيكي.' : 'Click any player circle to configure specialized role settings.'}
              </p>
            )}
          </div>

          {/* AI Analysis trigger */}
          <div className="space-y-2">
            <button
              onClick={runAiAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 shadow cursor-pointer transition-all border-none"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{language === 'ar' ? 'جاري الفحص الموقعي بالمنطق...' : 'Calculating Position Gaps...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                  <span>{language === 'ar' ? 'فحص ثغرات السبورة بالذكاء الاصطناعي' : 'Board AI Space Inspection'}</span>
                </>
              )}
            </button>

            {analysisResult && (
              <div className="bg-slate-900/70 rounded-2xl border border-border/80 p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    {language === 'ar' ? 'نتائج الفحص والتحليل الموقعي' : 'Inspection Diagnosis'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    analysisResult.risk === 'High' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                      : analysisResult.risk === 'Medium' 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {language === 'ar' ? `الخلل: ${analysisResult.risk}` : `Risk: ${analysisResult.risk}`}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-black text-rose-400 flex items-center gap-1 leading-none">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'الثغرات المكتشفة:' : 'Identified space problems:'}</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-gray-300 font-semibold text-right rtl:text-right leading-relaxed">
                      {analysisResult.problems.map((prob, i) => (
                        <li key={i} className="text-[11.5px]">{prob}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/30">
                    <span className="text-[10px] uppercase font-black text-cyan-400 flex items-center gap-1 leading-none">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تعليمات الإصلاح المقترحة:' : 'Recommended adjustments:'}</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-gray-300 font-semibold leading-relaxed">
                      {analysisResult.fixingSteps.map((step, i) => (
                        <li key={i} className="text-[11px]">{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
