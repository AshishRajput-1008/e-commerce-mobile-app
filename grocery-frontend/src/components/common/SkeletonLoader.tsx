import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { colors, radius } from "@/theme";

interface Props {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = "100%", height = 16, borderRadius: br = radius.sm, style }: Props) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.85, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: br, backgroundColor: colors.secondary.beige, opacity },
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton height={130} borderRadius={radius.lg} />
      <View style={{ marginTop: 10, gap: 6 }}>
        <Skeleton width="80%" height={14} />
        <Skeleton width="50%" height={12} />
        <Skeleton width="40%" height={16} />
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View style={{ paddingHorizontal: 20, gap: 24 }}>
      <Skeleton height={180} borderRadius={radius.xl} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width={64} height={64} borderRadius={32} />
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 160 },
});
