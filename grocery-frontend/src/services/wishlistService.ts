import { api } from "./api";
import { ApiResponse, Product } from "@/types";

const USE_MOCK = true;

export const wishlistService = {
  async getWishlist(): Promise<Product[]> {
    if (USE_MOCK) return [];
    const res = await api.get<ApiResponse<Product[]>>("/wishlist");
    return res.data.data;
  },
  async addToWishlist(productId: string): Promise<void> {
    if (USE_MOCK) return;
    await api.post("/wishlist", { productId });
  },
  async removeFromWishlist(productId: string): Promise<void> {
    if (USE_MOCK) return;
    await api.delete(`/wishlist/${productId}`);
  },
};
