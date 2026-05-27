/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kita siapkan warna tema World Cup (Biru & Emas)
        cupBlue: '#002B5B',
        cupGold: '#EA5455',
        cupDark: '#1A1A2E'
      }
    },
  },
  plugins: [],
}