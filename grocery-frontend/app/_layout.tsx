import "react-native-gesture-handler";
import React, { useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { colors } from "@/theme";
import { useAuthStore } from "@/store";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StatusBar style="dark" backgroundColor={colors.background.default} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background.default } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="category/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="cart/index" options={{ presentation: "modal" }} />
        <Stack.Screen name="checkout/index" options={{ presentation: "card" }} />
        <Stack.Screen name="orders/index" options={{ presentation: "card" }} />
        <Stack.Screen name="admin/index" options={{ presentation: "card" }} />
        <Stack.Screen name="collection/[type]" options={{ presentation: "card" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
