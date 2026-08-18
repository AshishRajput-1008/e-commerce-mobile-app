import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, LayoutGrid, Search, Heart, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, typography } from "@/theme";

const icons: Record<string, any> = {
  index: Home,
  categories: LayoutGrid,
  search: Search,
  wishlist: Heart,
  profile: User,
};

const labels: Record<string, string> = {
  index: "Home",
  categories: "Categories",
  search: "Search",
  wishlist: "Wishlist",
  profile: "Profile",
};

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = icons[route.name] ?? Home;
        const label = labels[route.name] ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tab}
          >
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Icon size={20} color={focused ? colors.white : colors.text.secondary} />
            </View>
            <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: spacing.sm,
    ...shadow.floating,
  },
  tab: { flex: 1, alignItems: "center", gap: 4 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: { backgroundColor: colors.primary.organic },
  label: { ...typography.label, fontSize: 10, color: colors.text.muted, textTransform: "none" },
  labelActive: { color: colors.primary.organic, fontFamily: "Inter_600SemiBold" },
});
