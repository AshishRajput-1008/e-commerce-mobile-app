import { api } from "./api";
import { ApiResponse, Category } from "@/types";
import { mockCategories } from "./mock/categories";

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === "true";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    if (USE_MOCK) {
      await delay(250);
      return mockCategories;
    }
    const res = await api.get<ApiResponse<Category[]>>("/categories");
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  async getCategoryById(id: string): Promise<Category | undefined> {
    if (USE_MOCK) {
      await delay(200);
      return mockCategories.find((c) => c.id === id || c.slug === id);
    }
    const res = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return res.data?.data;
  },
};
