# Publishing Baseline Snapshot

**Date**: 2026-02-09
**Status**: Healthy

## System Health
- `GET /api/health` → 200 (database connected, AI available)
- Git status: Clean (no uncommitted changes to tracked files)
- No test suite configured (`npm test` not available)

## Route Verification (All 200)
| Route | Status |
|-------|--------|
| `/blog` | 200 |
| `/pricing` | 200 |
| `/features` | 200 |
| `/about` | 200 |
| `/faq` | 200 |
| `/crisis` | 200 |
| `/contact` | 200 |
| `/community` | 200 |
| `/privacy` | 200 |
| `/terms` | 200 |
| `/ethics` | 200 |
| `/disclaimer` | 200 |

## API Verification
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/health` | GET | 200 | Healthy |
| `/api/blog` | GET | 200 | Returns published posts |
| `/api/blog/rss` | GET | 200 | Valid RSS XML |
| `/api/leads` | POST | 201 | Consent-validated signup |
| `/api/leads` | GET | 401 | Admin-protected (correct) |
| `/api/newsletter/subscribe` | POST | 200 | Email validation only |
| `/api/social-posts` | GET | 401 | Admin-protected (correct) |

## Issues Found at Baseline
1. `SacredFooter.jsx` (components/) — Newsletter form non-functional (preventDefault only)
2. `sacred/SacredFooter.jsx` — Newsletter submit missing consent checkbox
3. `SocialStudioAdmin.jsx` — Toast implies auto-posting ("Posted to {platform}")
4. `SacredFooter.jsx` (components/) — Social links point to `#` (dead)
