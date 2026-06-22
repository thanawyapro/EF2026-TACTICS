import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Sparkles, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { TacticalProfile, TacticalProfileSchema } from '../../types/schemas';
import { FORMATIONS, TRANSLATIONS } from '../../lib/tactics';

export default function QuickProfilesTab() {
  const profiles = useAppStore(state => state.profiles);
  const activeProfileId = useAppStore(state => state.activeProfileId);
  const addProfile = useAppStore(state => state.addProfile);
  const setActiveProfileId = useAppStore(state => state.setActiveProfileId);
  const deleteProfile = useAppStore(state => state.deleteProfile);
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const [name, setName] = useState('');
  const [form, setForm] = useState('4-3-3');
  const [play, setPlay] = useState('Counter Attack');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      id: 'p_' + Date.now().toString(),
      name: name.trim(),
      formation: form,
      playstyle: play,
      details: details.trim(),
      subTactics: []
    };

    const verified = TacticalProfileSchema.safeParse(payload);
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

    addProfile(verified.data);
    setName('');
    setDetails('');
  };

  return (
    <div className="space-y-6 select-none font-sans" data-testid="quick-profiles-tab">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black font-orbitron text-white leading-tight">🗂️ {t('quick_profiles')}</h2>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'en'
            ? 'Manage elite tactical layouts, activate alignments, and construct special counter formulas'
            : 'إدارة وتفعيل الملفات الفنية السريعة لبدء مباريات تنافسية بأساليب مختلفة فوراً'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Profile Insertion Panel */}
        <form onSubmit={handleCreate} className="lg:col-span-5 bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/40 pb-2">📂 NEW STRUCTURAL PROFILE</h3>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Profile Name / Slot</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Guardiola Barca Meta Copy" 
              required 
              className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-primary font-bold" 
            />
            {errors.name && <p className="text-[8px] text-rose-450 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Base Formation</label>
              <select 
                value={form} 
                onChange={e => setForm(e.target.value)}
                className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-primary font-orbitron font-bold"
              >
                {FORMATIONS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Playstyle Set</label>
              <select 
                value={play} 
                onChange={e => setPlay(e.target.value)}
                className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-primary font-bold"
              >
                <option>Counter Attack</option>
                <option>Possession</option>
                <option>Long Ball Overload</option>
                <option>High Press</option>
                <option>Park the Bus</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-orbitron">Tactical Focus Description</label>
            <textarea 
              value={details} 
              onChange={e => setDetails(e.target.value)} 
              placeholder="Fast diamond passes with wide Fullbacks overlapping..." 
              required 
              className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-2 rounded-xl text-white outline-none focus:border-primary h-24 resize-none" 
            />
            {errors.details && <p className="text-[8px] text-rose-450 mt-1">{errors.details}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full text-navyBg font-black py-3 rounded-xl font-orbitron uppercase text-xs tracking-wider transition hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            style={{ backgroundColor: themeAccent }}
          >
            <Plus className="w-4 h-4" />
            <span>SAVE DECK CARD</span>
          </button>
        </form>

        {/* Profiles List layout */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center bg-slate-950/20 p-2.5 rounded-xl select-none font-bold">
            <span className="text-xs text-gray-400 font-orbitron uppercase tracking-wider">📁 ACTIVE BUCKET CARDS</span>
            <span className="text-[10px] text-gray-500 font-mono">TOTAL IN DECK: {profiles.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map(p => {
              const isActive = p.id === activeProfileId;
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: `0 0 20px ${themeAccent}40`,
                    borderColor: themeAccent 
                  }}
                  transition={{ duration: 0.2 }}
                  className={`bg-slate-950/40 border p-5 rounded-2xl relative flex flex-col justify-between space-y-3 cursor-pointer select-none transition ${
                    isActive ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-border/80'
                  }`}
                  style={isActive ? { borderColor: themeAccent, boxShadow: `0 0 16px ${themeAccent}25` } : {}}
                  onClick={() => setActiveProfileId(p.id)}
                >
                  {/* Glowing tag marker */}
                  {isActive && (
                    <span 
                      className="absolute top-4 right-4 bg-primary text-slate-950 px-2 py-0.5 rounded text-[8.5px] font-black font-orbitron uppercase flex items-center gap-0.5 tracking-wider font-extrabold animate-pulse shadow"
                      style={{ backgroundColor: themeAccent }}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[4px]" /> ACTIVE
                    </span>
                  )}

                  <div className="space-y-2 font-semibold">
                    <p className="text-xs font-black font-orbitron text-white leading-normal uppercase">{p.name}</p>
                    
                    <div className="flex gap-2.5 text-[9.5px]">
                      <span className="bg-slate-900 border border-border/60 px-2 py-0.5 rounded text-gray-300 font-orbitron font-extrabold uppercase">{p.formation}</span>
                      <span className="bg-amber-500/10 text-amber-500 border border-amber-500/15 px-2 py-0.5 rounded font-black">{p.playstyle}</span>
                    </div>

                    <p className="text-[11px] text-gray-400/90 leading-relaxed pt-1">{p.details}</p>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-border/30 pt-3 mt-2">
                    {!isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProfile(p.id);
                        }}
                        className="text-rose-450 hover:text-rose-400 text-xs bg-slate-900 border border-border/80 hover:border-zinc-700 p-2 rounded-xl transition cursor-pointer"
                        title="Delete Profile"
                        style={{ color: '#f43f5e' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProfileId(p.id);
                      }}
                      className={`text-[9.5px] font-black font-orbitron px-3.5 py-1.5 rounded-lg border transition uppercase cursor-pointer ${
                        isActive 
                          ? 'bg-slate-900 text-gray-500 border-border/30 cursor-not-allowed' 
                          : 'bg-primary text-navyBg border-primary hover:brightness-110 font-bold'
                      }`}
                      style={!isActive ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}
                      disabled={isActive}
                    >
                      {isActive ? 'Loaded' : 'Load Alignment'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
