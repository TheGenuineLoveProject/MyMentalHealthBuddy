# MMHB R15 bounded asset content review

R14's supplied result reports that all 31 selected runtime assets match the reviewed bytes and that none is in the passing R13 candidate. This repair unit selects only the 22 `ai/` assets used by the two prompt registries: two registries, two system prompts, eight healing modules, and ten business modules. It applies eleven exact text changes across six files. Sixteen files remain byte-identical. The selected assets total 21,559 bytes before and 22,006 bytes after the changes.

The machine-readable policy is `r15-asset-repair-policy.json`. Every selected file has an expected SHA-256, expected length, resulting SHA-256, and resulting length. Each of the six edits additionally includes complete exact old/new UTF-8 texts and the eleven single-occurrence substitutions. This review does not alter source snapshots or execute the application.

## Exact edits

| File | Text edits | Resulting behavior requested by the prompt |
| --- | ---: | --- |
| `ai/healing/system.md` | 2 | Replace The Genuine Love Project with MyMentalHealthBuddy. Replace the assertion that information is not retained between sessions with an instruction to describe privacy, memory, and retention only from verified platform information and avoid blanket non-storage promises. |
| `ai/business/system.md` | 3 | Use MyMentalHealthBuddy branding. Replace the asserted ZERO access with a prohibition on requesting, using, or disclosing sensitive subscriber data and an explicit statement that a prompt does not establish technical access isolation. Replace deterministic-output language with a consistent-structure instruction. |
| `ai/business/prompts/b01_offer_design.md` | 1 | Use MyMentalHealthBuddy branding in the offer-design purpose. |
| `ai/healing/prompts/h01_intake.md` | 2 | Replace the ambiguous storage reassurance with verified-information wording. Identify 988 as a US resource and include call/text access. |
| `ai/healing/prompts/h08_safety_check.md` | 2 | Label HOME to 741741 as US-only. Replace unlimited assistant-availability wording with encouragement to contact a trusted person or crisis counselor. |
| `ai/business/prompts/b04_email_sequences.md` | 1 | Base suppression rules on consent, communication preferences, unsubscribe status, or bounces; expressly exclude crisis flags, health information, and inferred mental state. |

The healing system's complete Crisis Protocol and Frameworks sections are byte-preserved. The h08 Hard Rules and After Resources sections are also byte-preserved. Registry audience/risk values are unchanged. These facts establish the patch's scope; they do not establish clinical validity, live routing, effective authorization, provider behavior, or privacy compliance.

