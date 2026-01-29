/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pastel Brand Colors - Direct hex values
        'brand': {
          'blue': {
            '50': '#F0F5F9',
            '100': '#E1EBF3',
            '200': '#C3D7E7',
            '300': '#A3BED7',
            '400': '#85A5C7',
            '500': '#6B8DB7',
            '600': '#567499',
            '700': '#42597A',
            '800': '#2D3F5C',
            '900': '#19243D',
          },
          'green': {
            '50': '#F2F8F5',
            '100': '#E5F1EB',
            '200': '#CBE3D7',
            '300': '#B8D9C3',
            '400': '#9DCFAF',
            '500': '#82C59B',
            '600': '#68A87C',
            '700': '#4E8B5D',
            '800': '#346E3E',
            '900': '#1A511F',
          },
          'rose': {
            '50': '#FDF7F7',
            '100': '#FBEFEF',
            '200': '#F7DFDF',
            '300': '#EED2D1',
            '400': '#E5C5C4',
            '500': '#DCB8B7',
            '600': '#C09695',
            '700': '#A47473',
            '800': '#885251',
            '900': '#6C302F',
          },
          'lavender': {
            '50': '#F7F6FA',
            '100': '#EFEDF5',
            '200': '#DFDAEB',
            '300': '#DAD4E9',
            '400': '#C5BEE0',
            '500': '#B0A8D7',
            '600': '#9689BE',
            '700': '#7C6AA5',
            '800': '#624B8C',
            '900': '#482C73',
          },
        },
        'warmgray': {
          '50': '#FAFAFA',
          '100': '#F5F5F5',
          '200': '#ECECEC',
          '300': '#E0E0E0',
          '400': '#C2C2C2',
          '500': '#9E9E9E',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#333333',
        },
      },
      fontFamily: {
        'heading': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Inter', 'Open Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'soft': '8px',
        'gentle': '12px',
        'comfort': '16px',
      },
      boxShadow: {
        'gentle': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'comfort': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
