/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
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