const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
    theme: {

    colors: {
      'white': '#FFFFFF',
      'black': '#242424',
      'grey': '#F3F3F3',
      'dark-grey': '#6B6B6B',
      'red': '#FF4E4E',
      'transparent': 'transparent',
      'twitter': '#1DA1F2',
      'purple': '#8B46FF'
    },

    fontSize: {
      'sm': '12px',
      'base': '14px',
      'xl': '16px',
      '2xl': '20px',
      '3xl': '28px',
      '4xl': '38px',
      '5xl': '50px',
    },

    extend: {
      fontFamily: {
        inter: ["'Inter'", "sans-serif"],
        gelasio: ["'Gelasio'", "serif"]
      },
    },

  },

  darkMode: "class",
  plugins: [nextui()],
}
