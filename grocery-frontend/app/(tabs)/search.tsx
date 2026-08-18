import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { X, TrendingUp, Clock } from "lucide-react-native";
import { colors, radius, spacing, typography } from "@/theme";
import { SearchBar } from "@/components/navigation";
import { ProductGrid } from "@/components/products";
import { useProductStore } from "@/store";

const recentSearches = ["Organic Spinach", "Money Plant", "Tomato Seeds"];
const popularSearches = ["Aloe Vera", "Vermicompost", "Curry Leaf Plant", "Rose Plant"];
const trendingCategories = ["Vegetables", "Indoor Plants", "Seeds", "Fertilizers"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const { searchResults, isSearching, search } = useProductStore();

  const runSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (q.trim().length > 0) search(q);
    },
    [search]
  );

  const hasQuery = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={query}
            onChangeText={runSearch}
            placeholder="Search organic products..."
            autoFocus
          />
        </View>
        {hasQuery && (
          <Pressable onPress={() => setQuery("")} style={styles.clearButton} hitSlop={8}>
            <X size={18} color={colors.text.secondary} />
          </Pressable>
        )}
      </View>

      {!hasQuery ? (
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color={colors.text.secondary} />
            <Text style={styles.sectionTitle}>Recent Searches</Text>
          </View>
          <View style={styles.chipRow}>
            {recentSearches.map((s) => (
              <Pressable key={s} style={styles.chip} onPress={() => runSearch(s)}>
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.sectionHeader, { marginTop: spacing.xl }]}>
            <TrendingUp size={16} color={colors.text.secondary} />
            <Text style={styles.sectionTitle}>Popular Searches</Text>
          </View>
          <View style={styles.chipRow}>
            {popularSearches.map((s) => (
              <Pressable key={s} style={styles.chip} onPress={() => runSearch(s)}>
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Trending Categories
          </Text>
          <FlatList
            data={trendingCategories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable style={styles.trendingRow} onPress={() => runSearch(item)}>
                <Text style={styles.trendingText}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      ) : (
        <View style={{ flex: 1, marginTop: spacing.md }}>
          <ProductGrid products={isSearching ? [] : searchResults} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  searchRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.sm, gap: spacing.sm, paddingRight: spacing.lg },
  clearButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.sm },
  sectionTitle: { ...typography.productTitle, color: colors.text.primary },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.background.sunken,
  },
  chipText: { ...typography.bodySmall, color: colors.text.primary },
  trendingRow: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border.light },
  trendingText: { ...typography.body, color: colors.text.primary },
});
