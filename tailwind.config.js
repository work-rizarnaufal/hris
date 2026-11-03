import { colors } from './resources/js/config/theme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/views/**/*.blade.php',
    './resources/js/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: colors.navy,
        gold: colors.gold,
        ink: colors.ink,
        surface: colors.surface,
        status: colors.status,
      },
      fontFamily: {
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

