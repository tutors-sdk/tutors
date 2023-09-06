import adapterNetlify from "@sveltejs/adapter-netlify";
import adapterNode from "@sveltejs/adapter-node";
import preprocess from "svelte-preprocess";
import dotenv from "dotenv";
dotenv.config();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true
    })
  ],

  kit: {
    adapter: process.env.ADAPTER === "node" ? adapterNode() : adapterNetlify()
  }
};

export default config;
