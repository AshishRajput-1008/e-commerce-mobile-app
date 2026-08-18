import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors, spacing } from "@/theme";
import { Header, SearchBar } from "@/components/navigation";
import { HeroCarousel, WhyChooseUs, OrganicFarmingSection } from "@/components/home";
import { CategoryCard, ProductCarousel, PlantCarousel } from "@/components/products";
import { SectionHeader, HomeSkeleton, ErrorState } from "@/components/common";
import { useProductStore } from "@/store";

export default function HomeScreen() {
  const { featured, nursery, farmingEssentials, categories, isLoading, error, loadHome } = useProductStore();

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  if (error && !isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ErrorState onRetry={loadHome} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} onRefresh={loadHome} tintColor={colors.primary.organic} />}
        contentContainerStyle={{ paddingBottom: spacing["3xl"] }}
      >
        <Header />
        <SearchBar editable={false} onPress={() => router.push("/(tabs)/search")} onFilterPress={() => router.push("/(tabs)/search")} />

        {isLoading ? (
          <View style={{ marginTop: spacing.lg }}>
            <HomeSkeleton />
          </View>
        ) : (
          <>
            <View style={{ height: spacing.lg }} />
            <HeroCarousel />

            <View style={{ height: spacing["2xl"] }} />
            <SectionHeader title="Shop by Category" />
            <ScrollableCategories categories={categories} />

            <View style={{ height: spacing["2xl"] }} />
            <SectionHeader title="Fresh Picks" subtitle="Hand-picked organic produce" actionLabel="See all" onAction={() => router.push("/collection/featured" as any)} />
            <ProductCarousel products={featured} />

            <View style={{ height: spacing["2xl"] }} />
            <SectionHeader title="Bring Nature Home" subtitle="Premium nursery plants" actionLabel="Explore Nursery" onAction={() => router.push("/collection/plants" as any)} />
            <PlantCarousel products={nursery} />

            <View style={{ height: spacing["2xl"] }} />
            <OrganicFarmingSection />

            <View style={{ height: spacing["2xl"] }} />
            <SectionHeader title="Seasonal Collection" subtitle="Curated for this season" actionLabel="See all" onAction={() => router.push("/collection/vegetables" as any)} />
            <ProductCarousel products={farmingEssentials} />

            <View style={{ height: spacing["2xl"] }} />
            <SectionHeader title="Why Choose Us" />
            <WhyChooseUs />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ScrollableCategories({ categories }: { categories: any[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
    >
      {categories.map((c) => (
        <CategoryCard key={c.id} category={c} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
});
