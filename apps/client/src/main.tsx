// 360° CRITICAL: Sentry instrumentation must be imported FIRST (before React or any other imports)
import "./instrument";

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

// Suppress dev-only Vite HMR WebSocket errors (doesn't affect production)
if (!import.meta.env.PROD) {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('WebSocket')) {
      event.preventDefault();
      console.debug('[Dev] Vite HMR WebSocket connection issue (non-critical)');
    }
  });
  
  // Suppress console errors for WebSocket connection issues
  const originalError = console.error;
  console.error = (...args) => {
    if (args.some(arg => typeof arg === 'string' && arg.includes('WebSocket'))) {
      return;
    }
    originalError.apply(console, args);
  };
}

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
