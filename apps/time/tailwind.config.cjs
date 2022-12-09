const config = {
  mode: "jit",
  content: [
    "./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}",
    "../../node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}",
    "../../packages/tutors-reader-lib/src/**/*.{html,js,svelte,ts}",
    "../../packages/tutors-ui/lib/**/**/*.{html,js,svelte,ts}",
    "./src/**/**/*.{html,js,svelte,ts}",
    "./src/**/*.{html,js,svelte,ts}"
  ],
  safelist: [
    {
      pattern: /border|text/
    }
  ],
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp"), require("@skeletonlabs/skeleton/tailwind/theme.cjs")],
  darkMode: "class"
};

module.exports = config;
