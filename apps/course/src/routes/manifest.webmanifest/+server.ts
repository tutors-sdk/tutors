import type { RequestHandler } from "./$types";
import { page } from "$app/stores";

const manifest = {
  name: "Tutors Course Reader",
  short_name: "Tutors",
  id: "tutors",
  icons: [
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png"
    }
  ],
  theme_color: "#37919b",
  background_color: "#ffffff",
  display: "standalone",
  start_url: page
};

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(manifest), {
    headers: {
      "content-type": "application/manifest+json"
    }
  });
};

export const prerender = true;
