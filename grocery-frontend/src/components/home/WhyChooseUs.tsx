import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

const features = [
  { emoji: "🌱", title: "100% Organic", desc: "Certified organic sourcing" },
  { emoji: "🚜", title: "Farm Fresh", desc: "Harvested same day" },
  { emoji: "📦", title: "Safe Packaging", desc: "Eco-friendly & secure" },
  { emoji: "💚", title: "Naturally Grown", desc: "No harmful chemicals" },
];

export function WhyChooseUs() {
  return (
    <View style={styles.grid}>
      {features.map((f) => (
        <View key={f.title} style={styles.card}>
          <Text style={styles.emoji}>{f.emoji}</Text>
          <Text style={styles.title}>{f.title}</Text>
          <Text style={styles.desc}>{f.desc}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: "47%",
    backgroundColor: colors.background.sunken,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  emoji: { fontSize: 26, marginBottom: spacing.xs },
  title: { ...typography.productTitle, color: colors.text.primary },
  desc: { ...typography.bodySmall, color: colors.text.secondary, marginTop: 2 },
});
