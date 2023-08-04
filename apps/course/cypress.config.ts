import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    FAIL_FAST_STRATEGY: "run",
    FAIL_FAST_ENABLED: true
  },
  e2e: {
    async setupNodeEvents(on, config) {
      const cypressFailFastPlugin = await import("cypress-fail-fast/plugin");
      cypressFailFastPlugin.default(on, config);
      return config;
    },
    baseUrl: "https://reader.tutors.dev/course/tutors-cypress-testing",
    specPattern: "cypress/e2e/**/**.cy.ts"
  }
});
