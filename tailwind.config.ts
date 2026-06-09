import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05060a",
          900: "#0a0c12",
          800: "#11141d",
          700: "#1a1e2a",
          600: "#2a2f3f",
          500: "#6d7388", // bumped from #3f4456 for readability on dark bg
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
          // Added so chaos and analysis can have their own category hues
          // distinct from paradox (rose) and geometry (amber). Used by
          // every chaos topic page (coral) and every analysis topic page
          // (teal), plus the cosmos constellation in lib/cosmos/layout.ts.
          coral: "#ff8a5c",
          teal: "#7be0c0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "float-slow": "floatSlow 12s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
