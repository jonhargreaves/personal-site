/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'gray': '#888888',
        'black': '#000000',
        'yellow': '#FFC800',
        'red': '#FF2801',
        'blue': '#0050FF',
      },
      fontFamily: {
        'sans': ['"BroadSans-Bold"', ...defaultTheme.fontFamily.sans],
        'mono': ['"Pinopolis-Regular"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        sm: ['1rem', {
          lineHeight: '1.5rem',
        }],
        md: ['1.125rem', {
          lineHeight: '2rem',
        }],
        lg: ['1.25rem', {
          lineHeight: '2rem',
        }],
        xl: ['1.5rem', {
          lineHeight: '2.25rem',
        }],
        '2xl': ['2.25rem', {
          lineHeight: '2.75rem',
        }],
        '3xl': ['4rem', {
          lineHeight: '4.75rem',
        }],
        '4xl': ['6rem', {
          lineHeight: '7rem',
        }],
      }
    },
  },
  plugins: [],
}

