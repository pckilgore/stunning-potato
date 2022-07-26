/** @type {import('tailwindcss').Config} */
/* eslint-disable */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    fontSize: {
      // fontSize, Leading
      "2xs": ["0.75rem", "1rem"], // 12, 16
      xs: ["0.8125rem", "1.125rem"], // 13, 18
      s: ["0.875rem", "1.125rem"], // 14, 18
      base: ["1rem", "1.25rem"], // 16, 20
      lg: ["1.125rem", "1.375rem"], // 18, 22
      xl: ["1.125rem", "1.5"], // 18, 24
      "2xl": ["1.5rem", "2rem"], // 24, 32 "heading 4"
      "3xl": ["1.75rem", "2.375rem"], // 28, 38 "heading 3"
      "4xl": ["2rem", "2.75rem"], // 32, 44 "heading 2"
      "5xl": ["2.5rem", "3.25rem"], // 40, 52 "heading 1"
    },
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
      gray: {
        700: "#151318",
        600: "#747276",
        400: "#9F9EA0",
        300: "#D0D0D1",
        150: "#E8E7E8",
        50: "#F3F3F4",
      },
      background: {
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
        gray: {
          50: "#232025",
          150: "#2A272C",
          300: "#353338",
          400: "#747276",
          600: "#A2A1A3",
          700: "#E8E7E8",
        },
        background: {
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
      lineHeight: {
        38: "2.375rem",
      },
      backgroundImage: {
        swirl: "url(../img/swirl.png)",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Roslindale", ...defaultTheme.fontFamily.serif],
      },
      gradientColorStops: {
        brand: {
          start: "#7E2EE0",
          end: "#9642FD",
        },
        brand2: {
          end: "#B980FF",
          start: "#7028CA",
        },
      },
    },
  },
};
