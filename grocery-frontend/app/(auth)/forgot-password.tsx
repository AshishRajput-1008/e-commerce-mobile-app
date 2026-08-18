import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { colors, spacing, typography } from "@/theme";
import { AuthInput } from "@/components/auth";
import { PrimaryButton } from "@/components/common";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
        <ArrowLeft size={22} color={colors.text.primary} />
      </Pressable>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        {sent
          ? "Check your inbox — we've sent password reset instructions."
          : "Enter your email and we'll send you instructions to reset your password."}
      </Text>

      {!sent && (
        <View style={{ marginTop: spacing.xl }}>
          <AuthInput label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <PrimaryButton label="Send Reset Link" onPress={() => setSent(true)} />
        </View>
      )}

      {sent && (
        <PrimaryButton label="Back to Login" onPress={() => router.replace("/(auth)/login")} style={{ marginTop: spacing.xl }} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: spacing.xl },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginTop: spacing.md, marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.sm },
});
