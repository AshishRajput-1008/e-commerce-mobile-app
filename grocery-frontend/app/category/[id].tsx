import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, Check } from "lucide-react-native";
import { colors, radius, spacing, typography, shadow } from "@/theme";
import { ProductGrid } from "@/components/products";
import { PrimaryButton, SecondaryButton } from "@/components/common";
import { productService, categoryService } from "@/services";
import { Product, Category } from "@/types";
import { ProductFilters } from "@/services/productService";

const sortOptions: { key: NonNullable<ProductFilters["sort"]>; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "newest", label: "Newest" },
  { key: "priceLowHigh", label: "Price: Low to High" },
  { key: "priceHighLow", label: "Price: High to Low" },
  { key: "rating", label: "Rating" },
];

export default function CategoryListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sort, setSort] = useState<ProductFilters["sort"]>("popular");
  const [organicOnly, setOrganicOnly] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const [cat, items] = await Promise.all([
      categoryService.getCategoryById(id),
      productService.getProducts({ categoryId: id, sort, organic: organicOnly || undefined }),
    ]);
    setCategory(cat ?? null);
    setProducts(items);
    setLoading(false);
  }, [id, sort, organicOnly]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton} hitSlop={8}>
          <ArrowLeft size={20} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{category?.name ?? "Products"}</Text>
        <Pressable onPress={() => setFilterVisible(true)} style={styles.iconButton} hitSlop={8}>
          <SlidersHorizontal size={19} color={colors.text.primary} />
        </Pressable>
        <Pressable onPress={() => setSortVisible(true)} style={styles.iconButton} hitSlop={8}>
          <ArrowUpDown size={19} color={colors.text.primary} />
        </Pressable>
      </View>

      <ProductGrid products={loading ? [] : products} />

      <Modal visible={sortVisible} transparent animationType="fade" onRequestClose={() => setSortVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSortVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Sort By</Text>
            {sortOptions.map((opt) => (
              <Pressable
                key={opt.key}
                style={styles.sortOption}
                onPress={() => {
                  setSort(opt.key);
                  setSortVisible(false);
                }}
              >
                <Text style={styles.sortLabel}>{opt.label}</Text>
                {sort === opt.key && <Check size={18} color={colors.primary.organic} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={filterVisible} transparent animationType="slide" onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Filters</Text>
            <ScrollView>
              <Pressable style={styles.filterRow} onPress={() => setOrganicOnly((v) => !v)}>
                <Text style={styles.sortLabel}>Organic Only</Text>
                <View style={[styles.checkbox, organicOnly && styles.checkboxActive]}>
                  {organicOnly && <Check size={12} color={colors.white} />}
                </View>
              </Pressable>
            </ScrollView>
            <View style={styles.filterActions}>
              <SecondaryButton label="Reset" onPress={() => setOrganicOnly(false)} style={{ flex: 1 }} />
              <PrimaryButton label="Apply" onPress={() => setFilterVisible(false)} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  iconButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h2, fontSize: 19, color: colors.text.primary, flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: "70%",
    ...shadow.floating,
  },
  sheetTitle: { ...typography.h2, fontSize: 18, color: colors.text.primary, marginBottom: spacing.md },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sortLabel: { ...typography.body, color: colors.text.primary },
  filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.4,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: { backgroundColor: colors.primary.organic, borderColor: colors.primary.organic },
  filterActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
});
