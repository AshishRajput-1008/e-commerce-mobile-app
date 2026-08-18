import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ProductGrid } from "@/components/products";
import { productService } from "@/services";
import { Product } from "@/types";
import { colors, spacing, typography } from "@/theme";

const copy = {
  featured: { title: "Fresh Picks", subtitle: "Our latest 10 hand-picked products" },
  plants: { title: "Bring Nature Home", subtitle: "Every plant in our nursery collection" },
  vegetables: { title: "Seasonal Collection", subtitle: "Fresh vegetables from our farm" },
} as const;

export default function CollectionScreen() {
  const { type } = useLocalSearchParams<{ type: keyof typeof copy }>();
  const key = type && type in copy ? type : "featured";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try { setProducts(key === "featured" ? await productService.getFeatured() : key === "plants" ? await productService.getNursery() : await productService.getProducts({ categoryId: "vegetables" })); }
    finally { setLoading(false); }
  }, [key]);
  useEffect(() => { load(); }, [load]);
  return <SafeAreaView style={styles.container} edges={["top"]}><View style={styles.header}><Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={20} color={colors.text.primary} /></Pressable><View style={styles.heading}><Text style={styles.title}>{copy[key].title}</Text><Text style={styles.subtitle}>{copy[key].subtitle}</Text></View></View><ProductGrid products={loading ? [] : products} /></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background.default }, header: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, paddingBottom: spacing.md }, back: { width: 38, height: 38, alignItems: "center", justifyContent: "center" }, heading: { marginLeft: spacing.sm }, title: { ...typography.h2, color: colors.text.primary, fontSize: 20 }, subtitle: { ...typography.bodySmall, color: colors.text.secondary, marginTop: 2 } });
