import "react-native-gesture-handler";
import React, { useEffect, useCallback, useState } from "react";
import { Stack } from "expo-router";
import { Image, Platform, StyleSheet, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
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
  const [introFinished, setIntroFinished] = useState(false);

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
      <View style={styles.root}>
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
        {/* Browser autoplay is intentionally skipped. Safari/WebKit throws an
            uncaught native error for imperative video playback; the intro is
            still shown in Expo native clients. */}
        {!introFinished && <StartupSplash onFinish={() => setIntroFinished(true)} />}
      </View>
    </SafeAreaProvider>
  );
}

function StartupSplash({ onFinish }: { onFinish: () => void }) {
  const videoSource = require("../assets/images/bioyield-start.mp4");
  const player = useVideoPlayer(videoSource, (instance) => {
    instance.loop = false;
    instance.muted = true;
  });

  useEffect(() => {
    // WebKit browsers can throw an uncaught native error for imperative
    // autoplay. BrowserVideo uses the HTML muted/autoplay attributes instead.
    if (Platform.OS !== "web") {
      try {
        const result = player.play();
        Promise.resolve(result).catch(() => onFinish());
      } catch {
        onFinish();
      }
    }
    const subscription = player.addListener("playToEnd", onFinish);
    // Keep the overlay visible for the complete 4–5 second clip even if the
    // native end event is delayed on iOS or Expo Go.
    const fallback = setTimeout(onFinish, 7500);
    return () => {
      subscription.remove();
      clearTimeout(fallback);
    };
  }, [player, onFinish]);

  return (
    <View style={styles.splash}>
      {Platform.OS === "web" ? (
        <BrowserVideo source={videoSource} onFinish={onFinish} />
      ) : (
        <VideoView player={player} style={[StyleSheet.absoluteFill, { objectFit: "contain" } as any]} contentFit="contain" nativeControls={false} />
      )}
    </View>
  );
}

function BrowserVideo({ source, onFinish }: { source: number; onFinish: () => void }) {
  const resolver = (Image as any).resolveAssetSource;
  const resolved = typeof resolver === "function" ? resolver(source) : source;
  const uri = typeof resolved === "string" ? resolved : resolved?.uri;
  return React.createElement("video", {
    src: uri,
    autoPlay: true,
    muted: true,
    playsInline: true,
    onEnded: onFinish,
    onError: onFinish,
    style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" },
  });
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  splash: { ...StyleSheet.absoluteFillObject, zIndex: 10, backgroundColor: "#101813", alignItems: "center", justifyContent: "center", overflow: "hidden" },
});
