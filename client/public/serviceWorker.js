/* 
 * MyMentalHealthBuddy Service Worker
 * Phase 115: durable anti-stale caching.
 *
 * Purpose:
 * - Keep offline support.
 * - Navigations (HTML): network-first, no-store — HTML is never stale.
 * - Vite hashed assets (/assets/*): cache-first — content-addressed, so a cached
 *   copy can never be stale, and it's fast. New deploys = new filenames = cache miss.
 * - All OTHER static assets (images like /lumi/*.png & /brand/*, fonts, any
 *   public-dir file with a STABLE url): network-first, so a redeploy is reflected
 *   immediately when online. This makes freshness INDEPENDENT of bumping
 *   CACHE_VERSION — the recurring "stale deployment" failure mode.
 * - Fall back to offline.html (navigations) or cache (assets) only when offline.
 */

const CACHE_VERSION = "mmhb-pwa-phase115-v2";
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

// Vite emits content-hashed bundles as /assets/<name>-<hash>.<ext> (hash = 8+
// base64url chars). ONLY those are truly immutable, so only those are safe to
// cache-first. Stable public files that also live under /assets/ (e.g.
// /assets/tglp-logo.svg) must NOT be treated as immutable, or they go stale again.
const HASHED_ASSET_RE = /^\/assets\/.+-[A-Za-z0-9_-]{8,}\.[^/]+$/;
function isHashedAsset(url) {
  return HASHED_ASSET_RE.test(url.pathname);
}

// Cache writes are best-effort: never cache partial/range (206) responses, and
// never let a cache.put rejection surface as an unhandled promise error.
function putInCache(cache, request, response) {
  if (request.headers.has("range")) return;
  if (!response || !response.ok || response.status === 206) return;
  cache.put(request, response.clone()).catch(() => {});
}

async function cacheFirstImmutable(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  putInCache(cache, request, response);
  return response;
}

// Stable-URL assets (images, fonts, public-dir files): try the network FIRST so a
// redeploy is reflected immediately when online; fall back to cache only offline.
async function networkFirstAsset(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    putInCache(cache, request, response);
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
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
    if (isHashedAsset(url)) {
      event.respondWith(cacheFirstImmutable(request));
    } else {
      event.respondWith(networkFirstAsset(request));
    }
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
