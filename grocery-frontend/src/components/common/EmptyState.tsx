import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PrimaryButton } from "./PrimaryButton";
import { colors, spacing, typography } from "@/theme";

interface Props {
  emoji?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ emoji = "🌱", title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={{ marginTop: spacing.lg, minWidth: 200 }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", paddingVertical: spacing["4xl"], paddingHorizontal: spacing.xl },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { ...typography.h2, color: colors.text.primary, textAlign: "center" },
  message: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginTop: spacing.xs },
});
