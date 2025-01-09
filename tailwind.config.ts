import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import { skeleton, contentPath } from "@skeletonlabs/skeleton/plugin";
import { nouveau, rose, cerberus } from "@skeletonlabs/skeleton/themes";
import tutors from "./src/lib/services/themes/styles/tutors";
import classic from "./src/lib/services/themes/styles/classic";
import dyslexia from "./src/lib/services/themes/styles/dyslexia";
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

  plugins: [
    typography,
    forms,
    skeleton({
      themes: [tutors, classic, dyslexia, nouveau, rose, cerberus]
    })
  ]
} satisfies Config;
