import React, { useRef } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
import { Heart } from "lucide-react-native";
import { colors, radius } from "@/theme";

interface Props {
  active: boolean;
  onPress: () => void;
  size?: number;
}

export function WishlistButton({ active, onPress, size = 18 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, speed: 30 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    onPress();
  };

  return (
    <Pressable accessibilityLabel="Toggle wishlist" onPress={handlePress} style={styles.button} hitSlop={8}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Heart
          size={size}
          color={active ? colors.status.error : colors.text.secondary}
          fill={active ? colors.status.error : "transparent"}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
});
