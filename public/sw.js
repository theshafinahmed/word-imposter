/**
 * sw.js
 *
 * One job: cache-first service worker so the app shell (HTML/CSS/JS/icons)
 * keeps working offline after the first successful load. This is a v1
 * "app shell" strategy, not a general-purpose network proxy: anything not
 * already cached falls back to a live network fetch (and simply fails if
 * the device is offline and the resource was never cached).
 */

// The version suffix below is a placeholder substituted at build time (see
// vite.config.js) so every deploy gets a distinct cache name. That way the
// browser always re-installs this worker when new bytes ship, even if the
// change was only to app content (e.g. src/data/words.json) and this file's
// logic never changed by hand.
const CACHE_NAME = "word-imposter-shell-__CACHE_VERSION__";
const APP_SHELL_URLS = ["./", "./index.html", "./manifest.json", "./icons/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Only handle same-origin GET requests; let everything else pass through.
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Only cache successful, basic (same-origin) responses.
          if (response && response.status === 200 && response.type === "basic") {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
