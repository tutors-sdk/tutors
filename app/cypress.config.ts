import { defineConfig } from "cypress";
import pkg from 'cy-verify-downloads'; //The cypress-verify-download plugin
const { verifyDownloadTasks } = pkg;

export default defineConfig({
  env: {
    FAIL_FAST_STRATEGY: "run",
    FAIL_FAST_ENABLED: true
  },
  e2e: {
    async setupNodeEvents(on, config) {
      // The below is needed to store the downloaded folder/file in the correction location
      // for the plugin to check if it has downloaded in the correct default location
      // A known issue with cypress
      on('before:browser:launch', (browser = {}, options) => {
        if (browser.family === 'chromium') {
          options.preferences.default['download'] = { default_directory: config['downloadsFolder'].replace(/\\/g, "\\\\") }
          return options
        }
        if (browser.family === 'firefox') {
          options.preferences['browser.download.folderList'] = 2;
          options.preferences['browser.download.dir'] = config['downloadsFolder'].replace(/\\/g, "\\\\");
          return options;
        }
      });
      on('task', verifyDownloadTasks); //This is for the cy-verify-download plugin
      const cypressFailFastPlugin = await import("cypress-fail-fast/plugin");
      cypressFailFastPlugin.default(on, config);
      return config;
    },
    //this url is what I was using for cypress testing.
    baseUrl: "https://reader.tutors.dev/course/tutors-cypress-testing",
    //this url is the url for the static heml generator
    //baseUrl: "https://tutors-reference-course-html.netlify.app/",
    specPattern: "cypress/e2e/**/**.cy.ts"
  }
});
