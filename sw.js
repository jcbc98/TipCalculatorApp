// The version of the cache.
const VERSION = "v1";

// The name of the cache
const CACHE_NAME = `tip-calculator-app-${VERSION}`;

// On install, cache the static resources
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/tipcalculator.js',
      '/style.css',
      '/tip-icon-192x192.png',
      '/tip-icon-180x180.png',
      '/tip-icon-512x512.png',
      '/tip-icon-32x32.png',
      '/sw.js',
      '/manifest.webmanifest'
    ])),
  );
});

// Delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
    })()
  );
});

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
self.addEventListener('fetch', (e) => {
  // As a single page app, direct app to always go to cached home page.
  if (e.request.mode === "navigate") {
    e.respondWith(caches.match("/"));
    return;
  }
  // For all other requests, go to the cache or respond with 404.
  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(e.request);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // If resource isn't in the cache, return a 404.
      return new Response(null, { status: 404 });
    })()
  );
});