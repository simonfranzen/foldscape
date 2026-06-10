export const palette = {
  ink: {
    950: "#05060a",
    900: "#0a0c12",
    800: "#11141d",
    700: "#1a1e2a",
    600: "#2a2f3f",
    500: "#6d7388",
    400: "#828aa1",
    300: "#a4abbf",
    200: "#c8cdde",
    100: "#eaecf3",
  },
  signal: {
    violet: "#b388ff",
    cyan: "#7df3ff",
    amber: "#ffd166",
    rose: "#ff7ab6",
    coral: "#ff8a5c",
    teal: "#7be0c0",
  },
  canvas: {
    bg: "#06070d",
    bgAlt: "#0b0d18",
    muted: "#8a90a4",
    ivory: "#fff5d6",
  },
} as const;

export type Palette = typeof palette;
