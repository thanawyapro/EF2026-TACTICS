import { create } from 'zustand';
import { 
  MatchRecord, TacticalProfile, PlayerNode, AIResponse, AppState, 
  AppStateSchema, MatchRecordSchema 
} from '../types/schemas';
import { DEFAULT_PROFILES, COORDS } from '../lib/tactics';

interface AppStore {
  // States
  matches: MatchRecord[];
  customCoords: Record<string, PlayerNode[]>;
  profiles: TacticalProfile[];
  activeProfileId: string;
  language: 'en' | 'ar';
  themeAccent: string;
  onboarded: boolean;
  aiHistory: Array<{
    id: string;
    timestamp: string;
    request: {
      userFormation: string;
      opponentFormation: string;
      score: string;
      possession: number;
      shots: number;
      shotsOnTarget: number;
      passAccuracy: number;
      problem: string;
      notes: string;
    };
    response: AIResponse;
  }>;

  // Actions
  addMatch: (match: MatchRecord) => void;
  deleteMatch: (id: string) => void;
  updateCustomCoords: (formation: string, coords: PlayerNode[]) => void;
  resetCustomCoords: (formation: string) => void;
  resetAllCustomCoords: () => void;
  addProfile: (profile: TacticalProfile) => void;
  updateProfile: (profile: TacticalProfile) => void;
  deleteProfile: (id: string) => void;
  setActiveProfileId: (id: string) => void;
  setLanguage: (language: 'en' | 'ar') => void;
  setThemeAccent: (color: string) => void;
  setOnboarded: (val: boolean) => void;
  addAiHistory: (request: any, response: AIResponse) => void;
  clearAiHistory: () => void;
  exportData: () => string;
  importData: (jsonString: string) => { success: boolean; message: string };
  hardReset: () => void;
}

// LocalStorage key helper
const STORAGE_KEYS = {
  APP_STATE: 'ef26_app_state_v1',
};

// Safe defaults loader
const loadInitialState = () => {
  const defaultState = {
    matches: [
      { id: 'm1', date: '2026-06-21', myFormation: '4-3-3', opponentFormation: '4-2-2-2', myGoals: 3, opponentGoals: 1, result: 'W' as const, possession: 55, myShots: 11, onTarget: 7, oppShots: 4, oppOnTarget: 2, feltControlLoss: false, matchType: 'Division Match', notes: 'Countered their long balls masterfully. Subbed in AMF for quick assist.' },
      { id: 'm2', date: '2026-06-20', myFormation: '4-2-3-1', opponentFormation: '4-1-2-1-2', myGoals: 1, opponentGoals: 2, result: 'L' as const, possession: 46, myShots: 6, onTarget: 2, oppShots: 8, oppOnTarget: 5, feltControlLoss: true, matchType: 'Division Match', notes: 'Hit post twice. GK made 9 impossible saves. Opponent pressed heavily on wings.' },
      { id: 'm3', date: '2026-06-19', myFormation: '4-2-2-2', opponentFormation: '4-3-3', myGoals: 2, opponentGoals: 2, result: 'D' as const, possession: 50, myShots: 9, onTarget: 5, oppShots: 8, oppOnTarget: 4, feltControlLoss: false, matchType: 'Friendly Match', notes: 'Intense match. Traded blows until physical tiredness kicked in at min 80.' },
      { id: 'm4', date: '2026-06-18', myFormation: '4-1-4-1', opponentFormation: '4-5-1', myGoals: 2, opponentGoals: 0, result: 'W' as const, possession: 58, myShots: 12, onTarget: 8, oppShots: 3, oppOnTarget: 1, feltControlLoss: false, matchType: 'Division Match', notes: 'Tiki-Taka masterclass. Completely dominated the midfield territory.' },
      { id: 'm5', date: '2026-06-17', myFormation: '3-5-2', opponentFormation: '4-2-2-2', myGoals: 1, opponentGoals: 3, result: 'L' as const, possession: 40, myShots: 5, onTarget: 3, oppShots: 10, oppOnTarget: 7, feltControlLoss: true, matchType: 'Co-op Match', notes: 'Overwhelmed by opponent high-speed counter attacks up the wing.' }
    ],
    customCoords: {} as Record<string, PlayerNode[]>,
    profiles: DEFAULT_PROFILES,
    activeProfileId: '1',
    language: 'en' as const,
    themeAccent: '#00d4ff',
    onboarded: false,
    aiHistory: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_STATE);
    if (!raw) return defaultState;
    
    const parsed = JSON.parse(raw);
    
    // Add internal versioning check inside Zod Schema validation
    const validated = AppStateSchema.safeParse(parsed);
    if (validated.success) {
      return {
        ...defaultState,
        ...validated.data,
        onboarded: parsed.onboarded ?? false, // handle onboarding in local storage
      };
    }
    
    console.warn('LocalStorage data failed validity check, sliding back to safe production fallbacks:', validated.error);
    return defaultState;
  } catch (err) {
    console.error('Critical failure retrieving client side database records:', err);
    return defaultState;
  }
};

const initialState = loadInitialState();

