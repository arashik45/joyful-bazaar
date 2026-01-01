import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";

const CategoryPage = () => {
  const { category } = useParams();
  
  const categoryTitles: Record<string, string> = {
    baby: "বেবি আইটেম",
    women: "নারী ফ্যাশন",
    men: "পুরুষ ফ্যাশন",
    electronics: "ইলেকট্রনিক্স ও গ্যাজেট",
    trendy: "ট্রেন্ডি পণ্য",
  };

  const demoProducts = [
    {
      id: "1",
      name: "Premium Baby Stroller",
      price: 12500,
      image: "https://images.unsplash.com/photo-1588773163629-e90a6c4f0cc6?w=500",
      category: "Baby Items",
      discount: 20,
    },
    {
      id: "2",
      name: "Women's Summer Dress",
      price: 2500,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
      category: "Women",
      discount: 15,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8">
          {categoryTitles[category || ""] || "সব পণ্য"}
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {demoProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
