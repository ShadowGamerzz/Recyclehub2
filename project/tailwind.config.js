/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bronze: {
          100: '#fdf2e9',
          600: '#cd7f32'
        }
      }
    },
  },
  plugins: [],
};