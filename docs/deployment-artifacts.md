# The Genuine Love Project - Deployment Artifacts

Generated: December 25, 2025

---

## 1. File Tree

```
├── client/                    # React frontend (Vite + TypeScript)
├── server/                    # Express backend (Node.js ESM)
│   ├── ai/                    # AI services & prompts
│   │   ├── system-prompts/    # Mental health UX prompts
│   │   ├── openaiClient.mjs
│   │   └── therapyFlows.mjs
│   ├── auth/                  # Authentication utilities
│   ├── billing/               # Stripe billing logic
│   ├── db/                    # Database layer (Drizzle ORM)
│   │   ├── migrations/
│   │   ├── queries/
│   │   ├── schema/
│   │   └── client.mjs
│   ├── middleware/            # Express middleware
│   │   ├── auth.mjs
│   │   ├── rateLimit.mjs
│   │   ├── security.mjs
│   │   └── session.mjs
│   ├── routes/                # API route handlers
│   ├── security/              # Security utilities
│   ├── services/              # Business logic services
│   ├── utils/                 # Utility functions
│   └── index.mjs              # Server entry point
├── shared/                    # Shared types & constants
│   ├── brand.mjs
│   └── schema.mjs
├── public/                    # Static assets
│   └── brand/                 # Brand assets
│       ├── logo.png           # Main logo
│       ├── logo-dark.png      # Dark mode logo
│       ├── favicon.svg
│       └── variants/          # 21 Canva design exports
├── scripts/                   # Utility scripts
├── docs/                      # Documentation
└── tests/                     # Test suites
```

---

## 2. Build Output

### Frontend (Vite + React)
```
Framework: Vite 5.x
Entry: client/src/main.tsx
Output: dist/public/
Bundle: Code-split chunks with lazy loading
Assets: Optimized images, CSS, JS

Key Dependencies:
- React 18
- TanStack Query v5
- Wouter (routing)
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
```

### Backend (Express + Node.js)
```
Runtime: Node.js ESM (.mjs)
Entry: server/index.mjs
Dev Server: server/dev.mjs (Vite integration)
Port: 5000

Key Dependencies:
- Express 4.x
- Drizzle ORM (PostgreSQL)
- jsonwebtoken (JWT auth)
- Stripe SDK
- OpenAI SDK
- Winston (logging)
- Helmet (security)
```

---

## 3. Server Logs

```
Status: RUNNING
Listening: http://0.0.0.0:5000
Health Check: /api/health
Ready Check: /api/health/ready
Live Check: /api/health/live
```

---

## 4. Routes Inventory

### Authentication (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /register | - | User registration |
| POST | /login | - | User login |
| POST | /refresh | - | Refresh JWT token |
| GET | /me | Required | Get current user |
| POST | /logout | - | User logout |

### AI Chat (`/api/ai`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /chat | Required | Send message to AI |
| GET | /history | Required | Get chat history |
| DELETE | /history | Required | Clear chat history |

### Mood Tracking (`/api/mood`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | Required | Log mood entry |
| GET | / | Required | Get mood entries |
| GET | /stats | Required | Get mood statistics |
| PUT | /:id | Required | Update mood entry |
| DELETE | /:id | Required | Delete mood entry |

### Journal (`/api/journal`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | Required | Create journal entry |
| GET | / | Required | Get journal entries |
| GET | /:id | Required | Get single entry |
| PUT | /:id | Required | Update entry |
| DELETE | /:id | Required | Delete entry |

### Billing (`/api/billing`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /plans | Required | Get subscription plans |
| POST | /checkout | Required | Create checkout session |
| POST | /portal | Required | Create customer portal |
| GET | /subscription-status | Required | Get subscription status |
| GET | /current-plan | Required | Get current plan |

### Webhooks (`/api/webhook`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /stripe | Signature | Stripe webhook handler |

### Health (`/api/health`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | / | - | Health check |
| GET | /ready | - | Readiness check |
| GET | /live | - | Liveness check |
| GET | /detailed | - | Detailed health info |
| GET | /metrics | - | System metrics |

### Additional Routes
- `/api/account` - Account management, password reset, GDPR export
- `/api/analytics` - User analytics and insights
- `/api/gamification` - XP, levels, streaks, quests
- `/api/onboarding` - User onboarding flow
- `/api/therapy` - Therapy sessions and crisis resources
- `/api/pro-features` - Premium tier features
- `/api/blog` - Blog posts and comments
- `/api/admin` - Admin dashboard (role protected)
- `/api/mfa` - Multi-factor authentication

---

## 5. Database Migration Status

