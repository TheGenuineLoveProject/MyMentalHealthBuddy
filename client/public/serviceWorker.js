const CACHE_NAME = 'genuine-love-v1';
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/brand/favicon.svg',
  '/brand/favicon.png',
  '/brand/logo.png',
  '/brand/og-image.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/logo.svg',
  '/sacred-pattern.svg'
];

const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets failed to cache:', err);
      });
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
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|woff2?|ttf|eot)$/)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.destination === 'document' || request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

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
  } catch (err) {
    return new Response('Asset not available offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    return new Response(offlineHTML(), {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

function offlineHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - The Genuine Love Project</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #FAF9F7 0%, #E8F5E9 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .container {
      max-width: 500px;
    }
    .lotus {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      animation: breathe 4s ease-in-out infinite;
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
    }
    h1 {
      font-family: 'Playfair Display', serif;
      color: #5A8A6E;
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      color: #6B7280;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .affirmation {
      background: rgba(143, 191, 159, 0.15);
      border-radius: 12px;
      padding: 1.5rem;
      color: #5A8A6E;
      font-style: italic;
    }
    button {
      margin-top: 2rem;
      background: linear-gradient(135deg, #8FBF9F 0%, #5A8A6E 100%);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 50px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="container">
    <svg class="lotus" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="70" rx="8" ry="25" fill="#8FBF9F" opacity="0.9"/>
      <ellipse cx="35" cy="65" rx="7" ry="22" fill="#A8D4B8" opacity="0.85" transform="rotate(-20 35 65)"/>
      <ellipse cx="65" cy="65" rx="7" ry="22" fill="#A8D4B8" opacity="0.85" transform="rotate(20 65 65)"/>
      <ellipse cx="22" cy="55" rx="6" ry="18" fill="#C5E8D2" opacity="0.8" transform="rotate(-40 22 55)"/>
      <ellipse cx="78" cy="55" rx="6" ry="18" fill="#C5E8D2" opacity="0.8" transform="rotate(40 78 55)"/>
      <circle cx="50" cy="45" r="8" fill="#FFD93D" opacity="0.9"/>
    </svg>
    <h1>You're Offline</h1>
    <p>It looks like you've lost your connection, but your healing journey continues.</p>
    <div class="affirmation">
      "In stillness, I find my strength. In pause, I find my peace."
    </div>
    <button onclick="location.reload()">Try Again</button>
  </div>
</body>
</html>`;
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
