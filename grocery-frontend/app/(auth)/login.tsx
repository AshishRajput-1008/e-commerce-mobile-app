import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";
import { colors, radius, spacing, typography } from "@/theme";
import { AuthInput, SocialButton, Divider } from "@/components/auth";
import { PrimaryButton } from "@/components/common";
import { useAuthStore } from "@/store";
import { authBackground } from "@/constants/images";

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async () => {
    clearError();
    try {
      await login({ email, password });
      const currentUser = useAuthStore.getState().user;
      router.replace(currentUser?.role === "admin" ? "/admin" : "/(tabs)");
    } catch {
      // error surfaced via store
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.heroWrap}>
            <Image source={{ uri: authBackground }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <View style={styles.heroOverlay} />
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>🌿</Text>
            </View>
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Grow something beautiful.</Text>

            <View style={{ marginTop: spacing.xl }}>
              <AuthInput
                label="Email or Mobile"
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <AuthInput
                label="Password"
                placeholder="••••••••"
                isPassword
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.rowBetween}>
              <Pressable style={styles.rememberRow} onPress={() => setRememberMe((r) => !r)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Check size={12} color={colors.white} />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
                <Text style={styles.forgot}>Forgot password?</Text>
              </Pressable>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <PrimaryButton label="Log In" onPress={handleLogin} loading={isLoading} style={{ marginTop: spacing.lg }} />

            <Divider />

            <SocialButton label="Continue with Google" onPress={() => {}} />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Pressable onPress={() => router.push("/(auth)/signup")}>
                <Text style={styles.footerLink}>Create one</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  content: { flexGrow: 1 },
  heroWrap: {
    height: 220,
    backgroundColor: colors.primary.forest,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(23,32,25,0.55)" },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -32,
    ...{ elevation: 6 },
  },
  logoText: { fontSize: 28 },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing["3xl"], paddingBottom: spacing["2xl"] },
  title: { ...typography.heroTitle, fontSize: 30, color: colors.text.primary, textAlign: "center" },
  subtitle: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginTop: 6 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  rememberRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.4,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: { backgroundColor: colors.primary.organic, borderColor: colors.primary.organic },
  rememberText: { ...typography.bodySmall, color: colors.text.secondary },
  forgot: { ...typography.bodySmall, color: colors.primary.organic, fontFamily: "Inter_600SemiBold" },
  errorText: { ...typography.bodySmall, color: colors.status.error, marginTop: spacing.xs },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: spacing.xl },
  footerText: { ...typography.body, color: colors.text.secondary },
  footerLink: { ...typography.body, color: colors.primary.organic, fontFamily: "Inter_600SemiBold" },
});
