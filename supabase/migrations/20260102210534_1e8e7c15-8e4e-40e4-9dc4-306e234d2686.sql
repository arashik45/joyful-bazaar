-- Allow anonymous role to manage products from the frontend
CREATE POLICY "Anon can insert products"
ON public.products
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anon can update products"
ON public.products
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Anon can delete products"
ON public.products
FOR DELETE
TO anon
USING (true);
