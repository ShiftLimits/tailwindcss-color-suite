const colors = require('tailwindcss/colors')
function csZ(index) {
  return 99000 + index
}

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
      stroke: (theme) => theme('colors'),
      transitionDuration: {
          '25': '25ms', // might as well be instant
          '35': '35ms', // barely perceptible
          '50': '50ms',
          '2000': '2000ms',
          '3000': '3000ms'
      },
      transitionTimingFunction: {
        'in-brisk': 'cubic-bezier(1,0,.85,1)',
        'out-brisk': 'cubic-bezier(.15,0,0,1)'
      },
      zIndex: {
        'bg': -1,
        'under-panel': csZ(40),
        'panel': csZ(50),
        'over-panel': csZ(60),
        'modal': csZ(100)
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
