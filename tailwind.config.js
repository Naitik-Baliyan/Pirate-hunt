/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        pirate: {
          dark: '#2c1810',
          navy: '#4a3427',
          gold: '#d4af37',
          parchment: '#f4e4bc',
          accent: '#8b0000',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
