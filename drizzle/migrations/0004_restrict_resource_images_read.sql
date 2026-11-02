DROP POLICY IF EXISTS "Published resource images are readable" ON storage.objects;
CREATE POLICY "Admins read resource-images" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'resource-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));