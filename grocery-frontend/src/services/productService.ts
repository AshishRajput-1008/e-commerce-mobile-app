import { api } from "./api";
import { ApiResponse, Product } from "@/types";
import {
  mockProducts,
  getMockProductById,
  getMockProductsByCategory,
  getFeaturedProducts,
  getNurseryProducts,
  getFarmingEssentials,
} from "./mock/products";

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === "true";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
  sort?: "popular" | "newest" | "priceLowHigh" | "priceHighLow" | "rating";
  query?: string;
}

function applyFilters(products: Product[], filters?: ProductFilters): Product[] {
  let result = [...products];
  if (!filters) return result;
  if (filters.categoryId) result = result.filter((p) => p.categoryId === filters.categoryId);
  if (filters.organic) result = result.filter((p) => p.organic);
  if (filters.minPrice != null) result = result.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice != null) result = result.filter((p) => p.price <= filters.maxPrice!);
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }
  switch (filters.sort) {
    case "priceLowHigh":
      result.sort((a, b) => a.price - b.price);
      break;
    case "priceHighLow":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      result.reverse();
      break;
    default:
      break;
  }
  return result;
}

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    if (USE_MOCK) {
      await delay(400);
      return applyFilters(mockProducts, filters);
    }
    const res = await api.get<ApiResponse<Product[]>>("/products", { params: filters });
    return res.data.data;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    if (USE_MOCK) {
      await delay(300);
      return getMockProductById(id);
    }
    const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return res.data.data;
  },

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (USE_MOCK) {
      await delay(350);
      return getMockProductsByCategory(categoryId);
    }
    const res = await api.get<ApiResponse<Product[]>>(`/categories/${categoryId}/products`);
    return res.data.data;
  },

  async getFeatured(): Promise<Product[]> {
    if (USE_MOCK) {
      await delay(300);
      return getFeaturedProducts();
    }
    const res = await api.get<ApiResponse<Product[]>>("/products/featured");
    return res.data.data;
  },

  async getNursery(): Promise<Product[]> {
    if (USE_MOCK) {
      await delay(300);
      return getNurseryProducts();
    }
    const res = await api.get<ApiResponse<Product[]>>("/products/nursery");
    return res.data.data;
  },

  async getFarmingEssentials(): Promise<Product[]> {
    if (USE_MOCK) {
      await delay(300);
      return getFarmingEssentials();
    }
    const res = await api.get<ApiResponse<Product[]>>("/products/farming-essentials");
    return res.data.data;
  },

  async search(query: string): Promise<Product[]> {
    if (USE_MOCK) {
      await delay(300);
      return applyFilters(mockProducts, { query });
    }
    const res = await api.get<ApiResponse<Product[]>>("/products/search", { params: { q: query } });
    return res.data.data;
  },
};
