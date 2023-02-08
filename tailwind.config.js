module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      chicagoblue: "#B3DDF2",
      chicagowhite: "#FFFFF",
      chicagored: "#FF0000",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
