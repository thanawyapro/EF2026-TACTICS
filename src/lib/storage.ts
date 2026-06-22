import { PlayerNode, TacticalProfile } from './tactics';

export interface MatchRecord {
  id: string;
  date: string;
  myFormation: string;
  opponentFormation: string;
  myGoals: number;
  opponentGoals: number;
  result: 'W' | 'L' | 'D';
  possession: number;
  myShots: number;
  onTarget: number;
  oppShots: number;
  oppOnTarget: number;
  feltControlLoss: boolean; // replaced feltScripted
  matchType: string;
  notes: string;
}

const STORAGE_KEYS = {
  MATCHES: 'ef26_matches',
  CUSTOM_COORDS: 'ef26_custom_coords',
  PROFILES: 'ef26_profiles',
  ACTIVE_PROFILE_ID: 'ef26_active_profile_id',
  LANGUAGE: 'ef26_language',
  THEME_ACCENT: 'ef26_theme_accent'
};

const INITIAL_MATCHES: MatchRecord[] = [
  { id: 'm1', date: '2026-06-21', myFormation: '4-3-3', opponentFormation: '4-2-2-2', myGoals: 3, opponentGoals: 1, result: 'W', possession: 55, myShots: 11, onTarget: 7, oppShots: 4, oppOnTarget: 2, feltControlLoss: false, matchType: 'Division Match', notes: 'Countered their long balls masterfully. Subbed in AMF for quick assist.' },
  { id: 'm2', date: '2026-06-20', myFormation: '4-2-3-1', opponentFormation: '4-1-2-1-2', myGoals: 1, opponentGoals: 2, result: 'L', possession: 46, myShots: 6, onTarget: 2, oppShots: 8, oppOnTarget: 5, feltControlLoss: true, matchType: 'Division Match', notes: 'Hit post twice. GK made 9 impossible saves. Opponent pressed heavily on wings.' },
  { id: 'm3', date: '2026-06-19', myFormation: '4-2-2-2', opponentFormation: '4-3-3', myGoals: 2, opponentGoals: 2, result: 'D', possession: 50, myShots: 9, onTarget: 5, oppShots: 8, oppOnTarget: 4, feltControlLoss: false, matchType: 'Friendly Match', notes: 'Intense match. Traded blows until physical tiredness kicked in at min 80.' },
  { id: 'm4', date: '2026-06-18', myFormation: '4-1-4-1', opponentFormation: '4-5-1', myGoals: 2, opponentGoals: 0, result: 'W', possession: 58, myShots: 12, onTarget: 8, oppShots: 3, oppOnTarget: 1, feltControlLoss: false, matchType: 'Division Match', notes: 'Tiki-Taka masterclass. Completely dominated the midfield territory.' },
  { id: 'm5', date: '2026-06-17', myFormation: '3-5-2', opponentFormation: '4-2-2-2', myGoals: 1, opponentGoals: 3, result: 'L', possession: 40, myShots: 5, onTarget: 3, oppShots: 10, oppOnTarget: 7, feltControlLoss: true, matchType: 'Co-op Match', notes: 'Overwhelmed by opponent high-speed counter attacks up the wing.' }
];

export const loadMatches = (): MatchRecord[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(INITIAL_MATCHES));
    return INITIAL_MATCHES;
  }
  return JSON.parse(data);
};

export const saveMatches = (matches: MatchRecord[]) => {
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
};

export const loadCustomCoords = (): Record<string, PlayerNode[]> => {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_COORDS);
  return data ? JSON.parse(data) : {};
};

export const saveCustomCoords = (coords: Record<string, PlayerNode[]>) => {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_COORDS, JSON.stringify(coords));
};

export const loadProfiles = (fallbackPreset: TacticalProfile[]): TacticalProfile[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(fallbackPreset));
    return fallbackPreset;
  }
  return JSON.parse(data);
};

export const saveProfiles = (profiles: TacticalProfile[]) => {
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
};

export const loadActiveProfileId = (): string => {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID) || '1';
};

export const saveActiveProfileId = (id: string) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
};

export const loadLanguage = (): 'en' | 'ar' => {
  const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  return lang === 'ar' ? 'ar' : 'en';
};

export const saveLanguage = (lang: 'en' | 'ar') => {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
};

export const loadThemeAccent = (): string => {
  return localStorage.getItem(STORAGE_KEYS.THEME_ACCENT) || '#00d4ff';
};

export const saveThemeAccent = (color: string) => {
  localStorage.setItem(STORAGE_KEYS.THEME_ACCENT, color);
};

export const exportAppState = (): string => {
  const state = {
    matches: loadMatches(),
    custom_coords: loadCustomCoords(),
    profiles: loadProfiles([]),
    active_profile_id: loadActiveProfileId(),
    language: loadLanguage(),
    theme_accent: loadThemeAccent()
  };
  return JSON.stringify(state, null, 2);
};

export const importAppState = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.matches) saveMatches(parsed.matches);
    if (parsed.custom_coords) saveCustomCoords(parsed.custom_coords);
    if (parsed.profiles) saveProfiles(parsed.profiles);
    if (parsed.active_profile_id) saveActiveProfileId(parsed.active_profile_id);
    if (parsed.language) saveLanguage(parsed.language);
    if (parsed.theme_accent) saveThemeAccent(parsed.theme_accent);
    return true;
  } catch (error) {
    console.error('Failed to import config:', error);
    return false;
  }
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.MATCHES);
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_COORDS);
  localStorage.removeItem(STORAGE_KEYS.PROFILES);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
  localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
  localStorage.removeItem(STORAGE_KEYS.THEME_ACCENT);
};
