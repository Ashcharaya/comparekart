/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2874f0', // CompareKart brand blue
          600: '#1e5ecc',
          700: '#1748a6',
          800: '#133980',
          900: '#102d63',
        },
        accent: {
          light: '#fff4cc',
          DEFAULT: '#ff9f00', // vibrant shopping accent
          dark: '#fb641b', // action button orange
        },
        kartGreen: {
          DEFAULT: '#388e3c',
          light: '#e8f5e9',
          dark: '#2e7d32',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'kart': '0 2px 8px rgba(0,0,0,0.08)',
        'kart-hover': '0 6px 18px rgba(0,0,0,0.12)',
        'tray': '0 -4px 20px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}
