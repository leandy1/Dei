/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bts: {
          light: '#e0c3fc',
          main: '#8ec5fc',
          purple: '#a29bfe',
          dark: '#6c5ce7',
          pink: '#ffb6b9'
        }
      },
      fontFamily: {
        nunito: ['"Nunito"', 'sans-serif'],
        quicksand: ['"Quicksand"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
