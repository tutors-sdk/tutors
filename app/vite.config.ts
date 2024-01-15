import { sveltekit } from "@sveltejs/kit/vite";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { defineConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { resolve } from "path";

const packageJsonPath = resolve("package.json");
const json = readFileSync(packageJsonPath, "utf8");

export default defineConfig({

  plugins: [sveltekit(), purgeCss()],
  define: {
    PKG: JSON.parse(json),
  },
});

