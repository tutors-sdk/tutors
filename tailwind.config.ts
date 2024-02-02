import { join } from "path";
import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";
import { skeleton } from "@skeletonlabs/tw-plugin";
import { tutors } from "./src/lib/themes/tutors";
import { dyslexia } from "./src/lib/themes/dyslexia";
import typography from "@tailwindcss/typography";

const config = {
  mode: "jit",
  content: ["./src/**/*.{html,js,svelte,ts}", "./src/**/**/*.{html,js,svelte,ts}", join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}")],
  safelist: [
    {
      pattern: /border|text/
    }
  ],
  plugins: [
    forms,
    typography,
    skeleton({
      themes: {
        custom: [tutors, dyslexia]
      }
    })
  ],
  darkMode: "class"
} satisfies Config;

export default config;
