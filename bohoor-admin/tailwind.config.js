/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#152D5B",
        accent: "#EF8D00",
        white: "#FFFFFF",
        black: "#000000",
      },
      fontFamily: {
        arabic: ['"GE SS"', 'sans-serif'],
        english: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

