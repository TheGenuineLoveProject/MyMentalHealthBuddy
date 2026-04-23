# Canonical File Tree (Server)

> Status: **target structure**. Reflects ownership model the project converges toward.
> Files marked `(stay)` are wired and stable — leave them in place.
> Files marked `(move)` are recommended migrations (see `OWNERSHIP_MATRIX.md`).
> Files marked `(dead)` have zero importers — safe to relocate without breakage.
> No file should be deleted in this refactor; all moves are non-destructive.

## Target Tree

```
server/
  ai/                              # AI domain — decision, execution, intelligence
    orchestrator.mjs               (stay)  CORE decision engine — composition only
    provider.mjs                   (stay)  LLM execution
    openaiClient.mjs               (stay)  4-line OpenAI SDK wrapper
    aiTelemetry.mjs                (stay)  AI-call telemetry — co-located with orchestrator/provider per ownership clarification (measures model calls, tool usage, module counts, token usage, latency)
    aiClient.mjs                   (move)  ← server/utils/aiClient.mjs    [Phase 2]
    responsePolicy.mjs             (stay)  behavior contract (pure)
    providerPolicy.mjs             (stay)  provider-side policy
    scoring.mjs                    (stay)  cost + model selection
    memory.mjs                     (stay)  short-term memory
    memorySummary.mjs              (stay)  long-term compressed memory
    summarizer.mjs                 (stay)  AI summarization
    profileExtractor.mjs           (stay)  structured insight extraction
    profileStore.mjs               (stay)  profile persistence
    modules.mjs                    (stay)  module definitions
    moduleRouter.mjs               (stay)  module selection
    tools.mjs                      (stay)  tool catalog
    toolSelector.mjs               (stay)  tool selection
    toolExecutor.mjs               (stay)  tool execution
    crisisClassifier.mjs           (stay)  classifier (currently disabled flag)
    normalizeResponse.mjs          (stay)  response shape utility
    therapyFlows.mjs               (stay)  domain flows
    evolution.mjs                  (stay)  analyzeSystem (analysis only)
    safety/
      crisis.mjs                   (stay)
      guard.mjs                    (stay)
      policy.mjs                   (stay)
      sanitize.mjs                 (stay)
      safetyCheck.mjs              (move)  ← server/utils/safetyCheck.mjs   (dead)
      aiGuardrails.mjs             (move)  ← server/utils/aiGuardrails.mjs  (dead)
    system-prompts/
      mental-health-ux.txt         (stay)
      wellnessSystemPrompt.mjs     (stay)

  logging/                         # Observability sinks (write-side) — platform-wide, not AI-specific
    aiLogger.mjs                   (stay)  AI structured log sink
    safetyLogger.mjs               (stay)  safety event sink
    auditLogger.mjs                (move)  ← server/utils/auditLogger.mjs   [1 importer]
    metrics.mjs                    (move)  ← server/utils/metrics.mjs       [6 importers]
    # NOTE: aiTelemetry.mjs intentionally lives in server/ai/, not here.
    # It measures AI-call shape (model, tool, module, latency, tokens) and belongs to the AI domain.

  utils/                           # Low-level infra helpers (stateless, no domain)
    asyncLock.mjs                  (stay)  concurrency primitive
    asyncHandler.mjs               (stay)  express handler wrapper
    cookies.mjs                    (stay)
    envValidation.mjs              (stay)
    hash.mjs                       (stay)
    jwt.mjs                        (stay)
    logger.mjs                     (stay)  base console logger (infra-level)
    logRedaction.mjs               (stay)  redaction helper (infra-level)
    password.mjs                   (stay)
    response.mjs                   (stay)  HTTP response helpers — canonical
    responses.mjs                  (merge) → fold forbidden/notFound into response.mjs, delete after [2 importers]
    sentry.mjs                     (stay)
    stripe.mjs                     (stay)
    validation.mjs                 (stay)
    email.mjs                      (stay)  mail-sender util (distinct from routes/email.mjs)

  routes/                          # HTTP transport ONLY — no AI logic
    ai.mjs                         (stay)  delegates to ai/orchestrator (verified clean)
    ai.healing.mjs                 (stay)  dual-engine: healing
    ai.business.mjs                (stay)  dual-engine: business
    ai-dashboard.mjs               (stay)  admin dashboard
    health.mjs                     (stay)
    ...                            (stay)  all other route files

  middleware/                      (stay)  express middleware chain
  services/                        (stay)  service layer (note: contains 3 ai-named files — see ROUTE_FAMILIES.md §Services)
  db/                              (stay)  drizzle setup
  engine/                          (stay)  domain engine layer (e.g. crisisDetection facade)
  config/                          (stay)
  contracts/                       (stay)
  intelligence/                    (stay)
  insights/                        (stay)
  memory/                          (stay)  ⚠ overlaps name with ai/memory.mjs — see ROUTE_FAMILIES.md
  premium/                         (stay)
  security/                        (stay)
  validation/                      (stay)  ⚠ overlaps name with utils/validation.mjs — see ROUTE_FAMILIES.md
  shared/                          (stay)
  tests/                           (stay)
  scripts/                         (stay)
  replit_integrations/             (stay)
  lib/                             (stay)
  auth/                            (stay)
  billing/                         (stay)
  .data/                           (stay)

  app.mjs                          (stay)
  app.ts                           (stay)
  index.mjs                        (stay)  route wiring
  dev.mjs                          (stay)
  db.mjs                           (stay)
  sessionStore.mjs                 (stay)
  test.config.mjs                  (stay)
```

## Layer-Boundary Rules (enforced by review)

1. `server/routes/**` — may import from `services/`, `middleware/`, `utils/response.mjs`, `engine/`, `ai/orchestrator.mjs`. **Must not** import `openai` SDK or `ai/provider.mjs` directly.
2. `server/ai/**` — may import from `utils/`, `logging/`. **Must not** import `express`, `req`, `res`, `next`, or any `routes/`.
3. `server/logging/**` — may import from `utils/`. **Must not** import from `ai/` or `routes/` (avoids cycles).
4. `server/utils/**` — leaf nodes. **Must not** import from `ai/`, `routes/`, `services/`, or `logging/`.
5. `server/services/**` — orchestration layer between routes and ai/db. May import from `ai/`, `db/`, `utils/`, `logging/`.

## Files NOT in this tree

The audit also surfaced these top-level subdirs whose ownership boundary is fuzzy:
`engine/`, `intelligence/`, `insights/`, `memory/` (server-level), `validation/` (server-level), `premium/`, `lib/`. They are stable and out of scope for this refactor; flagged for a future ownership pass.
