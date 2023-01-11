import { build, files, prerendered, version } from "$service-worker";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
const precache_list = [
  "/", // Attention: might not be ideal for your use case - read more below.
  ...build,
  ...files,
  ...prerendered
].map((s) => ({
  url: s,
  revision: version
}));
precacheAndRoute(precache_list);
