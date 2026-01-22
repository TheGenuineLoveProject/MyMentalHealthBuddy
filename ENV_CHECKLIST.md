# ENV CHECKLIST — The Genuine Love Project

## Required Environment Variables

### Database (Required)
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `DATABASE_URL` | `server/db/connection.mjs` | PostgreSQL connection string |
| `PGHOST` | DB connection | PostgreSQL host |
| `PGPORT` | DB connection | PostgreSQL port |
| `PGUSER` | DB connection | PostgreSQL user |
| `PGPASSWORD` | DB connection | PostgreSQL password |
| `PGDATABASE` | DB connection | PostgreSQL database name |

### Authentication (Required)
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `SESSION_SECRET` | `server/middleware/session.mjs` | Express session secret |
| `JWT_ACCESS_EXPIRES` | `server/routes/auth.mjs` | JWT access token expiry |
| `JWT_REFRESH_EXPIRES` | `server/routes/auth.mjs` | JWT refresh token expiry |
| `COOKIE_SECURE` | `server/utils/cookies.mjs` | Cookie secure flag |
| `COOKIE_SAMESITE` | `server/utils/cookies.mjs` | Cookie SameSite policy |

### GitHub OAuth (Required for GitHub login)
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `GITHUB_CLIENT_ID` | `server/routes/github-auth.mjs` | GitHub OAuth app ID |
| `GITHUB_CLIENT_SECRET` | `server/routes/github-auth.mjs` | GitHub OAuth app secret |

### OpenAI (Required for AI features)
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `OPENAI_API_KEY` | `server/routes/ai.mjs` | OpenAI API key |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | AI integration | Replit-managed OpenAI key |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | AI integration | OpenAI base URL |

### Stripe (Required for payments)
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `STRIPE_SECRET_KEY` | `server/utils/stripe.mjs` | Stripe secret key |
| `VITE_STRIPE_PUBLIC_KEY` | Frontend | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | `server/routes/webhook.mjs` | Stripe webhook secret |
| `STRIPE_PRICE_BASIC` | Billing routes | Basic plan price ID |
| `STRIPE_PRICE_PRO` | Billing routes | Pro plan price ID |
| `STRIPE_PRICE_PREMIUM` | Billing routes | Premium plan price ID |

### Monitoring (Optional)
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `SENTRY_DSN` | `server/utils/sentry.mjs` | Sentry error tracking |
| `VITE_SENTRY_DSN` | Frontend | Sentry for frontend |

### Email (Optional)
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `RESEND_API_KEY` | Email services | Resend API for email |

### Canva Integration (Optional)
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `CANVA_CLIENT_ID` | `server/routes/canva-oauth.mjs` | Canva OAuth |
| `CANVA_APP_ORIGIN` | Canva integration | App origin URL |
| `CANVA_ENABLE_IMR` | Canva integration | Enable IMR |

### CORS & Domains
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `CORS_ORIGIN` | `server/index.mjs` | Allowed CORS origins |
| `REPLIT_DOMAINS` | Various | Replit domain list |
| `REPLIT_DEV_DOMAIN` | Development | Dev domain |

### Application
| Variable | Location Used | Description |
|----------|---------------|-------------|
| `NODE_ENV` | Various | Environment (development/production) |
| `ADMIN_EMAILS` | Admin check | Comma-separated admin emails |

---

## env.example Template

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tglp
PGHOST=localhost
PGPORT=5432
PGUSER=user
PGPASSWORD=password
PGDATABASE=tglp

# Auth
SESSION_SECRET=your-session-secret-here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
COOKIE_SECURE=false
COOKIE_SAMESITE=lax

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OpenAI
OPENAI_API_KEY=your-openai-key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_BASIC=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_PREMIUM=price_xxx

# Admin
ADMIN_EMAILS=admin@example.com

# Environment
NODE_ENV=development
```

---

## Status

- ✅ All required secrets are configured in Replit
- ✅ Database connection available
- ✅ GitHub OAuth configured
- ✅ Stripe configured
- ✅ OpenAI configured
