import { defineConfig } from "cypress";
import pkg from "cy-verify-downloads"; //The cypress-verify-download plugin
const { verifyDownloadTasks } = pkg;

export default defineConfig({
  env: {
    FAIL_FAST_STRATEGY: "run",
    FAIL_FAST_ENABLED: true
  },
  e2e: {
    experimentalMemoryManagement: true,
    async setupNodeEvents(on, config) {
      // The below is needed to store the downloaded folder/file in the correction location
      // for the plugin to check if it has downloaded in the correct default location
      // A known issue with cypress
      
   
  


      on("task", verifyDownloadTasks); //This is for the cy-verify-download plugin
      const cypressFailFastPlugin = await import("cypress-fail-fast/plugin");
      cypressFailFastPlugin.default(on, config);
      return {
        browsers: config.browsers.filter(
          (b) => b.family === 'chromium' && b.name !== 'electron'
        ),
      }      
    },
    trashAssetsBeforeRuns: true,
    //this url is what I was using for cypress testing.
    baseUrl: "https://reader.tutors.dev/course/tutors-cypress-testing",
    //this url is the url for the static heml generator
    //baseUrl: "https://tutors-reference-course-html.netlify.app/",
    specPattern: "cypress/e2e/**/**.cy.ts"
  }
});
