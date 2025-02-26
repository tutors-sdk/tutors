import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import { contentPath } from "@skeletonlabs/skeleton/plugin";

import type { Config } from "tailwindcss";

export default {
  darkMode: "selector",
  content: ["./src/**/*.{html,js,svelte,ts}", contentPath(import.meta.url, "svelte")],
  safelist: [
    {
      pattern: /border|text|ml|preset-filled-/
    }
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": { content: '""' },
            "code::after": { content: '""' }
          }
        }
      }
    }
  },

  plugins: [typography, forms]
} satisfies Config;
