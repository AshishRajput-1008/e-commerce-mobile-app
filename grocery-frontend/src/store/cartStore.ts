import { create } from "zustand";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clearCart: () => void;
  subtotal: () => number;
  discount: () => number;
  deliveryFee: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { productId: product.id, product, quantity }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    }));
  },

  saveForLater: (productId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, savedForLater: true } : i
      ),
    }));
  },

  moveToCart: (productId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, savedForLater: false } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  subtotal: () =>
    get()
      .items.filter((i) => !i.savedForLater)
      .reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  discount: () =>
    get()
      .items.filter((i) => !i.savedForLater)
      .reduce((sum, i) => sum + (i.product.mrp - i.product.price) * i.quantity, 0),

  deliveryFee: () => (get().subtotal() > 499 || get().subtotal() === 0 ? 0 : 40),

  total: () => get().subtotal() + get().deliveryFee(),

  itemCount: () =>
    get()
      .items.filter((i) => !i.savedForLater)
      .reduce((sum, i) => sum + i.quantity, 0),
}));
