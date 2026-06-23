// src/pages/UpdatePasswordPage.tsx
import React, { useState } from 'react';
import { supabaseAuth } from '../lib/supabaseAuth';
import { useLanguage } from '../hooks/useLanguage';
import { KeyRound, Eye, EyeOff, CheckCircle, AlertCircle, CloudLightning } from 'lucide-react';

interface UpdatePasswordPageProps {
  onRedirectToLogin: () => void;
}

export function UpdatePasswordPage({ onRedirectToLogin }: UpdatePasswordPageProps) {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password || !confirmPassword) {
      setErrorMsg(t('settings.errorEmptyFields', 'Please fill in all standard credentials.'));
      return;
    }

    if (password.length < 8) {
      setErrorMsg(t('settings.errorMinLen', 'The password must contain at least 8 characters.'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(t('settings.errorPasswordMatch', 'The passwords do not match.'));
      return;
    }

    setLoading(true);
    try {
      await supabaseAuth.updatePassword(password);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || t('common.error', 'An error occurred during save.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-8 px-4" data-testid="update-password-page">
      <div className="w-full max-w-sm bg-slate-950/85 border border-border/85 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        {/* Visual Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

        <div className="text-center space-y-2 select-none">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-2">
            <CloudLightning className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-base font-black font-orbitron tracking-wider text-white uppercase">
            {t('settings.changePassword')}
          </h2>
          <p className="text-[10px] text-gray-400 font-semibold leading-normal">
            Choose a strong, secure new password for your Coach Account profile.
          </p>
        </div>

        {success ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-green-500/10 border border-green-500/25 text-green-200 text-xs font-semibold leading-relaxed">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <span>{t('settings.successPassword')}</span>
            </div>

            <button
              type="button"
              onClick={onRedirectToLogin}
              className="w-full p-3.5 rounded-xl bg-primary text-navyBg text-xs font-black font-orbitron tracking-widest uppercase transition duration-150 select-none cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>{t('auth.login')}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password input */}
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

            {/* Confirm New Password input */}
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

            {errorMsg && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-semibold leading-relaxed animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3.5 rounded-xl bg-primary text-navyBg text-xs font-black font-orbitron tracking-widest uppercase transition duration-150 disabled:opacity-50 select-none cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:brightness-110"
            >
              <span>{loading ? t('common.loading') : t('settings.updatePasswordBtn')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
export default UpdatePasswordPage;
