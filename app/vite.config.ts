import { sveltekit } from "@sveltejs/kit/vite";
import { readFileSync } from "fs";
import { defineConfig } from 'vite';
import { resolve } from "path";

const packageJsonPath = resolve("package.json");
const json = readFileSync(packageJsonPath, "utf8");

export default defineConfig({

  plugins: [sveltekit()],
  define: {
    PKG: JSON.parse(json),
  },
});

