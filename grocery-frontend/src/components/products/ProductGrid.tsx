import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/common";
import { spacing } from "@/theme";

interface Props {
  products: Product[];
  onEndReached?: () => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function ProductGrid({ products, onEndReached, ListHeaderComponent }: Props) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
          <ProductCard product={item} width="100%" />
        </View>
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <EmptyState emoji="🔍" title="No products found" message="Try adjusting your filters or search terms." />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing["3xl"] },
  row: { gap: spacing.md, marginBottom: spacing.md },
});
