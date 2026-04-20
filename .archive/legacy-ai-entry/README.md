# Archived: Legacy AI Entry Path

**Archived:** 2026-04-20
**Reason:** Ungoverned alternate server entry and AI route handler. Bypassed
the locked contract surface (no identity gate, weaker crisis detection,
shared `default-user` memory bucket, no rate limit, no PII redaction).

## Files

- `index.js` — alternate server entry (was `server/index.js`). Imported the
  legacy `routes/ai.js`. Never executed by `npm run dev` / `npm start` /
  `node server/app.mjs`, but existed as a deploy-script foot-gun.
- `ai.js` — legacy AI router (was `server/routes/ai.js`). Substring-only
  crisis detection, no `x-guest-id` enforcement, anonymous chats collapsed
  into a single `default-user` memory bucket (PII cross-contamination risk).

## Canonical replacements (DO NOT BYPASS)

- Server entry: `server/app.mjs`
- AI router: `server/routes/ai.mjs`
- Crisis facade: `server/engine/crisisDetection.mjs`
- Identity gate: `server/middleware/auth.mjs` + `x-guest-id` header

## Restore (rollback) command

```bash
mv .archive/legacy-ai-entry/index.js server/index.js
mv .archive/legacy-ai-entry/ai.js    server/routes/ai.js
rm -rf .archive/legacy-ai-entry
```

Do not re-import these files into the running server.
