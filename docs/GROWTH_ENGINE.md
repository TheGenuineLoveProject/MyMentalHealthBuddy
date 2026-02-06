# Growth & Viral Systems

**Generated:** 2026-02-06
**Phase:** 13 — Growth & Viral Systems
**Status:** PROPOSALS ONLY — No changes applied

---

## Existing Growth Systems

### Gamification Engine

| Feature | Implementation | Status |
|---------|---------------|--------|
| XP System | GamificationContext | ACTIVE |
| Levels | Level progression logic | ACTIVE |
| Streaks | Daily check-in tracking | ACTIVE |
| Badges | server/routes/badges.mjs | ACTIVE |
| Daily Quests | Quest system in gamification | ACTIVE |

### Social Sharing

| Component | File | Function |
|-----------|------|----------|
| SocialShare | client/src/components/SocialShare.jsx | Platform share buttons |
| ReflectionCard | client/src/components/share/ReflectionCard.jsx | Shareable reflection images |
| IdentityMirror | client/src/components/share/IdentityMirror.jsx | Self-discovery share card |
| InfinityHeartCard | client/src/components/share/InfinityHeartCard.tsx | Branded share visual |
| StreakShare | client/src/components/share/StreakShare.tsx | Streak milestone sharing |
| ShareModal | client/src/components/share/ShareModal.jsx | Unified share interface |

### Community

| System | File | Function |
|--------|------|----------|
| Affirmation Wall | AffirmationWall.jsx | Anonymous community affirmations |
| Community Feed | CommunityFeed.jsx | Content discovery |
| Community Circle | CommunityCircle.jsx | Group interaction |
| Shared Reflections | SharedReflections.tsx | User-generated reflections |
| Community Boundary | CommunityBoundary.tsx | Safety wrapper |

### Lead Capture & Communication

| System | File | Function |
|--------|------|----------|
| Newsletter | server/routes/newsletter.mjs | Email list growth |
| Leads | server/routes/leads.mjs | Lead capture |
| Invites | server/routes/invites.mjs | Referral system |
| Email | server/routes/email.mjs | Transactional email (Resend) |
| Contact | server/routes/contact.mjs | Inbound inquiries |

---

## Identified Viral Loops

### Loop 1: Content Sharing Loop
```
User completes wellness exercise
  → Generates shareable reflection card
  → Shares to social media
  → Friend sees card, visits platform
  → Friend signs up
  → Friend completes exercise
  → Cycle repeats
```

**Current strength:** MODERATE — Share components exist but no tracking of share-to-signup attribution.

**Proposed enhancement:**
- Add UTM parameter tracking to share URLs
- Track share-to-signup conversion rate
- Personalize landing page for referred users

### Loop 2: Streak & Achievement Loop
```
User maintains daily streak
  → Reaches milestone (7, 30, 90 days)
  → Prompted to share achievement
  → Share card generated with streak data
  → Social proof drives new signups
```

**Current strength:** MODERATE — Streak tracking and StreakShare exist. Milestone prompts may need strengthening.

**Proposed enhancement:**
- Automated milestone celebration modals
- Pre-generated share cards at key milestones
- "Your friend [name] has a 30-day streak" social proof

### Loop 3: Community Affirmation Loop
```
User writes anonymous affirmation
  → Affirmation appears on community wall
  → Other users "Send Light" (heart)
  → Original author sees engagement
  → Feels validated, writes more
  → Wall grows, attracts new users
```

**Current strength:** ACTIVE — Full implementation exists with like system.

**Proposed enhancement:**
- Weekly "Most Loved Affirmations" digest email
- Embeddable affirmation widget for external sites
- Anonymous gratitude response feature

### Loop 4: Personalization Depth Loop
```
User uses mood tracker daily
  → Platform learns emotional patterns
  → AI provides increasingly personalized insights
  → User finds platform indispensable
  → User upgrades to premium for deeper insights
  → User recommends to friends
```

**Current strength:** MODERATE — Mood tracking and AI insights exist. Personalization depth could increase.

**Proposed enhancement:**
- Weekly emotional intelligence report
- Personalized content recommendations based on mood history
- "Your growth this month" summary card (shareable)

---

## Growth Metrics to Track

| Metric | Formula | Current Tracking |
|--------|---------|-----------------|
| Daily Active Users (DAU) | Unique users per day | Analytics endpoint |
| Weekly Active Users (WAU) | Unique users per week | Analytics endpoint |
| DAU/MAU Ratio | DAU / MAU | Derivable |
| Streak Retention | Users with 7+ day streaks / total users | Gamification data |
| Share Rate | Shares per session | Not yet tracked |
| Viral Coefficient | Invited signups / inviting users | Not yet tracked |
| Content Creation Rate | New reflections per day | Community data |
| Premium Conversion Rate | Upgrades / total users | Billing data |

---

## Ethical Growth Principles

All growth mechanisms must:
1. **Respect autonomy** — No dark patterns, no manipulative urgency
2. **Add genuine value** — Every engagement hook must serve the user's wellness
3. **Support opt-out** — Users can disable notifications, sharing prompts, gamification
4. **Maintain privacy** — Anonymous sharing by default, no PII in viral content
5. **Avoid dependency** — Platform should empower independence, not create addiction

---

## Phase 13 Status: COMPLETE
No code modified. Growth systems inventoried. Viral loops identified with proposals.
