// src/components/plan/sub/PlanResult.tsx
import React from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, Play, RefreshCw, Save } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { GeneratedPlan } from '../../../lib/planBuilder';

interface PlanResultProps {
  plan: GeneratedPlan;
  onSave: () => void;
  onReset: () => void;
}

export default function PlanResult({ plan, onSave, onReset }: PlanResultProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  return (
    <div className="space-y-6 bg-slate-900/40 p-4 sm:p-6 rounded-3xl border border-border/80" data-testid="plan-result">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-border/30 pb-4">
        <div>
          <h3 className="text-xl font-black font-orbitron text-white">
            {language === 'ar' ? '📋 خطتك التكتيكية جاهزة!' : '📋 Tactical Plan is Ready!'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'ar' ? 'تم ضبط البيانات لتتناسب مع ميكانيكا محرك اللعبة.' : 'Optimized specifically to align with game engine mechanics.'}
          </p>
        </div>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-400/25 px-2.5 py-1 rounded-full font-black">
          {plan.formation}
        </span>
      </div>

      {/* Main Stats Block */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-border/50">
          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">
            {language === 'ar' ? 'الأسلوب المقترح' : 'Suggested Playstyle'}
          </span>
          <span className="text-sm font-bold text-white">
            {language === 'ar' ? plan.playstyleAr : plan.playstyle}
          </span>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-border/50">
          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">
            {language === 'ar' ? 'التشكيل المناسب' : 'Best Layout Shape'}
          </span>
          <span className="text-sm font-bold text-white">
            {plan.formation}
          </span>
        </div>
      </div>

      {/* Tactic Explanation Card */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase font-black text-cyan-400 font-orbitron tracking-wider">
          {language === 'ar' ? '📝 شرح الفلسفة التكتيكية:' : '📝 Tactical Philosophy Explanation:'}
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed font-semibold">
          {language === 'ar' ? plan.explanationAr : plan.explanation}
        </p>
      </div>

      {/* Do This / Action List */}
      <div className="space-y-3 pt-2">
        <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ar' ? 'خطط التحرك والانتشار (Do This):' : 'Spread and Movement (Do This):'}</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-semibold">
            {language === 'ar' ? plan.attackingIdeaAr : plan.attackingIdea}
          </p>
        </div>

        {/* Watch Out */}
        <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>{language === 'ar' ? 'تحذير وعيوب تكتيكية (Watch Out):' : 'Tactical Hazards (Watch Out):'}</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-semibold">
            {language === 'ar' ? plan.whatToAvoidAr : plan.whatToAvoid}
          </p>
        </div>
      </div>

      {/* Individual Instructions Recommendations */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase font-black text-cyan-400 font-orbitron tracking-wider">
          {language === 'ar' ? '⚙️ التعليمات الفردية الفورية المقترحة (Sub-Tactics):' : '⚙️ Recommended Sub-Tactics Instruction Nodes:'}
        </h4>
        <div className="space-y-2">
          {(language === 'ar' ? plan.individualInstructionsAr : plan.individualInstructions).map((inst, i) => (
            <div key={i} className="flex gap-2 items-center text-xs text-gray-300 bg-slate-950/40 p-2.5 rounded-xl border border-border/50">
              <span className="w-4 h-4 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center text-[9px] font-bold">
                {i + 1}
              </span>
              <span className="font-semibold">{inst}</span>
            </div>
          ))}
        </div>
      </div>

      {/* switch instructions */}
      <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-2xl space-y-1.5 text-xs">
        <span className="font-bold text-amber-400 block tracking-wider uppercase text-[10px]">
          {language === 'ar' ? '🔄 متى تفعل الخطة الفرعية (Sub-Tactic Switch Trigger):' : '🔄 Sub-Tactic Switch Trigger Timing:'}
        </span>
        <p className="text-gray-300 leading-relaxed font-semibold">
          {language === 'ar' ? plan.whenToSwitchSubTacticAr : plan.whenToSwitchSubTactic}
        </p>
      </div>

      {/* Footer controls */}
      <div className="flex gap-3 pt-4 border-t border-border/30">
        <button
          onClick={onReset}
          className="px-5 py-3.5 rounded-2xl border border-border/70 text-gray-300 text-xs font-black transition hover:bg-slate-900 cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'إعادة اختيار' : 'Modify Choices'}</span>
        </button>

        <button
          onClick={onSave}
          className="flex-1 py-3.5 rounded-2xl font-black text-slate-950 text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition shadow"
          style={{ backgroundColor: themeAccent }}
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>{language === 'ar' ? 'احفظ الخطة للـ Saved Plans' : 'Save Plan to Database'}</span>
        </button>
      </div>
    </div>
  );
}
