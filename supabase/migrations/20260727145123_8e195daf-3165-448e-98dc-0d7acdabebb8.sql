
CREATE POLICY "Public read resource-images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'resource-images');

CREATE POLICY "Admins upload resource-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resource-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update resource-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resource-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete resource-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resource-images' AND public.has_role(auth.uid(), 'admin'));
