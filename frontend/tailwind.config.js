/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        forge: {
          950: "#0a0a0b",
          900: "#111113",
          800: "#1a1a1e",
          700: "#252529",
          600: "#32323a",
          500: "#4a4a55",
        },
        ember: {
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
        },
        steel: {
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
        },
      },
      animation: {
        "slide-up": "slideUp 0.4s ease forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
        "blink": "blink 1.2s step-end infinite",
      },
      keyframes: {
        slideUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
