import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="max-w-lg w-full shadow-medium">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">
              আপনার অর্ডার কনফার্ম হয়েছে!
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              ধন্যবাদ। আমাদের কল সেন্টার থেকে অল্প সময়ের মধ্যেই আপনাকে কনফার্মেশনের জন্য যোগাযোগ করা হবে।
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
              <Button asChild variant="shop" className="sm:min-w-[160px]">
                <a href="/">হোমে ফিরুন</a>
              </Button>
              <Button asChild variant="outline" className="sm:min-w-[160px]">
                <a href="/cart">কার্টে ফিরে যান</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
