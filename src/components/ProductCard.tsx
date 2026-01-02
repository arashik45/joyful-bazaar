import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, ShoppingBag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
  rating?: number;
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  discount,
  rating = 4.5,
}: ProductCardProps) => {
  const [open, setOpen] = useState(false);
  const discountedPrice = discount ? price - (price * discount) / 100 : price;
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(id);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem({ id, name, price, image, category, discount });
    setOpen(true);
    setTimeout(() => setOpen(false), 2000);
  };

  const handleOrderNow = () => {
    addItem({ id, name, price, image, category, discount });
    navigate("/cart");
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-sm text-center">
          <AlertDialogHeader className="items-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <AlertDialogTitle className="text-xl font-heading">
              পণ্য কার্টে যোগ হয়েছে
            </AlertDialogTitle>
            <AlertDialogDescription>
              {name} সফলভাবে আপনার কার্টে যোগ করা হয়েছে।
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="group"
      >
        <Card className="h-full overflow-hidden border-border hover:shadow-medium transition-smooth">
          <Link to={`/product/${id}`}>
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              />
              {discount && (
                <Badge className="absolute top-2 left-2 gradient-warm text-white border-0">
                  -{discount}%
                </Badge>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth bg-background/80 hover:bg-background"
                onClick={(e) => {
                  e.preventDefault();
                  if (inWishlist) {
                    removeFromWishlist(id);
                  } else {
                    addToWishlist({ id, name, price, image, category, discount, quantity: 1 });
                  }
                }}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? "text-destructive" : ""}`} />
              </Button>
            </div>
          </Link>

          <CardContent className="p-4">
            <div className="mb-1">
              <Badge variant="outline" className="text-xs mb-2">
                {category}
              </Badge>
            </div>
            <Link to={`/product/${id}`}>
              <h3 className="font-medium line-clamp-2 mb-2 hover:text-primary transition-smooth">
                {name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-muted-foreground">{rating} / ৫</span>
            </div>
            <div className="flex items-center gap-2">
              {discount ? (
                <>
                  <span className="text-lg font-bold text-primary">৳{discountedPrice.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ৳{price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">৳{price.toFixed(2)}</span>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex flex-col gap-2">
            <Button
              variant="shop"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                handleOrderNow();
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              অর্ডার করুন
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              কার্টে যোগ করুন
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
};
