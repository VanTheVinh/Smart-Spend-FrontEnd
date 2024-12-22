/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'], // Bật chế độ tối qua class
  theme: {
    extend: {
      transitionProperty: {
        'transform': 'transform',
      },
      colors: {
        tealCustom: '#21A691',
        tealEdit: '#229799',
        tealFirsttd: '#C9E4D6',
        tealDashboard: '#9AD0C2',
        tealBGDaskboard: '#F5F5F5',
        hovercolor: '#9AE6B4',
        tdOdd: '#E0EEEE',
        openForm: '#ADDDD0',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
