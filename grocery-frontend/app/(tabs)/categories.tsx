import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, spacing, typography } from "@/theme";
import { categoryService } from "@/services";
import { Category } from "@/types";
import { Skeleton } from "@/components/common";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Browse everything GreenRoot has to offer</Text>
      </View>

      {loading ? (
        <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={100} borderRadius={radius.lg} />
          ))}
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: spacing.md, marginBottom: spacing.md }}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing["3xl"] }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/category/${item.id}`)}>
              <Image source={{ uri: item.image as string }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              <LinearGradient colors={["transparent", "rgba(23,32,25,0.65)"]} style={StyleSheet.absoluteFill} />
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardCount}>{item.productCount} items</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: { ...typography.h1, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: 4 },
  card: {
    flex: 1,
    height: 130,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.secondary.beige,
    padding: spacing.md,
    justifyContent: "flex-end",
  },
  cardIcon: { fontSize: 22, position: "absolute", top: spacing.sm, left: spacing.sm },
  cardTitle: { ...typography.productTitle, color: colors.white, fontSize: 16 },
  cardCount: { ...typography.bodySmall, color: colors.secondary.cream, marginTop: 2 },
});
