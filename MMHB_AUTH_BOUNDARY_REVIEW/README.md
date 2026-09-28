# MMHB authentication boundary review

## Scope
Candidate commit reported by the user: `63ff8372d07368a5434c11ff58bdf87bb468449d`.

The `sources/` directory was reconstructed from contiguous numbered terminal-output lines in user uploads. Line numbers were removed and final newlines normalized. These are not direct reads from Replit, nor a full repository checkout. The source hashes identify the test inputs, not independent proof of their correspondence to repository blobs.

This review covers:
- `server/security/csrf.mjs`
- `server/replit_integrations/auth/routes.mjs`
- `server/middleware/auth.mjs`
- `server/replit_integrations/auth/replitAuth.mjs`

## Execution
Executed in the ChatGPT container with Node.js v22.16.0 (the user's reported runtime is Node 24). No dependencies were installed, no database or application server was started, and the tests made no network calls. The harness loads the module bodies in VM contexts with explicitly supplied imports. Node's built-in crypto and URL parsing are real. JWT, Passport, express-session, connect-pg-simple, storage, provider discovery/refresh, logger, and email dependencies are mocks. Requests and responses are test doubles, not real Express requests.

Reproduce locally with an appropriate Node installation:

```sh
node --experimental-vm-modules review.mjs
```

There are 63 behavior checks and 4 mutation-detection checks. All 67 assertions completed successfully. **Some checks assert that a problematic behavior exists; PASS in results.json means the observed behavior matched that assertion, not that the application is secure.** No production exploit or complete runtime session invalidation was demonstrated.

## Material observations

1. Generic CSRF scope differs for lowercase and uppercase API prefixes. A synthetic POST `/api/private-probe` without a CSRF token is rejected; `/API/private-probe` calls `next()`. These are test paths, not claims about mounted routes. Route reachability, Express case sensitivity, and per-route protections must be inspected before declaring application-level exploitability.
2. The `/api/auth` prefix is checked case-insensitively before generic header exemptions. The ordinary matching-origin, foreign-origin, invalid-Origin, Referer fallback, missing-header, and Fetch Metadata paths behave as recorded in the matrix. A `same-origin` Fetch Metadata value with no Origin is an early allowance before target-host validation; this is a policy/trust assumption, not evidence that a foreign browser can forge that header.
3. Generic CSRF exemptions advance for an unverified `x-guest-id` or a syntactically prefixed `Bearer` header. A separate `requireAuth` invocation still rejects a missing/invalid bearer token. Thus these are CSRF-scope observations, not authentication bypasses. Browser CSRF exposure also depends on CORS and cookie-authenticated route handling.
4. `/api/auth/user` looks up and returns an OIDC identity with missing, zero, or nonnumeric `expires_at`, whereas the dedicated `isAuthenticated` path denies those same constructed session identities. Test storage and refresh were mocked. This is a consistency defect demonstrated in handler logic; creation/reachability of malformed stored sessions is not established.
5. The profile route forwards the storage object's fields without projection. A synthetic `passwordHash` field supplied by the mock reaches the response. Actual storage contents have not been supplied, so real password-hash or other secret exposure is NOT confirmed.
6. `requireAuth` consumes bearer JWTs, not the OIDC cookie session. Removing a cookie session does not alter its decision when JWT verification supplies the same valid fixture result. There is no revocation-store call in this middleware. Overall logout semantics depend on local token issuance, refresh and revocation code not yet supplied.
7. JWT verification receives no explicit issuer/audience/algorithm options in the examined call sites. The mock also demonstrates missing application claim validation, such as a required user id. This review does not test JWT cryptography or prove a forged token can pass the real library.
8. Actual origin predicate plus actual OIDC logout handler were combined, with external services and session callbacks mocked: same-origin POST invokes logout/destruction; foreign or absent signals are rejected before those calls.

## Next source set
The separate `MMHB_AUTH_INTEGRATION_COLLECT.py` collects nine literal files from the pinned recovered commit and verifies matching working-file bytes. These cover middleware mounting/CORS/proxy settings, storage projection, local login/logout/refresh, frontend credential cleanup, and existing frozen-source tests. It creates only a private source report, not an application patch. No repeated recovery/backup/export of Git ancestry is needed.

## Release status
Restoration and backup successes come from earlier user-provided logs. This review does not recheck those operations. Fresh builds, real database/session integration, authenticated credential replay, production-mode/proxy tests, independent CI, and deployment verification remain unqualified here.
