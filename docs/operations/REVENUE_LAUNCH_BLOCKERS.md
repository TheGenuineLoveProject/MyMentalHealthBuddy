# Revenue Launch Blockers

## Current State
- Build passes.
- Runtime health endpoint works.
- Runtime readiness endpoint works.
- Stripe billing routes exist.
- Checkout route exists.
- Webhook route exists.
- Billing client now calls server checkout route only.
- Client must never use STRIPE_SECRET_KEY.

## Active Blockers Before Real Revenue Testing
1. Rotate every exposed secret shown in screenshots or shell output.
2. Replace mixed Stripe keys with one matching mode only.
3. Add VITE_STRIPE_PUBLISHABLE_KEY in Replit Secrets.
4. Restrict CORS_ORIGIN from wildcard to the production domain.
5. Review and patch GitHub Dependabot vulnerabilities.
6. Run Stripe checkout test only after secrets are aligned.
7. Run Stripe webhook test only after webhook secret is rotated and reconfigured.
8. Verify premium gating after successful checkout.
9. Verify cancellation downgrade.
10. Verify billing portal return flow.

## Monetization Path
- Free tier: safety resources, basic tools, intro journaling.
- Starter tier: extended tools, guided reflections, journal insights.
- Pro tier: unlimited AI chat, healing journeys, advanced insights, progress analytics.
- Elite tier: voice affirmations, early access, elite community, onboarding, premium guided content.

## Deployment Rule
Do not conduct real payment testing until Stripe key mode alignment and secret rotation are complete.
