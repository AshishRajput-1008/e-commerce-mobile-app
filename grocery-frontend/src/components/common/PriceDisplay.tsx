import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/theme";
import { formatPrice, formatDiscount } from "@/utils/format";

interface Props {
  price: number;
  mrp: number;
  size?: "sm" | "md";
}

export function PriceDisplay({ price, mrp, size = "md" }: Props) {
  const discount = formatDiscount(price, mrp);
  return (
    <View style={styles.row}>
      <Text style={[styles.price, size === "sm" && styles.priceSm]}>{formatPrice(price)}</Text>
      {mrp > price && <Text style={styles.mrp}>{formatPrice(mrp)}</Text>}
      {discount > 0 && <Text style={styles.discount}>{discount}% OFF</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xs, flexWrap: "wrap" },
  price: { ...typography.price, color: colors.text.primary },
  priceSm: { fontSize: 15 },
  mrp: { ...typography.bodySmall, color: colors.text.muted, textDecorationLine: "line-through" },
  discount: { ...typography.bodySmall, color: colors.status.success, fontFamily: "Inter_600SemiBold" },
});
