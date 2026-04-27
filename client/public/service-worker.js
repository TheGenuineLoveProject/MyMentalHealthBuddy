// MMHB Service Worker — cache strategy
//
// IMPORTANT: This file is served by server/app.mjs via a dynamic handler that
// replaces "__BUILD_ID__" with the per-deploy build identifier and sets
// Cache-Control: no-cache, no-store, must-revalidate. That guarantees:
//   • Each deploy produces a different cache name (auto-purges prior versions)
//   • Browsers always re-fetch the SW file itself (no stale registration)
//
// Strategy summary:
//   • Navigations / HTML  -> network-first (never freeze index.html)
//   • Hashed static assets -> cache-first (Vite hashes are content-immutable)
//   • API / auth          -> network-first (caches as fallback only)
//
const BUILD_ID = "__BUILD_ID__";
const CACHE_PREFIX = "glp-cache-";
const CACHE_NAME = `${CACHE_PREFIX}${BUILD_ID}`;
const OFFLINE_URL = "/offline.html";

// NOTE: index.html is intentionally NOT pre-cached. It is served via
// network-first so users see new builds the moment they reload.
const STATIC_ASSETS = [
  "/manifest.json",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/offline.html"
];

const STATIC_EXTENSIONS = ["woff2", "woff", "ttf", "css", "js", "png", "jpg", "jpeg", "webp", "svg", "ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`[ServiceWorker] (${BUILD_ID}) Pre-caching offline shell`);
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[ServiceWorker] Some assets failed to cache:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Sequence the lifecycle: purge stale caches first, THEN claim clients so
  // controlled pages never get a half-purged cache state.
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map((name) => {
            console.log("[ServiceWorker] Purging stale cache:", name);
            return caches.delete(name);
          })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // 1) API + auth — always network-first; cache only as a degraded fallback.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 2) Navigations / HTML documents — ALWAYS network-first.
  //    This is the critical fix: never serve a stale index.html.
  const isNavigation =
    request.mode === "navigate" ||
    (request.headers.get("Accept") || "").includes("text/html");
  if (isNavigation) {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  // 3) Hashed static assets (Vite chunks etc.) — safe to cache-first.
  if (isHashedStatic(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 4) Other static extensions (icons, fonts) — cache-first with revalidation.
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

function isStaticAsset(pathname) {
  return STATIC_EXTENSIONS.some((ext) => pathname.endsWith(`.${ext}`));
}

// Vite-style content-hashed asset, e.g. /assets/About-DOX9bTt9.js
function isHashedStatic(pathname) {
  return /\/assets\/.+\.[A-Za-z0-9_-]{6,}\.(js|css|png|jpg|jpeg|webp|svg|woff2?|ttf|ico)$/.test(pathname);
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("[ServiceWorker] Cache-first failed:", error);
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok && shouldCachePut(request)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ error: "Offline", message: "Please check your connection" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Network-first for HTML navigations.  On network failure, fall back to the
// offline page; we deliberately do NOT cache the navigation response, so the
// next online navigation always fetches the freshly deployed index.html.
async function networkFirstHTML(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    const offlinePage = await caches.match(OFFLINE_URL);
    if (offlinePage) return offlinePage;
    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/html" } });
  }
}

function shouldCachePut(request) {
  // Don't accidentally cache HTML or API responses via the generic networkFirst.
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return false;
  const accept = request.headers.get("Accept") || "";
  if (accept.includes("text/html")) return false;
  return true;
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pending-entries") {
    event.waitUntil(syncPendingEntries());
  }
});

async function syncPendingEntries() {
  console.log("[ServiceWorker] Background sync triggered");
}

self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || "You have a new notification",
      icon: "/lotus-icon-192.png",
      badge: "/lotus-icon-192.png",
      vibrate: [100, 50, 100],
      data: { url: data.url || "/" },
      actions: [
        { action: "open", title: "Open" },
        { action: "dismiss", title: "Dismiss" }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "The Genuine Love Project", options)
    );
  } catch (error) {
    console.error("[ServiceWorker] Push notification error:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
