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
    baseUrl: "http://localhost:3000/course/full-stack-web-dev-oth-2022",
    specPattern: "cypress/e2e/**/**.cy.ts"
  }
});
