import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { colors, radius, spacing, typography } from "@/theme";
import { categoryImages } from "@/constants/images";

const cards = [
  { title: "Organic Seeds", image: categoryImages.seeds, route: "/category/cat-seeds" },
  { title: "Organic Fertilizers", image: categoryImages.farming, route: "/category/cat-farming" },
  { title: "Soil & Planting", image: categoryImages.pots, route: "/category/cat-farming" },
  { title: "Gardening Tools", image: categoryImages.farming, route: "/category/cat-farming" },
];

export function OrganicFarmingSection() {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.heading}>Grow Healthy. Live Naturally.</Text>
        <Text style={styles.subheading}>Everything you need to build your own organic garden.</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {cards.map((c) => (
          <Pressable key={c.title} onPress={() => router.push(c.route as any)} style={styles.card}>
            <Image source={{ uri: c.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <LinearGradient colors={["transparent", "rgba(23,32,25,0.7)"]} style={StyleSheet.absoluteFill} />
            <Text style={styles.cardTitle}>{c.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  heading: { ...typography.h2, color: colors.text.primary },
  subheading: { ...typography.body, color: colors.text.secondary, marginTop: 4 },
  row: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: {
    width: 140,
    height: 170,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.secondary.beige,
    justifyContent: "flex-end",
    padding: spacing.sm,
  },
  cardTitle: { ...typography.productTitle, color: colors.white },
});
