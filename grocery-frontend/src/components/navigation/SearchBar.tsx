import React from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { colors, radius, spacing, shadow, typography } from "@/theme";

interface Props {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  onFilterPress?: () => void;
  onPress?: () => void;
  editable?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onFilterPress,
  onPress,
  editable = true,
  placeholder = "Search vegetables, plants, seeds...",
  autoFocus,
}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Search size={18} color={colors.text.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        style={styles.input}
        autoFocus={autoFocus}
        returnKeyType="search"
        pointerEvents={editable ? "auto" : "none"}
      />
      {onFilterPress && (
        <Pressable onPress={onFilterPress} hitSlop={8} style={styles.filterButton}>
          <SlidersHorizontal size={17} color={colors.primary.forest} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 52,
    marginHorizontal: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  input: { flex: 1, ...typography.body, color: colors.text.primary },
  filterButton: {
    paddingLeft: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: colors.border.light,
  },
});
