import React from "react";
import { Alert, View, Text, Pressable, StyleSheet, Image } from "react-native";
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

  const handleWishlist = () => {
    const wasWishlisted = isWishlisted(product.id);
    toggleWishlist(product);
    Alert.alert(
      wasWishlisted ? "Removed from wishlist" : "Added to wishlist",
      wasWishlisted ? `${product.name} was removed from your wishlist.` : `${product.name} is saved to your wishlist.`
    );
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    Alert.alert("Added to cart", `${product.name} was added to your cart.`);
  };

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
          <WishlistButton active={isWishlisted(product.id)} onPress={handleWishlist} />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.unit} numberOfLines={1}>
          {product.unit || product.category}
        </Text>
        <Text style={[styles.stock, product.stock <= 0 && styles.stockOut]}>
          {product.stock > 0 ? `Available: ${product.stock} ${product.category.toLowerCase().includes("veget") ? (product.unit?.match(/kg|g/i)?.[0] || "kg") : "units"}` : "Out of stock"}
        </Text>
        <Rating value={product.rating} reviews={product.reviews} />
        <View style={styles.bottomRow}>
          <View style={styles.priceWrap}>
            <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />
          </View>
          <View style={styles.cartAction}>
            <CartButton size={32} onPress={handleAddToCart} disabled={product.stock <= 0} />
          </View>
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
  stock: { ...typography.bodySmall, color: colors.status.success, fontFamily: "Inter_600SemiBold", marginBottom: 5 },
  stockOut: { color: colors.status.error },
  bottomRow: { width: "100%", flexDirection: "row", alignItems: "center", marginTop: spacing.xs, minHeight: 34 },
  priceWrap: { flex: 1, minWidth: 0 },
  cartAction: { flexShrink: 0, marginLeft: spacing.xs, width: 32, height: 32 },
});
