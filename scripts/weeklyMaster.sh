#!/usr/bin/env bash
set -e
echo "🗓️  Running weekly master chain (v13.5)..."
# 1) Generate / translate / report (from previous versions if present)
[ -f scripts/autoPublishApproved.mjs ] && node scripts/autoPublishApproved.mjs || true
[ -f scripts/weeklyReport.mjs ] && node scripts/weeklyReport.mjs || true
[ -f scripts/generateCovers.mjs ] && node scripts/generateCovers.mjs || true
# 2) Cross-post blogs (v13.0)
[ -f scripts/crossPublisher.mjs ] && node scripts/crossPublisher.mjs || true
# 3) NEW: Social carousels (IG + X + Threads)
node scripts/social/carouselPoster.mjs || true
echo "✅ Weekly chain complete (v13.5)."
