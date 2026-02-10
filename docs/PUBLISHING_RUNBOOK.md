# Publishing Runbook

## How to Write a Blog Post

1. Navigate to `/admin/publishing` or `/blog/editor` (admin access required)
2. Fill in the title, excerpt, tags, and body content
3. Choose content type (blog_post, newsletter, reflection, essay, note)
4. Set visibility (public, private, or draft)
5. Save as draft first to review

## How to Publish a Blog Post

1. Open the post in the editor
2. Review content for accuracy and tone
3. Set status to "published"
4. The post will appear at `/blog` and `/blog/:slug`
5. RSS feed at `/rss.xml` updates automatically

## How to Send a Newsletter

1. Navigate to `/admin/newsletter`
2. Review subscriber statistics
3. Create newsletter content using the editor
4. Preview the email
5. Send to subscribers via Resend integration
6. All emails include unsubscribe links and privacy language

## Newsletter Signup

- Public signup form at `/newsletter`
- Also integrated in blog index page
- Requires email + consent
- Rate limited to prevent abuse
- Duplicate subscriptions handled gracefully

## How to Use Tracked Links (/r/:slug)

1. Navigate to `/admin/social` (Social Ops Console)
2. In the post editor, click "Create /r/ Link"
3. Enter the destination URL
4. A short slug is generated (e.g., `/r/abc123`)
5. Share the tracked link on social media
6. Clicks are counted and visible in the Signals panel

## How to Build UTM Links

1. In the Social Ops Console editor, click "Build UTM"
2. Source, medium, and campaign are auto-filled from the post
3. The generated UTM link is ready to copy
4. Use UTM links for campaign attribution tracking

## Social Media Publishing Pipeline

1. **Create Draft**: Write content in the editor with per-platform captions
2. **Safety Check**: Run the built-in safety check (blocks medical claims, shame/urgency framing)
3. **Submit for Review**: Move draft to review status
4. **Approve**: After human review, approve the post
5. **Mark as Posted**: After manually posting on the platform, mark it as posted with platform tags
6. All transitions are logged in the Audit Log

## Repurpose Blog to Social

1. Go to the "Repurpose" tab in Social Ops Console
2. Select a published blog post
3. Optionally assign to a campaign
4. Click "Generate Draft Posts" to create platform-specific drafts
5. All generated posts start as DRAFTS — never auto-approved

## Running Audits

```bash
# Link integrity audit
node scripts/audit-links.mjs

# API wiring audit
node scripts/audit-api-usage.mjs

# Security audit
node scripts/security-audit.mjs

# Full evolution check
node scripts/evolve.mjs

# Full evolution check with build
node scripts/evolve.mjs --build
```

## Safety Rules

- No auto-posting to any social platform
- All publishing actions require human approval
- Safety checks block medical/therapy claims
- Safety checks block urgency/shame/dependency framing
- Safety note is required before any post can be approved
- Crisis CTA can be marked as required for sensitive topics
- All actions are logged in the audit trail
