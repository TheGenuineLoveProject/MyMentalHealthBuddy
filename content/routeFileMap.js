/**
 * routeFileMap.js
 * Deterministic route → generated file mapping table and resolver.
 * 
 * Auto-detects whether generated pages use flattened filenames (account-profile.jsx)
 * or nested folders (account/profile.jsx) and maps routes accordingly.
 */

import fs from 'fs';
import path from 'path';

export const GENERATED_PAGES_DIR = "client/src/pages/generated";

export const ROUTE_FILE_OVERRIDES = {
  "/": "index.jsx",
  "/home": "home.jsx",
  "/welcome": "welcome.jsx",
  "/404": "404.jsx",
  "/*": "404.jsx",
  "/blog/:slug": "blog-[param].jsx",
  "/community/discussion/:id": "community-discussion-[param].jsx"
};

const SENTINEL_CHECKS = {
  nested: [
    "account/profile.jsx",
    "blog/[slug].jsx",
    "community/discussion/[id].jsx"
  ],
  flat: [
    "account-profile.jsx",
    "blog-[param].jsx",
    "community-discussion-[param].jsx"
  ]
};

let cachedLayout = null;

function detectGeneratedLayout() {
  if (cachedLayout !== null) {
    return cachedLayout;
  }
  
  for (const sentinel of SENTINEL_CHECKS.nested) {
    const fullPath = path.join(GENERATED_PAGES_DIR, sentinel);
    try {
      if (fs.existsSync(fullPath)) {
        cachedLayout = "nested";
        return cachedLayout;
      }
    } catch {}
  }
  
  for (const sentinel of SENTINEL_CHECKS.flat) {
    const fullPath = path.join(GENERATED_PAGES_DIR, sentinel);
    try {
      if (fs.existsSync(fullPath)) {
        cachedLayout = "flat";
        return cachedLayout;
      }
    } catch {}
  }
  
  cachedLayout = "flat";
  return cachedLayout;
}

export const GENERATED_LAYOUT = detectGeneratedLayout();

function normalizeRouteSegment(segment) {
  if (segment.startsWith(':')) {
    return '[param]';
  }
  return segment;
}

export function routeToGeneratedFile(route) {
  if (Object.prototype.hasOwnProperty.call(ROUTE_FILE_OVERRIDES, route)) {
    return ROUTE_FILE_OVERRIDES[route];
  }
  
  let normalized = route.replace(/^\/+/, '').replace(/\/+$/, '');
  
  if (normalized === '' || normalized === '/') {
    return 'index.jsx';
  }
  
  const segments = normalized.split('/').map(normalizeRouteSegment);
  
  const layout = detectGeneratedLayout();
  
  if (layout === "flat") {
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

export function resolveRouteToFile(route, aliasOf = null) {
  if (aliasOf) {
    const canonicalResolved = resolveRouteToFile(aliasOf);
    if (canonicalResolved.exists) {
      return {
        ...canonicalResolved,
        aliasOf: aliasOf
      };
    }
  }
  
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
  } catch {}
  
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
