const config = {
  mode: "jit",
  content: [
    "./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}",
    "../../node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}",
    "../../packages/tutors-reader-lib/src/**/*.{html,js,svelte,ts}",
    "./lib/**/**/*.{html,js,svelte,ts}",
    "./.storybook/*.{html,js,svelte,ts}",
    require("path").join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}")
  ],
  safelist: [
    {
      pattern: /border|text/
    }
  ],
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp"), ...require("@skeletonlabs/skeleton/tailwind/skeleton.cjs")()],
  darkMode: "class"
};

module.exports = config;
