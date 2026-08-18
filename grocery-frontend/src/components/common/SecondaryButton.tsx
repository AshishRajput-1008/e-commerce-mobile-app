import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface Props {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SecondaryButton({ label, onPress, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.base, { opacity: pressed ? 0.7 : 1 }, style]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary.forest,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.transparent,
  },
  label: {
    ...typography.button,
    color: colors.primary.forest,
  },
});
