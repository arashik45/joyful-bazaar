import { Link } from "react-router-dom";
import { Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
  rating = 4.5 
}: ProductCardProps) => {
  const discountedPrice = discount ? price - (price * discount / 100) : price;

  return (
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
                // Wishlist logic
              }}
            >
              <Heart className="h-4 w-4" />
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
            <span className="text-lg font-bold text-primary">৳{discountedPrice.toFixed(2)}</span>
            {discount && (
              <span className="text-sm text-muted-foreground line-through">৳{price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <Button
            variant="shop"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              // Order now logic
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
              // Add to cart logic
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            কার্টে যোগ করুন
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
