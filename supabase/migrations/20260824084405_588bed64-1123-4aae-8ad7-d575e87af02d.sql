DROP POLICY IF EXISTS "Public read resource-images" ON storage.objects;
CREATE POLICY "Published resource images are readable"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'resource-images'
  AND EXISTS (
    SELECT 1 FROM public.resources r
    WHERE r.published = true
      AND r.image_url LIKE '%/resource-images/' || storage.objects.name || '%'
  )
);