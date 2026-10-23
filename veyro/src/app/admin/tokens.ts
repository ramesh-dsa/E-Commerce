/**
 * Admin Design System Tokens
 * Strictly scoped to the Admin UI
 */

export const ADMIN_TOKENS = {
  colors: {
    canvas: "#0D0D11",
    rail: "#09090C",
    surface: "#17171C",
    surface2: "#121216",
    surfaceHover: "#1E1E24",
    elevated: "#24242A",
    border: "rgba(255, 255, 255, 0.05)",
    borderStrong: "rgba(255, 255, 255, 0.10)",
    borderHover: "rgba(255, 255, 255, 0.12)",
    accent: "#7C3AED",
    primary: "#7C3AED",
    primaryHover: "#6D28D9",
    textPrimary: "#FFFFFF",
    textMuted: "#71717A",
    success: "#00F59B",
    danger: "#FF4B55",
    warning: "#F59E0B",
    info: "#38BDF8",
    heroCardBg: "#FFFFFF",
    heroCardText: "#111827",
  },
  radii: {
    card: "28px",
    input: "14px",
    select: "14px",
    innerPanel: "14px",
    item: "10px",
    button: "9999px",
    badge: "9999px",
  },
  donutPalette: [
    "#F97316", // Accent 1
    "#8B5CF6", // Accent 2
    "#FACC15", // Accent 3
    "#10B981", // Accent 4
    "#FB7185", // Accent 5
  ],
} as const;
