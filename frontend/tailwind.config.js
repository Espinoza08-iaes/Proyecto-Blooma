/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: {
            50: 'var(--color-primary-50)',
            100: 'var(--color-primary-100)',
            200: 'var(--color-primary-200)',
            300: 'var(--color-primary-300)',
            400: 'var(--color-primary-400)',
            500: 'var(--color-primary-500)',
            600: 'var(--color-primary-600)',
            700: 'var(--color-primary-700)',
            800: 'var(--color-primary-800)',
            900: 'var(--color-primary-900)',
          },
          earth: {
            50: 'var(--color-earth-50)',
            100: 'var(--color-earth-100)',
            200: 'var(--color-earth-200)',
            300: 'var(--color-earth-300)',
            400: 'var(--color-earth-400)',
            500: 'var(--color-earth-500)',
            600: 'var(--color-earth-600)',
            700: 'var(--color-earth-700)',
            800: 'var(--color-earth-800)',
            900: 'var(--color-earth-900)',
          },
          coral: {
            50: '#fff5f5',
            100: '#ffe3e3',
            200: '#ffc9c9',
            300: '#ffa8a8',
            400: '#ff8787',
            500: '#ff6b6b', // Para alertas urgentes
            600: '#fa5252',
            700: '#e03131',
            800: '#c92a2a',
            900: '#b01e1e',
          },
          sand: {
            50: '#fbfbf9',
            100: '#f7f6f0',
            200: '#ededdf',
            300: '#e0decc',
            400: '#d0cdb7',
            500: '#c0bca1',
            600: '#a39e83',
            700: '#848066',
            850: '#464436',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


