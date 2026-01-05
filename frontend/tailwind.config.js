/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5E72E4',
        secondary: '#8392AB',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}
