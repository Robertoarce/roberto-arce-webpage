/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,vue,ts,jsx,tsx}",
    ".CNAME",
  ],
  theme: {
    extend: {
      colors: {
        // Warm ink neutrals — disciplined foundation (no AI-purple, no neon)
        ink: {
          950: "#0a0c0f",
          900: "#0e1115",
          850: "#12161b",
          800: "#171c22",
          700: "#1f252d",
          600: "#2a323c",
        },
        line: "#232a33",
        paper: "#eef1f5",
        muted: "#98a2ad",
        faint: "#626c78",
        // Single disciplined accent — warm amber
        accent: {
          DEFAULT: "#e2a83f",
          soft: "#f0c46a",
          deep: "#b57f1f",
          muted: "rgba(226, 168, 63, 0.12)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      maxWidth: {
        prose: "72ch",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 32px -14px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(226,168,63,0.28), 0 8px 32px -10px rgba(226,168,63,0.28)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
