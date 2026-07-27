
-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;

-- 2. Extend resources
ALTER TABLE public.resources
  ADD COLUMN topics text[] NOT NULL DEFAULT '{}',
  ADD COLUMN publication_date date,
  ADD COLUMN image_url text;

-- Admin CRUD on resources
CREATE POLICY "Admins can view all resources"
  ON public.resources FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert resources"
  ON public.resources FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resources"
  ON public.resources FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resources"
  ON public.resources FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;

CREATE TRIGGER resources_set_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Community feedback
CREATE TYPE public.feedback_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.community_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  message text NOT NULL,
  area public.resource_area NOT NULL DEFAULT 'general',
  status public.feedback_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_feedback TO authenticated;
GRANT ALL ON public.community_feedback TO service_role;

ALTER TABLE public.community_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone signed in can submit feedback"
  ON public.community_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users see their own feedback"
  ON public.community_feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Approved feedback is public"
  ON public.community_feedback FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Admins view all feedback"
  ON public.community_feedback FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update feedback"
  ON public.community_feedback FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete feedback"
  ON public.community_feedback FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER community_feedback_set_updated_at
  BEFORE UPDATE ON public.community_feedback
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
