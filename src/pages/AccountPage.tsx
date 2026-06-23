// src/pages/AccountPage.tsx
// High fidelity cloud synchronizer and tactical account settings for eFootball players
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CloudLightning, Shield, BadgeCheck, HardDrive, RefreshCw, 
  UploadCloud, DownloadCloud, LogOut, CheckCircle2, ShieldAlert,
  Download, Upload, Trash2, Globe, Sparkles
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
  const language = useAppStore(state => state.language);
  const setLanguage = useAppStore(state => state.setLanguage);
  const setThemeAccent = useAppStore(state => state.setThemeAccent);
  
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
      
      setSuccessMsg(language === 'en' ? 'Successfully downloaded tactical backup file.' : 'تم تحميل ملف النسخة الاحتياطية بنجاح.');
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

        setSuccessMsg(language === 'en' ? 'Backup loaded and verified successfully!' : 'تم تحميل ومراجعة البيانات بنجاح!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err: any) {
        setErrorMsg('JSON Parse Error: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleWipeData = () => {
    if (window.confirm(language === 'en' 
      ? 'CRITICAL Action: Wipe all matches, custom profile listings, and layout coordinates forever?' 
      : 'تحذير حرج جداً: هل ترغب بالفعل في حذف ومسح كافة البيانات والخطط من جهازك نهائياً؟')) {
      hardReset();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 select-none font-sans" data-testid="unified-settings-page">
      {/* Title */}
      <div className="border-b border-border pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-orbitron text-white leading-tight">
            🛠️ {language === 'en' ? 'Account & Settings' : 'حسابي وإعدادات التطبيق'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en'
              ? 'Configure app visuals, back-ups, and toggle cloud integration'
              : 'تعديل لغة التطبيق، الألوان، تنزيل النسخ الاحتياطية، والربط السحابي.'}
          </p>
        </div>
      </div>

      {/* Grid: App Theme settings & Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          {/* Visual Preferences */}
          <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/40 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{language === 'en' ? 'APP PREFERENCES' : 'تفضيلات التطبيق'}</span>
            </h3>

            {/* Language toggle */}
            <div className="space-y-1.5 text-xs text-gray-300">
              <span className="block text-[10px] uppercase font-bold text-gray-450 font-orbitron tracking-wider">
                {language === 'en' ? 'App Language' : 'لغة واجهة التطبيق'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition duration-150 cursor-pointer ${
                    language === 'en' 
                      ? 'text-navyBg border-primary font-black' 
                      : 'bg-slate-900 border-border/50 text-gray-400 hover:text-white'
                  }`}
                  style={language === 'en' ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition duration-150 cursor-pointer ${
                    language === 'ar' 
                      ? 'text-navyBg border-primary font-black' 
                      : 'bg-slate-900 border-border/50 text-gray-400 hover:text-white'
                  }`}
                  style={language === 'ar' ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Color Accent theme selection */}
            <div className="space-y-2 text-xs text-gray-300">
              <span className="block text-[10px] uppercase font-bold text-gray-450 font-orbitron tracking-wider">
                {language === 'en' ? 'Dashboard Accent Highlight' : 'لون إضاءة التشكيل والتطبيق'}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: 'Cyan Glow', val: '#00d4ff', nameAr: 'سيان مشع' },
                  { name: 'Blue Storm', val: '#3b82f6', nameAr: 'أزرق عاصف' },
                  { name: 'Cosmic Purple', val: '#a855f7', nameAr: 'بنفسجي كوني' },
                  { name: 'Emerald Wave', val: '#10b981', nameAr: 'أخضر زمردي' },
                  { name: 'Amber Burst', val: '#f59e0b', nameAr: 'برتقالي متوهج' }
                ].map(col => (
                  <button
                    key={col.val}
                    type="button"
                    onClick={() => setThemeAccent(col.val)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border hover:bg-slate-900/60 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
                    style={{ borderColor: themeAccent === col.val ? themeAccent : 'rgba(255,255,255,0.08)' }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.val }} />
                    <span style={{ color: themeAccent === col.val ? themeAccent : '#d1d5db' }}>
                      {language === 'en' ? col.name : col.nameAr}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Backup operations */}
          <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/40 pb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>{language === 'en' ? 'LOCAL STORAGE BACKUPS' : 'النسخ الاحتياطي اليدوي'}</span>
            </h3>

            <p className="text-[11px] text-gray-400 leading-normal font-semibold">
              {language === 'en'
                ? 'Export or import your saved rosters and match logs directly as a local JSON file backup.'
                : 'قم بتحميل أو رفع ملف تكتيكي خارجي مفصل لحفظ قائمة تكتيكات المالك محلياً.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={handleExport}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-xs font-black font-orbitron text-white transition flex items-center justify-center gap-2 bg-[#0a0f1d] hover:bg-slate-900 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'en' ? 'EXPORT BACKUP' : 'تصدير نسخة'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-750 hover:border-zinc-500 text-xs font-black font-orbitron text-white transition flex items-center justify-center gap-2 bg-[#0a0f1d] hover:bg-slate-900 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{language === 'en' ? 'IMPORT BACKUP' : 'استيراد نسخة'}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
            </div>

            <div className="border-t border-border/40 pt-3 text-right">
              <button
                type="button"
                onClick={handleWipeData}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-[10.5px] font-black font-orbitron tracking-wide flex items-center gap-1.5 transition select-none cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'WIPE ALL LOCAL DATA' : 'مسح البيانات المحلية بالكامل'}</span>
              </button>
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

        {/* Right Side: Account status (Supabase cloud mode or sandbox guest mode) */}
        <div className="space-y-6">
          {!isSupabaseAvailable ? (
            <div className="bg-[#080d1a]/90 border border-border/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                <ShieldAlert className="w-6 h-6 text-amber-500 animate-pulse" />
                <div>
                  <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
                    {language === 'en' ? 'SECURE GUEST MODE' : 'وضع الزائر الآمن'}
                  </h3>
                  <span className="text-[10px] text-amber-400 font-extrabold block">LOCAL-ONLY STORAGE ACTIVE</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-normal font-semibold">
                {language === 'en'
                  ? 'Your data is securely locked strictly inside your browser local storage database. Provision Supabase configurations to deploy multi-device synchronization.'
                  : 'بيانات الفريق، المباريات المحللة، وأساليب اللعب مخزنة بشكل آمن داخل متصفحك محلياً فقط.'}
              </p>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-[11px] leading-relaxed text-amber-300">
                ⚠️ {language === 'en' 
                  ? 'Clearing your browser cache or cookies will wipe local tactics. Keep manual backups exported regularly!' 
                  : 'تنبيه: مسح ملفات تعريف الارتباط للمتصفح قد يضيع تكتيكاتك. نوصي بتحميل نسخة يدوية باستمرار!'}
              </div>
            </div>
          ) : authLoading ? (
            <div className="bg-[#080d1a]/90 border border-border/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-xs font-bold text-gray-450 uppercase font-orbitron">VERIFYING CLOUD PROFILE...</span>
            </div>
          ) : !isAuthenticated || !user ? (
            <LoginPage 
              onLogin={login} 
              onSignUp={signUp} 
              errorMsg={authError} 
              loading={authLoading} 
            />
          ) : (
            <div className="bg-[#080d1a]/90 border border-border/80 rounded-2xl p-5 space-y-4">
              {/* Cloud mode on Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <CloudLightning className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
                      {language === 'en' ? 'SAVE ONLINE (CLOUD SYNC)' : 'حفظ أونلاين (سحابي)'}
                    </h3>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 px-1.5 py-0.5 rounded font-black font-mono leading-none">ACTIVE</span>
                  </div>
                </div>

                <div style={{ borderColor: themeAccent, color: themeAccent }} className="px-2.5 py-1 rounded-full border border-primary/20 bg-slate-900/50 text-[9px] font-black font-orbitron tracking-wider">
                  {language === 'en' ? 'CONNECTED' : 'متصل بالخادم'}
                </div>
              </div>

              {/* Identity view */}
              <div className="bg-slate-950/45 rounded-xl p-3 border border-border/40 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center font-black uppercase text-xs">
                    {user.email?.[0] || 'C'}
                  </div>
                  <div>
                    <span className="font-bold block text-white">{user.user_metadata?.display_name || 'Active Coach'}</span>
                    <span className="text-[10px] text-slate-400">{user.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-450 font-black font-orbitron text-[10px] uppercase transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 inline mr-1" />
                  <span>{language === 'en' ? 'LOG OUT' : 'خروج'}</span>
                </button>
              </div>

              {/* Automated Sync Safeguard details */}
              <div className="p-3.5 rounded-xl bg-cyan-950/25 border border-cyan-400/15 flex gap-2.5 text-xs text-cyan-300">
                <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0 text-cyan-400 mt-0.5" />
                <p className="leading-relaxed">
                  {language === 'en'
                    ? 'Your custom tactics are backed up automatically. Use manual triggers to synchronize custom files.'
                    : 'خططك المسجلة والمحاذاة يتم حفظها ومزامنتها تلقائياً بالخلفية لضمان عدم ضياع التكتيكات.'}
                </p>
              </div>

              {/* Sync triggers panels */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-border/60 space-y-3">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-orbitron">
                  {language === 'en' ? 'MANUAL FORCE SYNC OVERRIDES:' : 'تجاوزات المزامنة اليدوية القسرية:'}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={performPushSync}
                    disabled={syncing}
                    className="p-3 rounded-lg border border-border/80 bg-slate-900 text-center hover:bg-slate-900/60 transition cursor-pointer flex flex-col items-center justify-center gap-1 w-full"
                  >
                    <UploadCloud className="w-4.5 h-4.5 text-cyan-400" />
                    <span className="text-[10px] font-black text-white">{language === 'en' ? 'PUSH TO CLOUD' : 'رفع التعديلات'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={performPullSync}
                    disabled={syncing}
                    className="p-3 rounded-lg border border-border/80 bg-slate-900 text-center hover:bg-slate-900/60 transition cursor-pointer flex flex-col items-center justify-center gap-1 w-full"
                  >
                    <DownloadCloud className="w-4.5 h-4.5 text-emerald-400" />
                    <span className="text-[10px] font-black text-white">{language === 'en' ? 'PULL FROM CLOUD' : 'تنزيل السحابي'}</span>
                  </button>
                </div>

                {lastSyncTime && (
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-gray-500">
                      {language === 'en' ? `Last sync: ${lastSyncTime}` : `آخر مزامنة: ${lastSyncTime}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
