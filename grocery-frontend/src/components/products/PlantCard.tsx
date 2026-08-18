import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Product } from "@/types";
import { colors, radius, spacing, typography } from "@/theme";
import { formatPrice } from "@/utils/format";

interface Props {
  product: Product;
  width?: number;
  height?: number;
}

export function PlantCard({ product, width = 150, height = 190 }: Props) {
  return (
    <Pressable onPress={() => router.push(`/product/${product.id}`)} style={{ width }}>
      <View style={[styles.imageWrap, { height }]}>
        <Image source={{ uri: product.images[0] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(23,32,25,0.75)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.textWrap}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageWrap: {
    width: "100%",
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.secondary.beige,
    justifyContent: "flex-end",
  },
  textWrap: { padding: spacing.sm },
  name: { ...typography.productTitle, color: colors.white },
  price: { ...typography.bodySmall, color: colors.secondary.cream, marginTop: 2, fontFamily: "Inter_600SemiBold" },
});
