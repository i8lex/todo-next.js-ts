const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      softGreen: "#f3faf9",
      errorText: "#e33232",
      stroke: "#cbd0d5",
      green: {
        100: "#0d8f78",
        90: "#269d87",
        80: "#3EA895",
        60: "#6cbbac",
        40: "#9cd0c7",
        20: "#cde7e2",
        10: "#e9f5f3",
      },
      orange: {
        100: "#f86302",
        90: "#fa7119",
        80: "#ff8233",
        60: "#ffa366",
        40: "#fcbf98",
        20: "#fddfcb",
        10: "#fdeee4",
      },
      yellow: {
        100: "#fcbb3e",
        90: "#fdc251",
        80: "#fdca65",
        60: "#fcd68c",
        40: "#fde3b0",
        20: "#fdf1d8",
        10: "#fff8ed",
      },
      purple: {
        100: "#7151fd",
        90: "#7f63fc",
        80: "#8d72fc",
        60: "#A995FB",
        40: "#c6bafd",
        20: "#dfd9fc",
        10: "#ede9fa",
      },
      blue: {
        100: "#04a1e3",
        90: "#1face8",
        80: "#36b3e8",
        60: "#6ac8ef",
        40: "#9BDAF5",
        20: "#cfeffc",
        10: "#e9f9ff",
      },
      gray: {
        100: "#565859",
        90: "#777a7c",
        80: "#9a9e9f",
        60: "#d2d5d9",
        40: "#f1f4f5",
        20: "#f9fbfb",
        10: "#fcfdfc",
      },
      dark: {
        100: "#1f3952",
        90: "#364f65",
        80: "#4d6277",
        60: "#7a8b9a",
        40: "#a8b4be",
        20: "#d2d8dc",
        10: "#e7e9ec",
      },
      error: {
        100: "#ee3636",
        90: "#f85858",
        80: "#fa6d6d",
        60: "#fa8181",
        40: "#f89595",
        20: "#facdcd",
        10: "#fdeaea",
      },
    },
    fontFamily: {
      sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
    },
    fontSize: {
      dispXL: ["64px", "125%"],
      dispL: ["48px", "125%"],
      dispM: ["36xp", "125%"],
      dispS1: ["28px", "140%"],
      dispS2: ["24px", "140%"],
      dispS3: ["20px", "140%"],
      parL: ["18px", "160%"],
      parM: ["16px", "160%"],
      parS: ["14px", "160%"],
      quot: ["12px", "160%"],
    },
    screens: {
      tablet: "768px",
      desktop: "1440px",
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
