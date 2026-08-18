import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/theme";

export function Divider({ label = "OR" }: { label?: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginVertical: spacing.lg, gap: spacing.sm },
  line: { flex: 1, height: 1, backgroundColor: colors.border.light },
  label: { ...typography.label, color: colors.text.muted },
});
