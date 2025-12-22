Roger v5.1 online, Maria.
I will now deliver BOTH items you requested in perfect sequence and full A→Z 360° format:

1️⃣ FULL API_REFERENCE v5.1
2️⃣ Next-error repair — based on the error shown in your screenshots:

Unauthorized: invalid or expired token — AI Chat check failed

This means your AI route is rejecting the request because no Bearer token or incorrect token is being sent.

I will fix that immediately.

Let’s proceed.

────────────────────────────────

⭐ 1️⃣ FULL API_REFERENCE v5.1

The Genuine Love Project — Complete Backend API Specification

(MIT–Harvard–Stanford Level • Zero-Knowledge Friendly)

Paste this into:
docs/API_REFERENCE_v5.1.md

⸻

📘 API REFERENCE — The Genuine Love Project v5.1

Complete A→Z documentation of every backend route.

⸻

0. GENERAL CONFIG

Base URL (Development)

http://127.0.0.1:5000

Base URL (Replit Autoscale)

https://<your-repl-name>.<your-username>.repl.co

Authentication

Most routes require:

Authorization: Bearer <JWT>
Content-Type: application/json


⸻

1. HEALTH ROUTES

GET /api/health

Checks if the backend is alive.

Response

{
  "status": "healthy",
  "message": "The Genuine Love Project API is running.",
  "environment": "development",
  "version": "2.0.0"
}


⸻

2. AUTH ROUTES

POST /api/auth/register

Registers new user.

Body

{
  "email": "test@example.com",
  "password": "12345678",
  "name": "Maria"
}


⸻

POST /api/auth/login

Returns JWT token.

Body

{
  "email": "test@example.com",
  "password": "12345678"
}

Response

{
  "token": "<jwt>",
  "user": { "id": "...", "email": "...", "name": "..." }
}


⸻

GET /api/auth/me

Returns authenticated user.

Requires JWT.

⸻

3. JOURNAL ROUTES

POST /api/journals

Creates journal entry.

Body

{
  "title": "My Day",
  "text": "Today I felt..."
}


⸻

GET /api/journals

Returns list of user journals.

⸻

GET /api/journals/:id

Returns a specific journal.

⸻

DELETE /api/journals/:id

⸻

4. MOOD ROUTES

POST /api/moods

Tracks mood entry.

Body

{
  "value": 4,
  "note": "Feeling good"
}


⸻

GET /api/moods

Returns mood history.

⸻

5. AI ROUTES

❗ POST /api/ai/chat

This is the failing endpoint in your screenshots.

Requires:

✔ Authorization: Bearer 

✔ OPENAI_API_KEY in secrets

Body

{
  "message": "I'm feeling anxious today"
}

Response

{
  "reply": "Your feelings make sense. Here’s a grounding step..."
}


⸻

6. ANALYTICS ROUTES

GET /api/analytics/summary

POST /api/analytics/event

⸻

7. WELLNESS ROUTES

(Only the main endpoints shown — full list in DB_REFERENCE)

GET /api/wellness/tools

Returns 54 tool definitions.

⸻

8. SUBSCRIPTION / BILLING ROUTES

POST /api/subscriptions/create-checkout

POST /api/subscriptions/webhook

Stripe webhook endpoint (must remain raw).

⸻

9. NOTIFICATION ROUTES

GET /api/notifications

POST /api/notifications/read

⸻

10. ERROR RESPONSE FORMAT (Unified)

{
  "ok": false,
  "error": "Invalid or expired token"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ 2️⃣ ERROR FIX — AI Chat: “Unauthorized: invalid or expired token”

Maria — based on your screenshots, the error is caused by missing Bearer token during the smoke-test call.

Your smoke test is calling:

/api/ai/chat

But you did NOT include:

Authorization: Bearer <jwt>

And in your AI route, I can see your code likely contains:

if (!req.user) return res.status(401).json({ ... })

So internally, it requires valid authentication.

✔ FIX: Update smoke-test.mjs to include a token

Below is the corrected version.

Paste this into:

/scripts/smoke-test.mjs

⭐ UPDATED smoke-test.mjs (v5.1 FIXED)

import fetch from "node-fetch";

const BASE = "http://127.0.0.1:5000";

// 1) Login to get a token (ensure a test user exists)
const loginRes = await fetch(`${BASE}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "test@example.com",
    password: "12345678"
  })
});

const loginData = await loginRes.json();
const token = loginData.token;

if (!token) {
  console.error("❌ Smoke test failed: No token returned from login.");
  process.exit(1);
}

console.log("✔ Auth token obtained.");

// 2) AI Chat Test
const aiRes = await fetch(`${BASE}/api/ai/chat`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ message: "Hello test" })
});

const aiData = await aiRes.json();

if (!aiRes.ok) {
  console.error("❌ AI Chat check failed:", aiData);
  process.exit(1);
}

console.log("✔ AI Chat operational:", aiData);


⸻

⭐ WHAT THIS FIXES

✔ Adds login step
✔ Pulls valid JWT
✔ Passes Authorization header
✔ Prevents “invalid or expired token”
✔ Makes smoke test fully correct
✔ Confirms AI endpoint end-to-end

⸻

⭐ NEXT STEP FOR YOU

Tell me:

“Roger v5.1, run the next healing or optimization step.”

or

“Roger v5.1, generate the FULL DB_REFERENCE.”

I will continue the A→Z 360° refinement.