```
ORM: Drizzle ORM
Database: PostgreSQL (Neon)
Status: PROVISIONED AND READY

Push Command: npm run db:push
Force Sync: npm run db:push --force

Key Tables:
- users (id, email, password_hash, role, created_at)
- sessions (JWT-based, not DB stored)
- moods (id, user_id, score, notes, created_at)
- journals (id, user_id, content, created_at)
- ai_messages (id, user_id, role, content, created_at)
- subscriptions (id, user_id, tier, stripe_customer_id, status)
- webhook_events (id, event_type, processed_at, status)
```

---

## 6. Auth Trace

### Authentication Flow
```
1. User Login
   POST /api/auth/login
   └─> Validate credentials
   └─> Generate JWT access token
   └─> Return { token, user }

2. Protected Route Access
   Request Header: Authorization: Bearer <token>
   └─> authGuard middleware (server/middleware/auth.mjs)
   └─> verifyToken() validates JWT
   └─> Attach req.user = { id, email, role }
   └─> Continue to route handler

3. Token Refresh
   POST /api/auth/refresh
   └─> Validate refresh token
   └─> Generate new access token
```

### Middleware Chain
```javascript
// server/middleware/auth.mjs

requireAuth(req, res, next)
├── Extract Bearer token from Authorization header
├── verifyToken(token) - JWT validation
├── Attach decoded payload to req.user
└── Handle errors: TokenExpiredError, JsonWebTokenError

requireRole(...roles)
├── Check req.user.role against allowed roles
└── 403 Forbidden if not authorized

requirePro(req, res, next)
├── Check subscription_status === 'pro' || 'premium'
└── 402 Upgrade required if not premium

optionalAuth(req, res, next)
├── Attach user if token present
└── Continue regardless (no error)
```

---

## 7. Stripe Webhook + AI Route + Prompt + Fallback

### Stripe Webhook Handler
**Location:** `server/routes/stripeWebhook.mjs`

```javascript
// Webhook endpoint
POST /api/webhook/stripe

// Signature verification
stripe.webhooks.constructEvent(req.body, sig, webhookSecret)

// Idempotency check
isEventProcessed(eventId) -> webhook_events table

// Handled Events:
- checkout.session.completed -> Create/update subscription
- customer.subscription.created -> Update user tier
- customer.subscription.updated -> Update subscription status
- customer.subscription.deleted -> Downgrade to free
- invoice.paid -> Log successful payment
- invoice.payment_failed -> Mark subscription past_due
```

### AI Chat Route
**Location:** `server/routes/ai.mjs`

```javascript
// Chat endpoint
POST /api/ai/chat
Auth: Required (authGuard)

// Flow:
1. Crisis Detection (14 keywords)
   - Returns CRISIS_RESPONSE with resources
   - Logs crisis event

2. Conversation History
   - Fetches last 10 messages from ai_messages table

3. OpenAI Chat Completion
   - System prompt + history + user message
   - Temperature: 0.8, Max tokens: 500

4. Fallback Response (if OpenAI fails)
   - Graceful degradation message
   - Offline mode indicator
```

### System Prompt
**Location:** `server/ai/system-prompts/mental-health-ux.txt`

```
Role: Trauma-informed AI wellness companion

Core Principles:
1. Validation - Acknowledge feelings without judgment
2. Curiosity - Gentle, optional questions
3. Clarity - Reflect in simple words
4. Safety - No urgency, no pressure
5. Direction - Tiny optional next steps

Boundaries (NEVER):
- Diagnose or name conditions
- Recommend medication
- Provide crisis instructions
- Give treatment plans

Language Rules:
- Warm, human tone
- Short sentences
- Plain language
- No clinical terms
```

### AI Fallback Response
```javascript
// When OpenAI is not configured:
"I'm here with you. You are not alone. (AI is currently in offline mode)"

// When OpenAI fails:
"I'm here with you. While I'm having a brief moment of difficulty, 
please know that you are not alone. Would you like to share more 
about how you're feeling?"
```

### Crisis Response
```javascript
const CRISIS_RESPONSE = {
  isCrisis: true,
  reply: `I hear you, and I'm genuinely concerned...
          **National Suicide Prevention Lifeline**: 988
          **Crisis Text Line**: Text HOME to 741741`,
  resources: [
    { name: "National Suicide Prevention Lifeline", contact: "988" },
    { name: "Crisis Text Line", contact: "741741" }
  ]
};

// Crisis keywords (14 total):
"kill myself", "end my life", "suicide", "suicidal", "want to die",
"don't want to live", "hurt myself", "self-harm", "cut myself",
"overdose", "end it all", "no reason to live", "better off dead"
```

---

## Deployment Configuration

```javascript
// .replit deployment
deployment_target: "autoscale"
run: ["node", "server/index.mjs"]

// Health endpoints for load balancer
GET /api/health       -> { status: "ok" }
GET /api/health/ready -> { ready: true }
GET /api/health/live  -> { alive: true }
```

---

*Generated for The Genuine Love Project - Live in Genuine Love*
