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
      <View style={{ flex: 1 }}>
        <Text style={styles.greeting}>Good Morning, {firstName} 🌱</Text>
        <View style={styles.locationRow}>
          <MapPin size={13} color={colors.text.secondary} />
          <Text style={styles.location} numberOfLines={1}>
            {user?.location || "Discover fresh & organic goodness"}
          </Text>
        </View>
      </View>

      <Pressable accessibilityLabel="Notifications" style={styles.iconButton} hitSlop={8}>
        <Bell size={20} color={colors.text.primary} />
        <View style={styles.dot} />
      </Pressable>

      <Pressable
        accessibilityLabel="Profile"
        onPress={() => router.push("/(tabs)/profile")}
        style={styles.avatar}
      >
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={StyleSheet.absoluteFill} />
        ) : (
          <Text style={styles.avatarLetter}>{firstName[0]}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
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
