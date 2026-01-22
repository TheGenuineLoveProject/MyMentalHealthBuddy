#!/usr/bin/env bash
set -euo pipefail

echo "== RELEASE GATE =="

if [ -f package.json ]; then
  if [ -f pnpm-lock.yaml ] && command -v pnpm >/dev/null 2>&1; then pnpm install;
  elif [ -f yarn.lock ] && command -v yarn >/dev/null 2>&1; then yarn install --frozen-lockfile || yarn install;
  elif [ -f package-lock.json ]; then npm ci;
  else npm install; fi

  node -v
  npm -v

  node tools/smoke_http.cjs
  node tools/route_map.cjs
  node tools/link_scan.cjs
  node tools/auth_smoke.cjs

  if node -e "const p=require('./package.json'); process.exit(p.scripts?.build?0:1)"; then
    npm run -s build
  else
    echo "SKIP: build (no script)"
  fi
else
  echo "No package.json found; skipping Node gates."
fi

echo "== RELEASE GATE: PASS =="
