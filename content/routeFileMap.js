/**
 * routeFileMap.js
 * Deterministic route → generated file mapping table and resolver.
 * 
 * Provides a reliable way to convert route paths to their corresponding
 * generated page file paths without filesystem guessing.
 */

import fs from 'fs';
import path from 'path';

export const GENERATED_PAGES_DIR = "client/src/pages/generated";

export const ROUTE_FILE_OVERRIDES = {
  "/": "index.jsx",
  "/404": "404.jsx",
  "/*": "404.jsx",
  "/home": "index.jsx",
  "/welcome": "index.jsx"
};

let detectedStrategy = null;

function detectNamingStrategy() {
  if (detectedStrategy !== null) {
    return detectedStrategy;
  }
  
  const flattenedProbe = path.join(GENERATED_PAGES_DIR, "account-profile.jsx");
  const nestedProbe = path.join(GENERATED_PAGES_DIR, "account", "profile.jsx");
  
  try {
    if (fs.existsSync(flattenedProbe)) {
      detectedStrategy = 'flattened';
    } else if (fs.existsSync(nestedProbe)) {
      detectedStrategy = 'nested';
    } else {
      detectedStrategy = 'flattened';
    }
  } catch {
    detectedStrategy = 'flattened';
  }
  
  return detectedStrategy;
}

function normalizeRouteSegment(segment) {
  if (segment.startsWith(':')) {
    return '[param]';
  }
  return segment;
}

export function routeToGeneratedFile(route) {
  if (ROUTE_FILE_OVERRIDES.hasOwnProperty(route)) {
    return ROUTE_FILE_OVERRIDES[route];
  }
  
  let normalized = route.replace(/^\/+/, '').replace(/\/+$/, '');
  
  if (normalized === '' || normalized === '/') {
    return 'index.jsx';
  }
  
  const segments = normalized.split('/').map(normalizeRouteSegment);
  
  const strategy = detectNamingStrategy();
  
  if (strategy === 'flattened') {
    const filename = segments.join('-') + '.jsx';
    return filename;
  } else {
    const filePath = segments.slice(0, -1).join('/');
    const filename = segments[segments.length - 1] + '.jsx';
    if (filePath) {
      return filePath + '/' + filename;
    }
    return filename;
  }
}

export function resolveRouteToFile(route) {
  const relativePath = routeToGeneratedFile(route);
  const fullPath = path.join(GENERATED_PAGES_DIR, relativePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      return {
        kind: 'file',
        href: fullPath,
        relativePath: relativePath,
        exists: true
      };
    }
  } catch {
  }
  
  return {
    kind: 'path',
    href: route,
    relativePath: relativePath,
    exists: false
  };
}

export function getGeneratedFilePath(route) {
  return path.join(GENERATED_PAGES_DIR, routeToGeneratedFile(route));
}

export function generatedFileExists(route) {
  const fullPath = getGeneratedFilePath(route);
  try {
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}
