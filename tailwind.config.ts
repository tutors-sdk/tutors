import forms from "@tailwindcss/forms";
import { skeleton } from "@skeletonlabs/tw-plugin";
import typography from "@tailwindcss/typography";
import { tutors } from "./src/lib/ui/themes/styles/tutors";
import { dyslexia } from "./src/lib/ui/themes/styles/dyslexia";
import { festive } from "./src/lib/ui/themes/styles/festive";
import type { Config } from "tailwindcss";
import { join } from "path";

export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./src/**/**/*.{html,js,svelte,ts}",
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
      themes: {
        custom: [festive, tutors, dyslexia],
        preset: [
          { name: "skeleton", enhancements: true },
          { name: "seafoam", enhancements: true },
          { name: "vintage", enhancements: true }
        ]
      }
    })
  ],
  darkMode: "class"
} satisfies Config;
