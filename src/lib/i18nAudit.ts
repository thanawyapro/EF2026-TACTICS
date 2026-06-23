// src/lib/i18nAudit.ts
import ar from '../i18n/locales/ar.json';
import en from '../i18n/locales/en.json';
import fr from '../i18n/locales/fr.json';
import es from '../i18n/locales/es.json';

export interface I18nAuditReport {
  allKeysCount: number;
  locales: {
    [localeName: string]: {
      totalKeys: number;
      missingKeysCount: number;
      missingKeys: string[];
      coveragePercent: number;
    };
  };
  hasDiscrepancies: boolean;
}

/**
 * Recursively extracts all dot-notation keys from a nested translation JSON object.
 * Arrays of strings are treated as leaves to keep keys coherent.
 */
function getFlattenedKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const key of Object.keys(obj)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      keys = keys.concat(getFlattenedKeys(obj[key], nextPrefix));
    }
  } else {
    if (prefix) {
      keys.push(prefix);
    }
  }
  return keys;
}

/**
 * Audits all application translations to find missing keys and verify bilingual alignment.
 */
export function runI18nAudit(): I18nAuditReport {
  const translations: { [locale: string]: any } = { ar, en, fr, es };
  const localeKeysMap: { [locale: string]: string[] } = {};
  const allKeysSet = new Set<string>();

  // Extract keys for each locale
  for (const locale of Object.keys(translations)) {
    const keys = getFlattenedKeys(translations[locale]);
    localeKeysMap[locale] = keys;
    keys.forEach(k => allKeysSet.add(k));
  }

  const masterKeys = Array.from(allKeysSet).sort();
  const allKeysCount = masterKeys.length;

  const report: I18nAuditReport = {
    allKeysCount,
    locales: {},
    hasDiscrepancies: false
  };

  for (const locale of Object.keys(translations)) {
    const keys = localeKeysMap[locale];
    const keySet = new Set(keys);
    const missingKeys: string[] = [];

    for (const masterKey of masterKeys) {
      if (!keySet.has(masterKey)) {
        missingKeys.push(masterKey);
      }
    }

    const missingKeysCount = missingKeys.length;
    if (missingKeysCount > 0) {
      report.hasDiscrepancies = true;
    }

    const totalKeys = keys.length;
    // Coverage is calculated relative to the full union of all defined translation keys
    const coveragePercent = allKeysCount > 0 
      ? Math.round(((allKeysCount - missingKeysCount) / allKeysCount) * 100) 
      : 100;

    report.locales[locale] = {
      totalKeys,
      missingKeysCount,
      missingKeys,
      coveragePercent
    };
  }

  // Console logging inside development environment
  const isDev = (import.meta as any).env?.DEV ?? true;
  if (isDev) {
    console.groupCollapsed(
      `🌐 [%cEF26 I18N Audit%c] Verified ${allKeysCount} unique translation keys across ${Object.keys(translations).length} languages.`,
      'color: #00d4ff; font-weight: bold;',
      'color: inherit;'
    );

    Object.entries(report.locales).forEach(([locale, data]) => {
      const isHealthy = data.missingKeysCount === 0;
      const statusColor = isHealthy ? 'color: #10b981' : 'color: #ef4444';
      
      console.log(
        `%c• Locale [${locale.toUpperCase()}]%c - Coverage: %c${data.coveragePercent}% %c(${data.totalKeys}/${allKeysCount} keys). Missing: %c${data.missingKeysCount}`,
        'font-weight: bold; color: #fff;',
        'color: inherit;',
        'font-weight: bold; color: #00eaaf;',
        'color: inherit;',
        `${statusColor}; font-weight: bold;`
      );

      if (data.missingKeys.length > 0) {
        console.warn(`[${locale.toUpperCase()}] Missing Keys:`, data.missingKeys);
      }
    });

    console.groupEnd();
  }

  return report;
}
