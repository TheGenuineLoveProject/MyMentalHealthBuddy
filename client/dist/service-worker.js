const CACHE_NAME = "glp-cache-v1";
const OFFLINE_URL = "/offline.html";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/offline.html"
];

const CACHE_STRATEGIES = {
  static: ["woff2", "woff", "ttf", "css", "js", "png", "jpg", "jpeg", "svg", "ico"],
  network: ["api", "auth"]
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching static assets");
      return cache.addAll(STATIC_ASSETS.filter(url => 
        !url.includes("undefined")
      )).catch(err => {
        console.warn("[ServiceWorker] Some assets failed to cache:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[ServiceWorker] Deleting old cache:", name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

function isStaticAsset(pathname) {
  return CACHE_STRATEGIES.static.some(ext => pathname.endsWith(`.${ext}`));
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

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
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    if (request.headers.get("Accept")?.includes("text/html")) {
      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) {
        return offlinePage;
      }
    }

    return new Response(
      JSON.stringify({ error: "Offline", message: "Please check your connection" }),
      { 
        status: 503, 
        headers: { "Content-Type": "application/json" }
      }
    );
  }
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
      data: {
        url: data.url || "/"
      },
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

  if (event.action === "dismiss") {
    return;
  }

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
