/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./src/**/*.{html,scss,ts}",
  ],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Itim', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
  darkMode: 'class'
}