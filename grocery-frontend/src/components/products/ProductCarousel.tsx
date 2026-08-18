import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { spacing } from "@/theme";

interface Props {
  products: Product[];
}

export function ProductCarousel({ products }: Props) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg },
});
