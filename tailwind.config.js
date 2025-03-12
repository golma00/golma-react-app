/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#edf9ff',
          '100': '#d6efff',
          '200': '#b6e5ff',
          '300': '#84d7ff',
          '400': '#4abfff',
          '500': '#219eff',
          '600': '#097fff',
          '700': '#0366f2',
          '800': '#0a51c3',
          '900': '#0e4491',
          '950': '#0e2c5d',
        }
      },
      backgroundColor: {
        "area-bg-color": "var(--area-bg-color)",
      },
      borderColor: {
        "area-border-color": "var(--area-border-color)",
      },
      
    },
  },
  plugins: [],
}