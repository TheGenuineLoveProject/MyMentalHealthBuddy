# OpenAI request deadline repair decision ledger

Application: MyMentalHealthBuddy. Assessment followed by implementation.
Current integration: official OpenAI Node SDK 6.49.0; existing Chat Completions clients.
Selected integration: preserve the existing SDK, configured Replit credentials/base URL, model selection and public response envelopes.

## Scope and decision receipt

The user selected **Reuse existing Replit setup (Recommended)** in response to the credential choice for the repair and offline tests. No new key, secret write or live API request is authorized by this test plan. Tests supply synthetic keys and intercept fetch; they never use an application credential.

The approved repair covers existing application deadlines in `server/ai/provider.mjs` (12 seconds per attempt) and `server/utils/aiClient.mjs` (15 seconds per attempt). These wrappers currently reject their Promise.race while the underlying SDK work can continue. The single implementation stage aborts the transport and awaits settlement before application retry, disables the SDK's additional retry loop per request, and clears the application timer after the complete SDK promise settles, including response-body parsing.

This is request lifecycle maintenance. It is not a Responses API or model migration. Application retry counts, fallback order, backoff/classification, instructions, output-token configuration, token telemetry, state and circuit-breaker envelopes remain the compatibility contracts. An abort-ignoring custom transport cannot guarantee both a hard deadline and settled, non-overlapping retries; the supported official SDK/fetch path is the validation target. Aborting client transport is not evidence that provider-side inference or billing stopped.

## Feature stage

| Stage | Deliverable | Dependencies | Authorization | Status |
|---|---|---|---|---|
| Existing request deadline lifecycle | Cancel expired SDK transports, avoid nested SDK retries and retain existing caller results in both wrappers | Official SDK request options; synthetic fetch/fake timers; existing CI | Approved by continued repair request and explicit credential reuse choice | Implemented; 25 focused tests pass; complete suite is required in PR CI |

No further API migration stage is approved in this bounded repair. Higher-lift features below require their own product/privacy decisions before implementation; they are not silently implemented by this maintenance change.

## Workload and boundary inventory

| Boundary | Existing behavior | This stage |
|---|---|---|
| Mounted `/api/ai/chat` -> orchestrator -> provider | Buffered conversation, scored model override or AI_MODEL/gpt-4o-mini, optional mini fallback; three application attempts per model | Preserve payload and `{ok, modelUsed, latency, reply}` / `{ok:false,error}`; repair each existing 12s attempt |
| `chatCompletion` shared helper, including route callers | Configured AI_INTEGRATIONS key/base URL or OPENAI key; gpt-4o-mini default, max_tokens, transient-error backoff and circuit breaker | Preserve `{success,content,usage}` / failure/circuit fields; repair each existing 15s attempt |
| Crisis classifier | Separate Chat Completions helper; orchestrator feature flag is false in reviewed source | No new classifier timeout or behavior introduced |
| Summarizer | Buffered gpt-4o-mini internal workload, returns empty string on failure and records token usage | No API migration or budget changes introduced |
| Profile extractor | gpt-4o-mini, JSON-object response and local schema coercion | No schema, storage or request policy changes introduced |
| Other AI utility/client imports | Existing callers remain on their configured clients | No claim that every AI route has a new overall deadline |

The per-attempt deadlines do not bound the complete orchestrated route: retries/fallback and other workloads remain separate. The main provider can still make up to six sequential application attempts when primary and fallback models differ.

## Capability review

Applicable/support flags describe this bounded repair and current source evidence. Unknown product requirements remain explicit rather than becoming new defaults.

