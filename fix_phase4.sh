#!/bin/bash
set -e

echo "=================================================="
echo " MyMentalHealthBuddy – Phase 4 FIX (frontend)"
echo "=================================================="

# 1) Ensure we are in project ROOT
if [ ! -f ".replit" ] || [ ! -d "client" ]; then
  echo "[ERROR] Please run this from the project ROOT (where .replit and client/ are)."
  exit 1
fi
echo "[OK] In project ROOT."

# 2) Go into client and ensure dependencies
cd client
if [ ! -f "package.json" ]; then
  echo "[ERROR] client/package.json not found."
  exit 1
fi
echo "[OK] Inside /client."

if [ ! -d "node_modules" ]; then
  echo "[INFO] node_modules missing – running npm install..."
  npm install --force
fi

echo "[STEP] Installing required frontend deps (wouter, clsx, tailwind-merge, tailwindcss-animate)..."
npm install wouter clsx tailwind-merge tailwindcss-animate --force

echo "[OK] Dependencies installed."

# 3) Create/replace src/lib/utils.ts (for @/lib/utils)
echo "[STEP] Creating src/lib/utils.ts ..."
mkdir -p src/lib

cat << 'EOUT' > src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() – merge Tailwind class names safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOUT

echo "[OK] src/lib/utils.ts created."

# 4) Fix vite.config.js alias for "@"
echo "[STEP] Updating vite.config.js alias..."

cat << 'EOUT' > vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for MyMentalHealthBuddy client
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",      // so "@/lib/utils" -> src/lib/utils.ts
    },
  },
  server: {
    host: true,
    strictPort: false,
    port: 5173,
    allowedHosts: true,
  },
})
EOUT

echo "[OK] vite.config.js updated."

# 5) Fix tailwind.config.js (add ts/tsx + animate plugin)
echo "[STEP] Updating tailwind.config.js ..."

cat << 'EOUT' > tailwind.config.js
import animate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [animate],
}
EOUT

echo "[OK] tailwind.config.js updated."

# 6) Overwrite src/index.css to remove any 'tw-animate-css' import
echo "[STEP] Rebuilding src/index.css (no tw-animate-css)..."

cat << 'EOUT' > src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.5rem;
  }

  body {
    @apply bg-white text-slate-900;
  }
}
EOUT

echo "[OK] src/index.css reset (no missing imports)."

echo "=================================================="
echo " Phase 4 FIX complete."
echo " - @/lib/utils now resolves correctly"
echo " - tw-animate-css error removed"
echo " - wouter installed"
echo "Now re-run your client (Replit Run/Preview)."
echo "=================================================="
