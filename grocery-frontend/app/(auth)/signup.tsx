import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Check } from "lucide-react-native";
import { colors, spacing, typography } from "@/theme";
import { AuthInput, SocialButton, Divider } from "@/components/auth";
import { PrimaryButton } from "@/components/common";
import { useAuthStore } from "@/store";

export default function SignUpScreen() {
  const { register, isLoading, error, clearError } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    if (mobile.trim().length < 10) errs.mobile = "Enter a valid mobile number";
    if (password.length < 6) errs.password = "Minimum 6 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!agreed) errs.agreed = "Please accept the Terms & Conditions";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = async () => {
    clearError();
    if (!validate()) return;
    try {
      await register({ fullName, email, mobile, password });
      router.replace("/(tabs)");
    } catch {
      // error surfaced via store
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <ArrowLeft size={22} color={colors.text.primary} />
          </Pressable>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join GreenRoot and start growing.</Text>

          <View style={{ marginTop: spacing.xl }}>
            <AuthInput label="Full Name" placeholder="Jane Doe" value={fullName} onChangeText={setFullName} error={fieldErrors.fullName} />
            <AuthInput label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} error={fieldErrors.email} />
            <AuthInput label="Mobile Number" placeholder="+91 98765 43210" keyboardType="phone-pad" value={mobile} onChangeText={setMobile} error={fieldErrors.mobile} />
            <AuthInput label="Password" placeholder="••••••••" isPassword value={password} onChangeText={setPassword} error={fieldErrors.password} />
            <AuthInput label="Confirm Password" placeholder="••••••••" isPassword value={confirmPassword} onChangeText={setConfirmPassword} error={fieldErrors.confirmPassword} />
          </View>

          <Pressable style={styles.termsRow} onPress={() => setAgreed((a) => !a)}>
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed && <Check size={12} color={colors.white} />}
            </View>
            <Text style={styles.termsText}>I agree to the Terms & Conditions and Privacy Policy</Text>
          </Pressable>
          {fieldErrors.agreed ? <Text style={styles.errorText}>{fieldErrors.agreed}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton label="Create Account" onPress={handleSignUp} loading={isLoading} style={{ marginTop: spacing.lg }} />

          <Divider />

          <SocialButton label="Sign up with Google" onPress={() => {}} />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.footerLink}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing["2xl"] },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: 4 },
  termsRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.xs, marginTop: spacing.xs },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.4,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxActive: { backgroundColor: colors.primary.organic, borderColor: colors.primary.organic },
  termsText: { ...typography.bodySmall, color: colors.text.secondary, flex: 1 },
  errorText: { ...typography.bodySmall, color: colors.status.error, marginTop: spacing.xs },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: spacing.xl },
  footerText: { ...typography.body, color: colors.text.secondary },
  footerLink: { ...typography.body, color: colors.primary.organic, fontFamily: "Inter_600SemiBold" },
});
