/* 
 * MyMentalHealthBuddy Service Worker
 * Phase 100: stale app-shell protection.
 *
 * Purpose:
 * - Keep offline support.
 * - Stop serving cached / or cached index.html for navigations.
 * - Prevent old HTML from pointing to deleted Vite hashed chunks after deploys.
 * - Use network-first navigation.
 * - Fall back only to offline.html when network fails.
 */

const CACHE_VERSION = "mmhb-pwa-phase115-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [
  OFFLINE_URL
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
              .map((key) => caches.delete(key))
          )
        ),
      self.clients.claim()
    ])
  );
});

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

function isStaticAssetRequest(request, url) {
  if (request.method !== "GET") return false;

  return (
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2")
  );
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request, {
      cache: "no-store"
    });

    return response;
  } catch (_error) {
    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;

    return new Response(
      "<!doctype html><title>Offline</title><main><h1>You are offline</h1><p>Please reconnect and refresh.</p></main>",
      {
        status: 503,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
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

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (isApiRequest(url)) {
    return;
  }

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isStaticAssetRequest(request, url)) {
    event.respondWith(staleWhileRevalidateAsset(request));
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
