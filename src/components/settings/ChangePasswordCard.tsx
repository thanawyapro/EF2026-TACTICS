// src/components/settings/ChangePasswordCard.tsx
import React, { useState } from 'react';
import { supabaseAuth } from '../../lib/supabaseAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { KeyRound, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export function ChangePasswordCard() {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!password || !confirmPassword) {
      setErrorMsg(t('settings.errorEmptyFields'));
      return;
    }

    if (password.length < 8) {
      setErrorMsg(t('settings.errorMinLen'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(t('settings.errorPasswordMatch'));
      return;
    }

    setLoading(true);
    try {
      await supabaseAuth.updatePassword(password);
      setSuccessMsg(t('settings.successPassword'));
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950/40 border border-border/80 p-5 rounded-3xl shadow-md space-y-4 font-semibold animate-fadeIn" data-testid="change-password-card">
      <div className="flex items-center gap-2 border-b border-border/45 pb-2">
        <KeyRound className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
          {t('settings.changePassword')}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              {t('settings.newPassword')}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-11 py-3 bg-slate-900 border border-border/80 focus:border-primary text-xs rounded-xl outline-none transition text-white font-semibold cursor-text"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              {t('settings.confirmNewPassword')}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-11 py-3 bg-slate-900 border border-border/80 focus:border-primary text-xs rounded-xl outline-none transition text-white font-semibold cursor-text"
              />
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-semibold leading-relaxed animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-xs font-semibold leading-relaxed animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex justify-start">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-navyBg text-xs font-black font-orbitron tracking-widest uppercase transition duration-150 disabled:opacity-50 select-none cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:brightness-110"
          >
            <span>{loading ? t('common.loading') : t('settings.updatePasswordBtn')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export default ChangePasswordCard;
