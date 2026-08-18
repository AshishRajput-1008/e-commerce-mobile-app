import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Info,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { colors, radius, spacing, shadow, typography } from "@/theme";
import { useAuthStore } from "@/store";

const menuItems = [
  { icon: Package, label: "My Orders", route: "/orders" },
  { icon: Heart, label: "Wishlist", route: "/(tabs)/wishlist" },
  { icon: MapPin, label: "My Addresses", route: "/(tabs)/profile" },
  { icon: CreditCard, label: "Saved Payments", route: "/(tabs)/profile" },
  { icon: Bell, label: "Notifications", route: "/(tabs)/profile" },
  { icon: HelpCircle, label: "Help & Support", route: "/(tabs)/profile" },
  { icon: Info, label: "About Us", route: "/(tabs)/profile" },
  { icon: FileText, label: "Terms & Conditions", route: "/(tabs)/profile" },
  { icon: Shield, label: "Privacy Policy", route: "/(tabs)/profile" },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing["3xl"] }}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{user?.fullName?.[0] ?? "G"}</Text>
          </View>
          <Text style={styles.name}>{user?.fullName ?? "Guest"}</Text>
          <Text style={styles.contact}>{user?.email ?? "Sign in to view your profile"}</Text>
          <Text style={styles.contact}>{user?.mobile}</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              style={[styles.menuItem, index === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuIconWrap}>
                <item.icon size={18} color={colors.primary.forest} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={18} color={colors.text.muted} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color={colors.status.error} />
          <Text style={styles.logoutLabel}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>GreenRoot v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  header: { alignItems: "center", paddingVertical: spacing.xl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.organic,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarLetter: { color: colors.white, fontSize: 30, fontFamily: "Poppins_600SemiBold" },
  name: { ...typography.h2, color: colors.text.primary },
  contact: { ...typography.bodySmall, color: colors.text.secondary, marginTop: 2 },
  menu: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    ...shadow.card,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.background.sunken,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { ...typography.body, color: colors.text.primary, flex: 1 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#F3D9D3",
  },
  logoutLabel: { ...typography.button, color: colors.status.error },
  version: { ...typography.bodySmall, color: colors.text.muted, textAlign: "center", marginTop: spacing.lg },
});
