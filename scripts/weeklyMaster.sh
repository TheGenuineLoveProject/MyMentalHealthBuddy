#!/usr/bin/env bash
set -e
echo "🗓️  Running weekly master chain..."
node scripts/autoPublishApproved.mjs
node scripts/weeklyReport.mjs
echo "✅ Weekly tasks complete."
