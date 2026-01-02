-- Add discount and SEO description columns to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS discount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seo_description text;

-- Ensure discount is between 0 and 100 (soft constraint via trigger recommended, but here we use simple CHECK within safe bounds)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_discount_range'
  ) THEN
    ALTER TABLE public.products
    ADD CONSTRAINT products_discount_range
    CHECK (discount >= 0 AND discount <= 100);
  END IF;
END $$;