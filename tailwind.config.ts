import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--color-surface)",
          alt: "var(--color-surface-alt)",
          card: "var(--color-surface-card)",
        },
        peach: {
          DEFAULT: "var(--color-peach)",
          light: "var(--color-peach-light)",
          dark: "var(--color-peach-dark)",
        },
        clay: {
          DEFAULT: "var(--color-clay)",
          light: "var(--color-clay-light)",
          dark: "var(--color-clay-dark)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          light: "var(--color-ink-light)",
          muted: "var(--color-ink-muted)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          onAccent: "var(--color-text-on-accent)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          focus: "var(--color-border-focus)",
        },
        bg: {
          surface: "var(--color-bg-surface)",
          card: "var(--color-bg-card)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
          dark: "var(--color-accent-dark)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        sans: ["var(--font-space-grotesk)", "sans-serif"],
      },
      boxShadow: {
        bruted: "var(--brut-shadow)",
        "bruted-sm": "var(--brut-shadow-sm)",
        "bruted-lg": "var(--brut-shadow-lg)",
      },
      borderWidth: {
        bruted: "var(--brut-border)",
      },
      borderRadius: {
        bruted: "var(--brut-radius)",
        "bruted-lg": "var(--brut-radius-lg)",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        ticker: "ticker 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
