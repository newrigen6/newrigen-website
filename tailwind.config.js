/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: '#4DD9D9', dark: '#3BC8C8', light: '#7ee8e8' }
      },
      animation: { fadeIn: 'fadeIn .3s ease' },
      keyframes: { fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } } }
    }
  },
  plugins: []
}
