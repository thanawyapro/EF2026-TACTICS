// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';

// Initialize i18next with react-i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es }
    },
    lng: 'ar', // Arabic is the absolute default for this project
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    },
    react: {
      useSuspense: false // avoids loading issues in low-speed mobile connections
    }
  });

// Automatically apply document direction & lang
export const updateDocumentDirection = (lang: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
};

export default i18n;
