const config = {
  mode: "jit",
  content: [
    "./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}",
    "../../node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}",
    "./src/**/**/*.{html,js,svelte,ts}",
    "./src/**/*.{html,js,svelte,ts}"
  ],
  safelist: [
    {
      pattern: /border|text/
    }
  ],
  plugins: [
    require("@tailwindcss/typography"),
    ...require("@skeletonlabs/skeleton/tailwind/skeleton.cjs")()
  ],
  darkMode: "class"
};

module.exports = config;
