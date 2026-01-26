#!/bin/bash
# Restore quarantined files
# Quarantine timestamp: 2026-01-26T07-00-19-388Z

mv "_quarantine/2026-01-26T07-00-19-388Z/client/src/copy/aiChat.ts" "client/src/copy/aiChat.ts"
mv "_quarantine/2026-01-26T07-00-19-388Z/client/src/copy/disclaimers.ts" "client/src/copy/disclaimers.ts"
mv "_quarantine/2026-01-26T07-00-19-388Z/client/src/copy/journal.ts" "client/src/copy/journal.ts"
mv "_quarantine/2026-01-26T07-00-19-388Z/client/src/copy/mood.ts" "client/src/copy/mood.ts"
mv "_quarantine/2026-01-26T07-00-19-388Z/client/src/copy/onboarding.ts" "client/src/copy/onboarding.ts"

echo "Restored 5 files"