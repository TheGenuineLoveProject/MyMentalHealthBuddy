# MMHB Launch Content System

A reusable, trauma-informed content engine for MyMentalHealthBuddy by The Genuine Love Project. Every piece of content in this pack maps to a real module + tool already shipped in the product, so the marketing voice and the in-app voice are the same voice.

---

## Voice & Guardrails (apply to every asset)

- **Trauma-informed**: never diagnose, never prescribe, never claim to treat.
- **Educational only**: language is "you might notice", "some people find", "one thing to try".
- **Calm and consent-based**: no urgency tactics, no scarcity, no fear hooks.
- **Plain language**: short sentences, concrete imagery, WCAG-friendly readability.
- **Always include a crisis line on any wellness piece**: a single visible line at the foot of every post, blog, and email — *"In crisis or thinking of suicide? Call or text 988 (US) or text HOME to 741741. International: findahelpline.com."*
- **Original writing only.** No paraphrased clinical material, no copied affirmations, no AI-generated medical claims.
- **Never gate the first relief experience.** Marketing CTAs always offer a free entry through `/start` before any upgrade prompt.

## Module → Tool → Content Map

The product ships six core modules, each bound to a specific in-app micro-exercise. Every content asset in this pack is tagged to one of them so the funnel is traceable end-to-end.

| Module (marketing) | In-app module id | Bound tool | Tool surface |
|---|---|---|---|
| Anxiety reset | `anxiety` | `box_breathing` | 60-90 second breathing card |
| Cognitive reframe | `thought_pattern` | `thought_reframe` | 4-step reframing card |
| Emotional processing | `emotional_processing` | `emotional_checkin` | name-and-locate feeling card |
| Relationship | `relationship` | `relationship_repair` | repair-script prompt |
| Behavioral loop | `loop_detection` | `pattern_interrupt` | interrupt-and-redirect card |
| Self-regulation | `self_regulation` | `overload_reset` | 5-minute reset sequence |

There is also a safety tool (`grounding_54321`) that the product surfaces alongside `box_breathing` for high-distress states. Marketing content should reference it as "5-4-3-2-1 grounding" without claiming it treats anything.

## Content Matrix

Every asset in this pack is one of four formats, each with a clear job-to-be-done:

| Format | Job-to-be-done | Length | Primary CTA |
|---|---|---|---|
| Short-form social post | Earn one moment of attention; offer one micro-relief | 1-3 sentences | Soft CTA: "Try a 60-second reset → /start" |
| Blog draft | Earn long-form trust; show the thinking behind a tool | 600-900 words | "Open the tool free → /start" |
| Newsletter issue | Sustain a weekly practice; tie one tool to one theme | 200-350 words | One link to the matching tool flow |
| Tool guide | Onboard a new user; remove friction before first use | 100-150 words per tool | Inline `/start?tool=...` link |

## Funnel Hooks (already shipped, content just feeds them)

- **Entry**: `/start` page with three single-tap relief flows
- **Telemetry events** (whitelisted, no message bodies): `start_page_click`, `first_tool_selected`, `first_response_success`, `streak_incremented`, `paywall_shown`, `paywall_clicked`
- **Soft paywall**: appears only after 3 successful non-crisis sessions; never on first relief, never on crisis
- **Streak chip**: appears on second visit, reinforces "come back tomorrow"

Content should use these hooks intentionally:
- Social posts → drive `start_page_click`
- Blogs → drive a deeper `first_tool_selected` (reader picks the tool that matches the article)
- Newsletter → drive `streak_incremented` (return visit)
- Tool guides → reduce time-to-first-relief on a specific tool

## Production Workflow

1. Pick a theme from the weekly editorial calendar (see newsletter file).
2. Open the matching module in this map → use its tool name and surface verbatim.
3. Write to the voice guardrails above.
4. Add the crisis line at the foot.
5. Publish to the channel; tag with the module id so analytics can attribute back.

## What This Pack Does NOT Include

- Paid ad copy (write only after observing real-user telemetry for 2 weeks)
- Influencer scripts (defer until product-market fit signal is visible)
- Clinical claims, condition pages, "treatment" framing — never
- Imagery prompts (handled by the design system, not here)

## Files in This Pack

- `content/launch-pack/LAUNCH_CONTENT_SYSTEM.md` — this document
- `content/social/launch/20_SHORT_FORM_POSTS.md` — 20 ready-to-post short pieces
- `content/blog/launch/5_LAUNCH_BLOG_DRAFTS.md` — 5 long-form drafts
- `content/newsletters/launch/4_WEEK_NEWSLETTER_STARTER.md` — 4 weekly issues
- `content/guides/launch/CORE_TOOLS_GUIDE.md` — onboarding copy for all 6 tools

## Crisis Line (paste verbatim onto every published asset)

> In crisis or thinking of suicide? Call or text **988** (US) or text **HOME** to **741741**. International: findahelpline.com. If you are in immediate danger, call your local emergency number.
