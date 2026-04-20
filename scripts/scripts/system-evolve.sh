#!/usr/bin/env bash

echo "Running system evolution scan..."

npm run routes:manifest
npm run verify

echo "Analyzing gaps..."

node << 'EOF'
const fs = require('fs');

const routes = JSON.parse(fs.readFileSync('docs/ROUTE_MANIFEST.json', 'utf8'));

console.log("Total routes:", routes.length);

const postRoutes = routes.filter(r => r.method === 'POST');
const getRoutes = routes.filter(r => r.method === 'GET');

if (postRoutes.length < getRoutes.length * 0.3) {
	console.log("⚠️ Potential imbalance: too few POST routes");
}

console.log("✅ Evolution scan complete");
EOF