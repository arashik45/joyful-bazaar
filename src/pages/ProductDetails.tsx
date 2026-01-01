import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, MessageCircle } from "lucide-react";
import { allProducts, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { z } from "zod";

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

  const product: Product | undefined = useMemo(
    () => allProducts.find((p) => p.id === id),
    [id]
  );

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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">প্রোডাক্টটি পাওয়া যায়নি।</p>
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-2">
        {/* Left: Image */}
        <section className="bg-muted rounded-3xl p-4 sm:p-6 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-2xl w-full max-w-md object-cover shadow-medium"
          />
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
            <p className="text-3xl font-extrabold text-primary">
              ৳{discountedPrice.toFixed(0)}
            </p>
            {product.discount && (
              <p className="text-sm text-muted-foreground">
                পূর্বের দাম <span className="line-through">৳{product.price}</span> — {" "}
                <span className="text-destructive font-semibold">-{product.discount}% ছাড়</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{averageRating.toFixed(1)} / ৫</span>
            <span>•</span>
            <span>{reviews.length} টি রিভিউ</span>
          </div>

          <p className="text-sm text-muted-foreground">
            {product.description || "এই প্রোডাক্ট সম্পর্কে বিস্তারিত শীঘ্রই যোগ করা হবে।"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              size="lg"
              className="flex-1"
              variant="shop"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> অর্ডার করুন
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

      {/* Reviews Section */}
      <section className="border-t border-border bg-muted/40">
        <div className="container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div>
            <h2 className="text-xl font-heading font-semibold mb-4">কাস্টমার রিভিউ</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="animate-fade-in">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{review.name}</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{review.rating} / ৫</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold mb-3">
              রিভিউ দিতে লগইন/রেজিস্ট্রেশন করুন
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              এখন ডেমো হিসেবে সরাসরি নিচের ফর্ম পূরণ করে রিভিউ দিতে পারেন।
            </p>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">আপনার নাম</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">রেটিং নির্বাচন করুন</label>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
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
                <label className="text-sm font-medium">আপনার রিভিউ</label>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[90px]"
                  value={form.comment}
                  onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                />
                {errors.comment && (
                  <p className="text-xs text-destructive mt-1">{errors.comment}</p>
                )}
              </div>

              <Button type="submit" className="w-full" variant="hero">
                রিভিউ সাবমিট করুন
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetails;
