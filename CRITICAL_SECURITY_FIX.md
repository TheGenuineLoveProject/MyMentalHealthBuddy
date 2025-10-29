# 🚨 CRITICAL SECURITY FIX REQUIRED

## Severity: **CRITICAL** 🔴

### The Problem
**All protected routes are currently using insecure header-based authentication instead of session-based authentication.**

Current vulnerable pattern:
```typescript
// ❌ INSECURE - Anyone can set this header to any userId
const userId = Sanitizer.sanitizeUserId(req.headers["x-user-id"]);
const journals = await storage.getJournalsByUserId(userId);
```

This means **anyone can access any user's data** by simply setting the `x-user-id` header to a different user's ID.

---

## The Solution

### Step 1: Apply `requireAuth` Middleware
Replace header-based userId with session-based authentication:

```typescript
// ✅ SECURE - Requires valid session
app.get("/api/journals",
  requireAuth,  // ← Add this middleware
  rateLimitMiddleware(apiRateLimiter),
  asyncHandler(async (req, res) => {
    // Get userId from authenticated session
    const userId = req.userId!;  // ← From session, not header
    const journals = await storage.getJournalsByUserId(userId);
    res.json(journals);
  })
);
```

### Step 2: Apply RBAC for Premium Features
Add tier checking for premium/professional features:

```typescript
// ✅ SECURE - Requires premium subscription
app.post("/api/analytics/export",
  requireAuth,
  requireTier('premium', storage),  // ← Add tier check
  rateLimitMiddleware(apiRateLimiter),
  asyncHandler(async (req, res) => {
    const userId = req.userId!;
    // ... export logic
  })
);
```

### Step 3: Apply CSRF Protection
Add CSRF protection to state-changing routes:

```typescript
// ✅ SECURE - CSRF protected
app.post("/api/journals",
  requireAuth,
  csrfProtection,  // ← Add CSRF check
  rateLimitMiddleware(apiRateLimiter),
  asyncHandler(async (req, res) => {
    // ... create journal
  })
);
```

---

## Routes That Need Fixing

### Immediate Priority (Data Access)
All routes in `apps/server/src/routes.ts` that use:
- `req.headers["x-user-id"]` ❌
- `Sanitizer.sanitizeUserId(req.headers["x-user-id"])` ❌

**Examples:**
- `/api/journals` (GET, POST, PATCH, DELETE)
- `/api/moods` (GET, POST)
- `/api/analytics/*` (All analytics endpoints)
- `/api/export/*` (All export endpoints)
- `/api/stripe/*` (Billing endpoints with user data)
- `/api/canva/*` (Canva integration endpoints)

### Feature Tier Requirements

#### Free Tier (All Users)
- AI Chat (with session limits)
- Basic Mood Tracking
- Crisis Resources
- Basic Journaling

#### Premium Tier
- Analytics Dashboard
- Advanced Export (CSV, JSON)
- Content Studio (basic)
- Social Calendar (basic)
- Unlimited AI sessions

#### Professional Tier
- Bulk Operations
- Automation Rules
- Advanced Analytics
- Scheduled Posts
- Canva Integration
- API Access

---

## Implementation Checklist

### Phase 1: Authentication (CRITICAL)
- [ ] Replace `x-user-id` headers with `requireAuth` middleware
- [ ] Update all routes to use `req.userId` instead of headers
- [ ] Test login flow end-to-end
- [ ] Verify unauthorized access is blocked

### Phase 2: Authorization (CRITICAL)
- [ ] Add `requireTier('premium', storage)` to premium routes
- [ ] Add `requireTier('professional', storage)` to professional routes
- [ ] Test tier enforcement with different subscription levels
- [ ] Verify upgrade messages are clear

### Phase 3: CSRF Protection (HIGH)
- [ ] Implement `generateCsrfToken` in login endpoint
- [ ] Return CSRF token to client
- [ ] Update client to send token in requests
- [ ] Add `csrfProtection` to POST/PUT/PATCH/DELETE routes
- [ ] Test CSRF protection flow

### Phase 4: Testing (HIGH)
- [ ] Test as unauthenticated user (should be blocked)
- [ ] Test as free user (limited access)
- [ ] Test as premium user (more access)
- [ ] Test as professional user (full access)
- [ ] Test CSRF token validation
- [ ] Test rate limiting

---

## Example: Complete Secure Route

```typescript
import { requireAuth, requireTier, csrfProtection } from "./lib/authMiddleware.js";
import { storage } from "../storage.js";

// ✅ FULLY SECURED ROUTE
app.post("/api/analytics/export",
  requireAuth,                      // 1. Require authenticated user
  requireTier('premium', storage),  // 2. Require premium subscription
  csrfProtection,                   // 3. Validate CSRF token
  rateLimitMiddleware(apiRateLimiter), // 4. Rate limit by user
  asyncHandler(async (req, res) => {
    // userId is from authenticated session, not headers
    const userId = req.userId!;
    
    // userSubscription attached by requireTier middleware
    const tier = req.userSubscription?.subscriptionTier;
    
    // Business logic here
    const data = await storage.getAnalyticsForExport(userId);
    res.json({ data, tier });
  })
);
```

---

## Estimated Effort

- **Phase 1 (Authentication):** 2-3 hours
  - Update ~20-30 routes
  - Test authentication flow

- **Phase 2 (Authorization):** 1-2 hours
  - Categorize features by tier
  - Apply middleware to premium/professional routes

- **Phase 3 (CSRF):** 1 hour
  - Implement token generation
  - Update client to use tokens
  - Add middleware to routes

- **Phase 4 (Testing):** 2-3 hours
  - Comprehensive testing across tiers
  - Edge case testing

**Total:** ~6-9 hours for complete security hardening

---

## Risk Assessment

### Current Risk: **CRITICAL** 🔴
- Any user can access any other user's data
- No subscription tier enforcement
- Premium features available to free users
- No CSRF protection for state changes

### After Fix: **LOW** 🟢
- Session-based authentication enforces user boundaries
- Subscription tiers properly enforced
- Premium features protected
- CSRF protection prevents cross-site attacks

---

## Questions?

**Q: Can we deploy with current security?**
A: ❌ **NO** - Current security is fundamentally broken. Any user can access any data.

**Q: Is devAuthFallback safe in development?**
A: ⚠️ **Only in development** - It's designed for testing but must never reach production.

**Q: Do we need CSRF for read-only endpoints?**
A: ❌ **No** - CSRF protection is only needed for state-changing operations (POST/PUT/PATCH/DELETE).

**Q: Can free users access premium features now?**
A: ✅ **Yes** - Which is why RBAC implementation is critical.

---

**Action Required:** Fix Phase 1 (Authentication) immediately before any production deployment.

**Updated:** October 29, 2025
**Architect:** ✅ Approved security design
**Status:** ⚠️ Awaiting route implementation
