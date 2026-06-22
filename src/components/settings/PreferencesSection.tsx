import React, { useState } from 'react';
import { PreferencesSettings } from '../../types';

interface PreferencesSectionProps {
  initialSettings?: PreferencesSettings;
  onSavePreferences: (settings: PreferencesSettings) => Promise<{ success: boolean; error?: string }>;
  triggerToast: (msg: string, type: 'success' | 'error') => void;
}

export function PreferencesSection({
  initialSettings,
  onSavePreferences,
  triggerToast,
}: PreferencesSectionProps) {
  const [language, setLanguage] = useState<'en' | 'ar'>(initialSettings?.language ?? 'en');
  const [theme, setTheme] = useState<'dark' | 'light'>(initialSettings?.theme ?? 'dark');
  const [pushNotif, setPushNotif] = useState(initialSettings?.pushNotifications ?? true);
  const [emailDigest, setEmailDigest] = useState(initialSettings?.emailDigest ?? false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await onSavePreferences({
        language,
        theme,
        pushNotifications: pushNotif,
        emailDigest,
      });
      if (res.success) {
        triggerToast('Local environment preferences updated successfully!', 'success');
      } else {
        triggerToast(res.error || 'Failed to update preferences catalog.', 'error');
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred during updating preferences.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
    triggerToast(
      nextLang === 'ar'
        ? 'تم تحويل لغة التطبيق إلى العربية بنجاح!'
        : 'App language switched to English successfully!',
      'success'
    );
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    triggerToast(`Theme preference updated to ${nextTheme.toUpperCase()}`, 'success');
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 space-y-6">
      {/* Head */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
        <span className="text-xl">⚙️</span>
        <div>
          <h3 className="text-base font-bold text-white font-orbitron uppercase tracking-wider">Interface Preferences</h3>
          <p className="text-xs text-gray-400">Configure visual themes, localized languages, and notifications</p>
        </div>
      </div>

      <div className="space-y-5 pt-1">
        {/* Language switcher */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Application Language (اللغة)</h4>
            <p className="text-xs text-gray-400">Toggle display between English and Arabic translations</p>
          </div>
          <div className="flex items-center bg-surface2 border border-border rounded-lg p-0.5 select-none">
            <button
              type="button"
              onClick={() => { setLanguage('en'); triggerToast('Language changed to English', 'success'); }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                language === 'en' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => { setLanguage('ar'); triggerToast('تم تغيير اللغة إلى العربية', 'success'); }}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                language === 'ar' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Theme preference */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/20">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Display Theme</h4>
            <p className="text-xs text-gray-400">Default dark mode is optimized for high-intensity night play sessions</p>
          </div>
          <div className="flex items-center bg-surface2 border border-border rounded-lg p-0.5 select-none">
            <button
              type="button"
              onClick={() => { setTheme('dark'); triggerToast('Dark mode activated', 'success'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-gray-800 text-white border border-border' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>🌙</span> Dark
            </button>
            <button
              type="button"
              onClick={() => { setTheme('light'); triggerToast('Light mode preference registered', 'success'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                theme === 'light' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>☀️</span> Light
            </button>
          </div>
        </div>

        {/* Push notifications */}
        <div className="flex items-start justify-between gap-4 pt-4 border-t border-border/20">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Device Push Alerts
            </label>
            <p className="text-xs text-gray-400 leading-relaxed md:max-w-md">
              Receive live alerts when new predictive algorithms compile or defensive meta shifts are detected.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPushNotif(!pushNotif)}
            className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
              pushNotif ? 'bg-success' : 'bg-surface2 border border-border'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                pushNotif ? 'translate-x-[24px]' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        {/* Email digests */}
        <div className="flex items-start justify-between gap-4 pt-4 border-t border-border/20">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Weekly Strategies Digest
            </label>
            <p className="text-xs text-gray-400 leading-relaxed md:max-w-md">
              Receive a weekly summary email detailing top offensive formations and training drill guides.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEmailDigest(!emailDigest)}
            className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
              emailDigest ? 'bg-success' : 'bg-surface2 border border-border'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                emailDigest ? 'translate-x-[24px]' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? 'Registering Settings...' : 'Store Preferences'}
        </button>
      </div>
    </div>
  );
}
