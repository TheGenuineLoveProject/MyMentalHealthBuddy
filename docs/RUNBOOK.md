# The Genuine Love Project - Runbook

## Quick Start

### Development Server
```bash
npm run dev
```
Server runs on http://localhost:5000

### Production Build
```bash
npm run build
npm start
```

---

## Release Gate

Run the full release gate to verify everything works:

```bash
npm run release:gate
# or
bash tools/release_gate.sh
```

### Individual Checks

| Command | Description |
|---------|-------------|
| `npm run env:audit` | Check environment variable coverage |
| `npm run link:scan` | Scan for broken navigation links |
| `npm run route:map` | Generate route inventory |
| `npm run auth:smoke` | Run auth endpoint smoke tests |
| `npm run test:all` | Run all tests |
| `npm run smoke` | Run smoke tests |

---

## Environment Setup

### Required Variables
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Express session encryption key |

### Optional Variables
See `.env.example` for full list and `ENV_CHECKLIST.md` for details.

### Setting Secrets on Replit
1. Open the **Secrets** tab in Replit
2. Add each required variable
3. Values are automatically available as `process.env.VARIABLE_NAME`

---

## Authentication Flow

### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ email, password }`
- **Returns**: User object + sets session cookie

### Register
- **Endpoint**: `POST /api/auth/register`
- **Body**: `{ email, password, displayName }`
- **Returns**: User object

### GitHub OAuth
- **Initiate**: `GET /api/auth/github`
- **Callback**: `GET /api/auth/github/callback`
- **Requires**: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

### Protected Routes
All `/api/*` routes (except auth) require authentication.
Unauthenticated requests return `401 Unauthorized`.

---

## Debugging Login Issues

### Check 1: Server Running
```bash
curl http://localhost:5000/healthz
```
Expected: `{"status":"ok"}`

### Check 2: Database Connected
```bash
curl http://localhost:5000/api/health-check
```
Expected: `{"status":"healthy","database":"connected"}`

### Check 3: Auth Endpoints
```bash
npm run auth:smoke
```
Expected: All tests pass

### Check 4: Session Secret
Ensure `SESSION_SECRET` is set in Replit Secrets.

### Check 5: GitHub OAuth
1. Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set
2. Check callback URL matches Replit domain

---

## Database

### Push Schema Changes
```bash
npm run db:push
```

### View Database (Drizzle Studio)
```bash
npx drizzle-kit studio
```

### Connection
Database URL is automatically provided by Replit PostgreSQL.

---

## Deployment

### Replit Deployment
1. Click **Deploy** in Replit
2. Configure as **Autoscale** deployment
3. Set production environment variables
4. Deploy

### Pre-deployment Checklist
- [ ] `npm run release:gate` passes
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Production env vars set

---

## Common Issues

### "Cannot connect to database"
- Check `DATABASE_URL` is set
- Verify PostgreSQL service is running

### "Login fails silently"
- Check browser console for errors
- Verify `SESSION_SECRET` is set
- Check CORS settings match your domain

### "OAuth callback error"
- Verify callback URL in GitHub app settings
- Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

### "Build fails"
- Run `npm run typecheck` to see TypeScript errors
- Check for missing dependencies with `npm install`

---

## Support

- **Safety Resources**: `/safety` or `SAFETY.md`
- **FAQ**: `/faq`
- **Crisis Help**: 988 (Suicide & Crisis Lifeline)
