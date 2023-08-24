import type { Preview } from "@storybook/svelte";

import { withThemeByClassName } from "@storybook/addon-styling";

import "$lib/ui/legacy/themes/tutors.css";
import "@skeletonlabs/skeleton/styles/skeleton.css";
import "../src/routes/app.postcss";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark"
      },
      defaultTheme: "light"
    })
  ]
};

export default preview;
