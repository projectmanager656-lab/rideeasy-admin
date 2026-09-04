/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        rideeasy: {
          night: "#111827",
          amber: "#FFA726",
          paper: "#FAFAFA",
          green: "#1FAA59",
          red: "#E5484D",
          slate: "#6B7280",
          card: "#FFFFFF",
          pending: "#FFF3E0",
        },
      },
    },
  },

  plugins: [],
};