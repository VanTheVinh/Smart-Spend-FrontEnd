/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'], // Bật chế độ tối qua class
  theme: {
    extend: {
      transitionProperty: {
        'transform': 'transform',
      },
      colors: {
        tealColor00: '#21A691',
        tealColor01: '#87DF2C',
        tealColor02: '#27403E',
        tealColor03: '#B4B4B2',
        tealColor04: '#FFFFFF',
        tealColor05: '#060D10',
        tealColor06: '#E0EEEE',
        tealColor07: '#F5F5F5',
        tealColor08: '#C9E4D6',
        tealColor09: '#9AE6B4',
        tealColor10: '#4C6A64 ',
        tealColor11: '#0d9488',



        // tealCustom: '#27403E',
        // tealEdit: '#21A691',
        // tealFirsttd: '#C9E4D6',
        // tealDashboard: '#9AD0C2',
        // tealBGDaskboard: '#F5F5F5',
        // hovercolor: '#9AE6B4',
        // tdOdd: '#E0EEEE',
        // openForm: '#ADDDD0',
      },
      
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
