import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
}

export function QuantitySelector({ quantity, onIncrease, onDecrease, min = 1 }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Decrease quantity"
        onPress={onDecrease}
        disabled={quantity <= min}
        style={[styles.btn, quantity <= min && styles.btnDisabled]}
      >
        <Minus size={16} color={quantity <= min ? colors.text.muted : colors.primary.forest} />
      </Pressable>
      <Text style={styles.value}>{quantity}</Text>
      <Pressable accessibilityLabel="Increase quantity" onPress={onIncrease} style={styles.btn}>
        <Plus size={16} color={colors.primary.forest} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.card,
  },
  btn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { opacity: 0.4 },
  value: {
    ...typography.productTitle,
    minWidth: 28,
    textAlign: "center",
    color: colors.text.primary,
  },
});
