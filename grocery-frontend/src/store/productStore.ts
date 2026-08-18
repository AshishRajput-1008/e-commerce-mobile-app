import { create } from "zustand";
import { Product, Category } from "@/types";
import { productService, categoryService, ProductFilters } from "@/services";

interface ProductState {
  featured: Product[];
  nursery: Product[];
  farmingEssentials: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  loadHome: () => Promise<void>;
  searchResults: Product[];
  isSearching: boolean;
  search: (query: string) => Promise<void>;
  listProducts: (filters?: ProductFilters) => Promise<Product[]>;
}

export const useProductStore = create<ProductState>((set) => ({
  featured: [],
  nursery: [],
  farmingEssentials: [],
  categories: [],
  isLoading: false,
  error: null,
  searchResults: [],
  isSearching: false,

  loadHome: async () => {
    set({ isLoading: true, error: null });
    try {
      const [featured, nursery, farmingEssentials, categories] = await Promise.all([
        productService.getFeatured(),
        productService.getNursery(),
        productService.getFarmingEssentials(),
        categoryService.getCategories(),
      ]);
      set({ featured, nursery, farmingEssentials, categories, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: e instanceof Error ? e.message : "Failed to load" });
    }
  },

  search: async (query) => {
    set({ isSearching: true });
    try {
      const results = await productService.search(query);
      set({ searchResults: results, isSearching: false });
    } catch {
      set({ isSearching: false });
    }
  },

  listProducts: async (filters) => {
    return productService.getProducts(filters);
  },
}));
