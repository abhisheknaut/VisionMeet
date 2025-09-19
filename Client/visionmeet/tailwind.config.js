// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // custom font
        roboto: ["Roboto", "sans-serif"],   // you can add multiple
      },
    },
  },
  plugins: [],
};
