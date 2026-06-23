// src/pages/AccountPage.tsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, Settings, CloudLightning, RefreshCw, 
  UploadCloud, DownloadCloud, LogOut, CheckCircle2, AlertTriangle,
  Download, Upload, Trash2, Globe, Heart
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCloudSync } from '../hooks/useCloudSync';
import { useLanguage } from '../hooks/useLanguage';
import { useAppStore } from '../store/useAppStore';
import { LanguageSelector } from '../components/settings/LanguageSelector';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { AuthPage } from './AuthPage';

export default function AccountPage() {
  const { t, language } = useLanguage();
  const themeAccent = useAppStore(state => state.themeAccent);
  
  const { 
    user, 
    loading: authLoading, 
    isAuthenticated,
    logout,
    isSupabaseAvailable
  } = useAuth();

  const {
    syncing,
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
      
      setSuccessMsg(language === 'ar' ? 'تم تصدير نسخة احتياطية من خططك بنجاح.' : 'Backup downloaded successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg('Error: ' + err.message);
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

        setSuccessMsg(language === 'ar' ? 'تم استيراد نسخة خططك الاحتياطية بنجاح!' : 'Tactics imported successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err: any) {
        setErrorMsg('JSON error: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleWipeData = () => {
    const confirmMsg = language === 'ar' 
      ? 'هل أنت متأكد من مسح جميع التكتيكات تماما؟ لا يمكن الرجوع عن هذه الخطوة!' 
      : 'Wipe all saved plans? This action is irreversible!';
    if (window.confirm(confirmMsg)) {
      hardReset();
      window.location.reload();
    }
  };

  // Simplified Arabic-first multilanguage dictionary
  const dict = {
    title: {
      ar: "حسابي والضبط",
      en: "Profile & Settings",
      fr: "Mon compte & Configuration",
      es: "Mi cuenta y Ajustes"
    },
    secPlayerInfo: {
      ar: "بيانات اللاعب",
      en: "Player Details",
      fr: "Informations du joueur",
      es: "Datos del jugador"
    },
    secSettings: {
      ar: "الضبط والمظهر",
      en: "Settings & Appearance",
      fr: "Paramètres & Apparence",
      es: "Ajustes y Aspecto"
    },
    secOnlineSync: {
      ar: "حفظ أونلاين",
      en: "Save Online",
      fr: "Sauvegarder en ligne",
      es: "Guardar online"
    },
    statusGuest: {
      ar: "تعديل محلي (أوفلاين)",
      en: "Local Mode Available",
      fr: "Analyse hors ligne active",
      es: "Análisis offline activo"
    },
    guestDesc: {
      ar: "خططك كلها محفوظة في المتصفح المحلي بشكل آمن. لعدم فقد تكتيكاتك الهامة يرجى حفظها أوفلاين كملف أو التسجيل للحفظ أونلاين.",
      en: "Your plans are currently saved within local browser storage. Export backups manually to prevent losing your strategic layouts.",
      fr: "Vos données sont stockées localement sur ce navigateur.",
      es: "Tus datos se guardan localmente en el navegador."
    },
    cloudConnected: {
      ar: "متصل بحسابك الآمن",
      en: "Connected Securly",
      fr: "Sécurisé en ligne",
      es: "Conectado online"
    },
    cloudDesc: {
      ar: "بإمكانك مزامنة تكتيكاتك المصممة بالرفع والتنزيل من خوادمنا الفورية بنقرة واحدة لتلعب بها من أي هاتف آخر.",
      en: "Synchronize, load, and upload your eFootball custom plans instantly from our visual playbook servers.",
      fr: "Sauvegardez vos tactiques sur notre serveur pour y accéder n'importe où.",
      es: "Sincroniza tus tácticas con nuestros servidores para recuperarlas en cualquier móvil."
    },
    btnPush: {
      ar: "رفع خططي الحالية",
      en: "Upload Current Plans",
      fr: "Envoyer mes plans",
      es: "Subir mis planes"
    },
    btnPull: {
      ar: "تنزيل خططي المحفوظة",
      en: "Download Saved Plans",
      fr: "Charger mes plans",
      es: "Bajar mis planes"
    },
    lblLastSync: {
      ar: "آخر حفظ ناجح",
      en: "Last synced",
      fr: "Dernier enregistrement",
      es: "Última sincronización"
    },
    btnBackup: {
      ar: "تحميل نسخة احتياطية (ملف)",
      en: "Export manual file backup",
      fr: "Exporter un fichier",
      es: "Exportar archivo"
    },
    btnRestore: {
      ar: "استعادة من ملف",
      en: "Import file backup",
      fr: "Importer un fichier",
      es: "Importar archivo"
    },
    btnWipe: {
      ar: "مسح جميع التكتيكات والبدء من جديد",
      en: "Reset everything",
      fr: "Réinitialiser les données",
      es: "Restablecer datos"
    }
  };

  const getTranslation = (key: keyof typeof dict) => {
    return dict[key][language as 'en' | 'ar' | 'fr' | 'es'] || dict[key]['ar'];
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-2xl mx-auto py-2" data-testid="account-page">
      {/* Page Title Header */}
      <div className="border-b border-border/60 pb-3">
        <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white leading-tight">
          ⚙️ {getTranslation('title')}
        </h2>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: بيانات اللاعب (Player Info) */}
        <div className="bg-slate-900/60 border border-border/80 rounded-2xl p-5 space-y-4 shadow">
          <h3 className="text-sm font-black font-orbitron text-white uppercase tracking-wider flex items-center gap-2 border-b border-border/25 pb-2.5">
            <User className="w-4.5 h-4.5 text-[#10b981]" />
            <span>{getTranslation('secPlayerInfo')}</span>
          </h3>

          {isAuthenticated && user ? (
            <div className="flex items-center justify-between bg-slate-950/40 p-4 rounded-xl border border-border/40 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black uppercase text-sm select-none"
                  style={{ backgroundColor: themeAccent, color: '#000' }}
                >
                  {user.email?.[0] || 'U'}
                </div>
                <div className="min-w-0 leading-tight space-y-0.5">
                  <span className="font-extrabold text-white block truncate">
                    {user.user_metadata?.display_name || 'eFootball Pro Tactics Player'}
                  </span>
                  <span className="text-[10px] text-gray-500 block truncate">{user.email}</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="px-3.5 py-1.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-450 font-bold text-xs uppercase cursor-pointer"
              >
                {language === 'ar' ? 'خروج' : 'Logout'}
              </button>
            </div>
          ) : (
            <div className="bg-slate-950/20 p-4.5 rounded-xl border border-border/40 text-center space-y-1">
              <p className="text-xs text-gray-300 font-bold">
                {language === 'ar' ? 'أنت تتصفح حالياً كأجنبي ضيف (دون سحابة).' : 'You are currently browsing as a guest player.'}
              </p>
              <p className="text-[11px] text-gray-500">
                {language === 'ar' ? 'يمكنك ربط حسابك لحماية أونلاين بنقرة واحدة.' : 'You can synchronize online with a verified account.'}
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: الضبط والمظهر (Settings & Appearance) */}
        <div className="bg-slate-900/60 border border-border/80 rounded-2xl p-5 space-y-4 shadow">
          <h3 className="text-sm font-black font-orbitron text-white uppercase tracking-wider flex items-center gap-2 border-b border-border/25 pb-2.5">
            <Settings className="w-4.5 h-4.5 text-cyan-400" />
            <span>{getTranslation('secSettings')}</span>
          </h3>

          <div className="space-y-4">
            <LanguageSelector />
            <ThemeSelector />
          </div>
        </div>

        {/* SECTION 3: حفظ أونلاين (Save Online) instead of Cloud Sync / Supabase */}
        <div className="bg-slate-900/60 border border-border/80 rounded-2xl p-5 space-y-4 shadow">
          <h3 className="text-sm font-black font-orbitron text-white uppercase tracking-wider flex items-center gap-2 border-b border-border/25 pb-2.5">
            <CloudLightning className="w-4.5 h-4.5 text-amber-500" />
            <span>{getTranslation('secOnlineSync')}</span>
          </h3>

          {isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300">
                ✓ {getTranslation('cloudConnected')}
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                {getTranslation('cloudDesc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={performPushSync}
                  className="px-4 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-border text-xs font-black font-orbitron text-white text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm uppercase shrink-0"
                >
                  <UploadCloud className="w-4.5 h-4.5 text-cyan-400" />
                  <span>{getTranslation('btnPush')}</span>
                </button>

                <button
                  type="button"
                  onClick={performPullSync}
                  className="px-4 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-border text-xs font-black font-orbitron text-white text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm uppercase shrink-0"
                >
                  <DownloadCloud className="w-4.5 h-4.5 text-emerald-400" />
                  <span>{getTranslation('btnPull')}</span>
                </button>
              </div>

              {lastSyncTime && (
                <div className="text-center font-semibold pt-1">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                    {getTranslation('lblLastSync')}: {lastSyncTime}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-xl space-y-1.5">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                  🛡️ {getTranslation('statusGuest')}
                </span>
                <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                  {getTranslation('guestDesc')}
                </p>
              </div>

              {/* Login / Registration form for Save Online */}
              {isSupabaseAvailable && (
                <div className="border border-border/40 p-4.5 bg-slate-950/20 rounded-xl">
                  <AuthPage 
                    onAuthSuccess={() => window.location.reload()} 
                    onContinueAsGuest={() => {}} 
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Local Backup Tools Subcard */}
        <div className="bg-slate-900/60 border border-border/80 rounded-2xl p-5 space-y-4 shadow">
          <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/25 pb-2">
            📂 {language === 'ar' ? 'نسخ احتياطي يدوي' : 'Manual File Backup'}
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
            <button
              onClick={handleExport}
              className="px-4 py-3.5 rounded-xl border border-border bg-slate-900 hover:bg-slate-950 text-white text-center flex items-center justify-center gap-1.5 cursor-pointer uppercase font-orbitron"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>{getTranslation('btnBackup')}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3.5 rounded-xl border border-border bg-slate-900 hover:bg-slate-950 text-white text-center flex items-center justify-center gap-1.5 cursor-pointer uppercase font-orbitron"
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span>{getTranslation('btnRestore')}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </div>

          <div className="border-t border-border/25 pt-4">
            <button
              onClick={handleWipeData}
              className="w-full py-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-[#f43f5e] font-bold text-xs uppercase cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>{getTranslation('btnWipe')}</span>
            </button>
          </div>

          {(successMsg || errorMsg) && (
            <div className={`p-3 rounded-xl text-xs font-semibold border ${
              successMsg ? 'bg-green-500/10 border-green-500/20 text-green-400 animate-fadeIn' : 'bg-red-500/10 border-red-500/20 text-red-100 animate-fadeIn'
            }`}>
              {successMsg || errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { AccountPage };
