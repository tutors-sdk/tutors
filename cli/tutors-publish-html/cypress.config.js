"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cypress_1 = require("cypress");
const cy_verify_downloads_1 = __importDefault(require("cy-verify-downloads")); //The cypress-verify-download plugin
const { verifyDownloadTasks } = cy_verify_downloads_1.default;
exports.default = (0, cypress_1.defineConfig)({
    env: {
        FAIL_FAST_STRATEGY: "run",
        FAIL_FAST_ENABLED: true,
    },
    e2e: {
        experimentalMemoryManagement: true,
        async setupNodeEvents(on, config) {
            // The below is needed to store the downloaded folder/file in the correction location
            // for the plugin to check if it has downloaded in the correct default location
            // A known issue with cypress
            on("before:browser:launch", (browser = {}, options) => {
                if (browser.family === "chromium") {
                    options.args.push(`--disable-features=CrossSiteDocumentBlockingIfIsolating`);
                    options.preferences = {
                        download: {
                            default_directory: config["downloadsFolder"]
                        }
                    };
                }
                else if (browser.family === "firefox") {
                    options.preferences = {
                        "browser.download.folderList": 2,
                        "browser.download.dir": config["downloadsFolder"]
                    };
                }
                return options;
            });
            on("task", verifyDownloadTasks); //This is for the cy-verify-download plugin
            const cypressFailFastPlugin = await Promise.resolve().then(() => __importStar(require("cypress-fail-fast/plugin")));
            cypressFailFastPlugin.default(on, config);
            return config;
        },
        trashAssetsBeforeRuns: true,
        //this url is the url for the static heml generator
        //baseUrl: "http://localhost:3000/tutors-reference-course/html/index.html",
        baseUrl: null,
        specPattern: "cypress/e2e/**/**.cy.ts"
    }
});
//# sourceMappingURL=cypress.config.js.map