import ReactDOM from "react-dom/client";
import App from "./App";
import { applyBrand } from "./lib/brand";
import { initUIMode } from "./lib/mode";
import "./index.css";
import "./styles/brand.css";
import "./styles/sacred.css";

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
                console.log('New content available; please refresh.');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('SW registration failed:', error);
      });
  });
}

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<App />);
} else {
  console.error("Root element not found!");
}
