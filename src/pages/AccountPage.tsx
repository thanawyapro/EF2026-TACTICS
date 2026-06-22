// AccountPage.tsx
// High fidelity cloud synchronizer and tactical account dashboard for eFootball profiles

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CloudLightning, Shield, BadgeCheck, HardDrive, RefreshCcw, 
  UploadCloud, DownloadCloud, LogOut, CheckCircle2, ShieldAlert,
  Download, Upload, RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCloudSync } from '../hooks/useCloudSync';
import LoginPage from './LoginPage';
import { useAppStore } from '../store/useAppStore';

export default function AccountPage() {
  const { 
    user, 
    loading: authLoading, 
    isAuthenticated,
    isCloudMode,
    isSupabaseAvailable,
    login,
    signUp,
    logout,
    error: authError
  } = useAuth();

  const {
    syncing,
    syncError,
    lastSyncTime,
    performPushSync,
    performPullSync
  } = useCloudSync(user?.id);

  const themeAccent = useAppStore(state => state.themeAccent);
  
  // Local Backup Handlers
  const exportData = useAppStore(state => state.exportData);
  const importData = useAppStore(state => state.importData);
  const [successMsg, setSuccessMsg] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    try {
      const dataStr = exportData();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `ef26_tactics_backup_manual_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setSuccessMsg('Successfully downloaded tactical backup payload.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg('Export crashed: ' + err.message);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setSuccessMsg('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        const result = importData(fileContent);

        if (!result.success) {
          setErrorMsg(result.message);
          return;
        }

        setSuccessMsg('Backup parsed and loaded into local memory states successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err: any) {
        setErrorMsg('JSON Parse Error: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (!isSupabaseAvailable) {
    return (
      <div className="bg-[#080d1a]/90 border border-border/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-border/40 pb-4">
          <ShieldAlert className="w-8 h-8 text-amber-500 animate-pulse" />
          <div>
            <h2 className="text-lg font-black font-orbitron text-white uppercase tracking-wider">SUPABASE OFFLINE FALLBACK</h2>
            <p className="text-[10px] text-slate-400">Environment variables are not populated. Running securely in Guest Sandbox mode.</p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-amber-300">
          <Shield className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div className="space-y-1">
            <span className="font-bold block text-white">Guest Sandbox Active</span>
            <p>Your team formations, matches, custom placements coordinates, and AI history are safely written directly to your browser's private local storage space. To sync metadata online, provision `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables inside your project configuration.</p>
          </div>
        </div>

        {/* Local Backup Tools directly available on settings fallback */}
        <div className="bg-slate-900/40 border border-border/40 rounded-xl p-5 space-y-4">
          <div className="select-none">
            <span className="text-[10px] font-black font-orbitron tracking-widest text-zinc-500 block uppercase">Manual Cold Storage backups</span>
            <p className="text-[11px] text-zinc-400">Securely export or import JSON config backups to keep schemas protected yourself.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-xs font-black font-orbitron text-white transition flex items-center justify-center gap-2 bg-[#0a0f1d] hover:bg-slate-900"
            >
              <Download className="w-4 h-4" />
              EXPORT JSON BACKUP
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl border border-zinc-750 hover:border-zinc-500 text-xs font-black font-orbitron text-white transition flex items-center justify-center gap-2 bg-[#0a0f1d] hover:bg-slate-900"
            >
              <Upload className="w-4 h-4" />
              IMPORT DATA PAYLOAD
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </div>

          {(successMsg || errorMsg) && (
            <div className={`p-3 rounded-xl text-xs font-semibold border ${
              successMsg ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {successMsg || errorMsg}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-bold font-orbitron text-slate-400 uppercase tracking-widest">Verifying Server Session...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <LoginPage 
        onLogin={login} 
        onSignUp={signUp} 
        errorMsg={authError} 
        loading={authLoading} 
      />
    );
  }

  return (
    <div className="bg-[#080d1a]/90 border border-border/80 rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center">
            <CloudLightning className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black font-orbitron text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>CLOUD DATABASE TIER</span>
              <span className="text-[8.5px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/25 px-1.5 py-0.5 rounded font-black tracking-widest uppercase font-mono leading-none">ACTIVE</span>
            </h2>
            <p className="text-[10px] text-zinc-400">Direct background sync enabled with Postgres RLS layers.</p>
          </div>
        </div>

        {/* Storage Tier Badge */}
        <div style={{ borderColor: themeAccent, color: themeAccent }} className="px-3.5 py-1.5 rounded-full border border-primary/40 bg-slate-900/50 text-[10px] font-black font-orbitron tracking-widest flex items-center gap-2">
          <BadgeCheck className="w-4 h-4" />
          <span>CLOUD MODE ON</span>
        </div>
      </div>

      {/* Warning Notice mandated: "Your data is stored locally unless you log in and enable cloud sync." */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-400/20 flex gap-3 text-xs leading-relaxed text-cyan-300">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan-400 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white uppercase tracking-wider text-[10.5px]">AUTOMATED SYNC SAFEGUARD</span>
          <p className="text-[11px] text-cyan-200">
            Your data is stored locally in your browser unless you log in and initialize active cloud synchronization. Since your server connection is active, tactical data automatically synchronizes securely.
          </p>
        </div>
      </div>

      {/* User Information Block */}
      <div className="bg-slate-950/50 rounded-xl p-5 border border-border/40 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-1 select-none">
          <span className="text-[9.5px] uppercase font-black font-orbitron text-zinc-500 tracking-wider">ACTIVE LAB PROFILE</span>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700 text-white font-black text-xs uppercase">
              {user.email?.[0] || 'C'}
            </div>
            <div>
              <span className="text-sm font-bold block text-white">{user.user_metadata?.display_name || 'Anonymous Coach'}</span>
              <span className="text-[10px] text-zinc-400">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[9.5px] uppercase font-black font-orbitron text-zinc-500 tracking-wider block">DATABASE ACTIONS</span>
          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/30 text-rose-400 text-[10px] font-black font-orbitron tracking-wide flex items-center gap-1.5 transition select-none cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            SIGN OUT OF LAB
          </button>
        </div>
      </div>

      {/* Synchronization Command deck */}
      <div className="bg-[#050811] rounded-xl border border-border/60 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/30 pb-3">
          <div>
            <h3 className="text-xs font-black font-orbitron tracking-wider text-white">MANUAL SYNCHRONIZATION OVERRIDES</h3>
            <p className="text-[10.5px] text-zinc-400">Trigger manual transfer protocols to sync modifications.</p>
          </div>
          {lastSyncTime && (
            <span className="text-[10px] font-mono font-semibold text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-border/30">
              L.S.T: {lastSyncTime}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            onClick={performPushSync}
            disabled={syncing}
            className="p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-slate-900/20 text-left hover:bg-slate-900/40 transition select-none cursor-pointer group space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400 transition group-hover:translate-y-[-2px]" />
              <span className="text-xs font-black font-orbitron tracking-wide text-white">UPLOAD TO CLOUD</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-normal">
              Overwrite remote cloud database tables with current local memory data.
            </p>
          </button>

          <button
            onClick={performPullSync}
            disabled={syncing}
            className="p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-slate-900/20 text-left hover:bg-slate-900/40 transition select-none cursor-pointer group space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-emerald-400 transition group-hover:translate-y-[2px]" />
              <span className="text-xs font-black font-orbitron tracking-wide text-white">DOWNLOAD FROM CLOUD</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-normal">
              Download and restore your cloud matches and profiles into local storage memory.
            </p>
          </button>
        </div>

        {syncing && (
          <div className="flex items-center gap-2 text-xs font-bold font-orbitron text-cyan-400 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>COMMITTING SYNC TRANSACTIONS...</span>
          </div>
        )}

        {syncError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex gap-2">
            <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 text-rose-500 mt-0.5" />
            <span>{syncError}</span>
          </div>
        )}
      </div>

      {/* Fallback cold storage backups (reusing manual handles so users can redundant back up both) */}
      <div className="bg-slate-900/40 border border-border/40 rounded-xl p-5 space-y-4">
        <div className="select-none">
          <span className="text-[10px] font-black font-orbitron tracking-widest text-zinc-500 block uppercase">Manual Cold Storage Backups</span>
          <p className="text-[11px] text-zinc-400">Export or import manual JSON files as a fallback redundant layer.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-xs font-black font-orbitron text-white transition flex items-center justify-center gap-2 bg-[#0a0f1d] hover:bg-slate-900"
          >
            <Download className="w-4 h-4" />
            EXPORT BACKUP FILE
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl border border-zinc-750 hover:border-zinc-500 text-xs font-black font-orbitron text-white transition flex items-center justify-center gap-2 bg-[#0a0f1d] hover:bg-slate-900"
          >
            <Upload className="w-4 h-4" />
            IMPORT DATA BACKUP
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
        </div>

        {(successMsg || errorMsg) && (
          <div className={`p-3 rounded-xl text-xs font-semibold border ${
            successMsg ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {successMsg || errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
