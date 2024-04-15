/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.html',
  './src/**/*.vue',
  './src/**/*.js',
  './dist/**/*.css',],
  theme: {
    extend: {
      colors:{
        '344687': '#344687',
        '98A6DA': '#98A6DA'
      }
    },
  },
  plugins: [],
}

