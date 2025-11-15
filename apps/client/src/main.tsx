// 360° CRITICAL: Sentry instrumentation must be imported FIRST (before React or any other imports)
import "./instrument";

import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { StripeProvider } from "./contexts/StripeContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import App from "./App";
import "./index.css";

// 🚀 888...^ PERFECTION: Comprehensive WebSocket error handling (dev-only)
// Must be installed BEFORE Vite client connects
if (!import.meta.env.PROD) {
  // Comprehensive WebSocket error suppression - catches ALL variations
  const handleWebSocketError = (event: any) => {
    const message = event?.reason?.message || event?.message || String(event?.reason || '');
    if (message.toLowerCase().includes('websocket') || message.includes('ws://')) {
      event.preventDefault?.();
      event.stopPropagation?.();
      event.stopImmediatePropagation?.();
      return true;
    }
    return false;
  };

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', handleWebSocketError, true);
  
  // Regular errors
  window.addEventListener('error', handleWebSocketError, true);
  
  // Comprehensive console patching
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const message = args.join(' ').toLowerCase();
    if (message.includes('websocket') || message.includes('[vite]') && message.includes('websocket')) {
      return; // Silently suppress
    }
    originalError.apply(console, args);
  };
  
  console.warn = (...args: any[]) => {
    const message = args.join(' ').toLowerCase();
    if (message.includes('websocket')) {
      return; // Silently suppress
    }
    originalWarn.apply(console, args);
  };
}

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
