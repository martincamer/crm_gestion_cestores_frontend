export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#242038",
        secondary: "#242038",
        terciary: "#8D86C9",
        fourty: "#CAC4CE",
        five: "#F7ECE1",
      },
    },
  },
  plugins: [require("daisyui")],
};
