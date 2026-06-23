// src/components/plan/BuildPlanPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { buildPlanDeterministically } from '../../lib/planBuilder';
import { TacticalProfileSchema } from '../../types/schemas';

// Subcomponents
import PlanWizard from './sub/PlanWizard';
import BoardButton from './sub/BoardButton';
import PlanResult from './sub/PlanResult';
import SavePlanDialog from './sub/SavePlanDialog';
import TacticalBoard from '../ui/TacticalBoard';

interface BuildPlanPageProps {
  onNavigate: (tabId: string) => void;
}

export default function BuildPlanPage({ onNavigate }: BuildPlanPageProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  const addProfile = useAppStore(state => state.addProfile);

  const [step, setStep] = useState<number>(1);
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [showBoard, setShowBoard] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleNext = () => {
    if (step === 1 && !selectedPlaystyle) return;
    if (step === 2 && !selectedProblem) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleReset = () => {
    setSelectedPlaystyle('');
    setSelectedProblem('');
    setStep(1);
    setShowBoard(false);
    setSaveSuccess(false);
  };

  // Compile plan
  const plan = step === 3 ? buildPlanDeterministically(selectedPlaystyle, selectedProblem) : null;

  const handleSaveTactic = () => {
    if (!plan) return;

    const payload = {
      id: 'p_wizard_' + Date.now().toString(),
      name: language === 'ar' ? `خطة مدرب: ${plan.playstyleAr}` : `Coach Plan: ${plan.playstyle}`,
      formation: plan.formation,
      playstyle: plan.playstyle,
      details: language === 'ar' ? plan.explanationAr : plan.explanation,
      isCustom: true,
      subTactics: plan.individualInstructions
    };

    const verified = TacticalProfileSchema.safeParse(payload);
    if (verified.success) {
      addProfile(verified.data);
      setSaveSuccess(true);
      setTimeout(() => {
        onNavigate('plans');
      }, 1500);
    }
  };

  return (
    <div className="font-sans space-y-6 max-w-xl mx-auto py-2" data-testid="build-plan-wizard-page">
      {/* Top Progress bar */}
      {step < 3 && (
        <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-border/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 border border-cyan-400/50 flex items-center justify-center text-[10px] font-black">
              {step}
            </div>
            <span className="text-xs font-bold text-gray-300">
              {step === 1 
                ? (language === 'ar' ? 'اختار أسلوبك المفضّل' : 'Choose Your Playstyle') 
                : (language === 'ar' ? 'ما هي تكتلات مشكلتك؟' : 'What is your main issue?')
              }
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-500">
            {step} / 2
          </span>
        </div>
      )}

      {/* Toggle board globally at any stage in our build plan view */}
      <div className="flex justify-center">
        <BoardButton isOpen={showBoard} onClick={() => setShowBoard(!showBoard)} />
      </div>

      <AnimatePresence mode="wait">
        {/* Toggleable Tactical Board view if Board Button is clicked */}
        {showBoard && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-[#030612]/90 border border-cyan-500/15 rounded-3xl"
          >
            <TacticalBoard 
              initialFormation={plan?.formation || '4-3-3'} 
              onSave={(form, players) => {
                // If plan is active, overwrite
                if (plan) {
                  plan.formation = form;
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step < 3 ? (
          <PlanWizard
            step={step}
            selectedPlaystyle={selectedPlaystyle}
            onSelectPlaystyle={setSelectedPlaystyle}
            selectedProblem={selectedProblem}
            onSelectProblem={setSelectedProblem}
            onNext={handleNext}
            onBack={handleBack}
          />
        ) : (
          plan && (
            <PlanResult
              plan={plan}
              onSave={handleSaveTactic}
              onReset={handleReset}
            />
          )
        )}
      </AnimatePresence>

      {/* Save redirection feedback panel */}
      <SavePlanDialog isOpen={saveSuccess} />
    </div>
  );
}
