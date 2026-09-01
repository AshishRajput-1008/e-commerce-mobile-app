import { api } from "./api";
import { ApiResponse, Category, Order, Product } from "@/types";

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  stockUnit?: "kg" | "g" | "unit";
  lowStockThreshold: number;
  unit: string;
  imageUrl?: string;
  images?: string[];
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
}

export interface AdminOrder extends Order {
  user?: { fullName: string; email: string; mobile: string };
}

export const adminService = {
  async getProducts(): Promise<Product[]> {
    const res = await api.get<ApiResponse<Product[]>>("/products");
    return res.data.data;
  },
  async getLowStock(): Promise<Product[]> {
    const res = await api.get<ApiResponse<Product[]>>("/admin/products/low-stock");
    return res.data.data;
  },
  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const res = await api.post<ApiResponse<Product>>("/admin/products", payload);
    return res.data.data;
  },
  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const res = await api.post<ApiResponse<Category>>("/admin/categories", payload);
    return res.data.data;
  },
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  },
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/admin/products/${id}`);
  },
  async updateStock(id: string, stock: number, lowStockThreshold: number, stockUnit?: "kg" | "g" | "unit"): Promise<Product> {
    const res = await api.patch<ApiResponse<{ product: Product }>>(`/admin/products/${id}/stock`, { stock, lowStockThreshold, stockUnit });
    return res.data.data.product;
  },
  async getOrders(): Promise<AdminOrder[]> {
    const res = await api.get<ApiResponse<AdminOrder[]>>("/orders/admin/all");
    return res.data.data;
  },
  async updateOrderStatus(id: string, status: Order["status"]): Promise<AdminOrder> {
    const res = await api.patch<ApiResponse<AdminOrder>>(`/orders/admin/${id}/status`, { status });
    return res.data.data;
  },
};
