/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
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