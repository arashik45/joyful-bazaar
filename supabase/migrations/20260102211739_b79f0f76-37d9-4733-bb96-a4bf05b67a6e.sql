-- Add extra image URL columns for up to 4 images per product
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_url_2 text,
  ADD COLUMN IF NOT EXISTS image_url_3 text,
  ADD COLUMN IF NOT EXISTS image_url_4 text;