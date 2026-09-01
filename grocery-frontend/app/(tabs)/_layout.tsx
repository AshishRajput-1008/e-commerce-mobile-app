import React from "react";
import { Tabs } from "expo-router";
import { BottomTabBar } from "@/components/navigation";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="categories" options={{ title: "Categories" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
      <Tabs.Screen name="wishlist" options={{ title: "Wishlist" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      {/* Search remains reachable from the home search field, but is not a bottom tab. */}
      <Tabs.Screen name="search" options={{ href: null }} />
    </Tabs>
  );
}
