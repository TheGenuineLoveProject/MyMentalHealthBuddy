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

// Initialize instrumentation modules AFTER initial render via idle callback
if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(async () => {
    // Lazy load heavy modules to avoid blocking main thread
    // NOTE: security-hardening and registerSW are truly lazy (only dynamically imported)
    const [
      { initializeSecurityHardening },
      { registerServiceWorker }
    ] = await Promise.all([
      import("./lib/security-hardening"),
      import("./registerSW")
    ]);

    // Only initialize security hardening in production (prevents HMR issues in dev)
    if (import.meta.env.PROD) {
      initializeSecurityHardening();
      registerServiceWorker();
    }
  }, { timeout: 2000 });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(async () => {
    const [
      { initializeSecurityHardening },
      { registerServiceWorker }
    ] = await Promise.all([
      import("./lib/security-hardening"),
      import("./registerSW")
    ]);

    if (import.meta.env.PROD) {
      initializeSecurityHardening();
      registerServiceWorker();
    }
  }, 100);
}

// Import performance/webVitals statically since they're used by hooks
// This eliminates dynamic import warnings and ensures immediate availability
import { initPerformanceMonitoring } from "./lib/performance";
import { initWebVitals } from "./lib/webVitals";
import { initializePerformanceOptimizations } from "./lib/performance-optimizer";

// Initialize after a short delay to allow render to complete
setTimeout(() => {
  initPerformanceMonitoring();
  initWebVitals();
  initializePerformanceOptimizations();
}, 0);
