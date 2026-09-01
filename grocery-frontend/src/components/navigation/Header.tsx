import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Bell, MapPin } from "lucide-react-native";
import { router } from "expo-router";
import { colors, radius, spacing, typography } from "@/theme";
import { useAuthStore } from "@/store";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.fullName?.split(" ")[0] ?? "Guest";

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Image source={require("../../../assets/images/bioyield-logo.png")} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandName}>BioYield</Text>
            <Text style={styles.brandTagline}>A VENTURE OF JUNGLE VASE</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable accessibilityLabel="Notifications" style={styles.iconButton} hitSlop={8}>
            <Bell size={20} color={colors.text.primary} />
            <View style={styles.dot} />
          </Pressable>
          <Pressable accessibilityLabel="Profile" onPress={() => router.push("/(tabs)/profile")} style={styles.avatar}>
            {user?.avatar ? <Image source={{ uri: user.avatar }} style={StyleSheet.absoluteFill} /> : <Text style={styles.avatarLetter}>{firstName[0]}</Text>}
          </Pressable>
        </View>
      </View>
      <View style={styles.greetingBlock}>
        <Text style={styles.greeting}>Good Morning, {firstName} 🌱</Text>
        <View style={styles.locationRow}>
          <MapPin size={13} color={colors.text.secondary} />
          <Text style={styles.location} numberOfLines={1}>{user?.location || "Discover fresh & organic goodness"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brandRow: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  brandCopy: { marginLeft: spacing.sm, flexShrink: 1 },
  brandName: { ...typography.h2, fontSize: 20, color: colors.primary.forest, letterSpacing: 0.2 },
  brandTagline: { ...typography.label, fontSize: 8, letterSpacing: 0.8, color: colors.text.secondary, marginTop: 1 },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  greetingBlock: { marginTop: 2 },
  brandMark: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  brandLogo: { width: 138, height: 138 },
  greeting: { ...typography.h2, fontSize: 19, color: colors.text.primary },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  location: { ...typography.bodySmall, color: colors.text.secondary, flexShrink: 1 },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.background.sunken,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent.gold,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.primary.organic,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarLetter: { ...typography.productTitle, color: colors.white },
});
