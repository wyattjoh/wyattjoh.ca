module.exports = {
  content: ["./components/**/*.tsx", "./app/**/*.tsx"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            code: {
              backgroundColor: theme("colors.slate.100"),
              borderRadius: theme("borderRadius.md"),
              paddingTop: theme("padding[1]"),
              paddingRight: theme("padding[1.5]"),
              paddingBottom: theme("padding[1]"),
              paddingLeft: theme("padding[1.5]"),
            },
            "code::before": {
              content: "normal",
            },
            "code::after": {
              content: "normal",
            },
          },
        },
      }),
    },
  },
  darkMode: "media",
  plugins: [require("@tailwindcss/typography")],
};
