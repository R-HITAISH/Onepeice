/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#17181A',
          900: '#17181A',
          800: '#222326',
          700: '#2E2F33',
        },
        ivory: {
          DEFAULT: '#F7F5F0',
          50: '#FBFAF7',
          100: '#F7F5F0',
          200: '#F0EEE8',
          300: '#E3E0D8',
        },
        brass: {
          DEFAULT: '#8A6D4E',
          hover: '#7A5E3F',
          light: '#A08560',
        },
        muted: {
          DEFAULT: '#6B6B66',
          light: '#8C8C86',
          dark: '#545450',
        },
        hairline: '#E3E0D8',
        success: '#4A6B4A',
        warning: '#9A7B3A',
        error: '#9A4A4A',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Work Sans', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(23, 24, 26, 0.08)',
        'soft-lg': '0 4px 20px rgba(23, 24, 26, 0.10)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
