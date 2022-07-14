/** @type {import('tailwindcss').Config} */
/* eslint-disable */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#FFF",
      brand: {
        700: "#6A32AE",
        600: "#833BDB",
        500: "#9642FD",
        100: "#2F2041",
        50: "#261C30",
      },
      grey: {
        700: "#151318",
        600: "#747276",
        400: "#9F9EA0",
        300: "#D0D0D1",
        150: "#E8E7E8",
        50: "#F3F3F4",
      },
      bg: {
        100: "#FAFAFA",
        200: "#FFF",
        300: "#F6F6F6",
      },
      accent: {
        green: "#10B981",
        red: "#F14C45",
      },
      social: {
        facebook: "#1877F2",
        twitter: "#1DA1F2",
        instagram: "#C32AA3",
        youtube: "#FF0000",
        mail: "#005FF9",
        google: "#fff",
      },
      dark: {
        // Reverse Scale (high number = lighter).
        // Means classnames should 1:1 map, e.g.: "bg-gray-700 dark:dark-bg-gray-700"
        // vs : "bg-gray-700 dark:dark-bg-gray-???"
        grey: {
          700: "#F3F3F4",
          600: "#A2A1A3",
          400: "#747276",
          300: "#353338",
          150: "#2A272C",
          50: "#232025",
        },
        bg: {
          100: "#17141A",
          200: "#1E1A20",
          300: "#252027",
        },
        brand: {
          700: "#6A32AE",
          600: "#833BDB",
          500: "#9642FD",
          100: "#EFE3FF",
          50: "#FAF6FF",
        },
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Roslindale", ...defaultTheme.fontFamily.serif],
      },
      gradientColorStops: {
        brand: {
          start: "#9642FD",
          end: "#7E2EE0",
        },
        brand2: {
          start: "#B980FF",
          end: "#7028CA",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
