/* Phase 94: stale-shell-safe service worker.
 * Purpose:
 * - Never serve cached index.html for navigations.
 * - Use network-first navigation.
 * - Fall back only to offline.html when network is unavailable.
 * - Avoid stale Vite chunk references after deploy.
 * - Preserve static asset/runtime caching for non-HTML assets.
 */

const CACHE_VERSION = "mmhb-pwa-v94-stale-shell-safe";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const STATIC_ASSETS = [
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",
].filter(Boolean);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isNavigationRequest(request) {
  return request.mode === "navigate" || (
    request.method === "GET" &&
    request.headers.get("accept")?.includes("text/html")
  );
}

function isCacheableAssetRequest(request) {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (isNavigationRequest(request)) return false;
  return /\.(?:js|css|woff2?|ttf|otf|png|jpg|jpeg|webp|svg|gif|ico|json|txt|xml)$/i.test(url.pathname);
}

async function networkFirstNavigation(request) {
  try {
    return await fetch(request, { cache: "no-store" });
  } catch (_error) {
    const cache = await caches.open(STATIC_CACHE);
    return (await cache.match("/offline.html")) || new Response(
      "Offline. Please reconnect and refresh.",
      {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }
}

async function staleWhileRevalidateAsset(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkPromise;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isCacheableAssetRequest(request)) {
    event.respondWith(staleWhileRevalidateAsset(request));
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "CLEAR_MHB_CACHES") {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    );
  }
});
