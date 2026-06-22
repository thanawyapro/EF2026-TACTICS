-- 202606230001_initial_schema.sql
-- Supabase initial production schema for EF26 Tactics Labs

-- Enable PGCRYPTO for uuid generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Reusable function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create tables

-- 1. public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  avatar_url text,
  preferred_language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. public.matches
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_name text,
  opponent_name text,
  user_formation text NOT NULL,
  opponent_formation text,
  score_for int DEFAULT 0,
  score_against int DEFAULT 0,
  possession int,
  shots int,
  shots_on_target int,
  pass_accuracy int,
  main_problem text,
  notes text,
  result text CHECK (result IN ('W', 'L', 'D', 'win', 'draw', 'loss')),
  match_date date DEFAULT current_date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. public.tactical_profiles
CREATE TABLE IF NOT EXISTS public.tactical_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  formation text NOT NULL,
  playstyle text,
  defensive_style text,
  instructions jsonb DEFAULT '{}'::jsonb,
  notes text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. public.custom_formations
CREATE TABLE IF NOT EXISTS public.custom_formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  base_formation text,
  players jsonb NOT NULL DEFAULT '[]'::jsonb,
  pitch_layout jsonb DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. public.ai_analysis_history
CREATE TABLE IF NOT EXISTS public.ai_analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  analysis_type text NOT NULL,
  input_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  model_used text,
  created_at timestamptz DEFAULT now()
);

-- 6. public.meta_radar_cache
CREATE TABLE IF NOT EXISTS public.meta_radar_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query text NOT NULL,
  result_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  sources jsonb DEFAULT '[]'::jsonb,
  checked_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- 7. public.user_settings
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'dark',
  language text DEFAULT 'en',
  ai_mode text DEFAULT 'hybrid',
  settings jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Apply set_updated_at triggers
CREATE TRIGGER trigger_set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_set_updated_at_matches
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_set_updated_at_tactical_profiles
  BEFORE UPDATE ON public.tactical_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_set_updated_at_custom_formations
  BEFORE UPDATE ON public.custom_formations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_set_updated_at_user_settings
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- Configure RLS (Row Level Security)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tactical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_radar_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies (using (SELECT auth.uid()))

-- Policies for public.profiles
CREATE POLICY "Users can select their own profile"
  ON public.profiles FOR SELECT
  USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = (SELECT auth.uid()));

-- Policies for public.matches
CREATE POLICY "Users can select their own matches"
  ON public.matches FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own matches"
  ON public.matches FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own matches"
  ON public.matches FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own matches"
  ON public.matches FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- Policies for public.tactical_profiles
CREATE POLICY "Users can select their own tactical profiles"
  ON public.tactical_profiles FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own tactical profiles"
  ON public.tactical_profiles FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own tactical profiles"
  ON public.tactical_profiles FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own tactical profiles"
  ON public.tactical_profiles FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- Policies for public.custom_formations
CREATE POLICY "Users can select their own custom formations"
  ON public.custom_formations FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own custom formations"
  ON public.custom_formations FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own custom formations"
  ON public.custom_formations FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own custom formations"
  ON public.custom_formations FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- Policies for public.ai_analysis_history
CREATE POLICY "Users can select their own ai analysis history"
  ON public.ai_analysis_history FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own ai analysis history"
  ON public.ai_analysis_history FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Policies for public.meta_radar_cache
CREATE POLICY "Users can select their own meta radar cache"
  ON public.meta_radar_cache FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own meta radar cache"
  ON public.meta_radar_cache FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Policies for public.user_settings
CREATE POLICY "Users can select their own user settings"
  ON public.user_settings FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own user settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own user settings"
  ON public.user_settings FOR UPDATE
  USING (user_id = (SELECT auth.uid()));


-- Setup performance-critical indexes

CREATE INDEX IF NOT EXISTS idx_matches_userid_date ON public.matches(user_id, match_date DESC);
CREATE INDEX IF NOT EXISTS idx_tactical_profiles_userid_created ON public.tactical_profiles(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_formations_userid_created ON public.custom_formations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_history_userid_created ON public.ai_analysis_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meta_radar_userid_expires ON public.meta_radar_cache(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_meta_radar_userid_query ON public.meta_radar_cache(user_id, query);


-- Auto-onboarding profile creation on auth.users after insert

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, preferred_language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'Coach ' || SUBSTRING(NEW.email FROM '([^@]+)')),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  );

  -- Create default user settings too
  INSERT INTO public.user_settings (user_id, theme, language, ai_mode)
  VALUES (NEW.id, 'dark', 'en', 'hybrid');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger schema creation linking authentication signups to UI profile entries
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
