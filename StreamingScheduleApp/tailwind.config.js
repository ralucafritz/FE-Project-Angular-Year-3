/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{html,scss,ts}"],
  important: true,
  theme: {
    extend: {
      colors: {
        navbarColor: "#1F283F",
      },
      fontFamily: {
        sans: ["Itim", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
  darkMode: "class",
};
