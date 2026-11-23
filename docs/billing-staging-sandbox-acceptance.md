# Deployed staging billing: sandbox acceptance packet

Status: **BLOCKED — deployment and live sandbox acceptance NOT_RUN.**
The staging-session connection question is pending; access-dependent work must wait.
Current access failures: local Browser `js` unavailable; cloud Browser requirements error;
native input unavailable (AT-SPI); staging/Stripe HTTPS requests rejected by CONNECT proxy 403.
Screenshots and offline tests do not establish deployment, checkout, or delivery success.

## 1. Pin and compare source before integration

Reference checkout: `7c13a72dc09b3d990d0a4a071dc5310c3f04c623`.
Billing fixes: `5ac20779008bc1d54d7c5e5d5929e8b405a296d0` and
`5043fac2c81935419ee669f8b1bef1c4d99ba709`; later newsletter changes are a separate milestone.
Record the current owner/staging commit, dirty-file inventory, and per-file hashes first.
Compare current staging files against these exact billing revisions; merge reviewed billing hunks only:
`server/routes/webhook.mjs` and the four billing test files in the command below.
Preserve current owner authentication, sessions, privacy repairs, secrets, and deployment audience.
Check installed Node/Stripe/Drizzle compatibility and existing price mapping; resolve conflicts explicitly.
Do not replace the checkout, dependency manifests, or unrelated files to bypass comparison.
Record resulting file hashes and the exact deployed revision/build ID; merge status: **NOT_RUN**.

## 2. Preconditions before any sandbox mutation

Confirm the exact MyMentalHealthBuddy staging project and existing audience policy.
Target project: `aad11b41-eb6d-4665-997a-1c2fa16342e9`;
published URL: `https://my-mental-health-buddy-staging.replit.app`.
Confirm the selected Stripe sandbox/test account and configured key/price mode without printing key values.
Every Customer, Price, Checkout Session, subscription, and event used must belong to that sandbox;
verify `livemode: false` where supplied. Unproven mode or ownership means **BLOCKED**.
Use only owned synthetic app accounts/customers and an owned test inbox; identify the staging DB target
without credentials and verify every touched record belongs to the fixture.
Record the published staging URL; verify checkout success/cancel and portal return URLs use that deployment.
Stop only this staging workspace's development preview Run workflow and observe **Stopped**;
closing a preview tab is insufficient. Keep the published staging deployment serving.
Preview stop: **NOT_RUN**; deployed URL/build identity: **UNVERIFIED**; sandbox guard: **NOT_RUN**.

## 3. Execute against the deployed URL with preview stopped

- Verify unauthenticated protected billing access is rejected and fixtures cannot read another account's billing.
- Complete the app's sandbox Pro/Elite checkout; verify actual charged price/customer and resulting app access.
- Cancel only the owned sandbox subscription using the app's billing control and its configured portal, if used;
  verify scheduled cancellation retains access.
  Obtain an actual terminal cancellation using the owned sandbox fixture/test clock if needed; do not infer it.
- Verify actual signed Stripe delivery to the exact deployed `/api/webhooks/stripe` endpoint
  (`server/app.mjs` mount plus `server/routes/webhook.mjs`), including endpoint ID, event ID/type, and HTTP result.
  An authentication redirect/403 is **BLOCKED**; preserve audience rather than exposing staging to bypass it.
- Verify exactly one matching processed `webhook_events` receipt and the correct fixture's resulting tier/expiry.
  Resend that same event through Stripe; verify duplicate acknowledgment, unchanged access, and no extra email attempt.
- With a newer active/trialing subscription, resend actual older cancellation/inactive/failed-invoice events;
  verify paid access survives. Verify recovered same-subscription access survives an older failed invoice.
- Verify a paid one-time Starter fixture retains Starter/null expiry after applicable older recurring negatives;
  standalone failed invoices must not revoke access. Record unavailable fixture cases as **NOT_RUN**.
All deployed checkout/cancellation/delivery/replay/access checks above: **NOT_RUN**.

## 4. Supporting offline evidence and completion receipt

The billing-only command covers 115 offline cases; it is supporting evidence, not deployed proof:
```sh
node --experimental-vm-modules --test server/tests/billing-starter-checkout.test.mjs server/tests/billing-cancellation.test.mjs server/tests/billing-stale-cancellation.test.mjs server/tests/billing-stale-downgrades.test.mjs
```
Record source/build hashes, preview state, sandbox identity, owned fixture aliases, exact endpoint/event/receipt,
replay result, and per-check PASS/FAIL/BLOCKED/NOT_RUN. Keep keys, signatures, cookies, tokens, capability URLs,
and customer content out of logs/evidence. Email-provider acceptance is not proof of inbox delivery.
Known limits: positive-event Pro/Elite tier reconciliation and recovery of historical Starter purchases remain open.
Entitlement mutation/event-receipt atomicity and a durable email outbox remain separate gaps.
Completion requires observed deployed results; current release acceptance remains **BLOCKED**.
