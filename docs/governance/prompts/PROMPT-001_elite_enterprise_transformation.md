# PROMPT-001 — Elite Enterprise Platform Transformation

**Type:** Reusable Prompt Template (archived, not executed)
**Date Archived:** 2026-05-05
**Kernel Reference:** MMHB v7.4 §11 Prompt Registry, §7 Metacognitive Governance, §3 Domain Model
**Status:** Archived — applicability gated (see §Applicability below)

---

## 1. Purpose

A comprehensive 9-domain (A→I) prompt template for performing 360° architectural assessment and transformation roadmapping of mid-to-large enterprise platforms. Covers Strategic, UX, Application, Data, Infrastructure, Security, Observability, Integration, and Engineering Culture layers. Outputs Current State assessment, Target State blueprint, Gap Analysis, and 5-phase Execution Roadmap.

---

## 2. Applicability — CRITICAL

**This prompt assumes a "typical enterprise legacy" profile** (multi-region, Kubernetes, microservices, MuleSoft/Salesforce/SAP, dedicated Platform/SRE teams, FinOps practice, etc.).

**MMHB does not match this profile.** MMHB is:

| Dimension | MMHB Reality | Prompt Assumption |
|---|---|---|
| Compute | Replit Autoscale (single deploy) | Multi-region Kubernetes |
| Frontend | Single React 18 SPA + Vite | Micro-frontends, SSR |
| Data | Single Neon Postgres + Drizzle | Lakehouse, Snowflake, vector + graph + time-series |
| Team | Solo founder + AI assistance | Platform Team, SRE org, stream-aligned squads |
| Integration | Stripe, OpenAI, Resend, Oura | Salesforce, SAP, MuleSoft, ESB |
| Compliance | Educational/wellness scope | SOC2, HIPAA, PCI-DSS multi-jurisdiction |

**Per §7 Metacognitive Governance (Hype Inflation Rejection):** Executing this prompt verbatim against MMHB would generate **fabricated analysis** — recommending Kafka clusters, Backstage portals, Istio service mesh, and 24-month roadmaps for a platform that needs none of them. This violates §12 ("No speculation. No hypotheticals. Only verified, executed, confirmed changes.") and §2 Primary Law domain separation.

**Use this prompt only when:**
1. MMHB has scaled to >10 engineers AND >100k MAU AND multi-region need is proven
2. OR the prompt is being applied to a different, larger client platform
3. OR a specific domain (A-I) is being audited in isolation with MMHB-scaled defaults substituted

**Do not use this prompt for:**
- Routine MMHB feature work
- Bug fixes (use kernel §4 Engine Model — smallest valid engine)
- Single-domain investigations (use the focused analysis already at `.local/platform-deep-dive-360.md`)

---

## 3. Prompt Body (Verbatim — Do Not Edit Without Version Bump)

> **SYSTEM ROLE ASSIGNMENT**
>
> You are engaged by a mature organization to perform a comprehensive 360-degree architectural assessment and transformational redesign of their existing digital platform.
>
> **Goal:** Evolve the current state ("Platform A") into a magnificent, world-class, future-proof enterprise platform ("Platform Z").
>
> **Operational Directive:** If specific details about the current platform are not provided, state assumptions clearly and proceed with a "typical enterprise legacy" profile. Do not halt the analysis waiting for perfect information.

### Phase 1 — Current State Assessment (360° Discovery)
Assess across 9 domains. Label assumed details with `[ASSUMPTION]`.

- **A. Strategic & Business Alignment** — business model, personas (B2E/B2C/B2B/Partner), compliance (GDPR/CCPA/SOC2/HIPAA/PCI/ISO 27001), geographic footprint, innovation velocity vs. tech debt.
- **B. UX & Interface Layer** — frontend pattern (SPA/MFE/SSR), mobile (Native/RN/Flutter/PWA), desktop (Electron/Tauri), design system maturity (tokens, WCAG 2.2), Core Web Vitals, i18n.
- **C. Application & Business Logic** — architecture (Monolith/Distributed/Microservices/Serverless/EDA), DDD maturity, API strategy (REST/GraphQL/gRPC/Async/WS), state management, workflow orchestration, code quality gates.
- **D. Data & Intelligence** — OLTP, OLAP/lakehouse, specialized stores (graph/TS/search/vector), data governance, ETL/ELT, AI/ML infra (feature stores, registries, MLOps, LLM/RAG strategy).
- **E. Infrastructure & Platform** — cloud strategy, compute (K8s/Serverless/Containers/VMs), IaC (Terraform/Pulumi/CDK), GitOps, networking (CDN/edge/service mesh), storage.
- **F. Security & Trust** — IAM (SSO/MFA/RBAC/ABAC/JIT), secrets management, AppSec (SCA/SAST/DAST/IAST/SLSA), data security, runtime protection, compliance posture.
- **G. Observability & Operations** — telemetry (metrics/logs/traces), APM/RUM, incident management, SRE (SLO/SLI/error budgets, chaos), FinOps.
- **H. Integration & Ecosystem** — messaging (Kafka/RabbitMQ/Pulsar), iPaaS, API management, event architecture (CDC/webhooks), third-party SaaS, partner/dev ecosystem.
- **I. Engineering Culture & Delivery** — SDLC maturity, DX (inner loop, dev containers), CI/CD (DORA metrics), team topologies, knowledge management (ADRs, runbooks).

