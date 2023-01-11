/// <reference lib="webworker" />

// Imports:
import { build, files, version } from '$service-worker';

// Initializations:
const worker = (self as unknown) as ServiceWorkerGlobalScope;
const FILES = `cache${version}`;
const to_cache = build.concat(files);
const staticAssets = new Set(to_cache);

// Install Event:
worker.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(FILES)
      .then((cache) => cache.addAll(to_cache))
      .then(() => {
        worker.skipWaiting();
      })
  );
});

// Activation Event:
worker.addEventListener('activate', (event) => {
	event.waitUntil(
    caches.keys().then(async (keys) => {
      for (const key of keys) {
        if (key !== FILES) await caches.delete(key);
      }
      worker.clients.claim();
    })
  );
});

// Fetch & Cache Event:
async function fetchAndCache(request: Request) {
  const cache = await caches.open(`offline${version}`);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const response = await cache.match(request);
    if (response) return response;
    throw err;
  }
}

// Fetch Event:
worker.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.headers.has("range")) return;
  const url = new URL(event.request.url);
  const isHttp = url.protocol.startsWith("http");
  const isDevServerRequest = url.hostname === self.location.hostname && url.port !== self.location.port;
  const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);
  const skipBecauseUncached = event.request.cache === "only-if-cached" && !isStaticAsset;
  if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
    event.respondWith(
      (async () => {
        const cachedAsset = isStaticAsset && (await caches.match(event.request));
        return cachedAsset || fetchAndCache(event.request);
      })()
    );
  }
});