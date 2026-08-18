import React from "react";
import { View, Text, FlatList, Image, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Trash2, Bookmark } from "lucide-react-native";
import { colors, radius, spacing, shadow, typography } from "@/theme";
import { EmptyState, PrimaryButton, QuantitySelector } from "@/components/common";
import { useCartStore } from "@/store";
import { formatPrice } from "@/utils/format";
import { CartItem } from "@/types";

export default function CartScreen() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    subtotal,
    discount,
    deliveryFee,
    total,
  } = useCartStore();

  const activeItems = items.filter((i) => !i.savedForLater);
  const savedItems = items.filter((i) => i.savedForLater);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton} hitSlop={8}>
          <ArrowLeft size={20} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>My Cart</Text>
        <View style={{ width: 38 }} />
      </View>

      {items.length === 0 ? (
        <EmptyState
          emoji="🛒"
          title="Your cart is empty"
          message="Your cart is waiting for something fresh."
          actionLabel="Start Shopping"
          onAction={() => router.push("/(tabs)")}
        />
      ) : (
        <FlatList
          data={activeItems}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing["3xl"] }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListHeaderComponent={<View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <CartRow
              item={item}
              onRemove={() => removeFromCart(item.productId)}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
              onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
              onSave={() => saveForLater(item.productId)}
            />
          )}
          ListFooterComponent={
            <View>
              {savedItems.length > 0 && (
                <View style={{ marginTop: spacing.xl }}>
                  <Text style={styles.savedTitle}>Saved for Later ({savedItems.length})</Text>
                  {savedItems.map((item) => (
                    <View key={item.productId} style={{ marginTop: spacing.md }}>
                      <CartRow
                        item={item}
                        onRemove={() => removeFromCart(item.productId)}
                        onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
                        onMoveToCart={() => moveToCart(item.productId)}
                        saved
                      />
                    </View>
                  ))}
                </View>
              )}

              {activeItems.length > 0 && (
                <View style={styles.summary}>
                  <Text style={styles.summaryTitle}>Order Summary</Text>
                  <SummaryRow label="Subtotal" value={formatPrice(subtotal())} />
                  <SummaryRow label="Discount" value={`- ${formatPrice(discount())}`} valueColor={colors.status.success} />
                  <SummaryRow label="Delivery" value={deliveryFee() === 0 ? "FREE" : formatPrice(deliveryFee())} valueColor={deliveryFee() === 0 ? colors.status.success : undefined} />
                  <View style={styles.divider} />
                  <SummaryRow label="Total" value={formatPrice(total())} bold />
                </View>
              )}
            </View>
          }
        />
      )}

      {activeItems.length > 0 && (
        <View style={styles.ctaBar}>
          <View>
            <Text style={styles.ctaTotal}>{formatPrice(total())}</Text>
            <Text style={styles.ctaSubtext}>{activeItems.length} item{activeItems.length !== 1 ? "s" : ""}</Text>
          </View>
          <PrimaryButton label="Proceed to Checkout" onPress={() => router.push("/checkout")} style={{ flex: 1, marginLeft: spacing.md }} />
        </View>
      )}
    </SafeAreaView>
  );
}

function CartRow({
  item,
  onRemove,
  onIncrease,
  onDecrease,
  onSave,
  onMoveToCart,
  saved,
}: {
  item: CartItem;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onSave?: () => void;
  onMoveToCart?: () => void;
  saved?: boolean;
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.product.images[0] }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
        <Text style={styles.unit}>{item.product.unit || item.product.category}</Text>
        <Text style={styles.price}>{formatPrice(item.product.price)}</Text>
        <View style={styles.rowBetween}>
          {!saved ? (
            <QuantitySelector quantity={item.quantity} onIncrease={onIncrease} onDecrease={onDecrease} />
          ) : (
            <Pressable onPress={onMoveToCart}>
              <Text style={styles.moveToCart}>Move to Cart</Text>
            </Pressable>
          )}
          <View style={styles.actionIcons}>
            {!saved && onSave && (
              <Pressable onPress={onSave} hitSlop={8} style={styles.iconAction}>
                <Bookmark size={17} color={colors.text.secondary} />
              </Pressable>
            )}
            <Pressable onPress={onRemove} hitSlop={8} style={styles.iconAction}>
              <Trash2 size={17} color={colors.status.error} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function SummaryRow({ label, value, bold, valueColor }: { label: string; value: string; bold?: boolean; valueColor?: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.summaryLabelBold]}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.summaryValueBold, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  iconButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h2, fontSize: 19, color: colors.text.primary, flex: 1, textAlign: "center" },
  card: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.sm,
    ...shadow.card,
  },
  image: { width: 76, height: 76, borderRadius: radius.md, backgroundColor: colors.secondary.beige },
  name: { ...typography.productTitle, color: colors.text.primary },
  unit: { ...typography.bodySmall, color: colors.text.muted, marginTop: 2 },
  price: { ...typography.price, color: colors.text.primary, marginTop: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm },
  actionIcons: { flexDirection: "row", gap: spacing.sm },
  iconAction: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  moveToCart: { ...typography.bodySmall, color: colors.primary.organic, fontFamily: "Inter_600SemiBold" },
  savedTitle: { ...typography.sectionTitle, fontSize: 16, color: colors.text.primary },
  summary: {
    marginTop: spacing.xl,
    backgroundColor: colors.background.sunken,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  summaryTitle: { ...typography.sectionTitle, fontSize: 16, color: colors.text.primary, marginBottom: spacing.sm },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  summaryLabel: { ...typography.body, color: colors.text.secondary },
  summaryLabelBold: { fontFamily: "Inter_700Bold", color: colors.text.primary },
  summaryValue: { ...typography.body, color: colors.text.primary },
  summaryValueBold: { ...typography.h2, fontSize: 18 },
  divider: { height: 1, backgroundColor: colors.border.default, marginVertical: spacing.xs },
  ctaBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadow.floating,
  },
  ctaTotal: { ...typography.h2, fontSize: 18, color: colors.text.primary },
  ctaSubtext: { ...typography.bodySmall, color: colors.text.secondary },
});
