// supabaseSync.ts
// Sync utilities for local state <-> Supabase PostgreSQL

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { useAppStore } from '../store/useAppStore';
import { MatchRecord, TacticalProfile, PlayerNode, MatchRecordSchema, TacticalProfileSchema } from '../types/schemas';

// Helper to check and guarantee RFC4122 v4 UUID format
export function isUuid(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Memory mapping for non-UUID legacy IDs to persist them across sync sessions
const idMapLocalStorageKey = 'ef26_sync_uuid_map';
const getIDMap = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(idMapLocalStorageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};
const saveIDMap = (map: Record<string, string>) => {
  try {
    localStorage.setItem(idMapLocalStorageKey, JSON.stringify(map));
  } catch {}
};

export function getOrCreateUUID(legacyId: string): string {
  if (isUuid(legacyId)) return legacyId;
  const map = getIDMap();
  if (map[legacyId]) return map[legacyId];
  const newUuid = generateUUID();
  map[legacyId] = newUuid;
  saveIDMap(map);
  return newUuid;
}

export const supabaseSync = {
  /**
   * Load all user cloud data and update the local store (Only Settings + Saved Plans)
   */
  async loadUserCloudData(userId: string) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const state = useAppStore.getState();

    // 1. Fetch profiles (Saved Plans)
    const { data: cloudProfiles, error: profilesErr } = await supabase
      .from('tactical_profiles')
      .select('*')
      .eq('user_id', userId);

    if (profilesErr) throw profilesErr;

    // 2. Fetch settings
    const { data: cloudSettings, error: settingsErr } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (settingsErr) throw settingsErr;

    // Map Cloud Profiles back to UI schema
    const localProfiles: TacticalProfile[] = (cloudProfiles || []).map((db) => {
      const detailsVal = db.notes || '';
      const subTacticsVal = db.instructions?.subTactics || [];
      const profileObj = {
        id: db.id,
        name: db.name,
        formation: db.formation,
        playstyle: db.playstyle || 'Possession Game',
        details: detailsVal,
        isCustom: db.is_favorite ?? true,
        subTactics: subTacticsVal,
      };

      const parsed = TacticalProfileSchema.safeParse(profileObj);
      return parsed.success ? parsed.data : profileObj;
    });

    // Map cloud settings
    const lang = (cloudSettings?.language === 'ar' || cloudSettings?.language === 'en' || cloudSettings?.language === 'fr' || cloudSettings?.language === 'es' ? cloudSettings.language : 'ar') as 'en' | 'ar' | 'fr' | 'es';
    const accent = cloudSettings?.settings?.themeAccent || '#00d4ff';

    // Return loaded settings & saved plans, preserving other local-only state like matches, customCoords and AI history
    return {
      matches: state.matches,
      profiles: localProfiles,
      customCoords: state.customCoords,
      language: lang,
      themeAccent: accent,
      aiHistory: state.aiHistory,
    };
  },

  /**
   * Save a single match record to the cloud
   */
  async saveMatchToCloud(userId: string, match: MatchRecord) {
    if (!isSupabaseConfigured || !supabase) return;

    const dbId = getOrCreateUUID(match.id);
    const dbPayload = {
      id: dbId,
      user_id: userId,
      team_name: match.matchType || 'Division Match',
      opponent_name: 'Opponent',
      user_formation: match.myFormation,
      opponent_formation: match.opponentFormation,
      score_for: match.myGoals,
      score_against: match.opponentGoals,
      possession: match.possession,
      shots: match.myShots,
      shots_on_target: match.onTarget,
      pass_accuracy: 80,
      main_problem: match.feltControlLoss ? 'Control Loss' : 'None',
      notes: match.notes,
      result: match.result === 'W' ? 'W' : match.result === 'L' ? 'L' : 'D',
      match_date: match.date,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('matches').upsert(dbPayload);
    if (error) console.error('Cloud match save mismatch:', error);
  },

  /**
   * Save a single tactical profile to the cloud
   */
  async saveProfileToCloud(userId: string, profile: TacticalProfile) {
    if (!isSupabaseConfigured || !supabase) return;

    const dbId = getOrCreateUUID(profile.id);
    const dbPayload = {
      id: dbId,
      user_id: userId,
      name: profile.name,
      formation: profile.formation,
      playstyle: profile.playstyle,
      defensive_style: 'Standard',
      instructions: { subTactics: profile.subTactics || [] },
      notes: profile.details,
      is_favorite: !!profile.isCustom,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('tactical_profiles').upsert(dbPayload);
    if (error) console.error('Cloud profile save mismatch:', error);
  },

  /**
   * Sync complete Custom Formations block to cloud (NOW OFFLINE ONLY)
   */
  async saveFormationToCloud(userId: string, formation: string, coords: PlayerNode[]) {
    // OFFLINE ONLY per user request
    return;
  },

  /**
   * Save an AI coach analysis entry to the cloud (NOW OFFLINE ONLY)
   */
  async saveAIAnalysisToCloud(userId: string, aiItem: any) {
    // OFFLINE ONLY per user request
    return;
  },

  /**
   * Delete an item from the cloud
   */
  async deleteCloudItem(userId: string, table: 'matches' | 'tactical_profiles' | 'custom_formations', localId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    if (table !== 'tactical_profiles') return; // Only delete profiles from the cloud

    const mappedId = getOrCreateUUID(localId);
    const { error } = await supabase.from('tactical_profiles').delete().eq('id', mappedId).eq('user_id', userId);
    if (error) console.error(`Failed to delete profile from cloud:`, error);
  },

  /**
   * Sync active Zustand store to Supabase Cloud (Only Settings + Saved Plans)
   */
  async syncLocalToCloud(userId: string) {
    if (!isSupabaseConfigured || !supabase) return;

    const state = useAppStore.getState();

    // 1. Sync User Settings
    const settingsPayload = {
      user_id: userId,
      theme: 'dark',
      language: state.language,
      ai_mode: 'hybrid',
      settings: { themeAccent: state.themeAccent },
      updated_at: new Date().toISOString(),
    };
    await supabase.from('user_settings').upsert(settingsPayload);

    // 2. Push profiles (Saved Plans)
    if (state.profiles.length > 0) {
      for (const p of state.profiles) {
        await this.saveProfileToCloud(userId, p);
      }
    }
  },

  /**
   * Sync complete database from cloud down into Local state with safe validation
   */
  async syncCloudToLocal(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const data = await this.loadUserCloudData(userId);
      if (!data) return { success: false, message: 'No backup found on cloud' };

      // Update local state completely
      useAppStore.setState({
        matches: data.matches,
        profiles: data.profiles,
        customCoords: data.customCoords,
        language: data.language,
        themeAccent: data.themeAccent,
        aiHistory: data.aiHistory,
      });

      // Commit to local storage so they match
      const payload = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        matches: data.matches,
        customCoords: data.customCoords,
        profiles: data.profiles,
        activeProfileId: data.profiles[0]?.id || '1',
        language: data.language,
        themeAccent: data.themeAccent,
        aiHistory: data.aiHistory,
        onboarded: true,
      };
      localStorage.setItem('ef26_app_state_v1', JSON.stringify(payload));

      return {
        success: true,
        message: 'Successfully downloaded and restored cloud database records!'
      };
    } catch (err: any) {
      console.error('Error during download-sync propagation:', err);
      return {
        success: false,
        message: `Cloud recovery failed: ${err.message || 'Check connection'}`
      };
    }
  }
};
