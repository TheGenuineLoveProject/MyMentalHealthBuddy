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

## Page Generation System (A→Z Execution Plan)

### Overview

The platform uses a config-driven page generation system. Route definitions in `client/src/content/routes.js` are the single source of truth. The generator creates JSX pages from these configs.

### AUTOPILOT BUILD

```bash
# Full build: generate all pages + verify integrity
npm run gen:pages:all && npm run verify:routes
```

### Category Run Order (A→Z)

Execute categories in this order for clean, incremental builds:

| Order | Category | Command |
|-------|----------|---------|
| 1 | Landing & Marketing | `npm run gen:pages:landing` |
| 2 | Authentication | `npm run gen:pages:category -- --category=auth` |
| 3 | Dashboard & Core | `npm run gen:pages:category -- --category=core` |
| 4 | Wellness & Healing | `npm run gen:pages:category -- --category=wellness` |
| 5 | Advanced & Mastery | `npm run gen:pages:category -- --category=advanced` |
| 6 | Content & Learning | `npm run gen:pages:category -- --category=content` |
| 7 | Community & Social | `npm run gen:pages:category -- --category=community` |
| 8 | Support & Resources | `npm run gen:pages:category -- --category=support` |
| 9 | Legal & Policy | `npm run gen:pages:category -- --category=legal` |
| 10 | Account & Settings | `npm run gen:pages:category -- --category=account` |
| 11 | Admin | `npm run gen:pages:category -- --category=admin` |
| 12 | System & Utility | `npm run gen:pages:category -- --category=system` |

### Generation Commands

```bash
# Generate by mode
npm run gen:pages:landing          # Landing pages only
npm run gen:pages:category         # Single category (see --category flag)
npm run gen:pages:range            # Range A-C (--from=A --to=C)
npm run gen:pages:all              # All categories

# Verification
npm run verify:routes              # Check manifest integrity
npm run verify:routes:fix          # Regenerate if drift detected

# Diff reports
npm run print:routes:diff          # Show route changes
npm run print:routes:diff:ci       # CI mode (max 20 lines)
npm run print:routes:diff:gha      # GitHub Actions format
npm run print:routes:diff:gha:max20 # GHA + max 20 lines
```

### Port 5000 Collision Fix

If port 5000 is already in use:

```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port (development only)
PORT=5001 npm run dev
```

**Note**: Production must use port 5000 (Replit's exposed port).

### Overwrite Guard (`// @generated`)

Generated files are protected by the `// @generated` marker:

```javascript
// @generated
/**
 * Page Name
 * Generated by: scripts/generate-pages.mjs
 */
```

**How it works:**
1. Generator checks for `// @generated` marker at top of file
2. If present → file can be overwritten
3. If missing or different → file is SKIPPED (manual edit protection)
4. If file doesn't exist → file is CREATED

**To manually edit a generated file:**
1. Remove the `// @generated` marker
2. Generator will skip it on future runs
3. You're now responsible for maintaining it

**To regenerate a manually edited file:**
1. Delete the file
2. Run `npm run gen:pages:all`
3. File will be recreated with `// @generated` marker

### Adding New Routes Safely

1. **Add route config to `routes.js`:**
```javascript
// In client/src/content/routes.js
{
  path: '/your-new-route',
  category: 'wellness',  // Use existing category
  title: 'Your Page Title',
  hero: { /* hero config */ },
  sections: [ /* sections */ ]
}
```

2. **Generate the page:**
```bash
npm run gen:pages:category -- --category=wellness
```

3. **Verify integrity:**
```bash
npm run verify:routes
```

4. **Check for drift:**
```bash
npm run print:routes:diff
```

5. **Commit the changes:**
```bash
git add client/src/pages/generated/ reports/
git commit -m "Add new route: /your-new-route"
```

### Manifest Files

| File | Purpose |
|------|---------|
| `reports/routes.generated.json` | Route manifest (source of truth) |
| `reports/routes.generated.sha256` | Hash for integrity verification |
| `reports/routes.config.snapshot.json` | Config snapshot |
| `reports/routes.config.sha256` | Config hash |

### CI Integration

Add to your CI pipeline:
```yaml
- name: Verify routes
  run: npm run verify:routes

- name: Check for drift
  run: npm run print:routes:diff:gha:max20
```

---

## Support

- **Safety Resources**: `/safety` or `SAFETY.md`
- **FAQ**: `/faq`
- **Crisis Help**: 988 (Suicide & Crisis Lifeline)
