import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    FAIL_FAST_STRATEGY: "run",
    FAIL_FAST_ENABLED: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-fail-fast/plugin")(on, config);
      return config;
    },
    baseUrl: "http://next.tutors.dev/#/course/full-stack-web-dev-oth-2022.netlify.app",
    specPattern: "cypress/e2e/**/**.cy.ts",
  },
});
