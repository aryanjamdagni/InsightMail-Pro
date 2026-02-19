/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        xl2: "22px",
      },
    },
  },
  plugins: [],
};
