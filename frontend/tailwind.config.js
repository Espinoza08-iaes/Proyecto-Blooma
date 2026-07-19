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
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6', // Principal
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
          earth: {
            50: '#faf8f5', // Background claro y cálido
            100: '#f5ebe0',
            200: '#e3d5ca',
            300: '#d5bdaf',
            400: '#b5838d',
            500: '#a06a50', // Tono tierra principal
            600: '#8c593f',
            700: '#6f4430',
            800: '#533222',
            900: '#382014',
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
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


