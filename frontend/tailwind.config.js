/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/Pages/**/*.{js,jsx,ts,tsx}",
    "./src/Components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#08050a",
        text: "#f7f5f9",
        primary: "#83569f",
        secondary: "#4A2F5B",
        accent: "#643A7E",
        lightGray: "#bfbfbf",
        darkGray: "#333333",
      }
    },
  },
  plugins: [],
}

