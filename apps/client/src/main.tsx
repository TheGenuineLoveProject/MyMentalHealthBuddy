import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { StripeProvider } from "./contexts/StripeContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { registerServiceWorker } from "./registerSW";
import { initPerformanceMonitoring } from "./lib/performance";
import { initWebVitals } from "./lib/webVitals";
import App from "./App";
import "./index.css";

// Initialize performance monitoring
initPerformanceMonitoring();

// Initialize Web Vitals monitoring
initWebVitals();

// Register service worker for PWA support (production only)
if (import.meta.env.PROD) {
  registerServiceWorker();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StripeProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StripeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
