import { create } from "zustand";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  toggleWishlist: (product) => {
    set((state) => {
      const exists = state.items.some((p) => p.id === product.id);
      return {
        items: exists
          ? state.items.filter((p) => p.id !== product.id)
          : [...state.items, product],
      };
    });
  },

  isWishlisted: (productId) => get().items.some((p) => p.id === productId),

  removeFromWishlist: (productId) => {
    set((state) => ({ items: state.items.filter((p) => p.id !== productId) }));
  },
}));
