// LoginPage.tsx
// High-fidelity login and onboarding gateway styled for EF26 Tactics Labs

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, KeyRound, Mail, UserPlus, CloudLightning, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onSignUp: (email: string, pass: string, name?: string) => Promise<void>;
  errorMsg: string | null;
  loading: boolean;
}

export default function LoginPage({ onLogin, onSignUp, errorMsg, loading }: LoginPageProps) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all standard credentials.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must contain at least 6 characters.');
      return;
    }

    try {
      if (isSignUpMode) {
        await onSignUp(email, password, displayName);
      } else {
        await onLogin(email, password);
      }
    } catch (err: any) {
      // Errors are handled by the hook/parent container
    }
  };

  const currentErr = errorMsg || localError;

  return (
    <div className="bg-[#0b0f19] border border-border/80 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-2xl space-y-6 relative overflow-hidden">
      {/* Decorative pulse glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

      <div className="text-center space-y-2 select-none">
        <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
          <CloudLightning className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black font-orbitron tracking-wider text-white uppercase">
          {isSignUpMode ? 'CREATE LAB PROFILE' : 'CLOUD SERVER LOG IN'}
        </h2>
        <p className="text-xs text-slate-400">
          Sync eFootball matches, customized field structures, and team tactics.
        </p>
      </div>

      <div className="flex border-b border-border/40 pb-0.5">
        <button
          type="button"
          onClick={() => { setIsSignUpMode(false); setLocalError(''); }}
          className={`flex-1 pb-3 text-xs font-black font-orbitron tracking-widest uppercase transition-colors relative cursor-pointer ${
            !isSignUpMode ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          SIGN IN
          {!isSignUpMode && (
            <motion.div layoutId="authUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-cyan-400" />
          )}
        </button>
        <button
          type="button"
          onClick={() => { setIsSignUpMode(true); setLocalError(''); }}
          className={`flex-1 pb-3 text-xs font-black font-orbitron tracking-widest uppercase transition-colors relative cursor-pointer ${
            isSignUpMode ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          REGISTER
          {isSignUpMode && (
            <motion.div layoutId="authUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-cyan-400" />
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUpMode && (
          <div className="space-y-1.5Packed">
            <label className="text-[10px] font-bold font-orbitron uppercase text-slate-400 tracking-wider">Coach Display Name</label>
            <div className="relative">
              <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Guardiola_EF"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#050811] border border-border/80 focus:border-cyan-400/70 text-sm rounded-xl outline-none transition text-white"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold font-orbitron uppercase text-slate-400 tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="email"
              placeholder="coach@ef26tactics.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#050811] border border-border/80 focus:border-cyan-400/70 text-sm rounded-xl outline-none transition text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold font-orbitron uppercase text-slate-400 tracking-wider">Password</label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#050811] border border-border/80 focus:border-cyan-400/70 text-sm rounded-xl outline-none transition text-white"
            />
          </div>
        </div>

        {currentErr && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold leading-relaxed"
          >
            <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 text-rose-500 mt-0.5" />
            <span>{currentErr}</span>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-[0.98] text-black text-xs font-black font-orbitron tracking-widest uppercase transition disabled:opacity-50 select-none cursor-pointer"
        >
          {loading ? 'PROCESSING CONNECTION...' : isSignUpMode ? 'CREATE ACCOUNT' : 'SECURE LOG IN'}
        </button>
      </form>

      <div className="pt-4 border-t border-border/40 flex items-center gap-3 text-slate-500">
        <Shield className="w-5 h-5 flex-shrink-0 text-cyan-400/55" />
        <p className="text-[10px] leading-relaxed">
          <span className="text-slate-300 font-bold">SQL RLS Sandbox:</span> Your tactical schemas are fully locked by modern Row-Level Security rules. Each database record is tightly isolated to your user uid.
        </p>
      </div>

      <div className="pt-2 text-center select-none">
        <p className="text-[10.5px] text-zinc-500">
          Your data is stored locally in <span className="text-zinc-400 font-bold">Guest Mode</span> unless you log in.
        </p>
      </div>
    </div>
  );
}
