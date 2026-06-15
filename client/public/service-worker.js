/*
 * The Genuine Love Project + MyMentalHealthBuddy
 * Service Worker — update-safe preview strategy
 *
 * Purpose:
 * - Avoid stale Replit Preview visuals/content after new builds.
 * - Never cache navigation HTML as the source of truth.
 * - Network-first for app/page navigation.
 * - Cache static build assets only as fallback.
 * - Immediately activate new service worker versions.
 */

const CACHE_VERSION = "tglp-mmmb-sw-v113dz";
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const STATIC_ASSET_PATTERNS = [
  /\/assets\/.+\.(?:js|css|png|jpg|jpeg|svg|webp|gif|ico|woff2?)$/i,
  /\/brand\/.+\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/i,
  /\/fonts\/.+\.(?:woff2?|ttf|otf)$/i,
  /\/manifest\.json$/i,
  /\/favicon\.ico$/i,
  /\/logo\.(?:png|svg|webp)$/i
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key.startsWith("tglp-mmmb-sw-"))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event?.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event?.data?.type === "CLEAR_APP_CACHES") {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    );
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  // Always network-first for navigation so preview/page content updates immediately.
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request, {
        cache: "no-store",
        credentials: "same-origin"
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Do not cache API responses; the platform API must remain live/current.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request, {
        cache: "no-store",
        credentials: "same-origin"
      })
    );
    return;
  }

  const shouldCacheStaticAsset = STATIC_ASSET_PATTERNS.some((pattern) =>
    pattern.test(url.pathname)
  );

  if (!shouldCacheStaticAsset) {
    event.respondWith(fetch(request));
    return;
  }

  // Static assets: cache-first fallback, but refresh cache in background.
  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cached = await cache.match(request);

      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
