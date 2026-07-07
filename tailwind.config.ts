import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fff8ef",
        blush: "#f7d8dc",
        rosewood: "#7a3848",
        espresso: "#2a1714",
        champagne: "#f5e4c8",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(122, 56, 72, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
