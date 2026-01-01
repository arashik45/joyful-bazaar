import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Checkout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-6">চেকআউট</h1>

        <Card className="max-w-xl mx-auto">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              এখানে আপনি আপনার ডেলিভারি তথ্য ও কন্টাক্ট ডিটেইলস দিয়ে অর্ডার কনফার্ম করতে পারবেন।
            </p>
            <div className="space-y-3 text-sm">
              <p>নাম, মোবাইল নম্বর, ঠিকানা ইত্যাদির ইনপুট ফর্ম এখানে আসবে (পরবর্তী ধাপে করা যাবে)।</p>
            </div>
            <Button variant="shop" className="w-full mt-4" disabled>
              অর্ডার সাবমিট (ডেমো)
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
