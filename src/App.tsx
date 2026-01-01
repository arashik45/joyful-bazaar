import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/categories/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/wishlist" element={<Wishlist />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
