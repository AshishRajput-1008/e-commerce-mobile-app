// GreenRoot — Core TypeScript data models
// These interfaces define the shape of data across the entire app.
// They are backend-agnostic: mock data and future REST responses both
// conform to these types, so swapping data sources requires no UI changes.

export type ProductType =
  | "vegetable"
  | "fruit"
  | "seed"
  | "plant"
  | "flower"
  | "fertilizer"
  | "tool"
  | "pot"
  | "soil";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  benefits?: string[];
  categoryId: string;
  category: string;
  type: ProductType;
  images: string[];
  price: number;
  mrp: number;
  discount?: number;
  rating: number;
  reviews: number;
  stock: number;
  organic: boolean;
  unit?: string;
  specifications?: Record<string, string>;
  careInstructions?: {
    sunlight?: string;
    water?: string;
    soil?: string;
    temperature?: string;
    growthTime?: string;
  };
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  productCount?: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  avatar?: string;
  location?: string;
  role?: "customer" | "admin";
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  mobile: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  savedForLater?: boolean;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  placedAt: string;
  total: number;
  address: Address;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}
