# Human Secret Rotation Checklist

Complete in Replit Secrets and provider dashboards before real revenue testing.

## Rotate Immediately
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- VITE_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- REPLIT_TOKEN
- GitHub personal access token
- Any token/key shown in screenshots or terminal output

## Required Stripe Mode Rule
Use exactly one mode:
- TEST mode: sk_test + pk_test + VITE pk_test
- LIVE mode: sk_live + pk_live + VITE pk_live

Never mix test and live Stripe keys.

## Required CORS Rule
Set CORS_ORIGIN to the exact production domain.

Do not use:
- *
- empty value
- localhost for production

## After Rotation
Run Phase 18 checkout verification.
