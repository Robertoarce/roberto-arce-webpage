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
        // Warm paper / cream — the "printed on paper" canvas
        paper: {
          DEFAULT: "#f4efe5",
          50: "#fbf8f2",
          100: "#f7f1e6",
          200: "#efe7d5",
          300: "#e4d8bf",
        },
        // Deep navy — secondary ink
        ink: {
          DEFAULT: "#0e2033",
          950: "#0a1622",
          900: "#0d1c2e",
          850: "#112338",
          800: "#162c45",
          700: "#1d3a58",
          600: "#2a4d71",
          500: "#3b628c",
        },
        // Hairlines + secondary text
        line: "#c8bb9f",
        muted: "#77808c",
        faint: "#9aa3ae",
        // Japanese vermillion — the single accent
        accent: {
          DEFAULT: "#c43d2c",
          soft: "#da5b43",
          deep: "#9b2a1b",
          muted: "rgba(196, 61, 44, 0.12)",
        },
        // Muted blue — data-viz / print ink
        azure: "#5b7a99",
        azureSoft: "#7f9cb5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      maxWidth: {
        prose: "72ch",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.4) inset, 0 24px 48px -28px rgba(13,28,46,0.35)",
        glow: "0 0 0 1px rgba(196,61,44,0.25), 0 12px 40px -18px rgba(196,61,44,0.45)",
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
