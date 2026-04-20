#!/bin/bash

set -e

URL=${1:-http://localhost:5000}

echo "Running system verification..."

echo "1. Health"
curl -s -o /dev/null -w "%{http_code}\n" $URL/api/health

echo "2. Guest Chat"
GUEST_ID="test-$(date +%s)"

curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "x-guest-id: $GUEST_ID" \
        -d '{"message":"test"}' \
        $URL/api/ai/chat

echo "3. History"
curl -s \
        -H "x-guest-id: $GUEST_ID" \
        $URL/api/ai/history

echo "4. Register"
TOKEN=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"test$(date +%s)@test.com\",\"password\":\"testpass123\"}" \
        $URL/api/auth/register | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then
        echo "FAIL: token missing"
        exit 1
fi

echo "5. Auth Me"
curl -s \
        -H "Authorization: Bearer $TOKEN" \
        $URL/api/auth/me

echo "6. Upgrade History (valid)"
curl -s -X POST \
        -H "Authorization: Bearer $TOKEN" \
        -H "x-guest-id: $GUEST_ID" \
        $URL/api/session-boundary/upgrade-history

echo "7. Upgrade History (no guest id → expect 400)"
curl -s -o /dev/null -w "%{http_code}\n" \
        -X POST \
        -H "Authorization: Bearer $TOKEN" \
        $URL/api/session-boundary/upgrade-history

echo "8. CSRF Token (expect token field)"
CSRF_RES=$(curl -s $URL/api/session-boundary/csrf-token)
echo "$CSRF_RES"
echo "$CSRF_RES" | grep -qE '"(csrfToken|token)"[[:space:]]*:[[:space:]]*"[a-f0-9]+"' || { echo "FAIL: csrf token missing"; exit 1; }

echo "9. Journal Summary (guest, expect ok:true)"
JS_RES=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "x-guest-id: $GUEST_ID" \
        -d '{"entries":["felt anxious this morning","short walk helped a little","grateful for tea"]}' \
        $URL/api/ai/journal-summary)
echo "$JS_RES"
echo "$JS_RES" | grep -q '"ok":true' || { echo "FAIL: journal-summary not ok"; exit 1; }

echo "10. Coping Plan (guest, neutral input, expect ok:true)"
CP_RES=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "x-guest-id: $GUEST_ID" \
        -d '{"message":"feeling overwhelmed by work","mood":"tired","energy":2}' \
        $URL/api/ai/coping-plan)
echo "$CP_RES"
echo "$CP_RES" | grep -q '"ok":true' || { echo "FAIL: coping-plan not ok"; exit 1; }

echo "11. Crisis Short-Circuit (chat, expect 988 + escalate_immediately)"
CR_GUEST="crisis-verify-$(date +%s)"
CR_RES=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "x-guest-id: $CR_GUEST" \
        -d '{"message":"i want to kill myself"}' \
        $URL/api/ai/chat)
echo "$CR_RES" | head -c 400
echo
echo "$CR_RES" | grep -q '988' || { echo "FAIL: crisis response missing 988"; exit 1; }
echo "$CR_RES" | grep -q 'escalate_immediately' || { echo "FAIL: crisis response missing escalate_immediately action"; exit 1; }

echo "Verification complete."