// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { Mail, KeyRound, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface RegisterFormProps {
  onSignUp: (email: string, pass: string, name?: string) => Promise<void>;
  loading: boolean;
  errorMsg: string | null;
}

export function RegisterForm({ onSignUp, loading, errorMsg }: RegisterFormProps) {
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password || !confirmPassword) {
      setLocalError(t('auth.errorEmptyFields', 'Please fill in all standard credentials.'));
      return;
    }

    if (password.length < 8) {
      setLocalError(t('auth.errorMinPassword'));
      return;
    }

    if (password !== confirmPassword) {
      setLocalError(t('auth.errorPasswordMatch'));
      return;
    }

    try {
      await onSignUp(email, password, displayName);
    } catch (err) {
      // Errors handled by parent component action
    }
  };

  const currentErr = errorMsg || localError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
      {/* Coach display name input */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
          {t('auth.displayName')}
        </label>
        <div className="relative">
          <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="e.g. Guardiola_Labs"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-border/80 focus:border-primary text-xs rounded-xl outline-none transition text-white font-semibold cursor-text"
          />
        </div>
      </div>

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

      {/* Password input */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
          {t('auth.password')}
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password input */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
          {t('auth.confirmPassword')}
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

      {currentErr && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-semibold leading-relaxed animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{currentErr}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full p-3.5 rounded-xl bg-primary text-navyBg text-xs font-black font-orbitron tracking-widest uppercase transition duration-150 disabled:opacity-50 select-none cursor-pointer flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-98"
      >
        <UserPlus className="w-4 h-4 shrink-0" />
        <span>{loading ? t('common.loading') : t('auth.register')}</span>
      </button>
    </form>
  );
}
export default RegisterForm;
