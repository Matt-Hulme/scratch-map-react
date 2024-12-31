/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'archivo-narrow': ['"Archivo Narrow"'],
      },
      fontSize: {
        h1: '64px',
        h2: '32px',
        h3: '24px',
      },
      fontWeight: {
        bold: '700',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.h1': {
          fontFamily: '"Archivo Narrow"',
          fontSize: '64px',
          fontStyle: 'normal',
          fontWeight: '700',
        },
        '.h2': {
          fontFamily: '"Archivo Narrow"',
          fontSize: '32px',
          fontStyle: 'normal',
        },
        '.h3': {
          fontFamily: '"Archivo Narrow"',
          fontSize: '24px',
          fontStyle: 'normal',
        },
      })
    },
  ],
}
