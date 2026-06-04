# Shell Command Manager (SCM) — Governance Specification

> **Phase:** H2.16 · **Mode:** GOVERNANCE / DESIGN ONLY — no runtime code, no executor implemented.
> **Status:** spec-only · **Version:** 1.0.0
> **Governed by:** MMHB v7.4 Archival Kernel (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`).

The SCM is a **non-autonomous, human-approved** manager that can *propose, sequence, and verify* shell commands but **must never execute destructive commands automatically**. This document specifies its governance only; nothing here is executed and no executor is built in this phase.

---

## Core principles

- **Shell-first** — prefer mechanical shell work; AI for logic/sequencing only.
- **Human approval required** before ANY execution — non-autonomous by construction.
- **No autonomous delete/move/refactor.**
- **Verification-first** — every batch ends in a verification gate.
- **Rollback-safe** — every executed step must be revertible (checkpoint or inverse command).
- **No secrets** printed or interpolated into commands/logs.
- **One phase at a time** — no multi-blocker fan-out.
- **Replit-safe** execution only.
- **Domain separation preserved** — no auth/healing/crisis/journal/provider/billing/admin/chat runtime changes; no business logic in healing flows.

---

## 1. Command queue model

An ordered, **append-only** queue. The manager NEVER auto-executes: it proposes, a human approves, then a **single** approved step runs, is verified, and the result gates the next step.

**Queue item fields:** `id`, `createdAt`, `proposedBy`, `intent`, `command`, `workingDir`, `classification`, `domainTouched`, `requiresApproval`, `approvalState`, `approvedBy`, `dependsOn[]`, `rollback{strategy,inverseCommand,checkpointRef}`, `verification{gate,command,expected}`, `executionState`, `result{exitCode,startedAt,finishedAt,stdoutDigest,stderrDigest}`.

**Lifecycle:** `PROPOSE → APPROVE/REJECT → EXECUTE → VERIFY → GATE`.

**Invariants:**
- At most **one** item executing at a time (no parallel mutation).
- An item runs only if `approvalState=approved` **and** all `dependsOn` succeeded.
- `destructive-blocked` items can **never** be approved here — routed to a human-only escalation path.
- A failed verification gate **freezes** the queue; no further auto-progress.

---

## 2. Allowed commands

**Read-only (diagnosis; still logged):** `ls`, `pwd`, `cat/head/tail`, `rg`, read-only `grep`/`find`, `git --no-optional-locks status/diff/log`, read-only analyzer scripts, `md5sum/sha256sum`, `wc/stat/du/df`, route-health `curl -s -o /dev/null -w '%{http_code}'`.

**Mutating (require explicit approval):** `node scripts/storage/auditStorageUsage.mjs`, `npm run build`, `npm run verify:all`, single-file edits via the file tools, additive `mkdir`/`touch`.

> **Allowed ≠ automatic.** Every mutating command still requires explicit human approval.

---

## 3. Blocked dangerous commands

**Policy:** NEVER executed under any approval state. Recognized, refused, and routed to a human-only manual path with out-of-band confirmation.

- `rm -rf` / `rm -r` / any recursive or force delete
- `mv`/rename of existing tracked files (destructive move)
- **All destructive git:** `commit`, `add`, `reset`, `restore`, `checkout`, `clean`, `rebase`, `revert`, `rm`, `push --force`, `filter-branch`, `reflog expire`, `gc --prune`, `update-ref -d`, `init`
- `chmod -R`, `chown -R`
- `kill -9` of platform-managed workflow PIDs / broad `pkill`
- `DROP/TRUNCATE/DELETE` SQL, `npm run db:push --force` (data-loss)
- edits to `package.json`, `vite.config.*`, `server/vite.ts`, `drizzle.config.ts`, `.replit`
- `curl | sh`, `wget | bash` and any download-piped-to-interpreter
- fork bombs
- anything that echoes/interpolates secret or env values
- anything touching auth/healing/crisis/journal/provider/billing/admin/chat runtime code

**Escalation:** A blocked command produces a refusal record + a human-only proposal note. The platform's **auto-checkpoint** and (where required) a **background Project Task** are the only sanctioned routes for destructive git operations.

---

## 4. Approval gates

Two-key, human-in-the-loop: agent proposes; human approves; only then does a single step run.

| Gate | Rule |
|---|---|
| **G0 classification** | Classify read-only/mutating/destructive-blocked *before* proposal. Misclassification = fail-closed (treat as destructive-blocked). |
| **G1 human-approval** | Mutating commands require explicit human approval. No implicit/time-based approval. |
| **G2 dependency** | Item runs only when all `dependsOn` items succeeded. |
| **G3 single-flight** | Only one mutating command executes at a time. |
| **G4 destructive-refusal** | `destructive-blocked` commands cannot be approved here; human-only out-of-band path required. |

Approvals are scoped to a single item and **expire** if the queue context changes (new dependency, edited command).

---

## 5. Verification gates

Order: **build → verify:all → route-check.**

| Gate | Command | Pass condition |
|---|---|---|
| build | `npm run build` | ✓ built (no TS/bundler errors) |
| verify:all | `npm run verify:all` | `Summary: NNN pass, 0 fail` (warns allowed, e.g. pre-existing copyright WARN) |
| route-check | `curl 127.0.0.1:5000<path>` | all **200** for `/ /blog /about /features /pricing /healing /journal /chat /tools /crisis` |

A batch is GREEN only if all applicable gates pass. Any failure **freezes** the queue and surfaces the failing gate to the human.

---

## 6. Rollback rules

| Strategy | When | How |
|---|---|---|
| **checkpoint** | default for any file mutation | Rely on Replit auto-checkpoint; record commit id; revert by suggesting rollback to it. |
| **inverse-command** | additive shell mutation with a clean inverse | Store `inverseCommand` (e.g. created dir → `rmdir` of that exact dir). Inverse must itself be non-destructive and approved. |
| **none-needed** | read-only command | No rollback required. |

**Invariants:** no step executes unless a rollback strategy is recorded; rollback never uses blocked destructive commands (checkpoint preferred); a failed step that left partial state must be rolled back before the queue resumes.

---

## 7. Logging format

- **Sink:** `codex/automation/logs/scm-<date>.jsonl` (append-only; created in a **future** implementation phase, not now).
- **Redaction:** secrets/env values are **never** logged; stdout/stderr stored as digests with secret-like tokens masked.
- **Record:** `{ ts, id, event(propose|approve|reject|execute-start|execute-end|verify|gate-pass|gate-fail|rollback|refuse), classification, command(secret-free), exitCode, gate, outcome, checkpointRef, note }`.
- **Output contract** (per kernel): *What changed (files+lines) / Before / After / Build status / Next step.* No speculation.

---

## 8. Replit-safe workflow

**Constraints baked into the design:**
- `git commit`/`add` and all destructive git are **blocked for the main agent**; the platform **auto-checkpoints** after each loop — treat checkpoints as the commit mechanism.
- Background servers launched from the shell are **reaped** when the call returns (exit 143). Use the platform-managed `Start application` workflow for a persistent server; run route checks against `127.0.0.1:5000`.
- Port 5000 is owned by the dev workflow and auto-reclaimed — do not fight it with `kill`/`pkill`.
- Never edit `package.json`, `vite.config.*`, `server/vite.ts`, `server/app.mjs`, `.replit`, `drizzle.config.ts`.
- DB schema changes go through Drizzle + `npm run db:push` (never hand-written SQL); `--force` only with explicit approval (data-loss).
- Secrets are platform-managed; never echo or interpolate them.

**Execution loop:** propose (agent) → approve (human) → run ONE step → verify (build/verify:all/route-check) → gate → next. **Stop on any red.**

---

## 9. CODEX integration points

- **Inputs:** `codex/storage/*.json` (audit, hotspots, candidates, blockers, remediation plan) as the command source-of-truth for storage-guard passes; `scripts/storage/auditStorageUsage.mjs` as the canonical regeneration command.
- **Outputs:** this spec (`codex/automation/shellCommandManagerSpec.{json,md}`); future `codex/automation/logs/*.jsonl`; regenerated `codex/storage/*.{json,md}` when a guard pass mutates runtime code.
- **Alignment:** the SCM formalizes exactly the one-file, verify-after-each-step storage-guard passes already performed in H2.8–H2.16 into an approved, logged, rollback-safe queue.

---

## 10. Future implementation plan

> Implementation is **not** part of this phase. Sequenced for future, separately-approved phases; each ends GREEN (`verify:all` 0 fail) and is independently rollback-safe.

| Phase | Title | Scope |
|---|---|---|
| **F1** | Schema + validators | Encode queue-item schema + classifier as a pure, tested module. No execution. |
| **F2** | Dry-run proposer | Generate a proposed queue from a codex plan WITHOUT executing; output a human approval sheet. |
| **F3** | Approval ledger | Append-only approval/refusal log + redacted logging sink. Still no execution. |
| **F4** | Single-flight executor (guarded) | Execute ONE approved, non-destructive step, then run the verification gate. Hard-refuse blocked patterns. Checkpoint rollback. |
| **F5** | Route + build gate integration | Wire build/verify:all/route-check as automatic post-step gates that freeze the queue on red. |

---

**Scope note:** Governance/design only. No runtime code modified, no executor built, no command run by the manager. Companion machine-readable spec: `codex/automation/shellCommandManagerSpec.json`. Crisis routing and business↔healing separation are unaffected.
