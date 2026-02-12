import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A", // Trinity Blue from logo
        "primary-dark": "#1E40AF",
        "primary-light": "#3B82F6",
        navy: "#000B29", // Dark navy from logo
        steel: "#64748B", // Steel grey
        "background-dark": "#0F172A",
        "section-dark": "#1E293B",
        "background-light": "#F8FAFC",
        "section-light": "#F1F5F9",
        accent: "#3B82F6",
        "accent-light": "#60A5FA",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
