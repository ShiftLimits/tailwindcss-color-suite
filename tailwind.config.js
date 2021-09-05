const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
      './index.html',
      './src/**/*.{js,ts,vue}',
  ],
  mode: 'jit',
	prefix: '__cs-',
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.gray
      },
      fill: (theme) => theme('colors'),
      stroke: (theme) => theme('colors')
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
