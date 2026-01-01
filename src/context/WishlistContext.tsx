import { createContext, useContext, useState, ReactNode } from "react";
import type { CartItem } from "./CartContext";

interface WishlistContextValue {
  items: CartItem[];
  addToWishlist: (item: CartItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToWishlist: WishlistContextValue["addToWishlist"] = (item) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist: WishlistContextValue["removeFromWishlist"] = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist: WishlistContextValue["isInWishlist"] = (id) =>
    items.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
};
