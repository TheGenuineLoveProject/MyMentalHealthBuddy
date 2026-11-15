# Newsletter consent persistence

`NewsletterSignup` on pricing, newsletter, and footer surfaces posts to
`POST /api/newsletter/subscribe`. The existing SacredForm and NewsletterInvite
clients use the same endpoint. Generic CRM capture remains at `/api/leads`.

An explicit Subscribe action accepts an email alone for existing clients. The
main form also requires and sends `consent: true`; an explicit false value is
rejected. Email is trimmed, lowercased, validated, and limited to 255 characters.
Optional source identifiers are limited to 100 characters and reject query
strings and free text. Optional campaign fields are bounded attribution hints;
they are not verified acquisition evidence.

The subscription transaction upserts the lead's consent and the dedicated
newsletter subscriber's active status together. Renewed consent preserves
unrelated lead interests and omitted metadata. Supplied campaign fields follow
the existing 30-day attribution window. A successful response is:

```json
{"ok":true,"data":{"subscribed":true},"message":"Subscription received. Thank you for joining us."}
```

The form displays success only after that committed acknowledgment. Validation
returns 400, the existing per-IP rate limit returns 429, and persistence failure
returns a generic 500 response with `ok: false`. Inputs remain available for
retry. Conversion success is recorded by the server after commit; the browser
records attempts without emitting another success event.

`POST /api/newsletter/unsubscribe` accepts an email and transactionally removes
its lead record and marks its dedicated subscriber row `unsubscribed`. Either
store may be absent. Repeating the request is safe, other addresses are
unaffected, and a failed write cannot produce a successful opt-out response.

These endpoints persist preferences. Sending, provider delivery, signed
unsubscribe links, and production marketing qualification require their own
verified integration. The repair does not send messages.

Run the backend regressions directly with:

```sh
node --experimental-vm-modules --test server/tests/newsletter-consent.test.mjs
```

`npm run verify:conversion-flows` includes these regressions and the actual
pricing-form UI checks. The full documented `npm test` remains a separate CI
gate after isolated server readiness.
