import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    // Dynamically imported via {#await import(...)} in TalkClient.svelte
    "src/lib/ui/learning-objects/content/TalkMozilla.svelte",
  ],
  ignoreDependencies: [
    // adapter-auto dynamically requires this based on process.env at build time
    "@sveltejs/adapter-netlify",
  ],
  ignore: [
    // Referenced in app.html via %sveltekit.assets% — knip can't trace the placeholder
    "static/global.css",
    // Loaded at runtime by pdfjs-dist via hardcoded path in TalkMozilla.svelte
    "static/pdf.worker.min.mjs",
  ],
};

export default config;
