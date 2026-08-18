export const formatPrice = (value: number): string => `₹${value.toLocaleString("en-IN")}`;

export const formatDiscount = (price: number, mrp: number): number =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max).trim()}…` : text;
