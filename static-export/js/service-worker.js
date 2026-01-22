const CACHE_NAME = 'tglp-cache-v1';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/home.html',
  '/css/style.css',
  '/css/responsive.css',
  '/js/main.js',
  '/images/logo.svg',
  '/manifest.json',
  '/assets/icons/heart.svg',
  '/assets/icons/leaf.svg',
  '/assets/icons/sun.svg',
  '/assets/icons/lotus.svg',
  '/assets/icons/sparkle.svg',
  '/assets/icons/brain.svg',
  '/assets/icons/journal.svg',
  '/assets/icons/shield.svg',
  '/assets/icons/compass.svg',
  '/assets/icons/wave.svg',
  '/assets/icons/moon.svg',
  '/assets/icons/star.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          if (fetchResponse.ok) {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return fetchResponse;
        });
      })
    );
  }
});
