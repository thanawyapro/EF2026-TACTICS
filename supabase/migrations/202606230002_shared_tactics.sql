-- 202606230002_shared_tactics.sql
-- Create public table for sharing tactical layouts and player formations

CREATE TABLE IF NOT EXISTS public.shared_tactics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation text NOT NULL,
  players jsonb NOT NULL DEFAULT '[]'::jsonb,
  playstyle text,
  sub_tactics jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on shared_tactics
ALTER TABLE public.shared_tactics ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous reads for shared links
CREATE POLICY "Allow public select on shared_tactics"
  ON public.shared_tactics FOR SELECT
  USING (true);

-- Allow public anonymous/authenticated inserts
CREATE POLICY "Allow public insert on shared_tactics"
  ON public.shared_tactics FOR INSERT
  WITH CHECK (true);
