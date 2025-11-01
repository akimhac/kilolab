CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'order-photos');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'order-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Owner Delete" ON storage.objects FOR DELETE USING (bucket_id = 'order-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
