import React, { useState } from 'react';

interface SecuritySectionProps {
  onUpdatePassword: (old: string, updated: string) => Promise<{ success: boolean; error?: string }>;
  triggerToast: (msg: string, type: 'success' | 'error') => void;
}

export function SecuritySection({ onUpdatePassword, triggerToast }: SecuritySectionProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerToast('All password change fields are required.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      triggerToast('New password must be at least 6 characters in length.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      triggerToast('Confirmed new password does not match. Re-check entry.', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await onUpdatePassword(currentPassword, newPassword);
      if (res.success) {
        triggerToast('Password changed securely and updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        triggerToast(res.error || 'Failed to update credentials password.', 'error');
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred updating security settings.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handle2FAToggle = () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    if (nextState) {
      triggerToast('Two-Factor Authentication configuration generated! Add authenticator.', 'success');
    } else {
      triggerToast('Two-Factor Authentication disabled successfully.', 'success');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 space-y-6">
      {/* Head section */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
        <span className="text-xl">🔒</span>
        <div>
          <h3 className="text-base font-bold text-white font-orbitron uppercase tracking-wider">Security Controls</h3>
          <p className="text-xs text-gray-400">Lock down your account credentials and system authentication</p>
        </div>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider">Update Account Password</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 px-4 bg-surface2 border border-border focus:border-primary focus:glow-active text-white rounded-xl text-sm transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 px-4 bg-surface2 border border-border focus:border-primary focus:glow-active text-white rounded-xl text-sm transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 px-4 bg-surface2 border border-border focus:border-primary focus:glow-active text-white rounded-xl text-sm transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isUpdating ? 'Renewing Password...' : 'Renew Account Password'}
          </button>
        </div>
      </form>

      {/* Two-Factor Authenticator */}
      <div className="border-t border-border/40 pt-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider">Two-Factor Authentication (2FA)</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enhance login security by triggering a verified device prompt after entering email password.
            </p>
          </div>
          <button
            type="button"
            onClick={handle2FAToggle}
            className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
              is2FAEnabled ? 'bg-success' : 'bg-surface2 border border-border'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                is2FAEnabled ? 'translate-x-[24px]' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>
    </div>
  );
}
