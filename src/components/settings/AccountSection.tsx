import React, { useState } from 'react';
import { User } from '../../types';

interface AccountSectionProps {
  user: User;
  onUpdateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  triggerToast: (msg: string, type: 'success' | 'error') => void;
}

export function AccountSection({ user, onUpdateProfile, triggerToast }: AccountSectionProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim() || !username.trim()) {
      triggerToast('Display name and username cannot be blank.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await onUpdateProfile({ displayName, username });
      if (res.success) {
        triggerToast('Account information updated successfully!', 'success');
      } else {
        triggerToast(res.error || 'Failed to update user profile info.', 'error');
      }
    } catch (err: any) {
      triggerToast(err.message || 'An unexpected error occurred.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
        <span className="text-xl">👤</span>
        <div>
          <h3 className="text-base font-bold text-white font-orbitron uppercase tracking-wider">Account Information</h3>
          <p className="text-xs text-gray-400">Update your public identity and profile credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wide block" htmlFor="acc-email">
            Email Address (Display Only)
          </label>
          <input
            id="acc-email"
            type="email"
            readOnly
            disabled
            value={user.email}
            className="w-full h-11 px-4 bg-surface2/50 border border-border/80 text-gray-400 rounded-xl text-sm select-none cursor-not-allowed outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wide block" htmlFor="acc-username">
            Tactician Username
          </label>
          <input
            id="acc-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="tactician_26"
            className="w-full h-11 px-4 bg-surface2 border border-border focus:border-primary focus:glow-active text-white rounded-xl text-sm transition-all outline-none"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wide block" htmlFor="acc-displayname">
            Display Name / Coach Name
          </label>
          <input
            id="acc-displayname"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Captain Tactician"
            className="w-full h-11 px-4 bg-surface2 border border-border focus:border-primary focus:glow-active text-white rounded-xl text-sm transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? 'Saving Roster Info...' : 'Update Account Info'}
        </button>
      </div>
    </div>
  );
}
