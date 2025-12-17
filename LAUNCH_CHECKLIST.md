# The Genuine Love Project — Launch Checklist

## Security
- [ ] SESSION_SECRET set (no defaults)
- [ ] Sessions stored in Postgres (connect-pg-simple)
- [ ] CORS restricted in production (no "*")
- [ ] Helmet enabled + CSP tuned
- [ ] Rate limiting enabled on auth + ai routes

## Reliability
- [ ] /api/ready returns 200 with DB connected
- [ ] Sentry enabled in production + release tag set
- [ ] Logs include requestId for every request

## Payments
- [ ] Stripe webhook verified
- [ ] Billing routes protected
- [ ] Customer portal tested

## Legal + UX
- [ ] Privacy / Terms / Disclaimer pages visible
- [ ] Crisis handling path tested in AI therapy flow
- [ ] Brand assets present (/public/brand)

## Deployment
- [ ] `npm run build` succeeds
- [ ] Autoscale: port 5000 internal, 80 external
- [ ] ENV vars set in Replit Deployments