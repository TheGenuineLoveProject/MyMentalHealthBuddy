// client/src/content/generatedRouteKeys.js
import { routeKeyFromFilename } from "./routeKey";

// Vite build-time file list (no runtime FS access needed)
const files = import.meta.glob("../pages/generated/**/*.{jsx,tsx,js,ts}", { eager: false });

export const GENERATED_ROUTEKEYS = Object.keys(files).reduce((acc, filePath) => {
  // routeKey = deterministic from filename
  const key = routeKeyFromFilename(filePath);
  acc[filePath] = key;
  return acc;
}, {});