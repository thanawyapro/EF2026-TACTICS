// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface ForgotPasswordFormProps {
  onResetPassword: (email: string) => Promise<void>;
  onBackToLogin: () => void;
  loading: boolean;
  errorMsg: string | null;
  successMsg: string | null;
}

export function ForgotPasswordForm({ onResetPassword, onBackToLogin, loading, errorMsg, successMsg }: ForgotPasswordFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email) {
      setLocalError(t('auth.errorEmptyFields', 'Please enter your email address.'));
      return;
    }

    try {
      await onResetPassword(email);
    } catch (err) {
      // Handled by parent container
    }
  };

  const currentErr = errorMsg || localError;

  return (
    <div className="space-y-4" data-testid="forgot-password-form">
      <div className="text-center space-y-2 pb-2">
        <h3 className="text-sm font-black font-orbitron text-white uppercase tracking-wider">
          {t('auth.forgotPassword')}
        </h3>
        <p className="text-[10px] text-gray-400 leading-normal">
          {t('auth.forgotPasswordDesc', 'Enter your registered coach email below. We will send you a secure link to reset and choose a new password.')}
        </p>
      </div>

      {successMsg ? (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-green-500/10 border border-green-500/25 text-green-200 text-xs font-semibold leading-relaxed animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full p-3.5 rounded-xl bg-slate-900 border border-border/80 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>{t('common.back')}</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="coach@ef26tactics.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-border/80 focus:border-primary text-xs rounded-xl outline-none transition text-white font-semibold cursor-text"
              />
            </div>
          </div>

          {currentErr && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-semibold leading-relaxed animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{currentErr}</span>
            </div>
          )}

          <div className="flex gap-2 p-1.5Packed">
            <button
              type="button"
              onClick={onBackToLogin}
              disabled={loading}
              className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-border/80 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>{t('common.back')}</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-3.5 rounded-xl bg-primary text-navyBg text-xs font-black font-orbitron tracking-widest uppercase transition duration-150 disabled:opacity-50 select-none cursor-pointer flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-98"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>{loading ? t('common.loading') : t('auth.resetPassword')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
export default ForgotPasswordForm;
