import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import { colors, spacing, typography } from "@/theme";

interface Props {
  value: number;
  reviews?: number;
  size?: number;
}

export function Rating({ value, reviews, size = 13 }: Props) {
  return (
    <View style={styles.row}>
      <Star size={size} color={colors.accent.gold} fill={colors.accent.gold} />
      <Text style={styles.value}>{value.toFixed(1)}</Text>
      {reviews != null && <Text style={styles.reviews}>({reviews})</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xxs },
  value: { ...typography.bodySmall, color: colors.text.primary, fontFamily: "System" },
  reviews: { ...typography.bodySmall, color: colors.text.muted },
});
