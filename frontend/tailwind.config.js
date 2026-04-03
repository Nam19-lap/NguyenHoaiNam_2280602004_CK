/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#081225",
        accent: "#f97316",
        mist: "#dbeafe"
      }
    }
  },
  plugins: []
};
