// database.ts
// TypeScript database mapping for Supabase schema

export interface DbProfile {
  id: string; // references auth.users
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface DbMatch {
  id: string; // uuid
  user_id: string;
  team_name: string | null;
  opponent_name: string | null;
  user_formation: string;
  opponent_formation: string | null;
  score_for: number;
  score_against: number;
  possession: number | null;
  shots: number | null;
  shots_on_target: number | null;
  pass_accuracy: number | null;
  main_problem: string | null;
  notes: string | null;
  result: 'W' | 'L' | 'D' | 'win' | 'draw' | 'loss' | null;
  match_date: string;
  created_at: string;
  updated_at: string;
}

export interface DbTacticalProfile {
  id: string;
  user_id: string;
  name: string;
  formation: string;
  playstyle: string | null;
  defensive_style: string | null;
  instructions: any; // jsonb
  notes: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbCustomFormation {
  id: string;
  user_id: string;
  name: string;
  base_formation: string | null;
  players: any; // jsonb (PlayerNode[])
  pitch_layout: any; // jsonb
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbAIAnalysisHistory {
  id: string;
  user_id: string;
  analysis_type: string;
  input_data: any; // jsonb
  output_data: any; // jsonb
  model_used: string | null;
  created_at: string;
}

export interface DbMetaRadarCache {
  id: string;
  user_id: string;
  query: string;
  result_data: any; // jsonb
  sources: any; // jsonb
  checked_at: string;
  expires_at: string;
}

export interface DbUserSettings {
  user_id: string;
  theme: string;
  language: string;
  ai_mode: string;
  settings: any; // jsonb
  updated_at: string;
}
