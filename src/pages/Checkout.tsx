import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Checkout = () => {
  const { items, totalPrice, totalItems } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [insideDhaka, setInsideDhaka] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();

  const deliveryCharge = useMemo(() => (insideDhaka ? 80 : 130), [insideDhaka]);
  const grandTotal = useMemo(() => totalPrice + deliveryCharge, [totalPrice, deliveryCharge]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-6">চেকআউট</h1>

        <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
          <AlertDialogContent className="max-w-sm text-center">
            <AlertDialogHeader className="items-center space-y-3">
              <AlertDialogTitle className="text-xl font-heading">অর্ডার সফলভাবে কনফার্ম হয়েছে!</AlertDialogTitle>
              <AlertDialogDescription>
                আপনার অর্ডার রিসিভ করা হয়েছে। এখনই অর্ডার কনফার্মেশন পেজে নিয়ে যাওয়া হবে।
              </AlertDialogDescription>
              <Button
                variant="shop"
                className="mt-2 w-full"
                onClick={() => {
                  setSuccessOpen(false);
                  navigate("/order-success");
                }}
              >
                অর্ডার কনফার্মেশন দেখুন
              </Button>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Customer info */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <p className="text-sm text-muted-foreground">
                অর্ডার কনফার্ম করতে আপনার নাম, ঠিকানা ও মোবাইল নাম্বার দিন।
              </p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">আপনার নাম</label>
                  <Input
                    placeholder="আপনার নাম লিখুন"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">আপনার মোবাইল নাম্বার</label>
                  <Input
                    placeholder="মোবাইল নম্বর"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">আপনার সম্পূর্ণ ঠিকানা</label>
                  <Input
                    placeholder="সম্পূর্ণ ঠিকানা / জেলা / উপজেলা / গ্রাম / বাজার"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <span className="text-sm font-medium">ডেলিভারি এরিয়া</span>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={insideDhaka ? "shop" : "outline"}
                    className="flex-1"
                    onClick={() => setInsideDhaka(true)}
                  >
                    ঢাকা সিটির ভিতর
                  </Button>
                  <Button
                    type="button"
                    variant={!insideDhaka ? "shop" : "outline"}
                    className="flex-1"
                    onClick={() => setInsideDhaka(false)}
                  >
                    ঢাকা সিটির বাইরে
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  ঢাকা সিটির ভিতরে ডেলিভারি চার্জ ৮০ টাকা, বাইরে ১৩০ টাকা ধরা হয়েছে।
                </p>
              </div>

              <Button
                variant="shop"
                className="w-full mt-4"
                disabled={!name || !phone || !address || items.length === 0}
                onClick={() => {
                  setSuccessOpen(true);
                  setTimeout(() => {
                    setSuccessOpen(false);
                    navigate("/order-success");
                  }, 2000);
                }}
              >
                অর্ডার কনফার্ম করুন
              </Button>
            </CardContent>
          </Card>

          {/* Right: Order summary */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-heading font-semibold mb-2">আপনার অর্ডার বিস্তারিত</h2>

              <div className="border border-dashed border-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-[4rem,1fr,4rem,4rem] bg-muted text-xs font-medium px-3 py-2">
                  <span>IMAGE</span>
                  <span>PRODUCT</span>
                  <span className="text-right">PRICE</span>
                  <span className="text-right">TOTAL</span>
                </div>
                {items.map((item) => {
                  const effectivePrice = item.discount
                    ? item.price - (item.price * item.discount) / 100
                    : item.price;

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[4rem,1fr,4rem,4rem] items-center px-3 py-3 text-xs border-t border-border/60 bg-background"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="px-2">
                        <p className="font-medium line-clamp-2 text-sm">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">পরিমাণ: {item.quantity} টি</p>
                      </div>
                      <span className="text-right text-sm">৳{effectivePrice.toFixed(0)}</span>
                      <span className="text-right text-sm font-semibold">
                        ৳{(effectivePrice * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1 text-sm mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">প্রোডাক্ট মূল্য ({totalItems} টি)</span>
                  <span className="font-medium">৳{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                  <span className="font-medium">৳{deliveryCharge.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2 mt-1 font-semibold text-base">
                  <span>মোট মূল্য</span>
                  <span>৳{grandTotal.toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
