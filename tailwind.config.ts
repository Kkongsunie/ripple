import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        gradient:
          "linear-gradient(127deg, #0B1A51 14.2%, rgba(0, 97, 255, 0.6) 83.22%)",
        hoverGradient:
          "linear-gradient(127deg, rgba(0, 97, 255, 0.6) 14.2%, #007acc 83.22%)",
      },
      fontSize: {
        h1: "5.61rem",
        h2: "4.209rem",
        h3: "3.157rem",
        h4: "2.369rem",
        h5: "1.777rem",
        h6: "1.333rem",
        p: "1rem",
        small: "0.75rem",
        smaller: "0.563rem",
      },
      boxShadow: {
        card: "3px 3px 20px 2px rgba(0, 0, 0, 0.10);",
      },
    },
  },
  plugins: [],
};
export default config;
