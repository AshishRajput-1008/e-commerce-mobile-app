import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "gold";
}

export function PrimaryButton({ label, onPress, loading, disabled, style, variant = "primary" }: Props) {
  const bg = variant === "gold" ? colors.accent.gold : colors.primary.forest;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.88 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  label: {
    ...typography.button,
    color: colors.white,
  },
});