### Phase 2 — Target State ("Platform Z")
Resilient (99.99%+, self-healing, anti-fragile), Scalable (linear cost, multi-region active-active), Intelligent (AI-Native, LLM-augmented), Secure (zero-trust, verified supply chain), Agile (multiple deploys/day, progressive delivery), Cost-Efficient (FinOps-embedded), Sustainable (carbon-aware), Developer-Centric (golden paths, low cognitive load).

For each of A-I, deliver: **(1) Target Architecture Blueprint** with Mermaid C4 diagrams, **(2) Opinionated Tech Stack Recommendations** with rationale, **(3) Key Patterns** (Circuit Breaker, Saga, CQRS, Strangler Fig, Canary, Backstage).

### Phase 3 — Gap Analysis & Transformation Strategy
Per-domain gap identification, migration patterns (Strangler Fig, Modular Monolith extraction, Blue/Green DB migration, CQRS read-model, dual-write), risk matrix (Technical/Org/Financial/Operational with probability × impact × mitigation), dependency mapping (sequenced vs. parallelizable).

### Phase 4 — Execution Roadmap (5 Phases × 24+ Months)
1. **Foundation (M0-6)** — Platform Team, IaC baseline, observability, security guardrails
2. **Unification (M6-12)** — API Gateway, Event Bus, Design System, Data Platform
3. **Modernization (M12-18)** — Strangler Fig decomposition, MFE, MLOps + LLM
4. **Optimization (M18-24)** — FinOps, multi-region, chaos, perf tuning
5. **Innovation (M24+)** — AIOps, predictive scaling, gen-AI native features

Each phase: OKRs, timeline (quarters), resource/skill requirements, quick wins, go/no-go gates.

### Output Format Requirements
1. Executive Summary (1-page TL;DR for C-Suite/Board)
2. Structured Markdown with Current vs. Target tables
3. Mermaid diagrams (System Context, Container, Deployment)
4. Opinionated defaults (no "it depends" without recommended path + trade-offs)
5. Assumption transparency (`[ASSUMPTION: ...]` brackets)
6. "First 90 Days" tactical kickoff (week-by-week)

### Initiation Protocol
Acknowledge mandate immediately. May ask up to 3 high-yield clarifying questions. Otherwise proceed with full analysis using reasonable enterprise assumptions for mid-to-large scale platforms.

---

## 4. MMHB-Specific Substitution Map (If Ever Executed)

If a future operator does choose to run this prompt against MMHB (against §7 guidance), they MUST substitute these defaults so the output stays grounded in reality, not fabricated:

| Prompt Domain | MMHB Substitution |
|---|---|
| A. Strategic | Solo-founder wellness platform; B2C only; educational scope (no clinical claims); single-region (Replit Autoscale); GDPR + CCPA aware, not certified |
| B. UX | React 18 SPA + Vite; PWA-ready (no native mobile); Lumi Design System v2; Aurora Token System; WCAG AA target |
| C. App | Modular monolith (Express.mjs); REST + Zod validation; JWT auth; TanStack Query state; no DDD bounded contexts; Vitest coverage TBD |
| D. Data | Single Neon Postgres + Drizzle ORM; pgvector for embeddings (planned); no warehouse/lakehouse; no MLOps platform — direct OpenAI API + Perplexity |
| E. Infra | Replit Autoscale (no K8s, no Terraform); object storage via Replit; built-in TLS; no service mesh |
| F. Security | Replit Auth + JWT; Helmet + CSP; rate limiting; secrets via Replit Secrets; no Vault; no SLSA pipeline |
| G. Observability | OpenTelemetry tracing + PagerDuty alerting; basic health endpoints; no Prometheus/Grafana; no SLO formalization yet |
| H. Integration | Stripe (billing), OpenAI (chat), Resend (email), Perplexity (factual), Oura/Google Fit/Whoop/HealthKit (biometric); no Kafka, no iPaaS |
| I. Culture | Solo + AI-assisted; no team topologies; ADRs in `docs/adr/`; runbooks ad-hoc |

---

## 5. Decision: Why Archived, Not Executed

Per kernel §8 Execution Discipline:

| Step | Status |
|---|---|
| 1. Diagnose with evidence | ✅ Prompt analyzed against MMHB profile — 9/9 domain mismatches |
| 2. Smallest patch | ✅ Archive prompt + register; do not generate fabricated 24-month enterprise roadmap |
| 3. Screenshot verify | N/A (documentation-only change) |
| 4. Build check | ✅ `Start application` running, `/api/health` 200 |
| 5. Next blocker | ⏸ Awaiting user direction: archive only, or execute with substitutions |

Per §12: This response contains no fabricated analysis. The prompt is preserved verbatim for future use, with explicit applicability gates so it is never silently misapplied.

---

## 6. References

- **Existing MMHB-scoped analyses** (already correctly sized for this platform):
  - `.local/platform-analysis-full.md`
  - `.local/platform-deep-dive-360.md`
  - `.local/platform-architecture-360.md`
- **Kernel:** `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- **First incident:** `docs/governance/incidents/INC-001_learning_library_loop.md`

---

**End of PROMPT-001.**
