import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      'pdfjs-dist/build/pdf.worker.min.mjs': resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs')
    }
  }
});
