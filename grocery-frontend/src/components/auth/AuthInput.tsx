import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function AuthInput({ label, error, isPassword, ...rest }: Props) {
  const [hidden, setHidden] = useState(isPassword);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, !!error && styles.inputWrapError]}>
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={colors.text.muted}
          style={styles.input}
        />
        {isPassword && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            {hidden ? (
              <Eye size={18} color={colors.text.muted} />
            ) : (
              <EyeOff size={18} color={colors.text.muted} />
            )}
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { ...typography.label, color: colors.text.secondary, marginBottom: spacing.xs },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.2,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.card,
  },
  inputWrapError: { borderColor: colors.status.error },
  input: { flex: 1, ...typography.body, color: colors.text.primary },
  error: { ...typography.bodySmall, color: colors.status.error, marginTop: 4 },
});
