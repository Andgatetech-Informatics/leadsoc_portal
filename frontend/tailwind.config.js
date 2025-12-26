/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        autofill: '#1e1e2f',
      },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-in-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, transform: 'scale(0.9)' },
        '100%': { opacity: 1, transform: 'scale(1)' },
      },
    },
    },
  },
  plugins: [require("tailwind-scrollbar")],

}