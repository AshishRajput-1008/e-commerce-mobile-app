import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface Props {
  label: string;
  onPress: () => void;
}

export function SocialButton({ label, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]} onPress={onPress}>
      <Text style={styles.text}>G</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.2,
    borderColor: colors.border.default,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.background.card,
  },
  text: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#EA4335" },
  label: { ...typography.button, color: colors.text.primary },
});
