import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Undo2, RefreshCw, Layers, ShieldCheck, Share2, Copy, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PlayerNode } from '../../types/schemas';
import { FORMATIONS, COORDS, TRANSLATIONS } from '../../lib/tactics';

export default function CustomFormationTab() {
  const customCoords = useAppStore(state => state.customCoords);
  const updateCustomCoords = useAppStore(state => state.updateCustomCoords);
  const resetCustomCoords = useAppStore(state => state.resetCustomCoords);
  const resetAllCustomCoords = useAppStore(state => state.resetAllCustomCoords);
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [localPlayers, setLocalPlayers] = useState<PlayerNode[]>([]);
  const [selectedPlayerIdx, setSelectedPlayerIdx] = useState<number | null>(null);
  const [activePlayerIdx, setActivePlayerIdx] = useState<number | null>(null);

  // Sharing states
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Undo memory stack
  const [history, setHistory] = useState<PlayerNode[][]>([]);
  const dragStartRef = useRef<PlayerNode[] | null>(null);
  const hasDraggedRef = useRef(false);

  const pitchRef = useRef<HTMLDivElement | null>(null);

  // Preload coordinates with a deep clone
  useEffect(() => {
    const base = customCoords[selectedFormation] || COORDS[selectedFormation] || COORDS['4-3-3'];
    setLocalPlayers(JSON.parse(JSON.stringify(base)));
    setSelectedPlayerIdx(null);
    setHistory([]);
  }, [selectedFormation, customCoords]);

  const pushToHistory = (stateToPush = localPlayers) => {
    setHistory(prev => [...prev.slice(-19), JSON.parse(JSON.stringify(stateToPush))]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setLocalPlayers(previous);
    setHistory(prev => prev.slice(0, -1));
  };

  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    setActivePlayerIdx(idx);
    setSelectedPlayerIdx(idx);
    dragStartRef.current = JSON.parse(JSON.stringify(localPlayers));
    hasDraggedRef.current = false;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch(err){}
  };

  const handlePointerMove = (idx: number, e: React.PointerEvent) => {
    if (activePlayerIdx !== idx || !pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const xVal = ((e.clientX - rect.left) / rect.width) * 100;
    const yVal = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.round(Math.max(2, Math.min(98, xVal)));
    const clampedY = Math.round(Math.max(2, Math.min(98, yVal)));

    hasDraggedRef.current = true;

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
      } catch(err){}

      if (hasDraggedRef.current && dragStartRef.current) {
        pushToHistory(dragStartRef.current);
      }
      dragStartRef.current = null;
      hasDraggedRef.current = false;
    }
  };

  const handleRoleChange = (idx: number, newRole: string) => {
    pushToHistory();
    setLocalPlayers(prev => {
      const cloned = [...prev];
      cloned[idx] = { ...cloned[idx], r: newRole };
      return cloned;
    });
  };

  const revertSelectedPlayerPosition = () => {
    if (selectedPlayerIdx === null) return;
    const defaultSuite = COORDS[selectedFormation] || COORDS['4-3-3'];
    const defaultPt = defaultSuite[selectedPlayerIdx];
    if (defaultPt) {
      pushToHistory();
      setLocalPlayers(prev => {
        const cloned = [...prev];
        cloned[selectedPlayerIdx] = {
          ...cloned[selectedPlayerIdx],
          x: defaultPt.x,
          y: defaultPt.y
        };
        return cloned;
      });
    }
  };

  const saveOverride = () => {
    updateCustomCoords(selectedFormation, localPlayers);
  };

  const resetToFactoryDefaults = () => {
    pushToHistory();
    resetCustomCoords(selectedFormation);
  };

  const resetAllFields = () => {
    if (window.confirm(language === 'en' ? 'Delete all customized coordinate overlays?' : 'هل ترغب في تصغير وحذف كافة التعديلات التشكيلية والعودة للإعداد الأصلي؟')) {
      resetAllCustomCoords();
      setHistory([]);
    }
  };

  const handleShareTactic = async () => {
    setShareError(null);
    setShareUrl(null);
    setShareLoading(true);

    try {
      const { supabase, isSupabaseConfigured } = await import('../../lib/supabaseClient');
      if (!isSupabaseConfigured || !supabase) {
        throw new Error(language === 'en' 
          ? 'Supabase is offline. Configure VITE_SUPABASE keys to share.' 
          : 'النسخ السحابي غير متصل. قم بتهيئة مفاتيح Supabase للمشاركة.'
        );
      }

      const payload = {
        formation: selectedFormation,
        players: localPlayers,
        playstyle: 'eFootball Custom Preset',
        sub_tactics: [],
        notes: `Shared custom setup for ${selectedFormation} formation.`
      };

      const { data, error } = await supabase
        .from('shared_tactics')
        .insert(payload)
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message || 'Database insert transaction failed.');
      }

      if (data && data.id) {
        const generatedLink = `${window.location.origin}?share=${data.id}`;
        setShareUrl(generatedLink);
      } else {
        throw new Error('No record ID fetched from server.');
      }
    } catch (err: any) {
      console.error('Tactical Share error:', err);
      setShareError(err.message || 'Error executing dynamic supabase share query.');
    } finally {
      setShareLoading(false);
    }
  };

  const getRoleColor = (roleStr: string): string => {
    const r = roleStr.toUpperCase();
    if (r === 'GK') return '#00d4ff';
    if (['CB', 'LB', 'RB', 'LWB', 'RWB', 'DF'].includes(r)) return '#cad4ea';
    if (['DMF', 'CM', 'CMF', 'LCM', 'RCM', 'AMF', 'LM', 'RM', 'LMF', 'RMF', 'MF'].includes(r)) return '#eab308';
    return '#ef4444'; // Forwards (CF, RW, LW, SS etc)
  };

  return (
    <div className="space-y-6 select-none font-sans" data-testid="formation-tab">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black font-orbitron text-white leading-tight">⚽ {t('custom_formation')}</h2>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'en'
            ? 'Relocate positions, customize roles, and save exact field structures to align with meta counters'
            : 'اسحب مراكز اللاعبين يدويًا لضبط وعقد خرائط مخصصة تحاكي خطط لعب الميتا بدقة'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-3">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">{t('select_formation_to_edit')}</h3>
            <select 
              value={selectedFormation} 
              onChange={e => setSelectedFormation(e.target.value)}
              className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-3 rounded-xl text-white outline-none font-orbitron font-extrabold uppercase transition focus:border-primary"
            >
              {FORMATIONS.map(f => <option key={f}>{f}</option>)}
            </select>
            <p className="text-[10px] text-gray-400 leading-normal font-semibold">{t('drag_instructions')}</p>
          </div>

          {/* Individual player properties modifier */}
          {selectedPlayerIdx !== null && localPlayers[selectedPlayerIdx] && (
            <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="text-[10px] font-black font-orbitron text-white uppercase tracking-wider">Player Node #{selectedPlayerIdx + 1}</span>
                <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded font-black font-mono" style={{ color: themeAccent, backgroundColor: `${themeAccent}15` }}>ACTIVE NODE</span>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-2 border-white/80 ring-4 ring-primary/20"
                  style={{ backgroundColor: getRoleColor(localPlayers[selectedPlayerIdx].r), color: '#040712' }}
                >
                  {localPlayers[selectedPlayerIdx].r}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-300">Pitch Axes:</span>
                    <span className="text-[10px] bg-slate-900 px-2.5 py-0.5 rounded border border-border/60 font-mono font-bold text-gray-300">
                      X: <b style={{ color: themeAccent }}>{localPlayers[selectedPlayerIdx].x}%</b> Y: <b style={{ color: themeAccent }}>{localPlayers[selectedPlayerIdx].y}%</b>
                    </span>
                  </div>
                  <button 
                    onClick={revertSelectedPlayerPosition}
                    className="flex items-center gap-1 text-[9px] text-rose-400 hover:text-rose-500 font-bold bg-slate-900 px-2 py-1 rounded border border-border/60 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Revert Coordinates
                  </button>
                </div>
              </div>

              {/* Position choices */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Change Role</label>
                <div className="grid grid-cols-4 gap-1.5 font-bold">
                  {['GK', 'CB', 'LB', 'RB', 'DMF', 'CMF', 'AMF', 'LWF', 'RWF', 'CF', 'SS', 'LMF'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(selectedPlayerIdx, role)}
                      className={`py-1.5 rounded text-[10px] font-black font-orbitron border transition ${
                        localPlayers[selectedPlayerIdx].r === role
                          ? 'bg-primary border-primary text-slate-950 shadow-md font-black'
                          : 'bg-slate-900 hover:bg-zinc-800 border-border/50 text-gray-300'
                      }`}
                      style={localPlayers[selectedPlayerIdx].r === role ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Secondary backup buttons */}
          <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-2.5 font-bold">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`w-full py-2.5 rounded-xl transition font-orbitron uppercase text-[10px] tracking-wider font-extrabold flex items-center justify-center gap-2 border select-none ${
                history.length > 0
                  ? 'bg-amber-500/15 hover:bg-amber-500/20 text-amber-500 border-amber-500/30 cursor-pointer'
                  : 'bg-slate-900 text-gray-600 border-border/20 cursor-not-allowed opacity-45'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" /> <span>Undo action ({history.length})</span>
            </button>

            <button 
              onClick={saveOverride}
              className="w-full text-navyBg font-black font-orbitron py-3 rounded-xl transition uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              style={{ backgroundColor: themeAccent }}
            >
              Save Custom Overrides
            </button>

            <button 
              onClick={resetToFactoryDefaults}
              className="w-full bg-slate-900 hover:bg-zinc-800 border border-border/60 text-gray-300 font-bold font-orbitron py-2.5 rounded-xl transition text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Reset Current Preset standard
            </button>

            <button 
              onClick={resetAllFields}
              className="w-full bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 text-rose-400 font-bold font-orbitron py-2.5 rounded-xl transition text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Reset All Lineups
            </button>
          </div>
        </div>

        {/* Right Canvas Column */}
        <div className="lg:col-span-8 bg-surface rounded-xl border border-border p-5 flex flex-col justify-between">
          <div className="w-full max-w-[480px] mx-auto space-y-3">
            {/* Quick layout switch slider bar */}
            <div className="bg-slate-950/40 border border-border/80 p-3 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-orbitron text-gray-400 tracking-wider">⚡ QUICK SWITCH PITCH HEADER</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/15 font-black font-orbitron font-bold">DRAG ENABLED</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none" style={{ scrollbarWidth: 'thin' }}>
                {FORMATIONS.map(f => {
                  const isSelected = selectedFormation === f;
                  const isCustom = !!customCoords[f];
                  return (
                    <button
                      key={f}
                      onClick={() => setSelectedFormation(f)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-orbitron whitespace-nowrap border shrink-0 flex items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-navyBg border-primary shadow-md'
                          : 'bg-slate-900 hover:bg-zinc-800 border-border/60 text-gray-400 hover:text-gray-200'
                      }`}
                      style={isSelected ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}
                    >
                      <span>{f}</span>
                      {isCustom && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-950/45 border border-border/80 p-3.5 rounded-t-2xl text-center text-xs font-black font-orbitron text-gray-300 border-b-0 uppercase tracking-widest flex justify-between items-center bg-surface2/45">
              <span>🏟️ TACTICAL Canvas</span>
              <span className="text-[10px] bg-slate-900 px-2.5 py-0.5 rounded border border-border/70 text-primary font-black font-mono uppercase tracking-wide" style={{ color: themeAccent }}>{selectedFormation}</span>
            </div>

            {/* Canvas pitch wrapper */}
            <div 
              ref={pitchRef}
              className="relative w-full aspect-[2/2.5] bg-gradient-to-b from-[#0a1e12] to-[#040e09] border border-border/80 rounded-b-none overflow-hidden shadow-2xl touch-none select-none"
            >
              {/* Pitch Drawing Overlays */}
              <div className="absolute inset-0 pointer-events-none opacity-20 border-[3px] border-white/60 m-3 rounded">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/60" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-[2px] border-white/60" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-16 border-[2px] border-white/60 border-t-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 border-[2px] border-white/60 border-t-0" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 border-[2px] border-white/60 border-b-0" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 border-[2px] border-white/60 border-b-0" />
              </div>

              {/* Render player node bubbles */}
              {localPlayers.map((pos, idx) => {
                const isDragging = activePlayerIdx === idx;
                const isSelected = selectedPlayerIdx === idx;
                return (
                  <motion.div
                    key={idx}
                    animate={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      scale: isDragging ? 1.3 : (isSelected ? 1.15 : 1.0),
                      zIndex: isDragging ? 50 : 20,
                      filter: isDragging ? "brightness(1.15) drop-shadow(0px 0px 14px rgba(6, 182, 212, 0.85))" : "brightness(1)"
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    style={{ position: 'absolute' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
                    onPointerDown={e => handlePointerDown(idx, e)}
                    onPointerMove={e => handlePointerMove(idx, e)}
                    onPointerUp={e => handlePointerUp(idx, e)}
                  >
                    <div
                      style={{ backgroundColor: getRoleColor(pos.r) }}
                      className={`rounded-full flex items-center justify-center font-black text-slate-950 shadow-2xl border-2 transition-all p-1 select-none ${
                        isDragging
                          ? 'w-10 h-10 text-xs border-cyan-400 ring-4 ring-cyan-500/50'
                          : isSelected
                            ? 'w-10 h-10 text-xs border-white ring-4 ring-primary/40'
                            : 'w-8 h-8 text-[11px] border-white/30 hover:scale-105'
                      }`}
                    >
                      {pos.r}
                    </div>
                    <span className="bg-slate-950/90 border border-border/80 text-[8px] font-black font-mono text-gray-300 px-1.5 rounded shadow mt-1 leading-none">
                      #{idx + 1}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Tactical Sharing console under pitch frame */}
            <div className="bg-slate-950/60 border border-border/80 border-t-0 p-4 rounded-b-2xl space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-cyan-400" style={{ color: themeAccent }} />
                  <span className="text-xs font-black font-orbitron text-white uppercase tracking-wider">SHARE PITCH SNAPSHOT</span>
                </div>
                <span className="text-[9px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/25 px-1.5 py-0.5 rounded uppercase font-black font-orbitron font-mono">SUPABASE PUBLIC URL</span>
              </div>

              <p className="text-[11px] text-gray-400 leading-normal">
                Generates a unique online shareable link mapping the current layout positions and player roles for this preset formation.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleShareTactic}
                  disabled={shareLoading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-500 hover:brightness-110 text-[#040712] text-[10px] font-black font-orbitron tracking-wider uppercase transition disabled:opacity-50 select-none cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                  style={{ backgroundImage: `linear-gradient(to right, ${themeAccent}, #10b981)` }}
                >
                  {shareLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>GENERATING LINK...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'CREATE PUBLIC LINK' : 'إنشاء رابط مشاركة'}</span>
                    </>
                  )}
                </button>

                {shareUrl && (
                  <div className="flex-1 flex gap-1.5 items-center bg-slate-950/80 px-3 py-2 rounded-xl border border-border/60 overflow-hidden">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-transparent text-[10px] font-mono text-cyan-400 select-all outline-none border-none truncate font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2500);
                      }}
                      className="p-1 px-2.5 text-[9px] font-black bg-[#0d1326] border border-border/60 hover:bg-slate-900 rounded-lg text-white font-orbitron flex items-center gap-1 cursor-pointer select-none transition-all shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-gray-400" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {shareError && (
                <div className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg flex items-center gap-1.5 leading-normal">
                  <span>⚠️</span>
                  <span>{shareError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
