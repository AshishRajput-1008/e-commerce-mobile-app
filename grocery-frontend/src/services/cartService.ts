import { api } from "./api";
import { ApiResponse, Cart } from "@/types";

// Cart mutations are handled locally by store/cartStore.ts today.
// These methods are ready to call a real backend cart — wire them in
// once persistence needs to move server-side (e.g. multi-device sync).
const USE_MOCK = true;

export const cartService = {
  async syncCart(cart: Cart): Promise<Cart> {
    if (USE_MOCK) return cart;
    const res = await api.put<ApiResponse<Cart>>("/cart", cart);
    return res.data.data;
  },
  async getCart(): Promise<Cart | null> {
    if (USE_MOCK) return null;
    const res = await api.get<ApiResponse<Cart>>("/cart");
    return res.data.data;
  },
};
