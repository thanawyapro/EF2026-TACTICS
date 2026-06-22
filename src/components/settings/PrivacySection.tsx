import React, { useState } from 'react';
import { PrivacySettings } from '../../types';

interface PrivacySectionProps {
  initialSettings?: PrivacySettings;
  onSavePrivacy: (settings: PrivacySettings) => Promise<{ success: boolean; error?: string }>;
  triggerToast: (msg: string, type: 'success' | 'error') => void;
}

export function PrivacySection({ initialSettings, onSavePrivacy, triggerToast }: PrivacySectionProps) {
  const [profilePublic, setProfilePublic] = useState(initialSettings?.isProfilePublic ?? false);
  const [tacticsSharing, setTacticsSharing] = useState(initialSettings?.allowTacticsSharing ?? true);
  const [dataSharing, setDataSharing] = useState(initialSettings?.shareDataAnalytic ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await onSavePrivacy({
        isProfilePublic: profilePublic,
        allowTacticsSharing: tacticsSharing,
        shareDataAnalytic: dataSharing,
      });
      if (res.success) {
        triggerToast('Profile privacy preferences recorded successfully!', 'success');
      } else {
        triggerToast(res.error || 'Failed to update catalog privacy.', 'error');
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred during updating preferences.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 space-y-6">
      {/* Head */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
        <span className="text-xl">🛡️</span>
        <div>
          <h3 className="text-base font-bold text-white font-orbitron uppercase tracking-wider">Privacy & Visibility</h3>
          <p className="text-xs text-gray-400">Govern who views your formations, analytics, and strategies</p>
        </div>
      </div>

      <div className="space-y-5 pt-1">
        {/* Profile Visibility Toggle */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Public Profile Mode
            </label>
            <p className="text-xs text-gray-400 leading-relaxed md:max-w-md">
              Allow other tacticians to find you by your Coach Name and username. Private profiles are hidden from searches.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setProfilePublic(!profilePublic)}
            className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
              profilePublic ? 'bg-success' : 'bg-surface2 border border-border'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                profilePublic ? 'translate-x-[24px]' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        {/* Tactics Share Visibility Toggle */}
        <div className="flex items-start justify-between gap-4 pt-2 border-t border-border/20">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Share Created Formations
            </label>
            <p className="text-xs text-gray-400 leading-relaxed md:max-w-md">
              Allow other players to browse, favorite, and copy your newly generated eFootball tactics and team playstyles.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTacticsSharing(!tacticsSharing)}
            className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
              tacticsSharing ? 'bg-success' : 'bg-surface2 border border-border'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                tacticsSharing ? 'translate-x-[24px]' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        {/* Analytics Sharing Toggle */}
        <div className="flex items-start justify-between gap-4 pt-2 border-t border-border/20">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Share Playstyle Analytics
            </label>
            <p className="text-xs text-gray-400 leading-relaxed md:max-w-md">
              Share match performance reports containing goal statistics anonymously to help us improve the predictive AI algorithms.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDataSharing(!dataSharing)}
            className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
              dataSharing ? 'bg-success' : 'bg-surface2 border border-border'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                dataSharing ? 'translate-x-[24px]' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? 'Locking Settings...' : 'Save Privacy Options'}
        </button>
      </div>
    </div>
  );
}
