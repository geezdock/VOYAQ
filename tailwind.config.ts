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
          DEFAULT: "#F5F0EB",
          alt: "#EDE6DF",
          card: "#FFFFFF",
        },
        peach: {
          DEFAULT: "#F0D5C9",
          light: "#F5E3DB",
          dark: "#E8C4B8",
        },
        clay: {
          DEFAULT: "#C4A99A",
          light: "#D4BFB2",
          dark: "#A88D7E",
        },
        ink: {
          DEFAULT: "#2D2A24",
          light: "#5C554A",
          muted: "#8B7D72",
        },
        accent: {
          DEFAULT: "#D4836A",
          light: "#E09D88",
          dark: "#C06A52",
        },
        success: "#4A7C59",
        warning: "#C49B3C",
        error: "#B84A4A",
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        sans: ["var(--font-space-grotesk)", "sans-serif"],
      },
      boxShadow: {
        bruted: "4px 4px 0px #2D2A24",
        "bruted-sm": "2px 2px 0px #2D2A24",
        "bruted-lg": "6px 6px 0px #2D2A24",
      },
      borderWidth: {
        bruted: "2px",
      },
      borderRadius: {
        bruted: "4px",
        "bruted-lg": "8px",
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
