import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#151618",
        graphite: "#4d525b",
        mist: "#f6f5f2",
        porcelain: "#fbfaf7",
        line: "#e7e2d8",
        moss: "#526a52",
        ember: "#b05d3b",
        cobalt: "#315a8f"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(31, 28, 24, 0.08)",
        hairline: "inset 0 0 0 1px rgba(26, 27, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
