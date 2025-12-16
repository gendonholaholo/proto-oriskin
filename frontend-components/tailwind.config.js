/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B7355',
        secondary: '#f8f4f0',
        accent: '#D4C4B0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
