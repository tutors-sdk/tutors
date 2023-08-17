const config = {
  mode: "jit",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    // 2. Append the path for the Skeleton NPM package and files:
    require("path").join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}")
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
