import "@skeletonlabs/skeleton/styles/all.css";
import "../lib/themes/tutors.css";

export const parameters = {
  backgrounds: {
    default: "light"
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};
