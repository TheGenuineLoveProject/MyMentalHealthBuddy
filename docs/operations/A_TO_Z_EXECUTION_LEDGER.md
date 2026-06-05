# MyMentalHealthBuddy A→Z Execution Ledger

## Verified Completed
- Runtime healthy
- Ready endpoint working
- Homepage title verified
- Build passes
- Phase 5 audit reports saved
- Billing route exists
- Stripe checkout route exists
- Stripe webhook route exists
- Subscription status route exists
- Admin, dashboard, social, billing, AI, security, assessment files inventoried

## Active Critical Blockers
1. Stripe mode mismatch must be resolved before real revenue testing.
2. Production CORS must be restricted before public production launch.
3. GitHub Dependabot vulnerabilities must be reviewed and patched.
4. Replit/GitHub OAuth workflow-scope tag push issue must not block main branch, but must be documented.

## Revenue Completion Queue
1. Verify Stripe secret/publishable key mode alignment.
2. Verify VITE_STRIPE_PUBLISHABLE_KEY use.
3. Verify checkout session creation.
4. Verify Stripe checkout redirect.
5. Verify webhook delivery.
6. Verify subscription activation.
7. Verify billing portal.
8. Verify cancellation downgrade.
9. Verify premium gating.
10. Verify pricing page CTA path.

## Platform Completion Queue
1. Verify all public pages render.
2. Verify all critical API endpoints return expected status.
3. Verify login/register/reset-password flows.
4. Verify admin guard protection.
5. Verify health/ready/metrics/deployment-readiness.
6. Verify content/social/newsletter publishing paths.
7. Verify AI safety disclaimers.
8. Verify crisis resource visibility.
9. Verify privacy/legal/terms pages.
10. Verify accessibility baseline.

## Monetization Queue
1. Starter plan checkout.
2. Pro monthly checkout.
3. Pro yearly checkout.
4. Elite monthly checkout.
5. Elite yearly checkout.
6. Subscriber benefits page.
7. Upgrade page.
8. Pricing page.
9. Account billing page.
10. Revenue admin dashboard.

## Next Rule
One blocker at a time. Verify before fixing. Fix smallest safe issue. Rebuild. Recheck runtime. Commit. Push. Stop.

## Phase 8 Added Blocker
- Stripe is currently blocked from real revenue testing because STRIPE_SECRET_KEY is TEST while STRIPE_PUBLISHABLE_KEY is LIVE and VITE_STRIPE_PUBLISHABLE_KEY is missing.
- Required before checkout testing:
  1. Rotate exposed Stripe/Replit/GitHub secrets.
  2. Use matching Stripe mode keys only.
  3. Add VITE_STRIPE_PUBLISHABLE_KEY.
  4. Re-run Phase 8 audit.
