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
      raisinblack: "#212227",
      dimgray:"#637074",
      tekhelet:"#573280"
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
