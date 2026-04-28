# ADR-0001 — Modular Monolith → Strangler Fig Progressive Extraction

- **Status:** Proposed
- **Date:** 2026-04-28
- **Deciders:** MMHB Platform Engineering (TGLP) — pending sign-off by founder/owner
- **Consulted:** Route Inventory (Week 1 / Task 1A), `content/strategy/platform-z-transformation.md`
- **Informed:** All future feature contributors (this ADR sets the default architectural posture)
- **Tags:** architecture, platform, extraction, strangler-fig, evolutionary-architecture
- **Supersedes:** —
- **Superseded by:** —

---

## Context and Problem Statement

MyMentalHealthBuddy (MMHB) today is a single Express monolith. The Week 1 / Task 1A route inventory measured the surface area at:

- **141 router files** under `server/routes/`
- **895 endpoint definitions** (`router.<method>(...)` calls)
- **128 routers actively mounted** through three different paths in `server/app.mjs` (direct identifier mounts, `ADMIN_SUB_ROUTERS`, and `EXTENDED_ROUTES`)
- **13 orphan routers** that exist in the repo but are never mounted in production
- **~3% router-level test coverage** (only `ai`, `auth`, `journal`, `mood`)
- **A 745-line legacy parallel entrypoint** (`server/index.mjs`) that imports many of the same routers redundantly and is not booted in production
- A growing surface of **safety-critical** domains (crisis routing, awareness detection, billing/Stripe webhooks, biometrics with PHI-adjacent data, the agent orchestrator with constitutional gate) co-resident in the same process as ~50 cognitive/wisdom/philosophy content routers

The platform works. Users are served. The Aurora design tokens, BuddyAvatar, AI orchestrator, awareness pipeline, protocol executor, and biometric ingestion pipeline are all live and tested in production. **Nothing is on fire.** This is exactly the right moment to make a deliberate architectural decision rather than a panicked one.

The question we need to answer:

> **Do we rewrite, decompose aggressively, or layer evolutionary platform engineering on top of what exists?**

Three options were considered.

---

## Decision Drivers

1. **Safety-first.** This is a mental wellness platform. Crisis routing, PHQ-9 item-9 escalation, and constitutional-gate enforcement cannot regress for a single user, ever. Big-bang rewrites have a notoriously poor track record on this dimension.
2. **Solo-builder reality.** Effective engineering bandwidth is one human plus AI assistance. Capital-A Architecture must respect that we don't have a team to staff three parallel rewrites.
3. **Working code is an asset.** The orchestrator, awareness pipeline, protocol executor, biometric ingestion service, and Lumi design system represent thousands of hours of debugged, tested, deployed code. Throwing that away to chase architectural purity is the textbook anti-pattern Joel Spolsky named "[Things You Should Never Do](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/)".
4. **Evolutionary > revolutionary.** Martin Fowler's [Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html) pattern (named after the Australian fig that grows around a host tree until the host is gone) is the standard, evidence-backed playbook for migrating large monoliths without downtime or feature freeze.
5. **Coupling is the actual enemy.** What hurts in the monolith today is *not* "everything is in one process" — it's that safety-critical paths and content-generation paths share the same deployment, scaling envelope, blast radius, and failure modes. We need to separate by **risk and rate-of-change**, not by "microservices because microservices."
6. **Operational maturity is finite.** Distributed systems pay an operational tax (service discovery, distributed tracing, schema-evolution coordination, partial-failure semantics). We can only afford to spend that tax on the surfaces where the benefit is concrete.

---

## Considered Options

### Option A — Big-Bang Rewrite
Pause feature work. Build a fresh service-oriented backend (NestJS / Fastify with a service-per-domain layout). Migrate functionality and cut over.

