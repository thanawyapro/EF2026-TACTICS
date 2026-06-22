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
   * Load all user cloud data and update the local store
   */
  async loadUserCloudData(userId: string) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client is not configured.');
    }

    // 1. Fetch matches
    const { data: cloudMatches, error: matchesErr } = await supabase
      .from('matches')
      .select('*')
      .eq('user_id', userId)
      .order('match_date', { ascending: false });

    if (matchesErr) throw matchesErr;

    // 2. Fetch profiles
    const { data: cloudProfiles, error: profilesErr } = await supabase
      .from('tactical_profiles')
      .select('*')
      .eq('user_id', userId);

    if (profilesErr) throw profilesErr;

    // 3. Fetch formations
    const { data: cloudFormations, error: formationsErr } = await supabase
      .from('custom_formations')
      .select('*')
      .eq('user_id', userId);

    if (formationsErr) throw formationsErr;

    // 4. Fetch settings
    const { data: cloudSettings, error: settingsErr } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (settingsErr) throw settingsErr;

    // 5. Fetch AI History
    const { data: cloudAIHistory, error: aiHistErr } = await supabase
      .from('ai_analysis_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (aiHistErr) throw aiHistErr;

    // Map Cloud Matches back to UI schema
    const localMatches: MatchRecord[] = (cloudMatches || []).map((db) => {
      const matchObj = {
        id: db.id,
        date: db.match_date || new Date().toISOString().split('T')[0],
        myFormation: db.user_formation,
        opponentFormation: db.opponent_formation || '4-3-3',
        myGoals: db.score_for ?? 0,
        opponentGoals: db.score_against ?? 0,
        result: (db.result === 'win' ? 'W' : db.result === 'loss' ? 'L' : db.result === 'draw' ? 'D' : db.result || 'D') as 'W' | 'L' | 'D',
        possession: db.possession ?? 50,
        myShots: db.shots ?? 10,
        onTarget: db.shots_on_target ?? 5,
        oppShots: db.shots ? Math.max(0, db.shots - 2) : 8,
        oppOnTarget: db.shots_on_target ? Math.max(0, db.shots_on_target - 1) : 4,
        feltControlLoss: db.main_problem === 'Control Loss',
        matchType: db.team_name || 'Division Match',
        notes: db.notes || '',
      };
      
      const parsed = MatchRecordSchema.safeParse(matchObj);
      return parsed.success ? parsed.data : matchObj;
    });

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

    // Map Cloud Formations back to custom coordinates
    const localCoords: Record<string, PlayerNode[]> = {};
    (cloudFormations || []).forEach((db) => {
      if (db.base_formation && Array.isArray(db.players)) {
        localCoords[db.base_formation] = db.players as PlayerNode[];
      }
    });

    // Map cloud settings
    const lang = (cloudSettings?.language === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
    const accent = cloudSettings?.settings?.themeAccent || '#00d4ff';

    // Map AI History
    const localAIHistory = (cloudAIHistory || []).map((db) => ({
      id: db.id,
      timestamp: db.created_at,
      request: db.input_data,
      response: db.output_data,
    }));

    return {
      matches: localMatches,
      profiles: localProfiles,
      customCoords: localCoords,
      language: lang,
      themeAccent: accent,
      aiHistory: localAIHistory,
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
   * Sync complete Custom Formations block to cloud
   */
  async saveFormationToCloud(userId: string, formation: string, coords: PlayerNode[]) {
    if (!isSupabaseConfigured || !supabase) return;

    // Use a unique compound id based on base formation name to prevent duplicating pitch coordinates
    const dbId = getOrCreateUUID(`formation_${formation}`);
    const dbPayload = {
      id: dbId,
      user_id: userId,
      name: `Custom ${formation}`,
      base_formation: formation,
      players: coords,
      pitch_layout: { formation },
      notes: 'Custom position layout pitch coords',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('custom_formations').upsert(dbPayload);
    if (error) console.error('Cloud formation save mismatch:', error);
  },

  /**
   * Save an AI coach analysis entry to the cloud
   */
  async saveAIAnalysisToCloud(userId: string, aiItem: any) {
    if (!isSupabaseConfigured || !supabase) return;

    const dbId = getOrCreateUUID(aiItem.id);
    const dbPayload = {
      id: dbId,
      user_id: userId,
      analysis_type: 'tactics_coach',
      input_data: aiItem.request,
      output_data: aiItem.response,
      model_used: 'gemini-3.5-flash',
      created_at: aiItem.timestamp || new Date().toISOString(),
    };

    const { error } = await supabase.from('ai_analysis_history').upsert(dbPayload);
    if (error) console.error('Cloud AI history save mismatch:', error);
  },

  /**
   * Delete an item from the cloud
   */
  async deleteCloudItem(userId: string, table: 'matches' | 'tactical_profiles' | 'custom_formations', localId: string) {
    if (!isSupabaseConfigured || !supabase) return;

    const mappedId = getOrCreateUUID(localId);
    const { error } = await supabase.from(table).delete().eq('id', mappedId).eq('user_id', userId);
    if (error) console.error(`Failed to delete item from cloud (${table}):`, error);
  },

  /**
   * Sync active Zustand store to Supabase Cloud
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

    // 2. Push matches
    if (state.matches.length > 0) {
      for (const m of state.matches) {
        await this.saveMatchToCloud(userId, m);
      }
    }

    // 3. Push profiles
    if (state.profiles.length > 0) {
      for (const p of state.profiles) {
        await this.saveProfileToCloud(userId, p);
      }
    }

    // 4. Push custom positions coordinates
    const coordKeys = Object.keys(state.customCoords);
    for (const key of coordKeys) {
      await this.saveFormationToCloud(userId, key, state.customCoords[key]);
    }

    // 5. Push AI coach summary histories
    if (state.aiHistory && state.aiHistory.length > 0) {
      for (const ai of state.aiHistory) {
        await this.saveAIAnalysisToCloud(userId, ai);
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
