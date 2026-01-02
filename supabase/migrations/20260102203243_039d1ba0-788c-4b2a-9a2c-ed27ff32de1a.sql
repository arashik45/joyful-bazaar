-- Add stock_count column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock_count integer NOT NULL DEFAULT 0;

-- Create orders table if it does not exist
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  address text NOT NULL,
  items text NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create orders (for checkout), but restrict viewing/updating to authenticated users
CREATE POLICY "Orders can be created by anyone" 
ON public.orders
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can view orders" 
ON public.orders
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update orders" 
ON public.orders
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete orders" 
ON public.orders
FOR DELETE
USING (auth.role() = 'authenticated');

-- Trigger to keep updated_at in sync
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;