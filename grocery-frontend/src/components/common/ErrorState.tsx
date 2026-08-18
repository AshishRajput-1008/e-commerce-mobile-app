import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { PrimaryButton } from "./PrimaryButton";
import { colors, spacing, typography } from "@/theme";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong.",
  message = "Please check your connection and try again.",
  onRetry,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <AlertTriangle size={28} color={colors.status.error} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <PrimaryButton label="Try Again" onPress={onRetry} style={{ marginTop: spacing.lg, minWidth: 160 }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", paddingVertical: spacing["4xl"], paddingHorizontal: spacing.xl },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FBEAE6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: { ...typography.h2, color: colors.text.primary, textAlign: "center" },
  message: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginTop: spacing.xs },
});
