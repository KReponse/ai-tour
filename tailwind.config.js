/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: "#0F9D94",
        accent: "#F4B400",
        dark: "#0B1120",
        light: "#F9FAFB",
      },
    },
  },

  plugins: [],
}