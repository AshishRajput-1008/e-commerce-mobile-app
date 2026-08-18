import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { Product } from "@/types";
import { colors, radius, shadow, spacing, typography } from "@/theme";
import { Rating, PriceDisplay, WishlistButton, CartButton } from "@/components/common";
import { useWishlistStore, useCartStore } from "@/store";

interface Props {
  product: Product;
  width?: number | `${number}%`;
}

export function ProductCard({ product, width = 168 }: Props) {
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      style={({ pressed }) => [styles.card, { width, opacity: pressed ? 0.95 : 1 }]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.images[0] }} style={styles.image} resizeMode="cover" />
        {product.organic && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ORGANIC</Text>
          </View>
        )}
        <View style={styles.heart}>
          <WishlistButton active={isWishlisted(product.id)} onPress={() => toggleWishlist(product)} />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.unit} numberOfLines={1}>
          {product.unit || product.category}
        </Text>
        <Rating value={product.rating} reviews={product.reviews} />
        <View style={styles.bottomRow}>
          <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />
          <CartButton size={30} onPress={() => addToCart(product, 1)} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadow.card,
  },
  imageWrap: { width: "100%", height: 130, backgroundColor: colors.secondary.beige },
  image: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.primary.forest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeText: { ...typography.label, color: colors.white, fontSize: 9 },
  heart: { position: "absolute", top: spacing.xs, right: spacing.xs },
  info: { padding: spacing.sm },
  name: { ...typography.productTitle, color: colors.text.primary },
  unit: { ...typography.bodySmall, color: colors.text.muted, marginTop: 2, marginBottom: 6 },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.xs },
});
