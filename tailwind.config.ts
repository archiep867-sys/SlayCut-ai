import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SLAYCUT brand palette
        sc: {
          black:    "#0d0d0d",
          charcoal: "#1a1a1a",
          graphite: "#252525",
          iron:     "#2e2e2e",
          cream:    "#f5f0e8",
          offwhite: "#ede8df",
          butter:   "#f4d03f",
          "butter-dim": "#c9a91e",
          orange:   "#e8571a",
          "orange-dim": "#b03e0d",
          teal:     "#0d9488",
          "teal-dim": "#0a6b62",
          purple:   "#7c3aed",
          "purple-dim": "#5b21b6",
          red:      "#dc2626",
          film:     "#1c1a14",
        },
        // Legacy aliases for backward-compat with existing components
        background: "#0d0d0d",
        surface: "#1a1a1a",
        surfaceHover: "#252525",
        surfaceActive: "#2e2e2e",
        primary: {
          DEFAULT: "#f4d03f",
          50:  "#fffde7",
          100: "#fff9c4",
          200: "#fff176",
          300: "#ffee58",
          400: "#ffca28",
          500: "#f4d03f",
          600: "#c9a91e",
          700: "#9a7d0a",
          800: "#6d5703",
          900: "#3d3100",
        },
        accent: {
          orange: "#e8571a",
          teal:   "#0d9488",
          purple: "#7c3aed",
          cream:  "#f5f0e8",
          butter: "#f4d03f",
        },
      },
      fontFamily: {
        display:    ["var(--font-display)", "Oswald", "Impact", "sans-serif"],
        body:       ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        handwritten:["var(--font-hand)", "Caveat", "cursive"],
        mono:       ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "sc-hero-gradient": "linear-gradient(135deg, #0d0d0d 0%, #1a1208 50%, #0d0d0d 100%)",
        "sc-card-gradient": "linear-gradient(145deg, #1a1a1a 0%, #141414 100%)",
        "sc-butter-gradient":"linear-gradient(135deg, #f4d03f 0%, #e8b800 100%)",
        "sc-orange-gradient":"linear-gradient(135deg, #e8571a 0%, #b03e0d 100%)",
        "sc-film-gradient": "repeating-linear-gradient(90deg, transparent 0px, transparent 14px, rgba(244,208,63,0.06) 14px, rgba(244,208,63,0.06) 15px)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "0.9" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        filmSlide: {
          "0%":   { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "30px 0" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideLeft: {
          "0%":   { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        pulseGlow:  "pulseGlow 3s ease-in-out infinite",
        shimmer:    "shimmer 2s infinite",
        filmSlide:  "filmSlide 2s linear infinite",
        ticker:     "ticker 30s linear infinite",
        fadeIn:     "fadeIn 0.4s ease forwards",
        scaleIn:    "scaleIn 0.35s ease forwards",
        slideLeft:  "slideLeft 0.4s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
