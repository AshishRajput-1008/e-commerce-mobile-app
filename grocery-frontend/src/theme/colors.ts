// GreenRoot Design System — Colors
// A sophisticated, nature-inspired palette for a premium organic brand.

export const colors = {
  primary: {
    forest: "#173F2A",
    organic: "#2E7D4F",
    fresh: "#5FAF68",
  },
  secondary: {
    sage: "#A8C3A0",
    cream: "#F7F5EC",
    beige: "#EDE7D9",
  },
  accent: {
    gold: "#D6A84F",
  },
  text: {
    primary: "#172019",
    secondary: "#66736A",
    muted: "#9AA59D",
    inverse: "#FCFCF8",
  },
  background: {
    default: "#FCFCF8",
    card: "#FFFFFF",
    sunken: "#F7F5EC",
  },
  status: {
    success: "#2E7D4F",
    error: "#C24E3A",
    warning: "#D6A84F",
    info: "#3B6E8F",
  },
  border: {
    light: "#EAE7DC",
    default: "#DDE2D8",
  },
  overlay: "rgba(23, 32, 25, 0.45)",
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

export type ColorTheme = typeof colors;
