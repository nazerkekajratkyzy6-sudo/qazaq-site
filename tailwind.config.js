/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: { 50: '#FDFBF6', 100: '#FAF5EA', 200: '#F3EAD7', 300: '#E8DAB9', 400: '#D6C196' },
        ink: { 900: '#2A2521', 700: '#4A423B', 500: '#756B60', 300: '#B3A998' },
        bark: { 500: '#8A5A33', 600: '#744A29', 700: '#5E3B20' },
        gold: { 500: '#B08D57' },
        ok: '#4C6B3C',
        bad: '#9A3B2E',
      },
      fontFamily: {
        serif: ['"PT Serif"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"PT Sans"', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(94,59,32,.06), 0 10px 30px -12px rgba(94,59,32,.18)',
      },
    },
  },
  plugins: [],
}
