# Selective Visibility Status Report

Generated: 2026-02-09

## Feature Flag Registry: `shared/featureFlags.mjs`

| Module | Flag Name | Status | Route(s) | Public Visible | Admin Visible |
|--------|-----------|--------|----------|----------------|---------------|
| Newsletter | newsletter | ready | /newsletter | Yes | Yes |
| Blog | blog | ready | /blog | Yes | Yes |
| Wellness Tools | tools | ready | /tools | Yes | Yes |
| Pricing | pricing | ready | /pricing | Yes | Yes |
| Crisis Support | crisis | ready | /crisis | Yes | Yes |
| Community | community | beta | /community | Yes (Beta label) | Yes |
| Learning Hub | learn | ready | /learn | Yes | Yes |
| Mood Tracking | mood | ready | /mood | Yes | Yes |
| Journaling | journal | ready | /journal | Yes | Yes |
| AI Chat | aiChat | ready | /chat, /ai-chat | Yes | Yes |
| Dashboard | dashboard | ready | /dashboard | Yes | Yes |
| Healing Journeys | healingJourneys | wip | /healing-journeys | No | Yes (admin bypass) |
| Content Studio | contentStudio | wip | /content-studio | No | Yes (admin bypass) |
| Study Vault | studyVault | wip | /study-vault | No | Yes (admin bypass) |
| Intellectual Atlas | atlas | wip | /atlas | No | Yes (admin bypass) |
| Strategy Maps | strategyMaps | wip | /strategy-maps | No | Yes (admin bypass) |
| Collaborative Lab | collaborativeLab | wip | /collaborative-lab | No | Yes (admin bypass) |

## Admin Modules

| Module | Flag Name | Status |
|--------|-----------|--------|
| Social Publishing | socialPublishing | ready |
| Billing Dashboard | billingDashboard | ready |
| Feature Flags | featureFlags | ready |
| Health Dashboard | healthDashboard | ready |
| Publishing Today | publishingToday | ready |
| Narrative Drafts | narrativeDrafts | ready |
| Analytics Dashboard | analytics | ready |

## Guard Components

- **FeatureGuard** (`client/src/components/guards/FeatureGuard.jsx`): Wraps any route to check feature flag status. Redirects to `/coming-soon?feature=X` for disabled/wip features. Admin users bypass WIP flags.
- **ComingSoon** (`client/src/pages/ComingSoon.jsx`): Gentle landing page for unavailable features. Shows feature name and 4 safe navigation options (Tools, Blog, Newsletter, Crisis Support).

## Status Legend

| Status | Behavior |
|--------|----------|
| `ready` | Fully visible in nav, CTAs, and routes |
| `beta` | Visible with "Beta" label |
| `wip` | Hidden from public nav/CTAs; route redirects to Coming Soon; admin can access |
| `disabled` | Completely hidden and blocked for all users |
