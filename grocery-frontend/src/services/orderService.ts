import { api } from "./api";
import { ApiResponse, Order, Cart, Address } from "@/types";

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === "true";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (USE_MOCK) {
      await delay(300);
      return [];
    }
    const res = await api.get<ApiResponse<Order[]>>("/orders");
    return res.data.data;
  },

  async createOrder(cart: Cart, address: Address): Promise<Order> {
    if (USE_MOCK) {
      await delay(700);
      return {
        id: `order-${Date.now()}`,
        items: cart.items,
        status: "placed",
        placedAt: new Date().toISOString(),
        total: cart.total,
        address,
      };
    }
    // The API accepts a compact checkout payload. Sending the full cart under
    // `cart` used to make the backend see no line items, which persisted a
    // zero subtotal/total in order history.
    const res = await api.post<ApiResponse<Order>>("/orders", {
      items: cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      discount: cart.discount,
      deliveryFee: cart.deliveryFee,
      address,
    });
    return res.data.data;
  },
};
