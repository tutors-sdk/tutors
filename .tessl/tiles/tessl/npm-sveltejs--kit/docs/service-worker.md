# Service Worker

Service Worker utilities for SvelteKit applications, providing access to build assets, static files, and prerendered routes for implementing caching strategies and offline functionality.

## Capabilities

### Build Assets

Access to generated build files for service worker caching.

```typescript { .api }
/**
 * Array of all generated build files including JavaScript, CSS, and other assets
 * Updates automatically when the application is rebuilt
 */
const build: string[];
```

### Static Files

Access to static files from the `static` directory.

```typescript { .api }
/**
 * Array of all static files from the static directory
 * Includes images, fonts, and other static assets
 */
const files: string[];
```

### Prerendered Routes

Access to all prerendered page routes.

```typescript { .api }
/**
 * Array of prerendered page paths
 * Includes all routes that were prerendered during build
 */
const prerendered: string[];
```

### App Version

Current application version for cache invalidation.

```typescript { .api }
/**
 * Current application version string
 * Changes when the application is rebuilt, useful for cache versioning
 */
const version: string;
```

## Usage Examples

### Basic Service Worker Setup

```javascript
// src/service-worker.js
import { build, files, prerendered, version } from '$service-worker';

const CACHE_NAME = `cache-${version}`;

// Assets to cache on install
const ASSETS = [
  ...build,    // Generated build files
  ...files,    // Static files
  ...prerendered // Prerendered pages
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => {
        console.log(`Cached ${ASSETS.length} assets`);
        self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => {
        console.log('Old caches cleared');
        self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  event.respondWith(
    caches
      .match(request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(request);
      })
      .catch(() => {
        // Fallback for offline scenarios
        if (request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});
```

### Advanced Caching Strategy

```javascript
// src/service-worker.js
import { build, files, prerendered, version } from '$service-worker';

const STATIC_CACHE = `static-${version}`;
const DYNAMIC_CACHE = `dynamic-${version}`;
const OFFLINE_PAGE = '/offline.html';

// Categorize assets
const STATIC_ASSETS = [...build, ...files];
const PRERENDERED_PAGES = prerendered;

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches
        .open(STATIC_CACHE)
        .then((cache) => cache.addAll(STATIC_ASSETS)),
      
      // Cache prerendered pages
      caches
        .open(DYNAMIC_CACHE)
        .then((cache) => cache.addAll([
          ...PRERENDERED_PAGES,
          OFFLINE_PAGE
        ]))
    ]).then(() => {
      console.log('All assets cached successfully');
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => 
              !name.startsWith(`static-${version}`) &&
              !name.startsWith(`dynamic-${version}`)
            )
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.origin) return;

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Static assets - cache first
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
    return response;
  }
  
  // Pages - network first with cache fallback
  if (request.destination === 'document') {
    try {
      const response = await fetch(request);
      
      // Cache successful page responses
      if (response.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, response.clone());
      }
      
      return response;
    } catch {
      // Fallback to cached version or offline page
      const cached = await caches.match(request);
      return cached || caches.match(OFFLINE_PAGE);
    }
  }
  
  // API requests - network only with error handling
  if (url.pathname.startsWith('/api/')) {
    try {
      return await fetch(request);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Network unavailable' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // Everything else - network first
  try {
    return await fetch(request);
  } catch {
    return caches.match(request);
  }
}
```

### Background Sync for Forms

```javascript
// src/service-worker.js
import { build, files, version } from '$service-worker';

// Handle background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'form-sync') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  const db = await openDB();
  const forms = await getAllPendingForms(db);
  
  for (const form of forms) {
    try {
      const response = await fetch(form.url, {
        method: 'POST',
        body: form.data,
        headers: form.headers
      });
      
      if (response.ok) {
        await deletePendingForm(db, form.id);
        
        // Notify the client
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'form-synced',
            formId: form.id,
            success: true
          });
        });
      }
    } catch (error) {
      console.error('Failed to sync form:', error);
    }
  }
}

// Handle offline form submissions
self.addEventListener('message', (event) => {
  if (event.data.type === 'queue-form') {
    queueFormForSync(event.data.form);
  }
});

async function queueFormForSync(formData) {
  const db = await openDB();
  await addPendingForm(db, formData);
  
  // Register for background sync
  await self.registration.sync.register('form-sync');
}
```

## Integration with SvelteKit

### Enabling Service Worker

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

export default {
  kit: {
    adapter: adapter(),
    serviceWorker: {
      register: true,
      files: (filepath) => !/\.DS_Store/.test(filepath)
    }
  }
};
```

### Client-Side Registration

```javascript
// src/app.html or layout
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

## Best Practices

1. **Version management**: Use the `version` string for cache naming
2. **Asset categorization**: Separate static assets from dynamic content
3. **Cache strategies**: Choose appropriate strategies per resource type
4. **Offline support**: Provide meaningful offline experiences
5. **Error handling**: Gracefully handle network failures
6. **Background sync**: Queue important operations for later
7. **Client communication**: Keep the UI informed of service worker state
8. **Performance**: Avoid over-caching dynamic content
9. **Security**: Validate all cached resources
10. **Debugging**: Use proper logging for troubleshooting