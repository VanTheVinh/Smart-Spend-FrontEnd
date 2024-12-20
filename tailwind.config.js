/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tealCustom: '#21A691',
        tealEdit: '#229799',
        tealFirsttd: '#C9E4D6',
        tealDashboard: '#E8E8E8',
        tealBGDaskboard: '#F5F5F5',
        hovercolor: '#9AE6B4',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
