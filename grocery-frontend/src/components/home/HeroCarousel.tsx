import React, { useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { PrimaryButton } from "@/components/common";
import { colors, radius, spacing, typography } from "@/theme";
import { heroImages } from "@/constants/images";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Keep carousel cards aligned with the page content on narrow screens.
const SLIDE_INSET = spacing["2xl"];
const SLIDE_WIDTH = SCREEN_WIDTH - SLIDE_INSET * 2;

const slides = [
  {
    image: heroImages.slide1,
    title: "Fresh From Our Farm",
    subtitle: "Naturally grown. Carefully harvested.",
    cta: "Shop Organic",
    route: "/category/cat-vegetables",
  },
  {
    image: heroImages.slide2,
    title: "Bring Nature Home",
    subtitle: "Premium nursery plants for your home.",
    cta: "Explore Plants",
    route: "/category/cat-plants",
  },
  {
    image: heroImages.slide3,
    title: "Grow Your Own Food",
    subtitle: "Quality seeds for healthy harvests.",
    cta: "Shop Seeds",
    route: "/category/cat-seeds",
  },
];

export function HeroCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View>
      <Animated.FlatList
        data={slides}
        keyExtractor={(item) => item.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SLIDE_WIDTH + spacing.md}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SLIDE_INSET }}
        ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
          listener: onScroll,
        })}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SLIDE_WIDTH }]}>
            <Image source={typeof item.image === "string" ? { uri: item.image } : item.image} style={[StyleSheet.absoluteFill, styles.heroImage]} resizeMode="contain" />
            <LinearGradient colors={["rgba(23,32,25,0.05)", "rgba(23,32,25,0.75)"]} style={StyleSheet.absoluteFill} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <PrimaryButton
                label={item.cta}
                onPress={() => router.push(item.route as any)}
                variant="light"
                style={styles.cta}
              />
            </View>
          </View>
        )}
      />
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    height: 220,
    borderRadius: radius.xl,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: colors.secondary.beige,
  },
  heroImage: { backgroundColor: colors.secondary.beige },
  textContainer: { padding: spacing.lg },
  title: { ...typography.h1, color: colors.white, fontSize: 26 },
  subtitle: { ...typography.body, color: colors.secondary.cream, marginTop: 4, marginBottom: spacing.md },
  cta: { alignSelf: "flex-start", height: 42, paddingHorizontal: spacing.lg },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border.default },
  dotActive: { backgroundColor: colors.primary.organic, width: 18 },
});
