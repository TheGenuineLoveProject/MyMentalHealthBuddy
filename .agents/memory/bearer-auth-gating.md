---
name: Bearer-auth gating contract
description: How MMHB authenticates API requests, why adding requireAuth to an existing endpoint can silently break a frontend feature, and the call-site fix.
---

# Bearer-auth gating contract

MMHB auth is **Bearer-token only**. `server/middleware/auth.mjs` `requireAuth`
reads `Authorization: Bearer <jwt>` and nothing else — there is **no cookie/session
fallback**. `optionalAuth` is the same but non-blocking. Token is minted by
`signUserToken({id,email,role})` and the route reads `req.dbUserId = decoded.id`.

The global CSRF middleware (`server/csrf.mjs`, mounted in `server/app.mjs` before
route mounts) **exempts Bearer-authenticated requests** from CSRF. So for a
Bearer-authed endpoint, `requireAuth` is the real authorization; CSRF only guards
cookie/no-token mutating requests.

## The footgun
Adding `requireAuth` to an endpoint the frontend already `fetch()`es will return
`401` and silently break the feature **unless every call site sends the token**.
Many older `fetch()` calls in `client/src` send no `Authorization` header.

**Fix:** at each call site attach the header from `getAuthToken()` (exported from
`client/src/lib/api.ts`), spread conditionally so logged-out callers don't send a
bogus header:
```js
headers: {
  "Content-Type": "application/json",
  ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
}
```
**Why conditional:** uploads/other features may be invoked before login; sending
`Bearer null` would 401. With the spread, anonymous calls correctly get denied by
`requireAuth` while authed calls pass.

**How to apply:** before gating any existing endpoint, grep `client/src` for every
`fetch("<that-path>"` and confirm each adds the bearer header. Verify with curl:
no token → 401, valid `Bearer` (mint via `jwt.sign({id,email,role}, JWT_SECRET)`
with a real UUID `id`) → 200.
