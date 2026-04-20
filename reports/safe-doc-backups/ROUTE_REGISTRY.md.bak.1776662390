# ROUTE REGISTRY — MyMentalHealthBuddy

## Core System Endpoints

### Health
- GET /api/health
- Auth: none
- Returns: 200 OK

---

### AI Chat
- POST /api/ai/chat
- Auth: guest or bearer
- Headers:
	- x-guest-id (required for guest)
- Returns: AI response

---

### History
- GET /api/ai/history
- Auth: guest or bearer
- Headers:
	- x-guest-id
- Returns: message history

---

### Journal Summary
- POST /api/ai/journal-summary
- Auth: guest or bearer
- Returns: structured summary

---

### Coping Plan
- POST /api/ai/coping-plan
- Auth: guest or bearer
- Returns: structured plan

---

### Auth
#### Register
- POST /api/auth/register
- Returns: JWT

#### Me
- GET /api/auth/me
- Auth: Bearer
- Returns: user profile

---

### Session Boundary

#### Upgrade History
- POST /api/session-boundary/upgrade-history
- Auth: Bearer
- Headers:
	- x-guest-id (REQUIRED)

Expected:
- 200 → success
- 401 → missing JWT
- 400 → missing guest id

---

#### CSRF Token
- GET /api/session-boundary/csrf-token
- Expected: 200