| Guidance heading | Applicable to repair | Support/current state | Decision and evidence |
|---|---|---|---|
| Model Selection | Preserve | Existing gpt-4o-mini/gpt-4o and configured overrides | Already present; no model change or live model-availability claim |
| Instruction File Naming | No | Existing repository conventions | Not applicable; no instruction files renamed or added |
| Migrate from Chat Completions to Responses API | No | SDK supports Responses; current workloads use Chat Completions | Not part of the approved lifecycle repair; no endpoint migration |
| Streaming | No | These wrappers buffer a completion | Existing buffered behavior retained; streaming would change callers |
| WebSocket Mode | No | Current invocation is ordinary HTTP | Not applicable to existing deadline wrapper repair |
| Data Privacy and Residency | Preserve | Existing configuration; formal requirements not established here | No endpoint, logging payload or retained-state changes |
| Zero Data Retention | Unknown requirement | No new storage or cache fields | Not asserted; store:false alone would not establish ZDR |
| Data Residency | Unknown requirement | Existing Replit/provider endpoint retained | No region changes or residency certification |
| Processing Tiers | No change | No service_tier is currently set by these wrappers | Existing default retained; no price/tier selection |
| Standard / Priority / Flex / Batch / Reserved | No change | Interactive existing buffered chat; other internal workloads inventoried above | No processing-tier migration in this stage |
| Prompt Caching | No change | Existing prompts and usage accounting | No cache parameter or prompt rewrite |
| Prompt Cache Keys | No change | Not set by these wrappers | No new identifiers or cache policy |
| Extended Cache Retention for Earlier Models | No | Retention requirements unconfirmed | Not applicable to deadline repair; no extended retention enabled |
| Explicit Cache Breakpoints for GPT-5.6 and Later | No | Selected existing models are not GPT-5.6+ | Not applicable |
| Prompt Cache Diagnostics | No | No Responses comparison ID path | Not applicable to existing Chat Completions transport repair |
| State Management | Preserve | Existing history, summary and profile construction | Payload construction and storage ownership retained |
| Instruction Persistence Gotcha | Preserve | System/policy messages assembled each request | No chaining or instruction reshaping |
| Reasoning | No change | Existing model/request controls retained | No reasoning features introduced |
| Encrypted Reasoning Items | No | No existing encrypted reasoning item replay in this path | Not applicable |
| Reasoning Effort | No change | Not configured by these existing model calls | No model-specific setting guessed |
| Reasoning Preservation | No | No reasoning context fields in selected calls | Not applicable |
| Reasoning Summaries and Tool-Call Preambles | No | Existing reply text only | Not applicable |
| Verbosity | No change | Existing behavior uses temperature and existing output fields | No unsupported verbosity setting added |
| Maximum Output Tokens | Preserve | Shared helper's max_tokens default500; provider adds no new limit | Existing payload limits retained |
| Assistant Message Phases | No | No Responses message phases on these requests | Not applicable |
| Context Compaction | No change | Existing history/summary assembled by callers | No compaction migration or new privacy behavior |
| Structured Outputs | Preserve | Profile extraction uses existing JSON-object response; target wrappers return text | No schema or parser changes |
| Tools | Preserve | Provider supplies existing exercise context as messages | No model-executed tool loop added |
| Tool Choice | No change | No tools/tool_choice argument on these selected calls | Not applicable |
| Tool Search and Additional Tools | No | No dynamic catalog in current completion payload | Not applicable |
| Parallel Tool Calls | No | Existing sequential application retries | No tool concurrency policy changes |
| Programmatic Tool Calling | No | No code-executed model tool harness | Not applicable |
| Model-Aligned Tool Interfaces | No | No tool API redesign in this repair | Not applicable |

## SDK evidence

Official source checked: `openai/openai-node` README main, blob `6e1342363291739ad591d59b4e2dfd1a82d88d2a`, Retries and Timeouts sections, https://github.com/openai/openai-node/blob/main/README.md. It documents per-request `maxRetries` and `timeout`, two default retries, and a ten-minute default timeout. Installed SDK6.49.0 source additionally establishes that fetch timeout is cleared at response headers, so an external controller must cover response-body parsing through full promise settlement.

Provider/framework review: direct official SDK is retained; limitations of Azure, LiteLLM, OpenRouter, Together or Vercel AI SDK are not applicable to these direct clients. No new provider, framework, transport or live connectivity test is introduced.

## Validation coverage and outcome

Responsible-code checks run the actual provider/shared wrapper and installed SDK with intercepted fetch. They cover configured request options, abort before retry, bounded simultaneous attempts, success/failure timer cleanup, slow response headers/body, fallback order, existing reply/usage/telemetry/circuit envelopes and legacy error classification.

| Check | Result and scope |
|---|---|
| `npm run verify:ai-deadlines` | PASS: provider12/12 and shared helper13/13. Synthetic credentials and transport only; no live API requests |
| Saved-baseline negative controls | Provider11 failed/1 passed; shared helper9 failed/4 passed. The new tests reproduce the old cancellation and nested-retry defects |
| `npm run verify:auth-session-contracts` | PASS |
| `npm run typecheck` | PASS; no diagnostics |
| `npm run lint` | PASS; zero errors,169 existing warnings |
| `npm run build` | PASS; production bundle generated |
| Independent source/test review and `git diff --check` | PASS; no blocking compatibility or cleanup issue found |

Full-suite local setup attempted with `python3 /workspace/platform-review/verify-full-suite-isolated.py`: disposable PostgreSQL16, an isolated application cwd, an environment whitelist, synthetic credentials and disabled dotenv loading. The app exited before listening because its public, unauthenticated Replit OIDC metadata lookup failed with `getaddrinfo EAI_AGAIN replit.com`. Consequently `npm test` could not start locally; this is not a local full-suite pass. The harness removed its own app process, container/anonymous volume and temporary workspace. No customer database or actual service credential was used.

The PR workflow now runs the complete documented `npm test` after isolated server readiness, including its existing pretest route checks. Earlier duplicate typecheck/safety/rate-limit invocations were removed because `npm test` includes them. The authoritative hosted result is the verification check attached to [PR41](https://github.com/TheGenuineLoveProject/MyMentalHealthBuddy/pull/41); local setup remains blocked as described above. The additional focused command is `npm run verify:ai-deadlines`; no application entry point or configuration was added.

This completes implementation of the sole approved maintenance stage. No additional API/model migration stage is approved. Live provider availability, deployed Replit behavior, total route latency and provider-side cancellation/billing remain unverified by these offline tests. Production release also requires reconciliation with the current owner/staging source and its separate lifecycle acceptance work.
