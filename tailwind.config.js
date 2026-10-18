/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F4EF',
        surface: '#FFFFFF',
        sunken: '#ECE9E1',
        ink: {
          DEFAULT: '#141414',
          2: '#5C5A55',
        },
        brass: {
          DEFAULT: '#A67C34',
          text: '#7A5A22',
        },
        night: {
          DEFAULT: '#0F0F0E',
          ink: '#F6F4EF',
        },
        error: '#A4321D',
        success: '#2E5E45',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Work Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      spacing: {
        'section': '120px',
        'section-m': '80px',
      },
      screens: {
        'sm': '390px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
};
