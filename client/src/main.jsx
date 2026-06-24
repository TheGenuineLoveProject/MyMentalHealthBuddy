import "./styles/lumi-visual-system.css";
import LumiPresenceLayer from "./components/lumi/LumiPresenceLayer";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { applyBrand } from "./lib/brand";
import { initUIMode } from "./lib/mode";
import "./index.css";
import "./styles/brand.css";
import "./styles/sacred.css";
import "./styles/accessibility.css";

// Apply mode BEFORE first paint to prevent FOUC
try {
  initUIMode();
} catch (err) {
  console.warn('Mode initialization failed:', err);
}

// Safe initialization - never let branding errors prevent app render
try {
  applyBrand();
} catch (err) {
  console.warn('Brand initialization failed, continuing with defaults:', err);
}

// Set ONLY when the user explicitly clicks "Update now" (or confirms the fallback
// prompt). controllerchange reloads the page solely when this is true, so a new
// service worker can never reload someone mid-journal/check-in without consent.
let updateConsentGiven = false;

function showUpdateBanner(worker) {
  if (document.getElementById('sw-update-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'sw-update-banner';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'polite');
  banner.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;background:#5A8A6E;color:#fff;padding:14px 24px;border-radius:12px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,0.18);font-family:Inter,sans-serif;font-size:14px;max-width:440px;width:calc(100% - 32px);animation:slideUp 0.3s ease-out';
  banner.innerHTML = '<span style="flex:1">A new version is available</span><button data-testid="btn-update-app" style="background:#fff;color:#5A8A6E;border:none;padding:8px 16px;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;white-space:nowrap">Update now</button><button data-testid="btn-dismiss-update" style="background:transparent;color:rgba(255,255,255,0.8);border:none;cursor:pointer;font-size:18px;padding:4px" aria-label="Dismiss">&times;</button>';
  const style = document.createElement('style');
  style.textContent = '@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
  banner.appendChild(style);
  banner.querySelector('[data-testid="btn-update-app"]').addEventListener('click', () => {
    updateConsentGiven = true;
    worker.postMessage({ type: 'SKIP_WAITING' });
    window.dispatchEvent(new CustomEvent("mmhb-service-worker-refresh-available"));
  });
  banner.querySelector('[data-testid="btn-dismiss-update"]').addEventListener('click', () => {
    banner.remove();
  });
  document.body.appendChild(banner);
}

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then((registration) => {
        // Surface a worker that was already waiting before this page load (e.g.
        // the user dismissed the banner then revisited) so they are never stuck
        // without an "Update now" prompt. showUpdateBanner de-dupes itself.
        if (registration.waiting && navigator.serviceWorker.controller) {
          showUpdateBanner(registration.waiting);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                try {
                  if (document.body) {
                    showUpdateBanner(newWorker);
                  } else {
                    if (window.confirm('A new version is available. Refresh to update?')) {
                      updateConsentGiven = true;
                      newWorker.postMessage({ type: 'SKIP_WAITING' });
                      window.dispatchEvent(new CustomEvent("mmhb-service-worker-refresh-available"));
                    }
                  }
                } catch (e) {
                  console.warn('Update banner failed, using fallback:', e);
                  if (window.confirm('A new version is available. Refresh to update?')) {
                    updateConsentGiven = true;
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.dispatchEvent(new CustomEvent("mmhb-service-worker-refresh-available"));
                  }
                }
              }
            });
          }
        });

        setInterval(() => {
          registration.update().then(() => {
            if (registration.waiting && navigator.serviceWorker.controller) {
              showUpdateBanner(registration.waiting);
            }
          }).catch(() => {});
        }, 60 * 60 * 1000);
      })
      .catch((error) => {
        console.warn('SW registration failed:', error);
      });
  });

  // A new service worker only takes control after the user CONSENTS via the
  // "Update now" banner (the SW no longer auto-activates via skipWaiting on
  // install). When that consented takeover happens, reload exactly once so the
  // user lands on the fresh bundle. Without consent (e.g. another tab, or first
  // install) we never reload — protecting in-progress journaling/check-ins.
  let reloadingForUpdate = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.dispatchEvent(new CustomEvent("mmhb-service-worker-updated", {
      detail: {
        source: "controllerchange",
        action: "consented-refresh",
      },
    }));
    if (reloadingForUpdate || !updateConsentGiven) return;
    reloadingForUpdate = true;
    window.location.reload();
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'CHECK_REMINDER') {
      checkAndShowReminder();
    }
    if (event.data?.type === 'NAVIGATE') {
      window.location.href = event.data.url;
    }
  });

  const reminderChannel = new BroadcastChannel('reminder-channel');
  reminderChannel.addEventListener('message', (event) => {
    if (event.data.type === 'STORE_REMINDER') {
      try { localStorage.setItem('glp-scheduled-reminder', JSON.stringify(event.data.data)); } catch (err) { console.warn("[storage-safe-write]", err); }
    }
    if (event.data.type === 'CLEAR_REMINDER') {
      localStorage.removeItem('glp-scheduled-reminder');
    }
  });

  function checkAndShowReminder() {
    const stored = localStorage.getItem('glp-scheduled-reminder');
    if (!stored) return;

    try {
      const { scheduledTime, settings } = JSON.parse(stored);
      const now = Date.now();
      
      if (now >= scheduledTime) {
        navigator.serviceWorker.ready.then(registration => {
          if (Notification.permission === 'granted') {
            registration.showNotification('MyMentalHealthBuddy', {
              body: settings.message || 'Would you like to check in with your emotions today?',
              icon: '/android-chrome-192x192.png',
              badge: '/android-chrome-192x192.png',
              tag: 'daily-reminder',
              silent: settings.tone === 'silent',
              data: { url: '/mood' }
            });
          }
          
          const nextReminder = new Date(scheduledTime);
          nextReminder.setDate(nextReminder.getDate() + 1);
          try {
            localStorage.setItem('glp-scheduled-reminder', JSON.stringify({
              scheduledTime: nextReminder.getTime(),
              settings
            }));
          } catch (err) { console.warn("[storage-safe-write]", err); }
        });
      }
    } catch (e) {
      console.warn('Error checking reminder:', e);
    }
  }

  checkAndShowReminder();
  
  setInterval(checkAndShowReminder, 60000);
}

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <HelmetProvider>
      <><App /><LumiPresenceLayer /></>
    </HelmetProvider>
  );
} else {
  console.error("Root element not found!");
}
