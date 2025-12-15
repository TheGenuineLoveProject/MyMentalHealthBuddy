# The Genuine Love Project — One-Click Deploy Checklist (v1.0)

## 0) Secrets (Replit → Secrets tab)
- DATABASE_URL = <your Neon/PG url>
- SESSION_SECRET = <random long string>
- (optional) SENTRY_DSN = <dsn>
- (optional) STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET

## 1) Fix + validate
- node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('OK')"

## 2) Install
- npm install

## 3) Build
- npm run build

## 4) Start
- npm start

## 5) Health checks
Open:
- /api/ready  → { "status": "ready" }
- /api/health → (if you have it)
- /brand/logo.png → loads (if present)

## 6) Create ChatGPT bundle (for debugging)
- npm run bundle:gpt
Download: gpt_repair_bundle.tgz

## 7) GitHub release prep
- Ensure version = 1.0.0 in package.json
- Add CHANGELOG.md (high level)
- Tag: v1.0.0
- Create GitHub Release with notes + attach gpt_repair_bundle.tgz (optional)

DONE ✅