import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, clientPlugin } from '@vitebook/client/node';
import { svelteMarkdownPlugin } from '@vitebook/markdown-svelte/node';
import { shikiMarkdownPlugin } from '@vitebook/markdown-shiki/node';
import {
  DefaultThemeConfig,
  defaultThemePlugin,
} from '@vitebook/theme-default/node';

export default defineConfig<DefaultThemeConfig>({
  include: ['src/**/*.md', 'src/**/*.story.svelte'],
  plugins: [
    shikiMarkdownPlugin(),
    svelteMarkdownPlugin(),
    clientPlugin({ appFile: 'App.svelte' }),
    defaultThemePlugin(),
    svelte({
      compilerOptions: {
        hydratable: true,
      },
      extensions: ['.svelte', '.md'],
      experimental: {
        // Remove if using `svelte-preprocess`.
        useVitePreprocess: true,
      },
    }),
  ],
  site: {
    title: 'tutors-components',
    description: 'design system & components for the tutors open source project',
    /** @type {(import('@vitebook/theme-default/node').DefaultThemeConfig} */
    theme: {},
  },
});
