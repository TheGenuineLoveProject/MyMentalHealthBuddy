import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { StripeProvider } from "./contexts/StripeContext";
import { registerServiceWorker } from "./registerSW";
import App from "./App";
import "./index.css";

// Register service worker for PWA support (production only)
if (import.meta.env.PROD) {
  registerServiceWorker();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StripeProvider>
        <App />
      </StripeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
