#!/usr/bin/env node
/**
 * ============================================================================
 * ROUTES-SNAPSHOT.MJS - Shared Snapshot Logic for Routes
 * ============================================================================
 * 
 * This module provides the canonical snapshot building logic used by both:
 * - scripts/generate-pages.mjs (writes snapshot to disk)
 * - scripts/verify-routes-manifest.mjs (computes expected snapshot for diff)
 * 
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { CATEGORY_ORDER } from '../content/categoryOrder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

/**
 * Stable stringify: sorts object keys for deterministic output.
 * Handles nested objects and arrays consistently.
 */
export function stableStringify(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).sort().reduce((sorted, k) => {
        sorted[k] = value[k];
        return sorted;
      }, {});
    }
    return value;
  });
}

/**
 * Compute sha256 hash of an object using stable stringification.
 */
export function computeRouteHash(routeEntry) {
  const stableJson = stableStringify(routeEntry);
  return crypto.createHash('sha256').update(stableJson).digest('hex');
}

/**
 * Load routes from routes.js configuration.
 */
export async function loadRoutes() {
  const routesModule = await import(path.join(ROOT, 'client', 'src', 'content', 'routes.js'));
  const routes = routesModule.routes || routesModule.default?.routes || [];
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error('No routes found in routes.js');
  }
  return routes;
}

/**
 * Build a route entry from a route config.
 * This is the canonical structure used in the snapshot.
 */
export function buildRouteEntry(routeConfig) {
  // Normalize undefined to null for consistent output
  const normalize = (val) => (val === undefined ? null : val);

  // Detect if route is a pattern (has :param)
  const pattern = routeConfig.route.includes(':') ? routeConfig.route : null;

  // Count sections and modules if present
  const sectionsCount = Array.isArray(routeConfig.sections) ? routeConfig.sections.length : 0;
  const modulesCount = Array.isArray(routeConfig.modules) ? routeConfig.modules.length : 0;

  // Build hero object if present
  let hero = null;
  if (routeConfig.hero) {
    hero = {
      title: normalize(routeConfig.hero.title),
      subtitle: normalize(routeConfig.hero.subtitle),
      primaryCta: routeConfig.hero.primaryCta ? {
        label: normalize(routeConfig.hero.primaryCta.label),
        href: normalize(routeConfig.hero.primaryCta.href)
      } : null,
      secondaryCta: routeConfig.hero.secondaryCta ? {
        label: normalize(routeConfig.hero.secondaryCta.label),
        href: normalize(routeConfig.hero.secondaryCta.href)
      } : null
    };
  }

  // Build route entry without hash first
  const routeEntry = {
    route: routeConfig.route,
    category: normalize(routeConfig.category),
    aliasOf: normalize(routeConfig.aliasOf),
    pattern,
    title: normalize(routeConfig.title || routeConfig.pageLabel),
    description: normalize(routeConfig.description),
    hero,
    sectionsCount,
    modulesCount
  };

  return routeEntry;
}

/**
 * Build the full routes index with per-route hashes.
 */
export async function buildRoutesIndex() {
  const routes = await loadRoutes();

  const routesIndex = routes.map(routeConfig => {
    const routeEntry = buildRouteEntry(routeConfig);
    const routeHash = computeRouteHash(routeEntry);
    return {
      ...routeEntry,
      routeHash
    };
  });

  // Sort by route ascending for deterministic output
  routesIndex.sort((a, b) => a.route.localeCompare(b.route));

  return routesIndex;
}

/**
 * Build the full snapshot object (without snapshotHash).
 */
export async function buildSnapshot() {
  const routesIndex = await buildRoutesIndex();

  // Build routeHashes map for fast lookup
  const routeHashes = {};
  for (const entry of routesIndex) {
    routeHashes[entry.route] = entry.routeHash;
  }

  return {
    categoryOrder: CATEGORY_ORDER,
    routeHashes,
    routesIndex
  };
}

/**
 * Build the full snapshot with snapshotHash included.
 */
export async function buildSnapshotWithHash() {
  const snapshot = await buildSnapshot();
  const snapshotJson = JSON.stringify(snapshot, null, 2);
  const snapshotHashValue = crypto.createHash('sha256').update(snapshotJson).digest('hex');

  return {
    snapshotHash: snapshotHashValue,
    ...snapshot
  };
}

export { CATEGORY_ORDER };
