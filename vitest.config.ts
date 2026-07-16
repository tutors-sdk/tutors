import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import quickpickle from "quickpickle";

const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const pkg = JSON.parse(json);

export default defineConfig({
  define: {
    APP_VERSION: JSON.stringify(pkg.version)
  },
  plugins: [sveltekit(), tailwindcss(), quickpickle()],
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/bdd/features/**/*.feature"],
    environment: "jsdom",
    globals: true,
    setupFiles: [
      "tests/setup.ts",
      "tests/bdd/steps/course-loading.steps.ts",
      "tests/bdd/steps/lab-navigation.steps.ts",
      "tests/bdd/steps/theme-switching.steps.ts",
      "tests/bdd/steps/user-authentication.steps.ts",
      "tests/bdd/steps/analytics-tracking.steps.ts",
      "tests/bdd/steps/presence-tracking.steps.ts",
      "tests/bdd/steps/catalogue-browsing.steps.ts"
    ],
    alias: {
      "$app/environment": fileURLToPath(new URL("tests/mocks/sveltekit-modules.ts", import.meta.url)),
      "$app/navigation": fileURLToPath(new URL("tests/mocks/sveltekit-modules.ts", import.meta.url)),
      "$app/state": fileURLToPath(new URL("tests/mocks/sveltekit-modules.ts", import.meta.url)),
      "$env/static/public": fileURLToPath(new URL("tests/mocks/env-public.ts", import.meta.url)),
      "$env/static/private": fileURLToPath(new URL("tests/mocks/env-private.ts", import.meta.url))
    },
    onConsoleLog(log) {
      if (log.includes("pngjs/browser")) return false;
    },
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts", "src/lib/**/*.svelte.ts"],
      exclude: ["src/lib/**/*.d.ts", "src/lib/services/themes/icons/**", "src/lib/services/themes/events/**"],
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage"
    }
  }
});
