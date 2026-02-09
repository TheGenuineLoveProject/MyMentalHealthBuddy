# Route Probe Report

Generated: 2026-02-09T04:04:58.644Z
Base URL: http://localhost:5000

## Summary

| Result | Count |
|--------|-------|
| PASS | 32 |
| FAIL | 1 |
| Total | 33 |

## Public Pages

| Path | Status | Result |
|------|--------|--------|
| `/` | 200 | PASS |
| `/about` | 200 | PASS |
| `/pricing` | 200 | PASS |
| `/blog` | 200 | PASS |
| `/newsletter` | 200 | PASS |
| `/crisis` | 200 | PASS |
| `/community` | 200 | PASS |
| `/tools` | 200 | PASS |
| `/login` | 200 | PASS |
| `/register` | 200 | PASS |
| `/learn` | 200 | PASS |
| `/about/approach` | 200 | PASS |
| `/values` | 200 | PASS |
| `/features` | 200 | PASS |
| `/landing` | 200 | PASS |
| `/terms` | 200 | PASS |
| `/privacy` | 200 | PASS |
| `/safety` | 200 | PASS |
| `/ethics` | 200 | PASS |
| `/disclaimer` | 200 | PASS |
| `/roadmap` | 200 | PASS |
| `/our-story` | 200 | PASS |
| `/press` | 200 | PASS |
| `/courses` | 200 | PASS |
| `/coming-soon` | 200 | PASS |

## Health Endpoints

| Path | Status | Result |
|------|--------|--------|
| `/api/health` | 200 | PASS |
| `/health` | 200 | PASS |

## API Endpoints

| Path | Status | Auth Expected | Result |
|------|--------|---------------|--------|
| `/api/auth/user` | 200 | yes | PASS |
| `/api/mood` | 401 | yes | PASS |
| `/api/journal` | 403 | yes | PASS |
| `/api/blog` | 200 | no | PASS |
| `/api/leads` | 401 | no | FAIL |
| `/api/health` | 200 | no | PASS |

## Failed Routes

- **/api/leads** — Status: 401
