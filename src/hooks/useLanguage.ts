// src/hooks/useLanguage.ts
import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import i18n, { updateDocumentDirection } from '../i18n';

export function useLanguage() {
  const language = useAppStore(state => state.language);
  const setLanguageState = useAppStore(state => state.setLanguage);

  // Keep i18next and index HTML attributes aligned on boot and whenever language changes
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    updateDocumentDirection(language);
  }, [language]);

  const changeLanguage = (lang: 'en' | 'ar' | 'fr' | 'es') => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    updateDocumentDirection(lang);
  };

  // Safe wrapper for translator function
  const t = (key: string, options?: any): string => {
    return (i18n.t(key, options) as string) || key;
  };

  return {
    language,
    changeLanguage,
    t,
    isRtl: language === 'ar'
  };
}
