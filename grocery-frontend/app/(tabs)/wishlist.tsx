import React from "react";
import { View, Text, FlatList, Image, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { colors, radius, spacing, typography, shadow } from "@/theme";
import { EmptyState, PriceDisplay, PrimaryButton } from "@/components/common";
import { useWishlistStore, useCartStore } from "@/store";

export default function WishlistScreen() {
  const { items, removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.subtitle}>{items.length} item{items.length !== 1 ? "s" : ""} saved</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing["3xl"], flexGrow: 1 }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <EmptyState
            emoji="🌱"
            title="Your garden is waiting"
            message="Save products you love and grow your wishlist."
            actionLabel="Discover Products"
            onAction={() => router.push("/(tabs)")}
          />
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/product/${item.id}`)}>
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.stock}>{item.stock > 0 ? "In Stock" : "Out of Stock"}</Text>
              <PriceDisplay price={item.price} mrp={item.mrp} size="sm" />
              <View style={styles.actionsRow}>
                <PrimaryButton
                  label="Add to Cart"
                  onPress={() => addToCart(item, 1)}
                  style={styles.addButton}
                />
                <Pressable onPress={() => removeFromWishlist(item.id)} style={styles.removeButton} hitSlop={8}>
                  <Trash2 size={18} color={colors.status.error} />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { ...typography.h1, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: 4 },
  card: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.sm,
    ...shadow.card,
  },
  image: { width: 84, height: 84, borderRadius: radius.md, backgroundColor: colors.secondary.beige },
  name: { ...typography.productTitle, color: colors.text.primary },
  stock: { ...typography.bodySmall, color: colors.status.success, marginTop: 2, marginBottom: 4 },
  actionsRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm },
  addButton: { flex: 1, height: 38 },
  removeButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
});
