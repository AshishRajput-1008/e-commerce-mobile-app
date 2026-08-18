import React, { useRef } from "react";
import { Pressable, StyleSheet, Animated, Text } from "react-native";
import { Plus } from "lucide-react-native";
import { colors, radius } from "@/theme";

interface Props {
  onPress: () => void;
  size?: number;
}

export function CartButton({ onPress, size = 32 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, speed: 40 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel="Add to cart"
        onPress={handlePress}
        style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Plus size={size * 0.55} color={colors.white} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary.organic,
    alignItems: "center",
    justifyContent: "center",
  },
});
