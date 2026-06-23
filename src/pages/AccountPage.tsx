// src/pages/AccountPage.tsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CloudLightning, Shield, HardDrive, RefreshCw, 
  UploadCloud, DownloadCloud, LogOut, CheckCircle2, AlertTriangle,
  Download, Upload, Trash2, Globe
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCloudSync } from '../hooks/useCloudSync';
import { useLanguage } from '../hooks/useLanguage';
import { useAppStore } from '../store/useAppStore';
import { LanguageSelector } from '../components/settings/LanguageSelector';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { ChangePasswordCard } from '../components/settings/ChangePasswordCard';
import { AuthPage } from './AuthPage';

export default function AccountPage() {
  const { t, language } = useLanguage();
  const themeId = useAppStore(state => state.themeId);
  
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
  
  // Local Backup Handlers
  const exportData = useAppStore(state => state.exportData);
  const importData = useAppStore(state => state.importData);
  const hardReset = useAppStore(state => state.hardReset);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    try {
      const dataStr = exportData();
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `ef26_tactics_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setSuccessMsg(t('settings.success', 'Successfully exported tactical backup backup.'));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg('Export error: ' + err.message);
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

        setSuccessMsg(t('settings.success', 'Backup loaded and verified successfully!'));
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err: any) {
        setErrorMsg('JSON Parse Error: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleWipeData = () => {
    if (window.confirm(t('settings.wipeConfirm'))) {
      hardReset();
      window.location.reload();
    }
  };

  const isRtl = language === 'ar';

  return (
    <div className="space-y-6 select-none font-sans" data-testid="unified-settings-page">
      {/* Page header */}
      <div className="border-b border-border pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white leading-tight">
            🛠️ {t('settings.title')}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {t('settings.desc')}
          </p>
        </div>
      </div>

      {/* Grid: App Theme settings & Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          {/* Dynamic Language Selector component */}
          <LanguageSelector />

          {/* Dynamic Theme Selector component */}
          <ThemeSelector />

          {/* Backup operations */}
          <div className="bg-slate-950/40 border border-border/80 p-5 rounded-3xl shadow-md space-y-4">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/40 pb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" />
              <span>{t('settings.backupTitle')}</span>
            </h3>

            <p className="text-[11px] text-gray-400 leading-normal font-semibold">
              {t('settings.backupDesc')}
            </p>

            <div className={`flex flex-col sm:flex-row gap-3 pt-1 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={handleExport}
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 hover:border-zinc-500 text-xs font-black font-orbitron text-white transition flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 cursor-pointer"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{t('settings.export')}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-750 hover:border-zinc-500 text-xs font-black font-orbitron text-white transition flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 cursor-pointer"
              >
                <Upload className="w-4 h-4 shrink-0" />
                <span>{t('settings.import')}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
            </div>

            <div className={`border-t border-border/40 pt-3 flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
              <button
                type="button"
                onClick={handleWipeData}
                className="px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-400 text-[10.5px] font-black font-orbitron tracking-wide flex items-center gap-1.5 transition select-none cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('settings.wipeData')}</span>
              </button>
            </div>

            {(successMsg || errorMsg) && (
              <div className={`p-3 rounded-xl text-xs font-semibold border ${
                successMsg ? 'bg-green-500/10 border-green-500/20 text-green-400 animate-fadeIn' : 'bg-red-500/10 border-red-500/20 text-red-400 animate-fadeIn'
              }`}>
                {successMsg || errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Account status (Supabase cloud mode or Sandbox guest mode) */}
        <div className="space-y-6">
          {!isSupabaseAvailable ? (
            <div className="bg-[#080d1a]/90 border border-border/80 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                <AlertTriangle className="w-6 h-6 text-amber-500 animate-pulse" />
                <div>
                  <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
                    {t('auth.guestModeActive')}
                  </h3>
                  <span className="text-[10px] text-amber-400 font-extrabold block">LOCAL-ONLY STORAGE ACTIVE</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-normal font-semibold">
                {t('auth.guestModeDesc')}
              </p>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-[11px] leading-relaxed text-amber-300">
                ⚠️ {language === 'ar' 
                  ? 'حذف ملفات الكاش أو تصفح المود الإضافي سيؤدي لمسح التشكيلات. يرجى تصدير نسخ احتياطية بانتظام.' 
                  : 'Clearing your browser cache or cookies will wipe local tactics. Keep manual backups exported regularly!'}
              </div>
            </div>
          ) : authLoading ? (
            <div className="bg-[#080d1a]/90 border border-border/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-2 select-none">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-bold text-gray-450 uppercase font-orbitron">VERIFYING CLOUD PROFILE...</span>
            </div>
          ) : !isAuthenticated || !user ? (
            <AuthPage 
              onAuthSuccess={() => window.location.reload()} 
              onContinueAsGuest={() => {}} 
            />
          ) : (
            <div className="space-y-6">
              {/* Connected Account View Card */}
              <div className="bg-slate-950/40 border border-border/80 rounded-3xl p-5 space-y-4">
                {/* Cloud mode on Header */}
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <CloudLightning className="w-5 h-5 text-primary animate-pulse" />
                    <div>
                      <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
                        {t('settings.cloudSyncActive')}
                      </h3>
                      <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-400/25 px-1.5 py-0.5 rounded font-black font-mono leading-none">ACTIVE</span>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-full border border-primary/20 bg-slate-900/50 text-[9px] font-black font-orbitron tracking-wider text-primary">
                    {t('settings.cloudConnected')}
                  </div>
                </div>

                {/* Identity view */}
                <div className="bg-slate-900/40 rounded-2xl p-4 border border-border/40 flex items-center justify-between gap-3 text-xs leading-normal">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black uppercase text-xs shrink-0 select-none">
                      {user.email?.[0] || 'C'}
                    </div>
                    <div className="min-w-0 flex-1 leading-tight">
                      <span className="font-extrabold block text-white truncate">{user.user_metadata?.display_name || 'Active Coach'}</span>
                      <span className="text-[10px] text-gray-450 block truncate">{user.email}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="px-3 py-1.5 rounded-xl border border-red-500/25 hover:bg-red-500/10 text-red-400 font-black font-orbitron text-[10px] uppercase transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('settings.logout')}</span>
                  </button>
                </div>

                {/* Automated Sync details */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-400/15 flex gap-2.5 text-xs text-cyan-300">
                  <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0 text-cyan-400 mt-0.5" />
                  <p className="leading-relaxed">
                    {t('settings.activeCoach')}
                  </p>
                </div>

                {/* Sync triggers panels */}
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-border/60 space-y-3">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-orbitron">
                    {t('settings.cloudSyncDesc')}
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={performPushSync}
                      disabled={syncing}
                      className="p-3 rounded-xl border border-border/80 bg-slate-950 hover:bg-slate-900 transition cursor-pointer flex flex-col items-center justify-center gap-1 w-full font-bold"
                    >
                      <UploadCloud className="w-4.5 h-4.5 text-primary" />
                      <span className="text-[9px] font-black text-white">{t('settings.pushCloud')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={performPullSync}
                      disabled={syncing}
                      className="p-3 rounded-xl border border-border/80 bg-slate-950 hover:bg-slate-900 transition cursor-pointer flex flex-col items-center justify-center gap-1 w-full font-bold"
                    >
                      <DownloadCloud className="w-4.5 h-4.5 text-emerald-400" />
                      <span className="text-[9px] font-black text-white">{t('settings.pullCloud')}</span>
                    </button>
                  </div>

                  {lastSyncTime && (
                    <div className="text-center font-semibold pt-1">
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">
                        {t('settings.lastSync')}: {lastSyncTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Change Password Form Card */}
              <ChangePasswordCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export { AccountPage };
