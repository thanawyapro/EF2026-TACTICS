import React, { useState } from 'react';
import { User, PrivacySettings, PreferencesSettings } from '../../types';
import { AccountSection } from './AccountSection';
import { SecuritySection } from './SecuritySection';
import { PrivacySection } from './PrivacySection';
import { PreferencesSection } from './PreferencesSection';
import { DeleteAccountModal } from './DeleteAccountModal';

interface SettingsSectionProps {
  user: User;
  onUpdateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  onUpdatePassword: (old: string, updated: string) => Promise<{ success: boolean; error?: string }>;
  onSavePrivacy: (settings: PrivacySettings) => Promise<{ success: boolean; error?: string }>;
  onSavePreferences: (settings: PreferencesSettings) => Promise<{ success: boolean; error?: string }>;
  onConfirmDelete: () => Promise<void>;
  triggerToast: (msg: string, type: 'success' | 'error') => void;
}

export function SettingsSection({
  user,
  onUpdateProfile,
  onUpdatePassword,
  onSavePrivacy,
  onSavePreferences,
  onConfirmDelete,
  triggerToast,
}: SettingsSectionProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy' | 'preferences' | 'danger'>('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Default values
  const defaultPrivacy: PrivacySettings = {
    isProfilePublic: false,
    allowTacticsSharing: true,
    shareDataAnalytic: true,
  };

  const defaultPreferences: PreferencesSettings = {
    language: 'en',
    theme: 'dark',
    pushNotifications: true,
    emailDigest: false,
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto pb-12">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-border rounded-xl p-5 sm:p-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-orbitron tracking-wider text-white uppercase">Coach settings</h2>
          <p className="text-xs text-gray-400 mt-1">Configure profile, account parameters, and telemetry filters</p>
        </div>
        <div className="flex items-center gap-3 bg-surface2/60 border border-border/80 px-4 py-2.5 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center text-xl">
            ⚽
          </div>
          <div>
            <div className="text-xs font-black text-white">{user.displayName}</div>
            <div className="text-[10px] text-gray-400">@{user.username}</div>
          </div>
        </div>
      </div>

      {/* Settings Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar Options */}
        <div className="md:col-span-1 bg-surface border border-border rounded-xl p-3 h-fit space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-surface2'
            }`}
          >
            <span>👤</span> Profile Info
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-surface2'
            }`}
          >
            <span>🔒</span> Security Controls
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-surface2'
            }`}
          >
            <span>🛡️</span> Privacy Filters
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-surface2'
            }`}
          >
            <span>⚙️</span> Preferences
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'danger'
                ? 'bg-danger/10 text-danger border border-danger/20'
                : 'text-gray-400 hover:text-danger hover:bg-danger/5'
            }`}
          >
            <span>⚠️</span> Danger Zone
          </button>
        </div>

        {/* Right Active Workspace Panel */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <AccountSection user={user} onUpdateProfile={onUpdateProfile} triggerToast={triggerToast} />
          )}

          {activeTab === 'security' && (
            <SecuritySection onUpdatePassword={onUpdatePassword} triggerToast={triggerToast} />
          )}

          {activeTab === 'privacy' && (
            <PrivacySection
              initialSettings={defaultPrivacy}
              onSavePrivacy={onSavePrivacy}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'preferences' && (
            <PreferencesSection
              initialSettings={defaultPreferences}
              onSavePreferences={onSavePreferences}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'danger' && (
            <div className="bg-surface border border-danger/30 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
                <span className="text-xl">⚠️</span>
                <div>
                  <h3 className="text-base font-bold text-white font-orbitron uppercase tracking-wider">Danger Zone Controls</h3>
                  <p className="text-xs text-danger font-medium">Critical non-reversible account actions</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed pt-1">
                Erase your EF26 Tactics cloud profile, custom squads, and training historical data logs completely. You will be signed out permanently.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-5 py-3 bg-danger hover:bg-danger/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  Permanently Delete Tactics Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteAccountModal
          onConfirmDelete={onConfirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          triggerToast={triggerToast}
        />
      )}
    </div>
  );
}