Primary resource checks support the limited geography edit: [Crisis Text Line](https://www.crisistextline.org/) identifies HOME to 741741 for the United States, and its [FAQ](https://www.crisistextline.org/about-us/faq/) describes its service. [988 Lifeline](https://988lifeline.org/) identifies 24/7 call/text/chat support. The parent also verified the 988 FAQ. These checks do not establish worldwide eligibility or validate the entire crisis protocol.

## Remaining module review queue

All eighteen modules require evaluation against actual MMHB runtime behavior before use by visitors. The table identifies concrete review targets, not findings that each module necessarily fails. Only the six files listed above are changed by R15.

| Module | Remaining review target and acceptance evidence |
| --- | --- |
| `h01_intake` | Confirm that the model gives accurate, understandable privacy explanations when verified retention information is absent or supplied. Check that the crisis reminder does not represent US access as universal. Verify that the welcome flow avoids soliciting identifying information. |
| `h02_journal_reflect` | Evaluate reflections for invented emotions, unsupported conclusions, and handling of journal text containing prompt injection. Confirm inherited crisis routing and avoid making the example response a fixed assumption. |
| `h03_cbt_reframe` | Evaluate reframing with abuse, credible external danger, grief, and uncertainty. Confirm that an alternative interpretation does not invalidate a real threat or pressure a person to reinterpret harm. |
| `h04_act_values` | Verify one-question-at-a-time behavior, consent, and tentative value reflections. Test religious/cultural diversity and inputs where inferring a person's values would be unwarranted. |
| `h05_breathing_grounding` | Obtain clinical review of the prescribed breath holds and technique selection for panic/dissociation. Evaluate consent, ability to stop, accessible alternatives, and escalation when symptoms need human assessment. |
| `h06_sleep_reset` | Review timed instructions, breath holds, the statement about restoration, and boundaries for persistent sleep problems. Test that the tool avoids diagnoses or false reassurance when users describe concerning symptoms. |
| `h07_conflict_script` | Test the abuse/danger branch before conversation coaching. Review the blanket responsibility statement and ensure that a request for communication help does not become pressure to confront someone unsafe. |
| `h08_safety_check` | Review the unconditional resource-display and no-probing rules, imminent danger handling, regional resource selection, minors, and continuity limitations. Verify the corrected resource geography and absence of an unlimited availability promise across generated outputs. |
| `b01_offer_design` | Verify that proposed offers, prices, features, and benefit statements correspond to approved MMHB facts. Test that the one-sentence promise does not become a clinical or guaranteed outcome claim. |
| `b02_funnel_map` | Require supplied or sourced baseline metrics and distinguish proposed targets from observed conversion rates. Verify cancellation/refund assertions against implemented product behavior. |
| `b03_content_factory` | Resolve the boundary between planning wellness content and the business system's prohibition on producing healing/support content. Verify originality, source attribution, editorial review, and that distribution plans do not trigger unauthorized posting. |
| `b04_email_sequences` | Verify that outputs do not reintroduce health-derived audience selection or crisis flags after the repair. Confirm that consent/preferences/unsubscribe/bounce decisions are enforced by the sending system and that generated copy does not claim unsupported unsubscribe behavior. |
| `b05_seo_briefs` | Require verifiable citations and existing internal URLs. Evaluate invented sources, assumed searcher fears, and assertions that title/meta character limits guarantee search appearance. |
| `b06_competitive_scan` | Require dated evidence for current pricing and competitor claims. Distinguish incomplete research from claims that no competitor serves a need, and avoid speculative disparagement. |
| `b07_pricing_packaging` | Verify the actual tier names, availability of free safety resources, and implemented cancellation/refund flow. Distinguish proposed product requirements from shipped features. |
| `b08_retention_loyalty` | Require evidenced aggregate cohort statistics and clearly labeled estimates for expected lift. Check that retention advice respects the sensitive-data boundary and that permanent suppression claims match the sending system. |
| `b09_partnerships` | Validate proposed partners and referral claims using current evidence. Check that disclosures fit the actual relationship and publication format; a generated statement that disclosures meet FTC standards is not a compliance determination. |
| `b10_ops_sops` | Verify tool access, prerequisites, commands, recovery instructions, and authorization boundaries in each produced SOP. Confirm that the stated dual review for crisis-related procedures is actually enforced. |

## System and integration boundaries still open

- A registry's `approvedPromptCount`, role list, or risk label reflects structure; it is not clinical approval or proof of authorization enforcement.
- The unchanged healing Frameworks section includes NLP-informed reframing. Evidence labeling and clinical boundaries remain for review; R15 does not present NLP, spiritual methods, or quantum concepts as proven treatment.
- The new privacy and business instructions reduce unsupported assertions. Actual retention, account isolation, logs, backups, provider handling, and server-side business access still need direct verification.
- The two prompt registries are loaded from the working directory by the reviewed loader. Successful parsing and file availability must be reported separately from application startup and generated-output evaluation.
- Kernel assets and blog fallback content are excluded from this 22-file policy. Their runtime reachability, branding, packaging needs, and health checks remain open.
- Source application belongs to the parent's bounded driver: qualify the private candidate first; retain exact originals; reject concurrent input changes; apply only the six full-file replacements; verify the expected final identities; and record rollback outcomes on handled failure.

No publication, provider request, email, social post, database action, package installation, or application execution is performed by this content policy. Content evaluation and release readiness remain pending.
