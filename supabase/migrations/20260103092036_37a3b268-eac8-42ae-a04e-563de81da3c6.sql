-- Add status column to products for Active/Draft, default 'active'
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- Ensure orders table is configured for realtime
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- Create public storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product-images bucket
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Allow anonymous/admin uploads to product-images bucket
CREATE POLICY "Anon can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow updates/deletes on product images by any role (can be refined later)
CREATE POLICY "Anon can manage product images"
ON storage.objects
FOR ALL
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');