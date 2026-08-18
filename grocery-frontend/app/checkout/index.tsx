import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, MapPin, CreditCard, Check } from "lucide-react-native";
import { colors, radius, spacing, shadow, typography } from "@/theme";
import { PrimaryButton } from "@/components/common";
import { useCartStore } from "@/store";
import { formatPrice } from "@/utils/format";
import { orderService } from "@/services";

const mockAddress = {
  id: "addr-1",
  label: "Home",
  fullName: "Ashish Sharma",
  mobile: "+91 98765 43210",
  line1: "12 Greenfield Residency",
  line2: "MP Nagar",
  city: "Bhopal",
  state: "Madhya Pradesh",
  pincode: "462011",
};

const paymentOptions = ["Cash on Delivery"];

export default function CheckoutScreen() {
  const { items, subtotal, discount, deliveryFee, total, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await orderService.createOrder(
      { items, subtotal: subtotal(), discount: discount(), deliveryFee: deliveryFee(), total: total() },
      mockAddress as any
    );
    clearCart();
    setPlacing(false);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton} hitSlop={8}>
          <ArrowLeft size={20} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing["3xl"] }}>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MapPin size={16} color={colors.primary.forest} />
            <Text style={styles.cardHeader}>Delivery Address</Text>
          </View>
          <Text style={styles.addressName}>{mockAddress.fullName} — {mockAddress.label}</Text>
          <Text style={styles.addressText}>
            {mockAddress.line1}, {mockAddress.line2}, {mockAddress.city}, {mockAddress.state} {mockAddress.pincode}
          </Text>
          <Text style={styles.addressText}>{mockAddress.mobile}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <CreditCard size={16} color={colors.primary.forest} />
            <Text style={styles.cardHeader}>Payment Method</Text>
          </View>
          {paymentOptions.map((opt) => (
            <Pressable key={opt} style={styles.paymentRow} onPress={() => setPaymentMethod(opt)}>
              <Text style={styles.paymentLabel}>{opt}</Text>
              <View style={[styles.radio, paymentMethod === opt && styles.radioActive]}>
                {paymentMethod === opt && <Check size={12} color={colors.white} />}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Order Summary</Text>
          <SummaryRow label="Subtotal" value={formatPrice(subtotal())} />
          <SummaryRow label="Discount" value={`- ${formatPrice(discount())}`} valueColor={colors.status.success} />
          <SummaryRow label="Delivery" value={deliveryFee() === 0 ? "FREE" : formatPrice(deliveryFee())} valueColor={deliveryFee() === 0 ? colors.status.success : undefined} />
          <View style={styles.divider} />
          <SummaryRow label="Total" value={formatPrice(total())} bold />
        </View>
      </ScrollView>

      <View style={styles.ctaBar}>
        <PrimaryButton label={`Place Order · ${formatPrice(total())}`} onPress={handlePlaceOrder} loading={placing} />
      </View>
    </SafeAreaView>
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
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.sm },
  cardHeader: { ...typography.sectionTitle, fontSize: 16, color: colors.text.primary },
  addressName: { ...typography.productTitle, color: colors.text.primary, marginTop: 4 },
  addressText: { ...typography.bodySmall, color: colors.text.secondary, marginTop: 2 },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  paymentLabel: { ...typography.body, color: colors.text.primary },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { backgroundColor: colors.primary.organic, borderColor: colors.primary.organic },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  summaryLabel: { ...typography.body, color: colors.text.secondary },
  summaryLabelBold: { fontFamily: "Inter_700Bold", color: colors.text.primary },
  summaryValue: { ...typography.body, color: colors.text.primary },
  summaryValueBold: { ...typography.h2, fontSize: 18 },
  divider: { height: 1, backgroundColor: colors.border.default, marginVertical: spacing.xs },
  ctaBar: {
    padding: spacing.lg,
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadow.floating,
  },
});
