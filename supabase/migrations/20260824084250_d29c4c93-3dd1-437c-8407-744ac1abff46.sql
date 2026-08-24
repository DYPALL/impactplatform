CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN auth.uid() IS NULL OR _user_id IS DISTINCT FROM auth.uid() THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
  END
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO service_role;

DROP POLICY IF EXISTS "Admins can view all resources" ON public.resources;
CREATE POLICY "Admins can view all resources" ON public.resources FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can insert resources" ON public.resources;
CREATE POLICY "Admins can insert resources" ON public.resources FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update resources" ON public.resources;
CREATE POLICY "Admins can update resources" ON public.resources FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete resources" ON public.resources;
CREATE POLICY "Admins can delete resources" ON public.resources FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins view all feedback" ON public.community_feedback;
CREATE POLICY "Admins view all feedback" ON public.community_feedback FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins update feedback" ON public.community_feedback;
CREATE POLICY "Admins update feedback" ON public.community_feedback FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins delete feedback" ON public.community_feedback;
CREATE POLICY "Admins delete feedback" ON public.community_feedback FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins upload resource-images" ON storage.objects;
CREATE POLICY "Admins upload resource-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resource-images' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins update resource-images" ON storage.objects;
CREATE POLICY "Admins update resource-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resource-images' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins delete resource-images" ON storage.objects;
CREATE POLICY "Admins delete resource-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resource-images' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);