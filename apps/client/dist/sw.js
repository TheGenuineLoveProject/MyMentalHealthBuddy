/**
 * Service Worker for MyMentalHealthBuddy PWA
 * Production-grade caching with intelligent strategies and automatic cleanup
 */

const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `mymentalhealthbuddy-v${CACHE_VERSION}`;
const RUNTIME_CACHE = `mymentalhealthbuddy-runtime-v${CACHE_VERSION}`;
const IMAGE_CACHE = `mymentalhealthbuddy-images-v${CACHE_VERSION}`;

// Cache configuration
const CACHE_CONFIG = {
  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
  maxEntries: 50,
  imageMaxEntries: 30,
};

// Critical assets to precache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html', // Fallback offline page
  // Critical routes for offline access
  '/chat',
  '/mood',
  '/journal',
  '/crisis',
];

// Install event - cache essential files with timestamps
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Service Worker: Cache opened');
        // Cache all URLs with timestamp headers
        const cachePromises = urlsToCache.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response && response.status === 200) {
              const headers = new Headers(response.headers);
              headers.set('sw-cache-date', Date.now().toString());
              const responseToCache = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: headers
              });
              await cache.put(url, responseToCache);
            }
          } catch (error) {
            console.warn(`Service Worker: Failed to cache ${url}`, error);
          }
        });
        await Promise.all(cachePromises);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Service Worker: Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated and ready');
      return self.clients.claim();
    })
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  const { request } = event;
  const url = new URL(request.url);
  
  // Strategy 1: Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
  // Strategy 2: Cache-first for images
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }
  
  // Strategy 3: Stale-while-revalidate for static assets
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }
  
  // Strategy 4: Network-first for HTML navigation
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }
  
  // Default: Network-first
  event.respondWith(networkFirstStrategy(request));
});

// Network-first strategy
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(
      JSON.stringify({ error: 'Offline - please reconnect' }),
      { 
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache-first strategy with expiration and max entries
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Check cache age
    const cacheDate = cachedResponse.headers.get('sw-cache-date');
    if (cacheDate) {
      const age = Date.now() - parseInt(cacheDate);
      if (age < CACHE_CONFIG.maxAgeSeconds * 1000) {
        return cachedResponse;
      }
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      
      // Enforce max entries for image cache
      if (cacheName === IMAGE_CACHE) {
        await enforceMaxEntries(cache, CACHE_CONFIG.imageMaxEntries);
      }
      
      // Add timestamp to response
      const headers = new Headers(networkResponse.headers);
      headers.set('sw-cache-date', Date.now().toString());
      const responseToCache = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: headers
      });
      cache.put(request, responseToCache.clone());
      return responseToCache;
    }
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Enforce maximum cache entries (LRU eviction)
async function enforceMaxEntries(cache, maxEntries) {
  const requests = await cache.keys();
  if (requests.length >= maxEntries) {
    // Delete oldest entry (first in, first out)
    await cache.delete(requests[0]);
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => null);
  
  return cachedResponse || fetchPromise;
}

// Network-first with offline fallback page
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page as last resort
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    // Final fallback
    const indexPage = await caches.match('/index.html');
    return indexPage || new Response('Offline', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queue') {
    event.waitUntil(syncOfflineQueue());
  }
});

async function syncOfflineQueue() {
  console.log('Service Worker: Background sync triggered');
  try {
    // Notify the app to sync its offline queue
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_QUEUE',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

// Cache cleanup on message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(cleanupOldCaches());
  }
});

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentVersion = CACHE_VERSION;
  const cachesToDelete = cacheNames.filter(cacheName => 
    cacheName.startsWith('mymentalhealthbuddy-') && !cacheName.includes(currentVersion)
  );
  await Promise.all(cachesToDelete.map(cacheName => caches.delete(cacheName)));
  console.log('Service Worker: Old caches cleaned up');
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('MyMentalHealthBuddy', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('Service Worker: Registered successfully');
