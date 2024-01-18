import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

const config = {
  plugins: [sveltekit()],
  define: {
    PKG: pkg
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
};