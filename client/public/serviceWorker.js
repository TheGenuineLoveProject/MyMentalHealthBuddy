const CACHE_VERSION = '2.1.0';
const CACHE_NAME = `genuine-love-${CACHE_VERSION}`;
const RUNTIME_CACHE = `genuine-love-runtime-${CACHE_VERSION}`;
const OFFLINE_QUEUE_DB = 'genuine-love-offline-queue';
const OFFLINE_QUEUE_STORE = 'pending-entries';

const STATIC_ASSETS = [
  '/',
  '/index.html',
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

const FONT_CSS_URL = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap';

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn('Some static assets failed to cache:', err);
        });
      }),
      caches.open(RUNTIME_CACHE).then((cache) => {
        return fetch(FONT_CSS_URL)
          .then((response) => {
            if (response.ok) {
              cache.put(FONT_CSS_URL, response);
            }
          })
          .catch((err) => {
            console.warn('Font CSS failed to cache:', err);
          });
      })
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
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

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|woff2?|ttf|eot)$/)
  ) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (request.destination === 'document' || request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function cacheFirst(request, cacheName = CACHE_NAME) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
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
  if (event.data && event.data.type === 'SYNC_OFFLINE_ENTRIES') {
    syncOfflineEntries();
  }
  if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
    scheduleReminder(event.data.settings);
  }
});

const REMINDER_STORAGE_KEY = 'glp-scheduled-reminder';

function scheduleReminder(settings) {
  if (!settings || !settings.enabled) {
    console.log('[SW] Reminders disabled, clearing scheduled reminder');
    clearScheduledReminder();
    return;
  }

  const [hours, minutes] = settings.time.split(':').map(Number);
  const now = new Date();
  let nextReminder = new Date();
  nextReminder.setHours(hours, minutes, 0, 0);

  if (nextReminder <= now) {
    nextReminder.setDate(nextReminder.getDate() + 1);
  }

  const reminderData = {
    scheduledTime: nextReminder.getTime(),
    settings: settings
  };

  self.registration.showNotification && storeReminderData(reminderData);
  console.log('[SW] Reminder scheduled for:', nextReminder.toLocaleString());
  
  checkAndShowReminder();
}

function storeReminderData(data) {
  try {
    const channel = new BroadcastChannel('reminder-channel');
    channel.postMessage({ type: 'STORE_REMINDER', data });
    channel.close();
  } catch (e) {
    console.log('[SW] BroadcastChannel not available');
  }
}

function clearScheduledReminder() {
  try {
    const channel = new BroadcastChannel('reminder-channel');
    channel.postMessage({ type: 'CLEAR_REMINDER' });
    channel.close();
  } catch (e) {
    console.log('[SW] BroadcastChannel not available');
  }
}

async function checkAndShowReminder() {
  try {
    const clients = await self.clients.matchAll({ type: 'window' });
    if (clients.length > 0) {
      clients[0].postMessage({ type: 'CHECK_REMINDER' });
    }
  } catch (e) {
    console.log('[SW] Could not check reminder');
  }
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkAndShowReminder());
  }
});

async function showReminderNotification(settings) {
  if (!self.registration.showNotification) {
    console.log('[SW] Notifications not supported');
    return;
  }

  const title = 'The Genuine Love Project';
  const options = {
    body: settings.message || 'Would you like to check in with your emotions today?',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    tag: 'daily-reminder',
    requireInteraction: false,
    silent: settings.tone === 'silent',
    data: {
      url: '/mood',
      type: 'daily-reminder'
    },
    actions: [
      { action: 'check-in', title: 'Check In' },
      { action: 'dismiss', title: 'Later' }
    ]
  };

  try {
    await self.registration.showNotification(title, options);
    console.log('[SW] Reminder notification shown');
  } catch (err) {
    console.error('[SW] Failed to show notification:', err);
  }
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/mood';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            client.postMessage({ type: 'NAVIGATE', url: urlToOpen });
            return client.focus();
          }
        }
        return self.clients.openWindow(urlToOpen);
      })
  );
});

function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_QUEUE_DB, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(OFFLINE_QUEUE_STORE)) {
        db.createObjectStore(OFFLINE_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function saveOfflineEntry(entry) {
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(OFFLINE_QUEUE_STORE);
    store.add({ ...entry, timestamp: Date.now() });
    await tx.complete;
    console.log('[SW] Saved entry for offline sync');
    return true;
  } catch (err) {
    console.error('[SW] Failed to save offline entry:', err);
    return false;
  }
}

async function getOfflineEntries() {
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readonly');
    const store = tx.objectStore(OFFLINE_QUEUE_STORE);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('[SW] Failed to get offline entries:', err);
    return [];
  }
}

async function clearOfflineEntry(id) {
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(OFFLINE_QUEUE_STORE);
    store.delete(id);
  } catch (err) {
    console.error('[SW] Failed to clear offline entry:', err);
  }
}

async function syncOfflineEntries() {
  const entries = await getOfflineEntries();
  if (entries.length === 0) return;
  
  console.log(`[SW] Syncing ${entries.length} offline entries...`);
  
  for (const entry of entries) {
    try {
      const response = await fetch(entry.url, {
        method: entry.method,
        headers: entry.headers,
        body: entry.body,
        credentials: 'include'
      });
      
      if (response.ok) {
        await clearOfflineEntry(entry.id);
        console.log('[SW] Synced offline entry:', entry.id);
      }
    } catch (err) {
      console.log('[SW] Entry sync failed, will retry later:', entry.id);
    }
  }
  
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'OFFLINE_SYNC_COMPLETE' });
    });
  });
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-entries') {
    event.waitUntil(syncOfflineEntries());
  }
});

self.addEventListener('online', () => {
  syncOfflineEntries();
});
