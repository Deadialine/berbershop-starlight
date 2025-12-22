import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-bebas)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        charcoal: "#0c0f14",
        accent: {
          cyan: "#30d5ff",
          emerald: "#0f6b4b",
          warm: "#f8f3e8"
        },
      },
      backgroundImage: {
        "hex-grid": "radial-gradient(circle at 1px 1px, rgba(48,213,255,0.08) 1px, rgba(12,15,20,0.4) 0)",
        "arch-glow": "conic-gradient(from 180deg at 50% 50%, rgba(48,213,255,0.25), rgba(248,243,232,0.15), rgba(15,107,75,0.15), rgba(48,213,255,0.25))"
      },
      boxShadow: {
        glow: "0 0 25px rgba(48,213,255,0.35)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
