import ReactDOM from "react-dom/client";
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

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content available; refreshing...');
                if (window.confirm('A new version is available. Refresh to update?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });

        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((error) => {
        console.warn('SW registration failed:', error);
      });
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('SW controller changed');
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
      localStorage.setItem('glp-scheduled-reminder', JSON.stringify(event.data.data));
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
            registration.showNotification('The Genuine Love Project', {
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
          localStorage.setItem('glp-scheduled-reminder', JSON.stringify({
            scheduledTime: nextReminder.getTime(),
            settings
          }));
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
  ReactDOM.createRoot(root).render(<App />);
} else {
  console.error("Root element not found!");
}
