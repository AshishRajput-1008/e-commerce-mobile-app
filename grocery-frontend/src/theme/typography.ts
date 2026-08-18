// GreenRoot Design System — Typography

export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  displayRegular: "Poppins_400Regular",
  displayMedium: "Poppins_500Medium",
  displaySemiBold: "Poppins_600SemiBold",
  displayBold: "Poppins_700Bold",
};

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  "2xl": 28,
  "3xl": 34,
  hero: 36,
};

export const lineHeight = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.65,
};

export const typography = {
  heroTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.hero,
    lineHeight: fontSize.hero * lineHeight.tight,
  },
  h1: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize["2xl"],
    lineHeight: fontSize["2xl"] * lineHeight.tight,
  },
  h2: {
    fontFamily: fontFamily.displaySemiBold,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.snug,
  },
  sectionTitle: {
    fontFamily: fontFamily.displaySemiBold,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.snug,
  },
  productTitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.snug,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  price: {
    fontFamily: fontFamily.displaySemiBold,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.snug,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.snug,
    letterSpacing: 0.4,
    textTransform: "uppercase" as const,
  },
  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.snug,
  },
};
