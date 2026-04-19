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

echo "Verification complete."