import { sveltekit } from "@sveltejs/kit/vite";
import { readFileSync } from "fs";
import { defineConfig } from 'vite';
import { resolve } from "path";
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

const packageJsonPath = resolve("package.json");
const json = readFileSync(packageJsonPath, "utf8");

export default defineConfig({

  plugins: [sveltekit(), purgeCss()],
  define: {
    PKG: JSON.parse(json),
  },
});

