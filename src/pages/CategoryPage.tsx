import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";

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
  };

  const productsByCategory: Record<string, DemoProduct[]> = {
    "mens-fashion": [
      {
        id: "m1",
        name: "Classic Formal Shirt",
        price: 1490,
        image:
          "https://images.unsplash.com/photo-1528701800489-20be3c30c1d5?w=500",
        category: "Men’s Fashion",
        discount: 10,
      },
      {
        id: "m2",
        name: "Slim Fit Jeans",
        price: 1890,
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
        category: "Men’s Fashion",
      },
      {
        id: "m3",
        name: "Casual Polo T-Shirt",
        price: 990,
        image:
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
        category: "Men’s Fashion",
        discount: 15,
      },
    ],
    "womens-fashion": [
      {
        id: "w1",
        name: "Premium Lawn Three Piece",
        price: 2590,
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
        category: "Women’s Fashion",
        discount: 20,
      },
      {
        id: "w2",
        name: "Elegant Abaya",
        price: 3290,
        image:
          "https://images.unsplash.com/photo-1543660722-44c4ea5b6805?w=500",
        category: "Women’s Fashion",
      },
      {
        id: "w3",
        name: "Casual Kurti",
        price: 1490,
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500",
        category: "Women’s Fashion",
        discount: 12,
      },
    ],
    "kids-baby": [
      {
        id: "k1",
        name: "Premium Baby Stroller",
        price: 12500,
        image:
          "https://images.unsplash.com/photo-1588773163629-e90a6c4f0cc6?w=500",
        category: "Kids & Baby",
        discount: 20,
      },
      {
        id: "k2",
        name: "Kids T-Shirt Combo (3 pcs)",
        price: 990,
        image:
          "https://images.unsplash.com/photo-1604467715878-83e57e8bc222?w=500",
        category: "Kids & Baby",
      },
      {
        id: "k3",
        name: "Newborn Gift Set",
        price: 1890,
        image:
          "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500",
        category: "Kids & Baby",
      },
    ],
    "islamic-products": [
      {
        id: "i1",
        name: "Premium Prayer Mat",
        price: 1250,
        image:
          "https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=500",
        category: "Islamic Products",
      },
      {
        id: "i2",
        name: "Tasbih (99 Beads)",
        price: 350,
        image:
          "https://images.unsplash.com/photo-1615684447764-dba6931908d1?w=500",
        category: "Islamic Products",
      },
      {
        id: "i3",
        name: "Arabic Calligraphy Frame",
        price: 2850,
        image:
          "https://images.unsplash.com/photo-1573451445413-92e6c641ab1b?w=500",
        category: "Islamic Products",
        discount: 18,
      },
    ],
    "electronics-gadgets": [
      {
        id: "e1",
        name: "Wireless Earbuds",
        price: 2290,
        image:
          "https://images.unsplash.com/photo-1585386959984-a4155223f3f8?w=500",
        category: "Electronics & Gadgets",
        discount: 25,
      },
      {
        id: "e2",
        name: "Smart Watch",
        price: 3290,
        image:
          "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=500",
        category: "Electronics & Gadgets",
      },
      {
        id: "e3",
        name: "Bluetooth Speaker",
        price: 1890,
        image:
          "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500",
        category: "Electronics & Gadgets",
      },
    ],
    "home-lifestyle": [
      {
        id: "h1",
        name: "Premium Bedsheet Set",
        price: 2490,
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500",
        category: "Home & Lifestyle",
      },
      {
        id: "h2",
        name: "Decorative Cushion Cover (Set of 4)",
        price: 1290,
        image:
          "https://images.unsplash.com/photo-1582719478250-cc857c7e9b9e?w=500",
        category: "Home & Lifestyle",
        discount: 15,
      },
      {
        id: "h3",
        name: "Wall Shelf Organizer",
        price: 1590,
        image:
          "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=500",
        category: "Home & Lifestyle",
      },
    ],
    "kitchen-accessories": [
      {
        id: "ka1",
        name: "Non-Stick Cookware Set (5 pcs)",
        price: 3590,
        image:
          "https://images.unsplash.com/photo-1514996937319-344454492b37?w=500",
        category: "Kitchen Accessories",
        discount: 22,
      },
      {
        id: "ka2",
        name: "Spice Jar Rack (12 pcs)",
        price: 1290,
        image:
          "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=500",
        category: "Kitchen Accessories",
      },
      {
        id: "ka3",
        name: "Kitchen Storage Container Set",
        price: 1890,
        image:
          "https://images.unsplash.com/photo-1565799544912-47a5f4a8a5ef?w=500",
        category: "Kitchen Accessories",
      },
    ],
  };

  const [priceFilter, setPriceFilter] = useState<string>("all");

  const products: DemoProduct[] = productsByCategory[category || ""] ||
    Object.values(productsByCategory).flat();

  const filteredProducts = useMemo(() => {
    if (priceFilter === "all") return products;

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
