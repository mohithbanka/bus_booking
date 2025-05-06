/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Deep blue
        secondary: "#DC2626", // Red
        hover: "#F3F4F6", // Light gray
      },
    },
  },
  plugins: [],
};