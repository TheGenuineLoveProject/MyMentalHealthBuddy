// ------------------------------------------------------------
// MyMentalHealthBuddy – Replit Autoscale Root Loader
// This file MUST exist for Vite + Replit to correctly render
// ------------------------------------------------------------

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // this will be created next
import "./index.css";

// Replit requires: the root element MUST be #root
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "❌ Root element #root not found. Ensure index.html contains <div id='root'></div>."
  );
}

// Create the root
const root = createRoot(rootElement);

// Render App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);