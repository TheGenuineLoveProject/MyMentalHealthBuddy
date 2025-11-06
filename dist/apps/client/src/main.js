import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { StripeProvider } from "./contexts/StripeContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { registerServiceWorker } from "./registerSW";
import { initPerformanceMonitoring } from "./lib/performance";
import { initWebVitals } from "./lib/webVitals";
import { initializePerformanceOptimizations } from "./lib/performance-optimizer";
import { initializeSecurityHardening } from "./lib/security-hardening";
import App from "./App";
import "./index.css";
// 360° Security: Initialize security hardening
initializeSecurityHardening();
// 360° Performance: Initialize performance monitoring
initPerformanceMonitoring();
// 360° Performance: Initialize Web Vitals monitoring
initWebVitals();
// 360° Performance: Initialize advanced performance optimizations
initializePerformanceOptimizations();
// Register service worker for PWA support (production only)
if (import.meta.env.PROD) {
    registerServiceWorker();
}
createRoot(document.getElementById("root")).render(_jsx(QueryClientProvider, { client: queryClient, children: _jsx(StripeProvider, { children: _jsx(ThemeProvider, { children: _jsx(App, {}) }) }) }));
