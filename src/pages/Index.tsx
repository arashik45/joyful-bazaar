import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp, Zap, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

const categories = [
  { id: "baby", name: "Baby Items", slug: "baby", color: "bg-pink-100 text-pink-700" },
  { id: "women", name: "Women", slug: "women", color: "bg-purple-100 text-purple-700" },
  { id: "men", name: "Men", slug: "men", color: "bg-blue-100 text-blue-700" },
  { id: "electronics", name: "Electronics", slug: "electronics", color: "bg-orange-100 text-orange-700" },
  { id: "trendy", name: "Trending", slug: "trendy", color: "bg-green-100 text-green-700" },
];

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
  {
    id: "3",
    name: "Men's Smart Watch",
    price: 8500,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Electronics",
  },
  {
    id: "4",
    name: "Wireless Earbuds",
    price: 3500,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    category: "Electronics",
    discount: 25,
  },
  {
    id: "5",
    name: "Men's Casual Shirt",
    price: 1800,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
    category: "Men",
  },
  {
    id: "6",
    name: "Women's Handbag",
    price: 4200,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
    category: "Women",
    discount: 10,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section styled similar to reference */}
      <section className="relative py-8 sm:py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-primary/90 shadow-medium overflow-hidden flex flex-col md:flex-row items-stretch gap-0">
            {/* Left image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2 bg-primary/80 flex items-center justify-center p-6 sm:p-10"
            >
              <div className="relative max-w-sm w-full animate-float">
                <div className="absolute -left-6 -top-6 w-14 h-14 rounded-full bg-background/40" />
                <div className="absolute -right-4 -bottom-6 w-10 h-10 rounded-full bg-secondary/60" />
                <img
                  src={heroBanner}
                  alt="অনলাইন শপ ব্যানার"
                  className="relative rounded-2xl w-full h-auto shadow-strong border border-border/40 bg-background"
                />
              </div>
            </motion.div>

            {/* Right text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:w-1/2 bg-primary px-6 sm:px-10 py-8 sm:py-10 flex flex-col justify-center text-primary-foreground"
            >
              <Badge className="mb-3 bg-background text-foreground border-0 w-max px-3 py-1 text-[11px] sm:text-xs">
                আপনার প্রিয় অনলাইন শপ
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight mb-2">
                আমার শপ
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold mb-3 drop-shadow">
                Online Shop
              </h2>
              <p className="text-sm sm:text-base mb-5 max-w-md text-primary-foreground/90">
                আপনার প্রয়োজনের সেরা পণ্য এক জায়গায়। অর্ডার দিন ঘরে বসেই, সারা বাংলাদেশে হোম ডেলিভারি।
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Button asChild size="lg" variant="secondary" className="rounded-full px-6">
                  <Link to="/categories/trendy" className="flex items-center gap-2">
                    এখনই অর্ডার করুন
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <div className="flex items-center gap-3 text-sm sm:text-base">
                  <div className="w-9 h-9 rounded-full bg-background text-foreground flex items-center justify-center">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="font-semibold">অর্ডার সাপোর্ট</p>
                    <p className="text-xs sm:text-sm">০১৬০০০০০০০০</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-cool flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">ফ্রি ডেলিভারি</h3>
                <p className="text-xs text-muted-foreground">৳১০০০+ অর্ডারে</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">দ্রুত ডেলিভারি</h3>
                <p className="text-xs text-muted-foreground">২-৫ কর্মদিবসের মধ্যে</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-cool flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">সিকিউর পেমেন্ট</h3>
                <p className="text-xs text-muted-foreground">১০০% নিরাপদ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">সেরা দাম</h3>
                <p className="text-xs text-muted-foreground">অফিশিয়াল গ্যারান্টি</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              ক্যাটাগরি অনুযায়ী শপ করুন
            </h2>
            <p className="text-muted-foreground">আপনার প্রয়োজনীয় সব পণ্য এক জায়গায়</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Link to={`/categories/${cat.slug}`}>
                  <div className="p-6 rounded-xl border border-border hover:shadow-medium transition-smooth group cursor-pointer text-center">
                    <div className={`w-16 h-16 ${cat.color} rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-bounce`}>
                      <span className="text-2xl font-bold">{cat.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-smooth">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                ফিচার্ড পণ্য
              </h2>
              <p className="text-muted-foreground">আপনার জন্য বাছাইকৃত সেরা পণ্য</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/categories/trendy">
                সব দেখুন
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {demoProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              শপিং শুরু করতে প্রস্তুত?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              হাজারো কাস্টমারের সাথে যোগ দিন। একাউন্ট খুলেই পান এক্সক্লুসিভ অফার!
            </p>
            <Button asChild size="xl" variant="hero">
              <Link to="/auth">
                এখনই একাউন্ট খুলুন
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
