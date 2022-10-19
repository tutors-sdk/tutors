const config = {
  mode: "jit",
  content: [
    "./node_modules/@brainandbones/skeleton/**/*.{html,js,svelte,ts}",
    "../../node_modules/@brainandbones/skeleton/**/*.{html,js,svelte,ts}",
    "../../components/tutors-reader-lib/src/**/*.{html,js,svelte,ts}",
    "./src/**/**/*.{html,js,svelte,ts}",
    "./src/**/*.{html,js,svelte,ts}",
  ],
  safelist: [
    {
      pattern: /border|text/,
    },
  ],
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp"), require("@brainandbones/skeleton/tailwind/theme.cjs")],
  darkMode: "class"
};

module.exports = config;
