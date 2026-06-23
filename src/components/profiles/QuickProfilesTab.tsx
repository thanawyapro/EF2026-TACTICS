// src/components/profiles/QuickProfilesTab.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Eye, Plus, Sparkles, FolderOpen, Heart, EyeOff, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface QuickProfilesTabProps {
  onNavigate?: (tabId: string) => void;
}

export default function QuickProfilesTab({ onNavigate }: QuickProfilesTabProps) {
  const profiles = useAppStore(state => state.profiles);
  const deleteProfile = useAppStore(state => state.deleteProfile);
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const [inspectedPlanId, setInspectedPlanId] = useState<string | null>(null);

  // Localization Dictionary
  const dict = {
    title: {
      ar: "خططي الكوتش",
      en: "My Saved Plans",
      fr: "Mes plans enregistrés",
      es: "Mis planes guardados"
    },
    subtitle: {
      ar: "تنظيم جميع تكتيكات eFootball المصممة مع كابتن المدرب الذكي الخاص بك.",
      en: "Your personal custom tactics playbook configured by the Smart Coach.",
      fr: "Votre bibliothèque tactique eFootball.",
      es: "Tu biblioteca táctica eFootball"
    },
    noPlans: {
      ar: "مفيش أي خطط محفوظة لغاية دلوقتي.",
      en: "No custom tactics saved yet.",
      fr: "Aucune tactique enregistrée pour le moment.",
      es: "No hay tácticas guardadas de momento."
    },
    btnNewPlan: {
      ar: "خطة جديدة",
      en: "New Plan",
      fr: "Nouvelle tactique",
      es: "Nueva táctica"
    },
    labelName: {
      ar: "الاسم",
      en: "Name",
      fr: "Nom",
      es: "Nombre"
    },
    labelFormation: {
      ar: "التشكيل",
      en: "Formation",
      fr: "Formation",
      es: "Alineación"
    },
    labelPlaystyle: {
      ar: "الأسلوب الرئيسي",
      en: "Main Playstyle",
      fr: "Style principal",
      es: "Estilo principal"
    },
    labelSummary: {
      ar: "تفاصيل سريعة",
      en: "Quick Summary",
      fr: "Résumé tactique",
      es: "Resumen táctico"
    },
    btnDelete: {
      ar: "احف الخطة",
      en: "Delete",
      fr: "Supprimer",
      es: "Eliminar"
    },
    btnInspect: {
      ar: "اعرض التكتيك",
      en: "Inspect",
      fr: "Inspecter",
      es: "Examinar"
    },
    btnInspectOff: {
      ar: "إخفاء التفاصيل",
      en: "Hide Details",
      fr: "Masquer les détails",
      es: "Ocultar detalles"
    }
  };

  const getTranslation = (key: keyof typeof dict) => {
    return dict[key][language as 'en' | 'ar' | 'fr' | 'es'] || dict[key]['ar'];
  };

  const handleRedirect = () => {
    if (onNavigate) {
      onNavigate('build_plan');
    }
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-2xl mx-auto py-2" data-testid="saved-plans-tab">
      {/* Header Block */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 border border-border/60 rounded-2xl">
        <div className="space-y-0.5">
          <h2 className="text-xl font-black font-orbitron text-white leading-tight flex items-center gap-2">
            📂 {getTranslation('title')}
          </h2>
          <p className="text-[11px] text-gray-400">
            {getTranslation('subtitle')}
          </p>
        </div>

        <button
          onClick={handleRedirect}
          className="px-4 py-2.5 rounded-xl text-slate-950 font-black font-orbitron text-xs flex items-center gap-1 hover:brightness-110 cursor-pointer shadow-md shrink-0"
          style={{ backgroundColor: themeAccent }}
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>{getTranslation('btnNewPlan')}</span>
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-slate-950/30 border border-border/50 rounded-2xl p-10 text-center space-y-4">
          <FolderOpen className="w-12 h-12 text-gray-500 mx-auto" />
          <p className="text-sm font-bold text-gray-400">
            {getTranslation('noPlans')}
          </p>
          <button
            onClick={handleRedirect}
            className="px-6 py-3 rounded-xl hover:bg-slate-900 font-bold border border-cyan-400/40 text-cyan-400 text-xs font-orbitron cursor-pointer"
          >
            {language === 'ar' ? 'اصنع خطتك التكتيكية الأولى الآن' : 'Create your first tactic blueprint'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((p) => {
            const isInspected = inspectedPlanId === p.id;
            return (
              <motion.div
                key={p.id}
                layout
                className="bg-slate-900/60 p-5 rounded-2xl border border-border/80 space-y-4 shadow transition-all duration-300 hover:border-cyan-500/30"
              >
                {/* Visual Header */}
                <div className="flex justify-between items-start border-b border-border/30 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-cyan-400 font-black uppercase font-orbitron tracking-widest">{getTranslation('labelName')}</span>
                    <h3 className="text-base font-black text-white">{p.name}</h3>
                  </div>
                  <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 px-2.5 py-1 rounded-xl text-[10px] font-black font-orbitron uppercase">
                    {p.playstyle}
                  </span>
                </div>

                {/* Information Fields */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="bg-slate-950/40 p-3.5 rounded-xl border border-border/40">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">🛡️ {getTranslation('labelFormation')}</span>
                    <span className="text-lg font-black font-orbitron text-white leading-none">{p.formation}</span>
                  </div>

                  <div className="bg-slate-950/40 p-3.5 rounded-xl border border-border/40">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">⚡ {getTranslation('labelPlaystyle')}</span>
                    <span className="text-xs font-bold text-gray-300 block line-clamp-1 truncate">{p.playstyle}</span>
                  </div>
                </div>

                {/* Quick Summary / Instructions List */}
                <div className="bg-slate-950/20 p-4 rounded-xl border border-border/30 space-y-1 text-xs text-gray-400 font-semibold">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">📝 {getTranslation('labelSummary')}</span>
                  <p className="leading-relaxed text-gray-300">
                    {p.details}
                  </p>
                </div>

                {/* Collapsible Inspection Panel */}
                <AnimatePresence>
                  {isInspected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-950/70 p-4.5 rounded-xl border border-cyan-500/20 text-xs text-gray-300 space-y-3 overflow-hidden"
                    >
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{language === 'ar' ? 'التفاصيل التكتيكية الكاملة والتعليمات الفردية:' : 'Full Tactical Elements & Individual Commands:'}</span>
                      </div>
                      
                      {p.subTactics && p.subTactics.length > 0 ? (
                        <div className="space-y-2">
                          <span className="block text-[10px] text-gray-500 uppercase">التعليمات الفردية المحقونة:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {p.subTactics.map((sub, i) => (
                              <span key={i} className="bg-slate-900 border border-border/70 text-[10px] text-cyan-300 px-2.5 py-1 rounded-lg font-bold">• {sub}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-500 font-medium">
                          {language === 'ar' ? 'لا توجد تعليمات فردية خاصة بالخطة؛ يتم تنفيذ التعليمات التلقائية الافتراضية.' : 'No individual instructions appended.'}
                        </p>
                      )}

                      <div className="text-[11px] text-gray-400 leading-normal pt-1.5 border-t border-border/20">
                        👉 {language === 'ar' ? 'لتفعيل هذه الخطة وتحميلها داخل فريقك، قم بتطبيق التشكيل ونطاق التمركزات الفردية كما هي معلنة أعلاه.' : 'To activate this playbook within your team layout, apply the formations and specific rules as displayed.'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions Footer */}
                <div className="flex justify-between items-center border-t border-border/20 pt-3 flex-row-reverse">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setInspectedPlanId(isInspected ? null : p.id)}
                      className="px-3.5 py-2 rounded-xl text-[11px] font-black font-orbitron border border-border hover:bg-slate-950 transition cursor-pointer flex items-center gap-1 bg-slate-900 text-gray-300 hover:text-white shrink-0 uppercase"
                    >
                      {isInspected ? <EyeOff className="w-3.5 h-3.5 text-orange-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{isInspected ? getTranslation('btnInspectOff') : getTranslation('btnInspect')}</span>
                    </button>

                    <button
                      onClick={() => deleteProfile(p.id)}
                      className="px-3.5 py-2 rounded-xl text-[11px] font-black text-[#f43f5e] border border-[#f43f5e]/30 hover:bg-rose-500/10 transition cursor-pointer flex items-center justify-center gap-1 bg-slate-900 shrink-0 uppercase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{getTranslation('btnDelete')}</span>
                    </button>
                  </div>
                  
                  <span className="text-[9.5px] font-mono text-gray-500 font-semibold uppercase">
                    ID: {p.id.replace('p_wizard_', '').replace('p_coach_', '').slice(0, 8)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
