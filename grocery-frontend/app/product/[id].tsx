import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import { colors, radius, spacing, shadow, typography } from "@/theme";
import { Rating, PriceDisplay, QuantitySelector, PrimaryButton, SecondaryButton, WishlistButton, ErrorState } from "@/components/common";
import { Skeleton } from "@/components/common";
import { Product } from "@/types";
import { productService } from "@/services";
import { useCartStore, useWishlistStore } from "@/store";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState<string | null>("description");

  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);
  const addedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoading(true);
    productService.getProductById(id).then((p) => {
      setProduct(p ?? null);
      setLoading(false);
    });
  }, [id]);

  const toggleSection = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => (prev === key ? null : key));
  };

  const showAddedFeedback = () => {
    addedAnim.setValue(0);
    Animated.sequence([
      Animated.timing(addedAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(900),
      Animated.timing(addedAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Skeleton height={320} borderRadius={radius.lg} />
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={16} />
          <Skeleton width="30%" height={24} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ErrorState title="Product not found" message="This product may no longer be available." onRetry={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View>
          <Image source={{ uri: product.images[activeImage] }} style={styles.heroImage} resizeMode="cover" />
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <ArrowLeft size={20} color={colors.text.primary} />
          </Pressable>
          <View style={styles.wishlistFloating}>
            <WishlistButton active={isWishlisted(product.id)} onPress={() => toggleWishlist(product)} size={20} />
          </View>

          {product.images.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow} contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.lg }}>
              {product.images.map((img, index) => (
                <Pressable key={img} onPress={() => setActiveImage(index)}>
                  <Image
                    source={{ uri: img }}
                    style={[styles.thumb, activeImage === index && styles.thumbActive]}
                  />
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.body}>
          {product.organic && (
            <View style={styles.organicBadge}>
              <Text style={styles.organicBadgeText}>ORGANIC CERTIFIED</Text>
            </View>
          )}
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.metaRow}>
            <Rating value={product.rating} reviews={product.reviews} size={15} />
            <Text style={styles.stockText}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</Text>
          </View>

          <View style={{ marginTop: spacing.sm }}>
            <PriceDisplay price={product.price} mrp={product.mrp} />
          </View>

          <Text style={styles.shortDescription}>{product.description}</Text>

          <ExpandableSection
            title="Description"
            open={expanded === "description"}
            onToggle={() => toggleSection("description")}
          >
            <Text style={styles.sectionBody}>{product.description}</Text>
          </ExpandableSection>

          {product.benefits && product.benefits.length > 0 && (
            <ExpandableSection title="Benefits" open={expanded === "benefits"} onToggle={() => toggleSection("benefits")}>
              {product.benefits.map((b) => (
                <Text key={b} style={styles.bulletItem}>• {b}</Text>
              ))}
            </ExpandableSection>
          )}

          {product.specifications && (
            <ExpandableSection title="Specifications" open={expanded === "specs"} onToggle={() => toggleSection("specs")}>
              {Object.entries(product.specifications).map(([key, value]) => (
                <View key={key} style={styles.specRow}>
                  <Text style={styles.specKey}>{key}</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </ExpandableSection>
          )}

          {product.careInstructions && (
            <ExpandableSection title="Care Instructions" open={expanded === "care"} onToggle={() => toggleSection("care")}>
              {Object.entries(product.careInstructions).map(([key, value]) =>
                value ? (
                  <View key={key} style={styles.specRow}>
                    <Text style={styles.specKey}>{capitalize(key)}</Text>
                    <Text style={styles.specValue}>{value}</Text>
                  </View>
                ) : null
              )}
            </ExpandableSection>
          )}
        </View>
      </ScrollView>

      <View style={styles.ctaBar}>
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock))}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
        />
        <SecondaryButton
          label="Add to Cart"
          onPress={() => {
            addToCart(product, quantity);
            showAddedFeedback();
          }}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          label="Buy Now"
          onPress={() => {
            addToCart(product, quantity);
            router.push("/checkout");
          }}
          style={{ flex: 1 }}
        />
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            opacity: addedAnim,
            transform: [{ translateY: addedAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
          },
        ]}
      >
        <Text style={styles.toastText}>Added to cart 🌿</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

function ExpandableSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.expandable}>
      <Pressable style={styles.expandableHeader} onPress={onToggle}>
        <Text style={styles.expandableTitle}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
          <ChevronDown size={18} color={colors.text.secondary} />
        </Animated.View>
      </Pressable>
      {open && <View style={styles.expandableBody}>{children}</View>}
    </View>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  heroImage: { width: SCREEN_WIDTH, height: 340, backgroundColor: colors.secondary.beige },
  backButton: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  wishlistFloating: { position: "absolute", top: spacing.sm, right: spacing.lg },
  thumbRow: { position: "absolute", bottom: spacing.md, left: 0, right: 0 },
  thumb: { width: 52, height: 52, borderRadius: radius.sm, borderWidth: 2, borderColor: "transparent" },
  thumbActive: { borderColor: colors.accent.gold },
  body: { padding: spacing.lg },
  organicBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.background.sunken,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },
  organicBadgeText: { ...typography.label, color: colors.primary.organic },
  name: { ...typography.h1, color: colors.text.primary },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.xs },
  stockText: { ...typography.bodySmall, color: colors.status.success },
  shortDescription: { ...typography.body, color: colors.text.secondary, marginTop: spacing.md },
  expandable: { borderTopWidth: 1, borderTopColor: colors.border.light, marginTop: spacing.lg, paddingTop: spacing.md },
  expandableHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  expandableTitle: { ...typography.sectionTitle, fontSize: 16, color: colors.text.primary },
  expandableBody: { marginTop: spacing.sm },
  sectionBody: { ...typography.body, color: colors.text.secondary },
  bulletItem: { ...typography.body, color: colors.text.secondary, marginBottom: 4 },
  specRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  specKey: { ...typography.bodySmall, color: colors.text.muted },
  specValue: { ...typography.bodySmall, color: colors.text.primary, fontFamily: "Inter_600SemiBold" },
  ctaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadow.floating,
  },
  toast: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: colors.primary.forest,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  toastText: { ...typography.bodySmall, color: colors.white, fontFamily: "Inter_600SemiBold" },
});
