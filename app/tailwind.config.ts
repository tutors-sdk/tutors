import { join } from "path";
import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";
import { skeleton } from "@skeletonlabs/tw-plugin";
import { tutors } from "./src/lib/themes/tutors";
import { dyslexia } from "./src/lib/themes/dyslexia";

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
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""'
            },
            "code::after": {
              content: '""'
            }
          }
        }
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
    forms,
    skeleton({
      themes: {
        custom: [tutors, dyslexia]
      }
    })
  ],
  darkMode: "class"
} satisfies Config;

export default config;
