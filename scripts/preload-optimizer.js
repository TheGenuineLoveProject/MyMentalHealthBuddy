#!/usr/bin/env node

/**
 * Preload & Prefetch Optimizer
 * Analyzes build and generates optimal resource hints
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'apps', 'client', 'dist');
const indexPath = path.join(distDir, 'index.html');

console.log('🚀 Preload & Prefetch Optimizer');
console.log('================================\n');

if (!fs.existsSync(indexPath)) {
  console.error('❌ Build not found. Run npm run build first.');
  process.exit(1);
}

// Read index.html
let html = fs.readFileSync(indexPath, 'utf-8');

// Find critical assets
const criticalAssets = [];
const prefetchAssets = [];

// Parse existing script and link tags
const scriptRegex = /<script[^>]+src="([^"]+)"[^>]*>/g;
const linkRegex = /<link[^>]+href="([^"]+)"[^>]*>/g;

let match;
while ((match = scriptRegex.exec(html)) !== null) {
  const src = match[1];
  if (src.includes('react-vendor') || src.includes('vendor')) {
    criticalAssets.push({ type: 'script', href: src });
  } else if (src.includes('index')) {
    criticalAssets.push({ type: 'script', href: src });
  } else {
    prefetchAssets.push({ type: 'script', href: src });
  }
}

while ((match = linkRegex.exec(html)) !== null) {
  const href = match[1];
  if (href.includes('.css') && !href.includes('preload')) {
    criticalAssets.push({ type: 'style', href: href });
  }
}

// Generate preload tags
const preloadTags = criticalAssets.map(asset => {
  if (asset.type === 'script') {
    return `  <link rel="modulepreload" href="${asset.href}" />`;
  } else {
    return `  <link rel="preload" href="${asset.href}" as="style" />`;
  }
}).join('\n');

// Generate prefetch tags for non-critical resources
const prefetchTags = prefetchAssets.slice(0, 3).map(asset => {
  return `  <link rel="prefetch" href="${asset.href}" />`;
}).join('\n');

// Add DNS prefetch for external resources
const dnsPrefetch = `
  <!-- DNS Prefetch for faster external requests -->
  <link rel="dns-prefetch" href="https://api.openai.com" />
  <link rel="dns-prefetch" href="https://api.stripe.com" />
  <link rel="preconnect" href="https://api.openai.com" crossorigin />
  <link rel="preconnect" href="https://api.stripe.com" crossorigin />
`;

console.log('📦 Resource Hints Generated');
console.log('----------------------------------');
console.log(`Critical Resources: ${criticalAssets.length}`);
console.log(`Prefetch Resources: ${Math.min(3, prefetchAssets.length)}`);
console.log(`DNS Prefetch: 2 domains`);

// Insert into HTML (after charset meta tag)
const headEndIndex = html.indexOf('</head>');
if (headEndIndex !== -1) {
  const optimizedHTML = 
    html.slice(0, headEndIndex) + 
    '\n  <!-- Resource Hints for Performance -->\n' +
    dnsPrefetch + '\n' +
    preloadTags + '\n' +
    prefetchTags + '\n' +
    html.slice(headEndIndex);
  
  fs.writeFileSync(indexPath, optimizedHTML);
  console.log('\n✅ Resource hints injected into index.html');
}

console.log('\n🎉 Optimization complete!');
console.log('================================\n');
