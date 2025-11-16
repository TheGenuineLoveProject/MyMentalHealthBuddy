// 360° CRITICAL: Sentry instrumentation must be imported FIRST (before React or any other imports)
import "./instrument";

// Suppress Vite HMR WebSocket errors in development (Replit iframe environment)
// This error is harmless - HMR works via HTTP polling fallback
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    // Suppress known benign Vite HMR errors
    if (message.includes('[vite] failed to connect to websocket') ||
        message.includes('WebSocket closed without opened')) {
      return; // Silently ignore
    }
    originalError.apply(console, args);
  };

  // Also suppress unhandledrejection for WebSocket HMR errors
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    if (message.includes('WebSocket closed without opened')) {
      event.preventDefault(); // Prevent console error
    }
  });
}

import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { StripeProvider } from "./contexts/StripeContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import App from "./App";
import "./index.css";

// 🚀 PERFORMANCE BREAKTHROUGH: Render first, instrument later
// Defer all heavy monitoring/optimization/security modules to post-render idle tasks
// This unblocks DOMContentLoaded and dramatically improves FCP/LCP

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StripeProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StripeProvider>
  </QueryClientProvider>
);

// Initialize instrumentation modules AFTER initial render via idle callback
if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(async () => {
    // Lazy load heavy modules to avoid blocking main thread
    const [
      { initializeSecurityHardening },
      { initPerformanceMonitoring },
      { initWebVitals },
      { initializePerformanceOptimizations },
      { registerServiceWorker }
    ] = await Promise.all([
      import("./lib/security-hardening"),
      import("./lib/performance"),
      import("./lib/webVitals"),
      import("./lib/performance-optimizer"),
      import("./registerSW")
    ]);

    // Only initialize security hardening in production (prevents HMR issues in dev)
    if (import.meta.env.PROD) {
      initializeSecurityHardening();
      registerServiceWorker();
    }

    // Initialize performance monitoring
    initPerformanceMonitoring();
    initWebVitals();
    initializePerformanceOptimizations();
  }, { timeout: 2000 });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(async () => {
    const [
      { initializeSecurityHardening },
      { initPerformanceMonitoring },
      { initWebVitals },
      { initializePerformanceOptimizations },
      { registerServiceWorker }
    ] = await Promise.all([
      import("./lib/security-hardening"),
      import("./lib/performance"),
      import("./lib/webVitals"),
      import("./lib/performance-optimizer"),
      import("./registerSW")
    ]);

    if (import.meta.env.PROD) {
      initializeSecurityHardening();
      registerServiceWorker();
    }

    initPerformanceMonitoring();
    initWebVitals();
    initializePerformanceOptimizations();
  }, 100);
}
