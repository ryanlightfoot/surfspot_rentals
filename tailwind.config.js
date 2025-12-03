/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f7a85',
          dark: '#0b5c63',
          light: '#e7f2f3', // 10% opacity-ish version for backgrounds
        },
        secondary: {
          DEFAULT: '#cbb28a',
          dark: '#b0966d',
        },
        canvas: '#fbf9f2',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Assuming Inter or system fonts, but good to be explicit if we wanted. I'll leave this out for now as I don't know if a font is linked.
      }
    },
  },
  plugins: [],
}
