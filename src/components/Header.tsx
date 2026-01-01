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
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      {/* Top info bar */}
      <div className="w-full bg-background text-[11px] sm:text-xs text-center py-1 border-b border-border/60">
        <p className="text-muted-foreground">
          আপনার জন্য সাশ্রয়ী বাংলাদেশি অনলাইন শপ | ক্যাশ অন ডেলিভারি | ৪৮-৭২ ঘন্টার মধ্যে ফাস্ট ডেলিভারি
        </p>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3 flex items-center gap-3 sm:gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg gradient-warm flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-lg">শ</span>
          </div>
          <div className="leading-tight hidden xs:block">
            <span className="block text-lg sm:text-xl font-heading font-extrabold tracking-tight">
              আমার শপ
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Bangladeshi Online Shop
            </span>
          </div>
        </Link>

        {/* Search bar */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="প্রোডাক্ট খুঁজুন এখানে..."
              className="pl-9 pr-4 h-10 rounded-full bg-background border-border focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Button asChild variant="hero" className="hidden sm:inline-flex px-5">
            <Link to="/auth">লগইন / সাইন আপ</Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="sm:hidden">
            <Link to="/auth">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" asChild className="gap-1">
            <Link to="/cart" className="flex items-center gap-1">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">কার্ট</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Orange navigation bar */}
      <div className="w-full bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 py-2 text-sm font-medium">
          <div className="flex items-center gap-6">
            <Link to="/" className="hover-scale">হোম</Link>
            <Link to="/categories/baby" className="hover-scale">ক্যাটাগরি</Link>
            <Link to="/categories/trendy" className="hover-scale hidden sm:inline">সকল পণ্য</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover-scale">
                  <span>অ্যাকাউন্ট</span>
                  <span className="text-xs">▼</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem asChild>
                  <Link to="/auth">লগইন</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auth">রেজিস্ট্রেশন</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/contact" className="hover-scale hidden sm:inline">যোগাযোগ</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="hidden sm:inline hover-scale flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>উইশলিস্ট</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-primary/20 hover:bg-primary/30">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/">হোম</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categories/baby">ক্যাটাগরি</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categories/trendy">সকল পণ্য</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auth">অ্যাকাউন্ট (লগইন/রেজি)</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact">যোগাযোগ</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
