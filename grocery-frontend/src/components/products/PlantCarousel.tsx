import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Product } from "@/types";
import { PlantCard } from "./PlantCard";
import { spacing } from "@/theme";

interface Props {
  products: Product[];
}

export function PlantCarousel({ products }: Props) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
      renderItem={({ item }) => <PlantCard product={item} />}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg },
});
