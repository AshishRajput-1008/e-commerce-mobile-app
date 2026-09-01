import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Modal, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, Check } from "lucide-react-native";
import { colors, radius, spacing, typography, shadow } from "@/theme";
import { ProductGrid } from "@/components/products";
import { PrimaryButton, SecondaryButton } from "@/components/common";
import { productService, categoryService } from "@/services";
import { Product, Category } from "@/types";
import { ProductFilters } from "@/services/productService";
import { useCartStore } from "@/store";

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

      {category?.slug === "customize-gifting" || category?.slug === "gifting" ? <CustomGiftBuilder /> : <ProductGrid products={loading ? [] : products} />}

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

function CustomGiftBuilder() {
  const [options, setOptions] = useState<Product[]>([]);
  const [plantsSelected, setPlantsSelected] = useState<Product[]>([]);
  const [plantersSelected, setPlantersSelected] = useState<Product[]>([]);
  const addToCart = useCartStore((s) => s.addToCart);
  useEffect(() => { productService.getProducts().then((rows) => setOptions(rows.filter((p) => p.type === "plant" || (p.category || "").toLowerCase().includes("planter")))); }, []);
  const plants = options.filter((p) => p.type === "plant");
  const planters = options.filter((p) => (p.category || "").toLowerCase().includes("planter"));
  const toggle = (item: Product, selected: Product[], setSelected: React.Dispatch<React.SetStateAction<Product[]>>) => setSelected(selected.some((entry) => entry.id === item.id) ? selected.filter((entry) => entry.id !== item.id) : [...selected, item]);
  const addBundle = () => { if (!plantsSelected.length || !plantersSelected.length) return Alert.alert("Choose your gift", "Select at least one plant and one planter first."); [...plantsSelected, ...plantersSelected].forEach((item) => addToCart(item)); Alert.alert("Gift added", `${plantsSelected.length + plantersSelected.length} items were added to your cart.`); };
  const optionCard = (item: Product, selected: boolean, onPress: () => void) => <Pressable key={item.id} onPress={onPress} style={[styles.customOption, selected && styles.customOptionActive]}><Image source={{ uri: item.images?.[0] }} style={styles.customImage} /><Text style={styles.customName} numberOfLines={2}>{item.name}</Text>{selected && <View style={styles.selectedBadge}><Check size={13} color={colors.white} /></View>}</Pressable>;
  return <ScrollView contentContainerStyle={styles.customWrap}><Text style={styles.customTitle}>Create your perfect gift</Text><Text style={styles.customSub}>Select one or more plants and planters to build your own collection.</Text><View style={styles.pairColumns}><View style={styles.pairColumn}><Text style={styles.customLabel}>🌿 Plants ({plantsSelected.length} selected)</Text>{plants.map((p) => optionCard(p, plantsSelected.some((item) => item.id === p.id), () => toggle(p, plantsSelected, setPlantsSelected)))}</View><View style={styles.pairColumn}><Text style={styles.customLabel}>🪴 Planters ({plantersSelected.length} selected)</Text>{planters.map((p) => optionCard(p, plantersSelected.some((item) => item.id === p.id), () => toggle(p, plantersSelected, setPlantersSelected)))}</View></View><View style={styles.pairSummary}><Text style={styles.summaryTitle}>Your selection</Text><Text style={styles.summaryText}>{plantsSelected.length ? plantsSelected.map((item) => item.name).join(", ") : "Choose plants"}</Text><Text style={styles.summaryText}>{plantersSelected.length ? plantersSelected.map((item) => item.name).join(", ") : "Choose planters"}</Text></View><PrimaryButton label="Add selection to cart" onPress={addBundle} /></ScrollView>;
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
  customWrap: { padding: spacing.lg, paddingBottom: spacing["3xl"] },
  customTitle: { ...typography.h2, color: colors.text.primary, fontSize: 22 },
  customSub: { ...typography.bodySmall, color: colors.text.secondary, marginTop: 4, marginBottom: spacing.lg },
  customLabel: { ...typography.productTitle, color: colors.text.primary, marginTop: spacing.md, marginBottom: spacing.sm },
  customRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  pairColumns: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  pairColumn: { flex: 1, gap: spacing.sm },
  customOption: { width: "100%", borderRadius: radius.md, borderWidth: 1, borderColor: colors.border.default, backgroundColor: colors.background.card, padding: spacing.xs, position: "relative" },
  customOptionActive: { borderColor: colors.primary.organic, backgroundColor: colors.secondary.cream },
  customImage: { width: "100%", height: 90, borderRadius: radius.sm },
  customName: { ...typography.bodySmall, color: colors.text.primary, marginTop: 5, minHeight: 34 },
  selectedBadge: { position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary.organic, alignItems: "center", justifyContent: "center" },
  pairSummary: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.secondary.cream },
  summaryTitle: { ...typography.productTitle, color: colors.text.primary },
  summaryText: { ...typography.bodySmall, color: colors.text.secondary, marginTop: 4 },
});
