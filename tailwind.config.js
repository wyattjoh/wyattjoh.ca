module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: {
          light: "rgb(236, 72, 153)",
          DEFAULT: "rgb(219, 39, 119)",
          dark: "rgb(190, 24, 93)",
        },
      },
    },
  },
};
