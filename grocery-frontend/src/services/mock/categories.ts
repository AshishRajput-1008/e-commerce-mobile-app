import { Category } from "@/types";
import { categoryImages } from "@/constants/images";

export const mockCategories: Category[] = [
  { id: "cat-vegetables", name: "Vegetables", slug: "vegetables", icon: "🥬", image: categoryImages.vegetables, productCount: 42 },
  { id: "cat-seeds", name: "Seeds", slug: "seeds", icon: "🌱", image: categoryImages.seeds, productCount: 58 },
  { id: "cat-plants", name: "Plants", slug: "plants", icon: "🪴", image: categoryImages.plants, productCount: 76 },
  { id: "cat-flowers", name: "Flowers", slug: "flowers", icon: "🌸", image: categoryImages.flowers, productCount: 30 },
  { id: "cat-fruits", name: "Fruits", slug: "fruits", icon: "🍎", image: categoryImages.fruits, productCount: 24 },
  { id: "cat-herbs", name: "Herbs", slug: "herbs", icon: "🌿", image: categoryImages.herbs, productCount: 19 },
  { id: "cat-farming", name: "Farming", slug: "farming", icon: "🧑‍🌾", image: categoryImages.farming, productCount: 33 },
  { id: "cat-pots", name: "Pots", slug: "pots", icon: "🪴", image: categoryImages.pots, productCount: 27 },
];
