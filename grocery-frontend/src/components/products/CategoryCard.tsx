import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { Category } from "@/types";
import { colors, radius, spacing, typography } from "@/theme";
import { categoryImages } from "@/constants/images";

interface Props {
  category: Category;
}

export function CategoryCard({ category }: Props) {
  return (
    <Pressable
      onPress={() => router.push(`/category/${category.id}`)}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: category.image || categoryImages[category.slug as keyof typeof categoryImages] || categoryImages.vegetables }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.iconBadge}>
          <Text style={styles.icon}>{category.icon}</Text>
        </View>
      </View>
      <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { width: 76, alignItems: "center" },
  imageWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: "hidden",
    backgroundColor: colors.secondary.beige,
  },
  iconBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  icon: { fontSize: 12 },
  name: { ...typography.bodySmall, color: colors.text.primary, marginTop: spacing.xs, textAlign: "center" },
});
