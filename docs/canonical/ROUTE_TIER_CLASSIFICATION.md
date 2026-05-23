# Route Tier Classification

## Tier Definitions

| Tier | Meaning | Rule |
|---|---|---|
| PRODUCTION | Public/user-facing core platform | Must remain stable |
| ADMIN | Internal operator/admin tools | Must be protected |
| EXPERIMENTAL | Advanced/lab/AI/avatar/Lumi systems | Do not expose broadly |
| ARCHIVE | Backup, snapshot, duplicate, historical | Do not mount |
| FUTURE | Planned but not active | Document only |

## Classification Rules

1. Crisis, safety, privacy, login, dashboard, journal, mood, AI companion = PRODUCTION.
2. Admin, analytics, publishing, security, audit = ADMIN.
3. Lumi, ritual, scene, avatar lab, ontology, meta-learning = EXPERIMENTAL.
4. `.hx-backups`, old snapshots, duplicate generated folders = ARCHIVE.
5. Unbuilt concepts = FUTURE.

## Non-Negotiable Rule
No deletion, merge, or refactor is allowed until every route/page has a tier.
