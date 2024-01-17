import adapter from "@sveltejs/adapter-netlify";
import preprocess from "svelte-preprocess";
import { defineConfig } from "vite";

export default defineConfig({  
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true
    })
  ],

  kit: {
    env: {
      publicPrefix: 'PUBLIC_'
    },
    adapter: adapter(),
  }
});