export const useAppStore = create<AppStore>((set, get) => {
  // Sync state helper to write back to local storage
  const syncToStorage = (newState: Partial<AppStore>) => {
    try {
      const state = get();
      const payload = {
        version: '1.0.0', // matching app version in package.json
        createdAt: new Date().toISOString(),
        matches: newState.matches ?? state.matches,
        customCoords: newState.customCoords ?? state.customCoords,
        profiles: newState.profiles ?? state.profiles,
        activeProfileId: newState.activeProfileId ?? state.activeProfileId,
        language: newState.language ?? state.language,
        themeAccent: newState.themeAccent ?? state.themeAccent,
        aiHistory: newState.aiHistory ?? state.aiHistory,
        onboarded: newState.onboarded !== undefined ? newState.onboarded : state.onboarded,
      };
      localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(payload));
    } catch (err) {
      console.error('Unable to synchronize in-memory tactical schema with local database:', err);
    }
  };

  return {
    ...initialState,

    addMatch: (match) => {
      const updated = [match, ...get().matches];
      set({ matches: updated });
      syncToStorage({ matches: updated });
    },

    deleteMatch: (id) => {
      const updated = get().matches.filter(m => m.id !== id);
      set({ matches: updated });
      syncToStorage({ matches: updated });
    },

    updateCustomCoords: (formation, coords) => {
      const updated = {
        ...get().customCoords,
        [formation]: coords
      };
      set({ customCoords: updated });
      syncToStorage({ customCoords: updated });
    },

    resetCustomCoords: (formation) => {
      const updated = { ...get().customCoords };
      delete updated[formation];
      set({ customCoords: updated });
      syncToStorage({ customCoords: updated });
    },

    resetAllCustomCoords: () => {
      set({ customCoords: {} });
      syncToStorage({ customCoords: {} });
    },

    addProfile: (profile) => {
      const updated = [...get().profiles, profile];
      set({ profiles: updated });
      syncToStorage({ profiles: updated });
    },

    updateProfile: (profile) => {
      const updated = get().profiles.map(p => p.id === profile.id ? profile : p);
      set({ profiles: updated });
      syncToStorage({ profiles: updated });
    },

    deleteProfile: (id) => {
      const updated = get().profiles.filter(p => p.id !== id);
      set({ profiles: updated });
      syncToStorage({ profiles: updated });
    },

    setActiveProfileId: (id) => {
      set({ activeProfileId: id });
      syncToStorage({ activeProfileId: id });
    },

    setLanguage: (lang) => {
      set({ language: lang });
      syncToStorage({ language: lang });
    },

    setThemeAccent: (color) => {
      set({ themeAccent: color });
      syncToStorage({ themeAccent: color });
    },

    setOnboarded: (val) => {
      set({ onboarded: val });
      syncToStorage({ onboarded: val });
    },

    addAiHistory: (request, response) => {
      const newReport = {
        id: 'ai_' + Date.now().toString(),
        timestamp: new Date().toISOString(),
        request,
        response
      };
      const updated = [newReport, ...get().aiHistory];
      set({ aiHistory: updated });
      syncToStorage({ aiHistory: updated });
    },

    clearAiHistory: () => {
      set({ aiHistory: [] });
      syncToStorage({ aiHistory: [] });
    },

    exportData: () => {
      const state = get();
      const payload = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        matches: state.matches,
        customCoords: state.customCoords,
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        language: state.language,
        themeAccent: state.themeAccent,
        aiHistory: state.aiHistory,
        onboarded: state.onboarded,
      };
      return JSON.stringify(payload, null, 2);
    },

    importData: (jsonString) => {
      try {
        const parsed = JSON.parse(jsonString);
        
        // Zod validation
        const verified = AppStateSchema.safeParse(parsed);
        if (!verified.success) {
          const firstError = verified.error.issues[0];
          return {
            success: false,
            message: `Invalid schema formatting: ${firstError.path.join('.')} - ${firstError.message}`
          };
        }

        const data = verified.data;
        set({
          matches: data.matches,
          customCoords: data.customCoords || {},
          profiles: data.profiles,
          activeProfileId: data.activeProfileId,
          language: data.language,
          themeAccent: data.themeAccent,
          aiHistory: data.aiHistory || [],
          onboarded: parsed.onboarded ?? true
        });

        // Save back fully
        syncToStorage(data);

        return {
          success: true,
          message: 'Data imported and verified successfully!'
        };
      } catch (err: any) {
        return {
          success: false,
          message: `Unexpected backup file parsing error: ${err.message || 'Check syntax'}`
        };
      }
    },

    hardReset: () => {
      localStorage.removeItem(STORAGE_KEYS.APP_STATE);
      
      const resetState = {
        matches: [],
        customCoords: {},
        profiles: DEFAULT_PROFILES,
        activeProfileId: '1',
        language: 'en' as const,
        themeAccent: '#00d4ff',
        onboarded: false,
        aiHistory: [],
      };
      
      set(resetState);
      
      const payload = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        ...resetState
      };
      localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(payload));
    }
  };
});
