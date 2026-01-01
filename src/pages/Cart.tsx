import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-heading font-bold mb-8">কার্ট</h1>

          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">আপনার কার্ট খালি</h2>
              <p className="text-muted-foreground mb-6">
                প্রিয় পণ্যগুলো কার্টে যোগ করুন
              </p>
              <Button variant="hero" asChild>
                <Link to="/">শপিং শুরু করুন</Link>
              </Button>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">কার্ট</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const effectivePrice = item.discount
                ? item.price - (item.price * item.discount) / 100
                : item.price;

              return (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold line-clamp-2 mb-1">
                        {item.name}
                      </h2>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.category}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-primary">
                          ৳{effectivePrice.toFixed(2)}
                        </span>
                        {item.discount && (
                          <span className="text-xs text-muted-foreground line-through">
                            ৳{item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-muted-foreground">পরিমাণ:</span>
                        <div className="inline-flex items-center border border-border rounded-full overflow-hidden">
                          <button
                            className="px-3 py-1 text-sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm border-x border-border bg-muted/40">
                            {item.quantity}
                          </span>
                          <button
                            className="px-3 py-1 text-sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-semibold mb-2">অর্ডার সামারি</h2>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">মোট পণ্য</span>
                  <span className="font-medium">{totalItems} টি</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">সাবটোটাল</span>
                  <span className="font-medium">৳{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                  <span className="font-medium">চেকআউটে নির্ধারিত হবে</span>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between font-semibold">
                  <span>মোট</span>
                  <span>৳{totalPrice.toFixed(2)}</span>
                </div>
                <Button asChild variant="shop" className="w-full mt-2">
                  <Link to="/checkout">চেকআউটে যান</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm"
                  onClick={clearCart}
                >
                  কার্ট খালি করুন
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;

