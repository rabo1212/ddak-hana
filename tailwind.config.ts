import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF7",
          100: "#FFF8F0",
          200: "#FFF0DE",
        },
        lavender: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
        },
        softpink: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
        },
        mint: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
        },
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        float: "float 3s ease-in-out infinite",
        "coin-spin": "coinSpin 0.6s ease-out",
        "char-happy": "charHappy 1.2s ease-in-out infinite",
        "char-sleepy": "charSleepy 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        coinSpin: {
          "0%": { transform: "rotateY(0deg) scale(1)" },
          "50%": { transform: "rotateY(180deg) scale(1.2)" },
          "100%": { transform: "rotateY(360deg) scale(1)" },
        },
        charHappy: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-8px) scale(1.05)" },
        },
        charSleepy: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(5deg) translateY(2px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
