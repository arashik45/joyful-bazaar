import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
interface DemoProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
}

const CategoryPage = () => {
  const { category } = useParams();

  const categoryTitles: Record<string, string> = {
    "mens-fashion": "Men’s Fashion",
    "womens-fashion": "Women’s Fashion",
    "kids-baby": "Kids & Baby",
    "islamic-products": "Islamic Products",
    "electronics-gadgets": "Electronics & Gadgets",
    "home-lifestyle": "Home & Lifestyle",
    "kitchen-accessories": "Kitchen Accessories",
    trendy: "সব পণ্য",
  };
 
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [products, setProducts] = useState<DemoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*");

      if (category && category !== "trendy") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading category products", error);
        setError("পণ্য লোড করতে সমস্যা হচ্ছে। পরে চেষ্টা করুন।");
        setProducts([]);
      } else {
        const mapped: DemoProduct[] = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price ?? 0),
          image: p.image_url,
          category: categoryTitles[category || ""] || p.category || "সব পণ্য",
          discount: undefined,
        }));
        setProducts(mapped);
        setError(null);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [category]);
 
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (priceFilter === "low") return product.price < 1000;
      if (priceFilter === "mid") return product.price >= 1000 && product.price <= 3000;
      if (priceFilter === "high") return product.price > 3000;
      return true;
    });
  }, [products, priceFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            {categoryTitles[category || ""] || "সব পণ্য"}
          </h1>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">প্রাইস রেঞ্জ:</span>
            <button
              className={`px-3 py-1 rounded-full border text-xs md:text-sm ${
                priceFilter === "all" ? "bg-primary text-primary-foreground border-transparent" : "border-border"
              }`}
              onClick={() => setPriceFilter("all")}
            >
              সব
            </button>
            <button
              className={`px-3 py-1 rounded-full border text-xs md:text-sm ${
                priceFilter === "low" ? "bg-primary text-primary-foreground border-transparent" : "border-border"
              }`}
              onClick={() => setPriceFilter("low")}
            >
              ০ - ১০০০৳
            </button>
            <button
              className={`px-3 py-1 rounded-full border text-xs md:text-sm ${
                priceFilter === "mid" ? "bg-primary text-primary-foreground border-transparent" : "border-border"
              }`}
              onClick={() => setPriceFilter("mid")}
            >
              ১০০০ - ৩০০০৳
            </button>
            <button
              className={`px-3 py-1 rounded-full border text-xs md:text-sm ${
                priceFilter === "high" ? "bg-primary text-primary-foreground border-transparent" : "border-border"
              }`}
              onClick={() => setPriceFilter("high")}
            >
              ৩০০০৳+
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground mb-4">পণ্য লোড হচ্ছে...</p>
        )}
        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
