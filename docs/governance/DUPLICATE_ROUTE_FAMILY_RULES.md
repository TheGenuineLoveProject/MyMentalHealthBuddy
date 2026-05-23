# Duplicate Route Family Rules

## Purpose
Prevent unsafe route deletion by requiring one canonical owner before any cleanup.

## Rules
1. Never delete a route because the name looks duplicated.
2. First classify every duplicate family.
3. Choose one canonical owner per family.
4. Mark all others as:
   - alias
   - redirect candidate
   - archive
   - experimental
   - future
5. Crisis, safety, privacy, auth, billing, and admin routes require extra review.
6. No source code changes during this phase.

## Required Families
- Crisis
- Mood
- Journal
- Dashboard
- Admin
- Billing / Pricing
- Login / Account
- Onboarding
- Breathing / Calm
- AI / Companion / Chat
- Privacy / Safety / Legal
- Growth / Reflection
