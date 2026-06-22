import React, { useRef, useState } from 'react';
import { Download, Upload, Trash2, Award, Zap, HelpCircle, HardDrive, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppStateSchema } from '../../types/schemas';
import { TRANSLATIONS } from '../../lib/tactics';

export default function AppSettingsTab() {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  const setLanguage = useAppStore(state => state.setLanguage);
  const setThemeAccent = useAppStore(state => state.setThemeAccent);
  
  const matches = useAppStore(state => state.matches);
  const profiles = useAppStore(state => state.profiles);
  const customCoords = useAppStore(state => state.customCoords);
  const hardReset = useAppStore(state => state.hardReset);
  const importData = useAppStore(state => state.importData);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const handleExport = () => {
    const exportData = {
      version: 1,
      createdAt: new Date().toISOString(),
      themeAccent,
      language,
      profiles,
      matches,
      customCoords
    };

    const str = JSON.stringify(exportData, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ef26-tact tactics_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    setImportSuccess('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        const res = importData(fileContent);
        
        if (!res.success) {
          setImportError(res.message);
          return;
        }

        setImportSuccess(language === 'en' 
          ? 'Backup data imported and validated successfully!' 
          : 'تم استرداد البيانات ومراجعة الأمان بنجاح!');
        
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        setImportError(language === 'en' 
          ? 'Parsing failure. Ensure the file contains valid JSON.' 
          : 'فشل في قراءة الملف. يرجى التأكد من اختيار ملف فني صحيح.');
      }
    };
    reader.readAsText(file);
  };

  const handleWipeData = () => {
    if (window.confirm(language === 'en' 
      ? 'CRITICAL Action: Wipe all matches, custom profile listings, and layout coordinates forever?' 
      : 'تحذير حرج: هل ترغب بالفعل في حذف ومسح كافة البيانات والتشكيلات ومقاييس الأداء نهائياً؟')) {
      hardReset();
      window.location.reload();
    }
  };

  // Roadmaps specifications
  const roadmapItems = [
    { title: '🔒 Cloud Synchronization Storage', desc: 'Secure database linkages to persist user tactics layouts across diverse mobile browsers and computer states.', q: 'Q3 2026' },
    { title: '👥 Co-op Tactics Meta Libraries', desc: 'A community center to share custom role alignments, download team presets, and vote on efficacy rates.', q: 'Q4 2026' },
    { title: '📄 Pro-grade PDF Export Sheets', desc: 'Export deep tactical layouts, custom roles indexes, and team stats charts into clean visual PDF briefings.', q: 'Q1 2027' },
    { title: '📬 Meta Updates Subscription Feed', desc: 'Receive weekly meta analysis updates, automatic countering guides, and recommended squads directly inside your deck.', q: 'Q2 2027' }
  ];

  return (
    <div className="space-y-6 select-none font-sans" data-testid="settings-tab">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-black font-orbitron text-white leading-tight">⚙️ {t('settings')}</h2>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'en'
            ? 'Adjust linguistic settings, theme variables, and manage local backup databases safely'
            : 'تعديل الخصائص اللغوية، فريسة الألوان، وتنزيل أو استيراد بيانات الفريق بشكل آمن'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Side: Parameters adjustments */}
        <div className="space-y-6">
          <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4 font-semibold">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/40 pb-2">🌐 LANGUAGE & ACCENT VARIABLES</h3>

            {/* Language toggle */}
            <div className="space-y-1.5 text-xs text-gray-300">
              <span className="block text-[10px] uppercase font-bold text-gray-400 font-orbitron">Select Accent Language</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition duration-150 cursor-pointer ${
                    language === 'en' 
                      ? 'bg-primary text-navyBg border-primary font-black' 
                      : 'bg-slate-900 border-border/50 text-gray-400 hover:text-white'
                  }`}
                  style={language === 'en' ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition duration-150 cursor-pointer ${
                    language === 'ar' 
                      ? 'bg-primary text-navyBg border-primary font-black' 
                      : 'bg-slate-900 border-border/50 text-gray-400 hover:text-white'
                  }`}
                  style={language === 'ar' ? { backgroundColor: themeAccent, borderColor: themeAccent } : {}}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Accent theme picking */}
            <div className="space-y-2 text-xs text-gray-300">
              <span className="block text-[10px] uppercase font-bold text-gray-400 font-orbitron">Tactics Panel Accent Theme</span>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: 'Cyan Glow', val: '#00d4ff' },
                  { name: 'Blue Storm', val: '#3b82f6' },
                  { name: 'Cosmic Purple', val: '#a855f7' },
                  { name: 'Emerald Wave', val: '#10b981' },
                  { name: 'Amber Burst', val: '#f59e0b' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setThemeAccent(item.val)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 hover:border-gray-500 transition text-[10px] font-bold font-orbitron cursor-pointer bg-slate-900"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.val }} />
                    <span className={themeAccent === item.val ? 'text-white font-black' : 'text-gray-400'}>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4 font-semibold">
            <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/40 pb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" style={{ color: themeAccent }} /> STATE DATABASE BACKUPS
            </h3>

            {importError && (
              <div className="bg-rose-950/90 border border-rose-500/30 text-rose-200 p-3.5 rounded-xl text-xs font-bold">
                ⚠️ {importError}
              </div>
            )}

            {importSuccess && (
              <div className="bg-emerald-950/90 border border-emerald-500/30 text-emerald-200 p-3.5 rounded-xl text-xs font-bold animate-fadeIn">
                🟢 {importSuccess}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[11px] text-gray-400 leading-normal">
                Export matches records, custom coordinates alignments, and active profiles list into an official `.json` backup. This backup can be imported safely into any other browser anytime.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs bg-slate-900 border border-border/70 text-gray-300 hover:text-white hover:border-zinc-500 font-bold transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> <span>Export Data</span>
                </button>
                
                <button
                  onClick={handleImportClick}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs bg-slate-900 border border-border/70 text-gray-300 hover:text-white hover:border-zinc-500 font-bold transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> <span>Import Data</span>
                </button>
              </div>

              <input 
                ref={fileInputRef}
                type="file" 
                accept="application/json" 
                className="hidden" 
                onChange={handleImportFile}
              />
            </div>

            <div className="border-t border-border/30 pt-4 flex items-center justify-between">
              <div className="pr-3 text-[11px] text-gray-400 leading-tight">
                永久抹除所有戰術、賽事紀錄和地圖、坐標設置？
              </div>
              <button
                onClick={handleWipeData}
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                className="bg-rose-500/5 hover:bg-rose-500/10 border p-2.5 rounded-xl text-rose-400 hover:text-rose-500 font-bold font-orbitron uppercase text-[10px] tracking-wider shrink-0 transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> <span>{t('wipe_data')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: projected metadata and Roadmap */}
        <div className="bg-slate-950/40 border border-border/80 p-5 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-widest border-b border-border/40 pb-2">🎯 LABS ROADMAP & SQUAD CHECKS</h3>

          <div className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-border/60 rounded-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-black font-orbitron text-gray-400 uppercase block">Active Neural Engine</span>
              <span className="text-xs font-black font-orbitron text-emerald-400 uppercase">Gemini-1.5-Flash Active (Secure)</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-glow" />
          </div>

          <div className="space-y-3 pt-1 text-xs text-gray-300 leading-normal font-semibold">
            <span className="text-[10px] font-black font-orbitron text-primary uppercase tracking-wider block" style={{ color: themeAccent }}>🗺️ PLANNED LABS FEATURES</span>
            
            <div className="space-y-3.5">
              {roadmapItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-slate-900/40 p-3 rounded-xl border border-border/50">
                  <span className="text-primary font-black font-orbitron" style={{ color: themeAccent }}>{item.q}</span>
                  <div className="space-y-1 leading-normal font-sans">
                    <p className="text-xs font-bold text-white leading-normal">{item.title}</p>
                    <p className="text-[11px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
