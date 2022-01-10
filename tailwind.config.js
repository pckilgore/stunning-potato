module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")]
};
