import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, MessageCircle } from "lucide-react";
import { type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

const reviewSchema = z.object({
  name: z.string().trim().min(2, "কমপক্ষে ২ অক্ষরের নাম দিন"),
  rating: z.number().min(1).max(5),
  comment: z.string().trim().min(5, "কমপক্ষে ৫ অক্ষরের রিভিউ লিখুন"),
});

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error loading product", error);
        setLoadError("প্রোডাক্ট লোড করতে সমস্যা হচ্ছে। পরে চেষ্টা করুন।");
        setProduct(null);
      } else if (data) {
        const images = [data.image_url, data.image_url_2, data.image_url_3, data.image_url_4].filter(
          (src): src is string => !!src
        );

        const mapped: Product = {
          id: data.id,
          name: data.name,
          price: Number(data.price ?? 0),
          image: images[0] || data.image_url || "",
          category: data.category || "General",
          description: data.description || "",
          stock_count:
            typeof data.stock_count === "number" ? data.stock_count : Number(data.stock_count ?? 0) || 0,
          discount: Number(data.discount ?? 0),
        };
        (mapped as any).images = images;
        setProduct(mapped);
        setLoadError(null);
      } else {
        setProduct(null);
        setLoadError(null);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Rahim",
      rating: 5,
      comment: "দাম অনুযায়ী কোয়ালিটি অনেক ভালো। ডেলিভারিও ফাস্ট পেয়েছি।",
    },
    {
      id: 2,
      name: "Ayesha",
      rating: 4,
      comment: "প্রোডাক্ট ঠিক আছে, প্যাকেজিং আরও ভালো হতে পারত।",
    },
  ]);

  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [errors, setErrors] = useState<{ name?: string; comment?: string }>({});

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">প্রোডাক্ট লোড হচ্ছে...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product || loadError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">প্রোডাক্টটি পাওয়া যায়নি বা লোড করতে সমস্যা হয়েছে।</p>
        </main>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const averageRating =
    reviews.length === 0
      ? product.rating || 4.5
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      discount: product.discount,
    });
    navigate("/cart");
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        discount: product.discount,
        quantity: 1,
      });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const result = reviewSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { name?: string; comment?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "name") fieldErrors.name = issue.message;
        if (issue.path[0] === "comment") fieldErrors.comment = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setReviews((prev) => [
      {
        id: prev.length + 1,
        name: form.name,
        rating: form.rating,
        comment: form.comment,
      },
      ...prev,
    ]);

    setForm({ name: "", rating: 5, comment: "" });
  };

  const imageGallery = (product as any).images && (product as any).images.length > 0
    ? (product as any).images
    : [product.image, product.image, product.image, product.image].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-2">
        {/* Left: Image carousel */}
        <section className="space-y-4">
          <div className="bg-muted rounded-3xl p-3 sm:p-4 flex items-center justify-center">
            <Carousel className="w-full max-w-md" opts={{ loop: true }}>
              <CarouselContent>
                {imageGallery.map((src: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="overflow-hidden rounded-2xl group cursor-zoom-in">
                      <img
                        src={src}
                        alt={`${product.name} ছবি ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-background/80" />
              <CarouselNext className="bg-background/80" />
            </Carousel>
          </div>

          <div className="flex gap-3 justify-center">
            {imageGallery.map((src: string, index: number) => (
              <button
                key={index}
                type="button"
                className="h-16 w-16 rounded-xl overflow-hidden border border-border hover:border-primary transition-smooth"
              >
                <img
                  src={src}
                  alt={`${product.name} থাম্বনেইল ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Right: Info */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-1">
                {product.name}
              </h1>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
            <button
              onClick={handleToggleWishlist}
              className={`rounded-full px-4 py-2 text-sm border transition-smooth ${
                inWishlist
                  ? "bg-destructive text-destructive-foreground border-destructive"
                  : "bg-background text-foreground border-border"
              }`}
            >
              {inWishlist ? "উইশলিস্ট থেকে রিমুভ" : "উইশলিস্টে যোগ করুন"}
            </button>
          </div>

          <div className="space-y-1">
            {product.discount && product.discount > 0 ? (
              <>
                <p className="text-3xl font-extrabold text-primary">
                  ৳{discountedPrice.toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  পূর্বের দাম <span className="line-through">৳{product.price}</span> — {" "}
                  <span className="text-destructive font-semibold">-{product.discount}% ছাড়</span>
                </p>
              </>
            ) : (
              <p className="text-3xl font-extrabold text-primary">
                ৳{product.price.toFixed(0)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{averageRating.toFixed(1)} / ৫</span>
            <span>•</span>
            <span>{reviews.length} টি রিভিউ</span>
          </div>

                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {product.description || "এই প্রোডাক্ট সম্পর্কে বিস্তারিত শীঘ্রই যোগ করা হবে।"}
                  </p>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium">
              স্টকে: {product.stock_count ?? 0} পিস
            </span>
            {product.stock_count !== undefined && product.stock_count <= 0 && (
              <span className="text-destructive font-semibold">স্টক শেষ</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              size="lg"
              className="flex-1"
              variant="shop"
              onClick={handleAddToCart}
              disabled={(product.stock_count ?? 0) <= 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> {(product.stock_count ?? 0) <= 0 ? "স্টক নেই" : "অর্ডার করুন"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            >
              <MessageCircle className="h-4 w-4 mr-2" /> রিভিউ পড়ুন
            </Button>
          </div>

          <Card className="mt-4">
            <CardContent className="p-4 text-sm space-y-1">
              <p>ঢাকা সিটির ভিতর: ৮০ টাকা কুরিয়ার চার্জ</p>
              <p>ঢাকা সিটির বাইরে: ১৩০ টাকা কুরিয়ার চার্জ</p>
              <p>পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি / বিকাশ / নগদ</p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Details / Policy / Reviews Tabs */}
      <section className="border-t border-border bg-muted/40">
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto rounded-full bg-background p-1 mb-4">
              <TabsTrigger value="details" className="text-xs sm:text-sm px-4 sm:px-6">
                পণ্যের বিস্তারিত
              </TabsTrigger>
              <TabsTrigger value="policy" className="text-xs sm:text-sm px-4 sm:px-6">
                রিটার্ন পলিসি
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm px-4 sm:px-6">
                মোট রিভিউ ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="p-5 text-sm leading-relaxed space-y-2">
                  <p className="font-semibold text-foreground">{product.name} – এক মেশিনেই সব কাজ!</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>হাই স্পিড মোটর – দ্রুত ও কার্যকর গ্রাইন্ডিং পারফরমেন্স।</li>
                    <li>স্টেইনলেস স্টিল ব্লেড – দীর্ঘ সময় ব্যবহারযোগ্য ও টেকসই।</li>
                    <li>কমপ্যাক্ট ডিজাইন – সহজে বহনযোগ্য ও কম জায়গা নেয়।</li>
                    <li>ইজি টু ক্লিন – ব্যবহার শেষে অল্প সময়ে পরিষ্কার করা যায়।</li>
                    <li>মাল্টি পারপাজ ইউজ – মসলা, সবজি, ডাল ইত্যাদি গ্রাইন্ড করার জন্য উপযুক্ত।</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policy" className="mt-4">
              <Card>
                <CardContent className="p-5 text-sm text-muted-foreground space-y-2">
                  <p>• পণ্য ডেলিভারির সময় ভিডিও করে আনবক্স করলে রিপ্লেসমেন্ট সহজ হবে।</p>
                  <p>• ম্যানুফ্যাকচারিং ডিফেক্ট থাকলে ৩ দিনের মধ্যে রিটার্নের সুযোগ।</p>
                  <p>• ব্যবহারজনিত ক্ষতির ক্ষেত্রে রিটার্ন প্রযোজ্য নয়।</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr] items-start">
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {reviews.map((review) => (
                    <Card key={review.id} className="animate-fade-in">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{review.name}</span>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{review.rating} / ৫</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-heading font-semibold mb-2 flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" /> দ্রুত রিভিউ দিন
                  </h3>
                  <form onSubmit={handleSubmitReview} className="space-y-2 text-xs">
                    <div className="space-y-1">
                      <label className="font-medium">আপনার নাম</label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-destructive mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium">রেটিং</label>
                      <select
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs"
                        value={form.rating}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, rating: Number(e.target.value) || 5 }))
                        }
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} / ৫
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium">রিভিউ</label>
                      <textarea
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs min-h-[70px]"
                        value={form.comment}
                        onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                      />
                      {errors.comment && (
                        <p className="text-[11px] text-destructive mt-1">{errors.comment}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" size="sm" variant="hero">
                      রিভিউ সাবমিট করুন
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetails;