- **Pros:** Clean slate; modern patterns from day one.
- **Cons:** 6–12 month "no new value" window; high probability of subtle regressions in safety-critical paths; abandons working orchestrator/awareness/protocol/biometric code; classic [second-system effect](https://en.wikipedia.org/wiki/Second-system_effect); existential risk to the project for a solo builder.
- **Verdict: REJECTED.**

### Option B — Aggressive Microservices Decomposition
Decompose all 141 routers into ~15 microservices behind an API gateway in one push. Use a message bus for cross-service communication.

- **Pros:** Clean per-service ownership; independent scaling.
- **Cons:** Pays the full distributed-systems operational tax up front, before we know which services actually need it. Most of the 141 routers are low-traffic content/wisdom endpoints with zero scaling pressure — extracting them buys nothing and costs deployment complexity, request-tracing infrastructure, and 10× the on-call surface. Premature optimization at the architectural scale.
- **Verdict: REJECTED.**

### Option C — Modular Monolith + Strangler Fig Progressive Extraction (this ADR)
Keep the Express monolith as the host. Layer platform engineering (typed contracts, contract tests, OpenAPI generation, shared safety middleware, structured logging, request tracing) over it. Extract specific services **only** when a concrete forcing function justifies the operational tax — and extract them one at a time, behind a feature-flagged proxy, with shadow traffic and contract tests, until the new service has fully replaced the in-monolith implementation. Then delete the monolith implementation.

- **Pros:** Zero-downtime path; preserves working code; pays operational tax incrementally and only where justified; matches solo-builder bandwidth; safety-critical domains can be hardened *in place* during the modular-monolith phase before extraction; reversible at every step.
- **Cons:** Temporary complexity during transition (two implementations live behind a flag); requires discipline to actually finish extractions rather than leaving the system half-migrated forever; demands a real platform-engineering investment up front (contract tests, OpenAPI, tracing).
- **Verdict: ACCEPTED.**

---

## Decision

**We adopt Option C.**

We will **NOT** rewrite the monolith. We will:

1. **Treat the current Express app as a "modular monolith" host.** We invest in the platform-engineering scaffolding (typed contracts, contract tests, OpenAPI 3.1 generation from Zod, structured request-scoped logging, distributed-trace IDs, shared safety middleware library) that makes both the monolith *and* future extracted services correct by construction.
2. **Use the Strangler Fig pattern for extraction.** When a domain meets the extraction criteria below, we put a façade in front of it, route a percentage of live traffic to a new external service via a feature flag, run shadow traffic and contract diff for ≥ 1 week, then ramp to 100% and delete the in-monolith implementation. Each extraction is a discrete, reversible project — never multiple in flight at once.
3. **Extract only what earns it.** A domain earns extraction by satisfying *at least two* of:
   - **Independent scaling envelope** (e.g., webhooks burst 100×; chat is steady-state)
   - **Independent risk/blast-radius** (e.g., a billing bug must not silence the crisis path)
   - **Independent compliance/data-residency** (e.g., biometric PHI may eventually require regional pinning)
   - **Independent deployment cadence** (e.g., the orchestrator changes weekly while the wisdom-traditions content is immutable)
   - **Independent on-call ownership** (future state)

---

## Extraction Order (Strangler Fig sequencing)

Each extraction is its own ADR, its own roadmap quarter, its own runbook. They run **sequentially**, not in parallel, until our operational maturity supports parallelism.

### 1. Crisis Service — *first, because the stakes are highest*
- **Why first:** Safety-critical short-circuit logic (currently `server/ai/safety/crisis.mjs` + `responsePolicy.mjs`, locked from modification) deserves an isolated process with the strictest possible deployment governance, smallest possible blast radius, and dedicated SLO. A regression here is an existential incident for the brand and, more importantly, a real risk to a real user.
- **Boundary:** Pure detection (regex + classifier ensemble) + routing decision (`/crisis` deep link, hotline payload, escalation event). No PII storage. No DB. Stateless.
- **Forcing functions met:** Independent risk/blast-radius (yes), independent deployment cadence (yes — should be near-immutable after launch).
- **Extraction technique:** Route `POST /api/crisis/detect` to the new service via feature flag. Shadow-call from the existing AI chat path, diff results for 2 weeks, then make the new service authoritative. Original `crisis.mjs` becomes a thin client.

### 2. Billing Service — *second, because money + webhooks*
- **Why second:** Stripe webhooks burst, retry, and demand strict idempotency. Webhook signature verification + entitlement application sit on a critical revenue path that today shares process memory and rate-limits with chat. The billing surface (`billing.mjs`, `revenue.mjs`, `pro-features.mjs`, `webhook.mjs`, `adminBilling.mjs`) has zero router-level tests today. Extracting it forces us to build the contract test harness that future extractions will reuse.
- **Boundary:** Stripe customer lifecycle, subscription entitlement state, webhook ingestion, tier resolution. No chat, no journaling, no PHI.
- **Forcing functions met:** Independent scaling (webhook bursts), independent risk (PCI-adjacent), independent compliance (financial audit trail).
- **Extraction technique:** Strangler façade behind `/api/billing/*`. New service owns the Stripe webhook endpoint outright on day one (the webhook is naturally idempotent, so no shadow phase is needed for that path); subscription queries shadow-call for 1 week before cutover.

### 3. Biometrics Service — *third, because PHI*
- **Why third:** The biometric ingestion pipeline (Oura / Google Fit / Whoop OAuth + HealthKit HMAC webhook + manual self-report + AES-256-GCM at rest) is PHI-adjacent. As the platform grows it may require regional data pinning, BAAs, or HIPAA-grade isolation. Extracting now (while data volume is small) is far cheaper than extracting later. It also allows the 6-hour polling scheduler to scale independently of chat.
- **Boundary:** OAuth callbacks, ingestion normalizers, encryption-at-rest, polling scheduler, nervous-system inference. The data it serves to the chat path goes through a typed contract, never a shared DB read.
- **Forcing functions met:** Independent compliance (PHI), independent scaling (polling), independent risk.
- **Extraction technique:** Standard Strangler. New service owns its own database (or schema). Existing rows migrated via dual-write window.

### 4. Agent Orchestrator Service — *fourth, because change cadence*
- **Why fourth:** The orchestrator (state machine, escalation gates, constitutional gate, working memory, agent registry, decision audit log) changes weekly. The wisdom/philosophy/cognitive content routers next to it in the monolith change once a quarter. Mixing those cadences in one deployment means every orchestrator change drags every content router along for the ride. Extraction lets the orchestrator iterate freely while content surfaces remain rock-stable.
- **Boundary:** Agent registry CRUD, decision execution, state transitions, escalation, constitutional gate, working memory (Redis-backed). The chat path calls it via a typed contract.
- **Forcing functions met:** Independent deployment cadence (yes, large delta), independent on-call (anticipated future state).
- **Extraction technique:** This is the most sensitive extraction because the orchestrator is wired into the live `POST /api/ai/chat` path. We will require:
  - The Crisis Service already extracted and stable (so the chat path's safety short-circuit is decoupled from orchestrator changes)
  - The contract test harness from the Billing extraction proven on a second domain (Biometrics)
  - A 4-week shadow-traffic phase with 100% sampling, not just a percentage
  - Explicit ADR-0005 (or whatever number it lands on) before starting, gating on the above

---

## Stays in the Modular Monolith — *indefinitely, by design*

The following domains are **explicitly chosen to remain in the monolith.** They are low-coupling within their own bounded context, high-cohesion internally, and have no forcing function that would justify the distributed-systems tax. Extracting them would be premature optimization.

- **Awareness pipeline** (`awareness.mjs`, `discernment.mjs`, the rule library + ML classifier stub + LLM reasoner ensemble). Tightly coupled to chat-path latency budgets — extracting it would add a network hop on the safety hot-path, which is the exact opposite of what we want.
- **Therapeutic protocols** (`protocols.mjs`, `therapy.mjs`, the protocol executor state machine). Stateful per-session, low traffic, no independent scaling pressure.
- **Content & knowledge surfaces** (the ~50 wisdom / philosophy / cognitive / healing / contemplative content routers). Read-heavy, cacheable, immutable in shape. Zero forcing function for extraction. Most appropriate move long-term is to push them behind a CDN or a static-site generator, not to make them microservices.
- **Wellness tools, journal, mood, gratitude, gamification, badges, onboarding, insights, dashboard, community.** User-facing CRUD + analytics rollups. Standard monolith fare.
- **Auth / identity** (after Crisis is extracted, auth could theoretically follow, but the value is low because it is already a thin layer in front of Replit Integrations + JWT + GitHub OAuth, none of which scale independently).

This list is not a forever promise — it is the current decision based on the current forcing functions. Any future ADR can promote a domain off this list with evidence.

---

## Consequences

### Positive
- **Lower risk.** No big-bang cutover. Every extraction is reversible with a feature-flag flip until the moment the in-monolith implementation is deleted.
- **Preserves working code.** The orchestrator, awareness pipeline, protocol executor, biometric ingestion, and Lumi design system continue to serve users without disruption while we strengthen the foundations.
- **Incremental delivery.** Platform-engineering investments (contract tests, OpenAPI, tracing) ship value immediately to the monolith — they are not deferred to "after the rewrite."
- **Operational tax paid only where it's earned.** We don't run 15 services to manage 5 actually-independent domains.
- **Solo-builder bandwidth respected.** One extraction in flight at a time. Each extraction has a clear "done" criterion.
- **Forcing function for testing.** Each extraction's contract test harness is reusable for the next, so the test investment compounds.
- **Honest about the tradeoff.** The monolith is treated as a deliberate first-class architectural choice, not as something to apologize for.

### Negative / Risks
- **Temporary complexity during transition.** Two implementations live behind a flag during shadow phases (1–4 weeks per extraction). Requires discipline to delete the old code on schedule, not leave it indefinitely.
- **Cognitive overhead of "is this a future-extracted-service domain or an indefinite-monolith domain?"** New features need a quick decision on which side of the line they sit. Mitigated by keeping the list above current and re-reading it before starting any new domain.
- **Platform-engineering investment must come first.** Contract tests, OpenAPI generation, structured tracing, and the feature-flag/proxy infrastructure are real work. The first extraction (Crisis) cannot start until at least the contract-test harness exists. Risk: this work is invisible to users — temptation to skip it. Mitigation: explicit roadmap line items; treat it as non-negotiable infrastructure debt repayment.
- **Half-done extractions are a worse state than not started.** A Crisis Service that handles 80% of traffic with 20% still in the monolith for a year is the worst possible outcome — two surfaces to maintain, two on-calls, twice the bug budget. Mitigation: every extraction has a hard "100% cutover and old code deleted" deadline at extraction-kickoff time. If we miss it, we ramp back to 0% and ship an ADR explaining what we learned.
- **Shadow traffic costs CPU.** During shadow phases the same request is processed twice. For a low-traffic platform this is acceptable; if traffic grows we will sample shadow traffic instead.

### Mitigations (from the negatives above)
1. **Feature flags** for every extraction — instant rollback at any percentage.
2. **Shadow traffic + diff** during every cutover — ≥ 1 week (≥ 4 weeks for the orchestrator) with structured diff logged to a comparison sink before promoting a new service to authoritative.
3. **Contract tests** generated from Zod schemas, run in CI on both monolith and extracted service. A new service cannot become authoritative until its contract test pass rate matches the in-monolith implementation byte-for-byte on the contract surface.
4. **Each extraction has an "old code deleted" deadline** at kickoff. Slipping it triggers a roll-back, not an extension.
5. **One extraction in flight at a time** until proven otherwise.
6. **A "Service Extraction Runbook"** lives next to each extracted service's ADR, capturing the playbook so the second, third, fourth extractions get progressively cheaper.

### Neutral
- This decision creates an implicit dependency between the platform-engineering roadmap (Weeks 1–4 of `content/strategy/platform-z-transformation.md`) and the first extraction. Crisis Service extraction cannot start until the contract test harness, OpenAPI 3.1 generation, and structured tracing are in place. This is intentional and acknowledged.

---

## Compliance

This ADR will be considered satisfied when:

- [ ] The Crisis Service has been extracted, runs in its own process, and the in-monolith `crisis.mjs` implementation has been replaced by a thin client. Tracked as ADR-0003 (placeholder) with its own roadmap and runbook.
- [ ] The Billing Service has been extracted with the same criteria. Tracked as ADR-0004 (placeholder).
- [ ] The Biometrics Service has been extracted with the same criteria. Tracked as ADR-0005 (placeholder).
- [ ] The Agent Orchestrator Service has been extracted with the same criteria, *only after the prior three are stable*. Tracked as ADR-0006 (placeholder).
- [ ] No additional services have been extracted beyond the four above without a fresh ADR documenting the forcing function.
- [ ] The remaining monolith retains the domains listed in the "Stays in the Modular Monolith" section, or any change is reflected in a follow-up ADR.

---

## Related

- **ADR-0002 (next):** Decommission `server/index.mjs` (parallel legacy entrypoint, 745 lines, not booted in production) — surfaces from Week 1 / Task 1A inventory.
- **Roadmap:** `content/strategy/platform-z-transformation.md` — sequences the platform-engineering investments that unlock this ADR.
- **Inventory:** `docs/inventory/route-inventory.md` — the empirical baseline this ADR is built on.
- **External references:**
  - Martin Fowler — [StranglerFigApplication](https://martinfowler.com/bliki/StranglerFigApplication.html)
  - Sam Newman — *Building Microservices*, 2nd ed., Chapter 3 ("Splitting the Monolith")
  - Joel Spolsky — [Things You Should Never Do, Part I](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/)
  - Simon Brown — *modular monolith* talks (concept that "monolith" and "well-modularised" are not opposites)
  - MADR template — [adr.github.io/madr](https://adr.github.io/madr/)

---

_Format: [MADR 3.0](https://adr.github.io/madr/). This file lives at `docs/adr/0001-modular-monolith-to-strangler-fig.md` and is the canonical record. Any change to this decision must be made through a superseding ADR — never edited in place._
