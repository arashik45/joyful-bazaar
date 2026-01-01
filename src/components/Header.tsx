import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-warm rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">শ</span>
            </div>
            <span className="text-xl font-heading font-bold">আমার শপ</span>
          </Link>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input 
                placeholder="প্রোডাক্ট খুঁজুন..." 
                className="pl-10 pr-4 h-10 w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/auth">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-6 py-3">
          <Link to="/categories/baby" className="text-sm font-medium hover:text-primary transition-smooth">
            বেবি আইটেম
          </Link>
          <Link to="/categories/women" className="text-sm font-medium hover:text-primary transition-smooth">
            নারী
          </Link>
          <Link to="/categories/men" className="text-sm font-medium hover:text-primary transition-smooth">
            পুরুষ
          </Link>
          <Link to="/categories/electronics" className="text-sm font-medium hover:text-primary transition-smooth">
            ইলেকট্রনিক্স
          </Link>
          <Link to="/categories/trendy" className="text-sm font-medium hover:text-primary transition-smooth">
            ট্রেন্ডি পণ্য
          </Link>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/categories/baby">বেবি আইটেম</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/categories/women">নারী</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/categories/men">পুরুষ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/categories/electronics">ইলেকট্রনিক্স</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/categories/trendy">ট্রেন্ডি পণ্য</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
