ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS surname text,
  ADD COLUMN IF NOT EXISTS avatar_url text;