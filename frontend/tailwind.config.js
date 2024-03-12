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
        background: "#170e1b",
        text: "#efe7f2",
        primary: "#c5a8d1",
        secondary: "#506636",
        accent: "#6cb182",
        lightGray: "#bfbfbf",
        darkGray: "#333333",
      }
    },
  },
  plugins: [],
}

