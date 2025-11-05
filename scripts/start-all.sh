#!/usr/bin/env bash
set -euo pipefail
mkdir -p audit/logs
( node scripts/agent.mjs || true ) &
concurrently -k -n server,client \
  "npm --prefix apps/server run dev | tee -a audit/logs/server.log" \
  "npm --prefix apps/client run start | tee -a audit/logs/client.log"
