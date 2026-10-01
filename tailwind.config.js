/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0a0a',
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
        },
        ivory: {
          DEFAULT: '#f5f3f0',
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e6e1',
          300: '#d4d1ca',
        },
        brass: {
          DEFAULT: '#a67c34',
          hover: '#c99d5c',
          light: '#c99d5c',
          dark: '#8a6528',
        },
        grey: {
          light: '#999999',
          medium: '#666666',
          dark: '#333333',
        },
        muted: {
          DEFAULT: '#999999',
          light: '#b0b0b0',
          dark: '#666666',
        },
        hairline: '#333333',
        success: '#4A6B4A',
        warning: '#9A7B3A',
        error: '#9A4A4A',
      },
      fontFamily: {
        display: ['Impact', 'Haettenschweiler', 'Franklin Gothic Bold', 'sans-serif'],
        body: ['Work Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      fontSize: {
        'impact-sm': ['11px', { letterSpacing: '1px', fontWeight: '900' }],
        'impact': ['12px', { letterSpacing: '1px', fontWeight: '900' }],
        'impact-lg': ['14px', { letterSpacing: '1px', fontWeight: '900' }],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(0, 0, 0, 0.15)',
        'soft-lg': '0 4px 20px rgba(0, 0, 0, 0.20)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'brand-in': 'brandIn 0.8s ease-out 0.2s both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        brandIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
