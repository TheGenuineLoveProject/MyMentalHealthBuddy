# Component Gravity Scorecard

Internal audit of major platform components scored on five dimensions.
Scale: 1 (low) to 5 (high). This is documentation only — no runtime impact.

Last updated: 2026-02-08

## Scoring Dimensions

| Dimension | Definition |
|-----------|-----------|
| **Usage** | How frequently users interact with this component |
| **Emotional Depth** | How deeply the component engages emotional processing |
| **Revenue Relevance** | How directly the component drives or supports monetization |
| **Stability** | How battle-tested and error-free the component is |
| **Risk** | Potential for harm if broken or misused (higher = more risk) |

## Core Components

| Component | Usage | Depth | Revenue | Stability | Risk | Notes |
|-----------|-------|-------|---------|-----------|------|-------|
| AI Chat (`AIChatPage.jsx`) | 5 | 5 | 5 | 4 | 5 | Primary Pro conversion driver. 5-free daily limit enforced server-side. Crisis detection active. |
| Mood Tracker (`MoodTracker.jsx`) | 4 | 4 | 2 | 5 | 2 | Free tier. High engagement, low monetization direct impact. |
| Journal (`Journal.jsx`) | 4 | 5 | 2 | 5 | 3 | Free tier. Contains sensitive personal data. Client-side sentiment analysis. |
| Dashboard Overview (`Overview.jsx`) | 5 | 3 | 3 | 5 | 2 | Central hub. Shows Pro badge and upgrade CTA for free users. |
| Pricing Page (`Pricing.jsx`) | 3 | 1 | 5 | 5 | 3 | Direct revenue page. Monthly/yearly toggle. Stripe checkout. |
| Billing Page (`Billing.jsx`) | 2 | 1 | 5 | 4 | 4 | Subscription management. Stripe portal access. |
| Crisis Page (`Crisis.jsx`) | 2 | 5 | 0 | 5 | 5 | Always free. Must never break. Links to 988 Lifeline, Crisis Text Line. |
| Community Wall (`AffirmationWall.jsx`) | 3 | 4 | 1 | 4 | 3 | Free tier. Anonymous affirmations. Moderation considerations. |
| Landing Page (`CanvaLanding.jsx`) | 5 | 3 | 4 | 5 | 2 | First impression. SEO critical. Links to pricing and signup. |

## Auth & Gating Components

| Component | Usage | Depth | Revenue | Stability | Risk | Notes |
|-----------|-------|-------|---------|-----------|------|-------|
| AuthContext (`AuthContext.jsx`) | 5 | 0 | 5 | 5 | 5 | Central auth state. Exposes `isPro`, `subscriptionStatus`. Single source of truth. |
| PlanGate (`PlanGate.jsx`) | 1 | 1 | 4 | 5 | 3 | Built but not yet widely deployed. Blurred teaser + upgrade CTA pattern. |
| Feature Access Config (`featureAccess.js`) | 3 | 0 | 5 | 5 | 4 | Single source of truth for feature-to-plan mapping. |
| Navbar (`TglpNavbar.jsx`) | 5 | 1 | 3 | 5 | 2 | Shows Pro badge or Upgrade link. Consistent across all pages. |

## Navigation & Discovery

| Component | Usage | Depth | Revenue | Stability | Risk | Notes |
|-----------|-------|-------|---------|-----------|------|-------|
| Footer (`Footer.jsx`) | 5 | 0 | 1 | 5 | 1 | Social links, legal links, crisis link. Low risk. |
| SafetyFooter (`SafetyFooter.jsx`) | 4 | 2 | 0 | 5 | 3 | Disclaimer, privacy, crisis. Appears on wellness pages. |
| Floating Lotus Guide | 3 | 2 | 1 | 4 | 1 | Route-conditional wellness assistant. |

## Server-Side Components

| Component | Usage | Depth | Revenue | Stability | Risk | Notes |
|-----------|-------|-------|---------|-----------|------|-------|
| Stripe Webhook (`webhook.mjs`) | 3 | 0 | 5 | 5 | 5 | Handles all subscription lifecycle. Idempotent. Email triggers. |
| Billing Routes (`billing.mjs`) | 3 | 0 | 5 | 5 | 5 | Checkout session creation, portal, plan queries. |
| AI Routes (`ai.mjs`) | 5 | 5 | 5 | 4 | 5 | Chat endpoint with daily limit enforcement, crisis detection. |
| Pro Features (`pro-features.mjs`) | 1 | 3 | 4 | 4 | 2 | Healing journeys, analytics, AI concierge. Newly mounted. |
| Health Check (`health.mjs`) | 2 | 0 | 0 | 5 | 3 | Platform health monitoring. |

## Priority Actions

1. **PlanGate deployment** — Component is ready but unused. Wrapping Pro features with it would complete the gating UX.
2. **AI Chat stability** — Highest combined score. Monitor error rates and response quality.
3. **Crisis page** — Maximum risk score. Must be tested regularly and never gated.
