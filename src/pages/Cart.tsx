import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

const Cart = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">কার্ট</h1>
        
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">আপনার কার্ট খালি</h2>
            <p className="text-muted-foreground mb-6">প্রিয় পণ্যগুলো কার্টে যোগ করুন</p>
            <Button variant="hero">শপিং শুরু করুন</Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
