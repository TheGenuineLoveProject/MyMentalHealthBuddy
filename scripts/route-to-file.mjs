#!/usr/bin/env node
/**
 * ============================================================================
 * ROUTE-TO-FILE.MJS - Deterministic Route → File Mapping
 * ============================================================================
 * 
 * Single source of truth for mapping routes to generated file paths.
 * Used by: generator, verifier, diff formatter
 * 
 * Examples:
 *   "/" -> "index.jsx"
 *   "/home" -> "home.jsx"
 *   "/welcome" -> "welcome.jsx"
 *   "/404" -> "404.jsx"
 *   "/*" or not-found -> "not-found.jsx"
 *   "/blog/:slug" -> "blog-[param].jsx"
 *   "/community/discussion/:id" -> "community-discussion-[param].jsx"
 *   "/wellness" -> "wellness.jsx"
 *   "/wellness-hub" -> "wellness-hub.jsx"
 *   "/deep/nested/path" -> "deep-nested-path.jsx"
 * 
 * ============================================================================
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const GENERATED_DIR = path.join(ROOT, 'client', 'src', 'pages', 'generated');

/**
 * Check if route contains dynamic segments (e.g., :slug, :id)
 */
export function isDynamicRoute(routePattern) {
  return routePattern.includes(':');
}

/**
 * Check if route is the catch-all/not-found route
 */
export function isCatchAllRoute(routePattern) {
  return routePattern === '/*' || routePattern === '*';
}

/**
 * Convert route pattern to generated file name
 * 
 * @param {string} routePattern - The route pattern (e.g., "/blog/:slug")
 * @returns {string} - The file name (e.g., "blog-[param].jsx")
 */
export function routeToGeneratedFileName(routePattern) {
  // Handle root route
  if (routePattern === '/') {
    return 'index.jsx';
  }
  
  // Handle catch-all / not-found
  if (isCatchAllRoute(routePattern)) {
    return 'not-found.jsx';
  }
  
  // Handle 404
  if (routePattern === '/404') {
    return '404.jsx';
  }
  
  // Strip leading slash
  let route = routePattern.startsWith('/') ? routePattern.slice(1) : routePattern;
  
  // Replace dynamic segments :param with [param]
  route = route.replace(/:([^/]+)/g, '[param]');
  
  // Replace slashes with hyphens
  route = route.replace(/\//g, '-');
  
  return `${route}.jsx`;
}

/**
 * Convert route pattern to full generated file path
 * 
 * @param {string} routePattern - The route pattern
 * @returns {string} - Full path to generated file
 */
export function routeToGeneratedFilePath(routePattern) {
  const fileName = routeToGeneratedFileName(routePattern);
  return path.join(GENERATED_DIR, fileName);
}

/**
 * Convert route pattern to relative file path (from repo root)
 * 
 * @param {string} routePattern - The route pattern
 * @returns {string} - Relative path from repo root
 */
export function routeToRelativeFilePath(routePattern) {
  const fileName = routeToGeneratedFileName(routePattern);
  return `client/src/pages/generated/${fileName}`;
}

/**
 * Get the generated directory path
 */
export function getGeneratedDir() {
  return GENERATED_DIR;
}

// Self-test when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Route → File Mapping Examples:\n');
  const examples = [
    '/',
    '/home',
    '/welcome',
    '/404',
    '/*',
    '/blog/:slug',
    '/community/discussion/:id',
    '/wellness',
    '/wellness-hub',
    '/deep/nested/path'
  ];
  
  for (const route of examples) {
    console.log(`  "${route}" → "${routeToGeneratedFileName(route)}"`);
  }
  console.log('\nAll mappings are deterministic and stable.');
}
