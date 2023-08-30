import { join } from "path";
import type { Config } from "tailwindcss";
import { skeleton } from "@skeletonlabs/tw-plugin";
import { tutors } from "./src/lib/themes/tutors";

const config = {
  mode: "jit",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./src/**/**/*.{html,js,svelte,ts}",
    // 2. Append the path for the Skeleton NPM package and files:
    join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}")
  ],
  safelist: [
    {
      pattern: /border|text/
    }
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require("@tailwindcss/typography"),
    skeleton({
      themes: {
        custom: [tutors]
      }
    })
  ],
  darkMode: "class"
} satisfies Config;

export default config;
