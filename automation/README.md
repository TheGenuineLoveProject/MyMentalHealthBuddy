# Platform Automation Tools - 360° Development Excellence

This directory contains automation tools for MyMentalHealthBuddy platform development and deployment.

## Tools

### 🚀 `dev-server.mjs`
**Automated Development Server Startup**

Automatically configures and starts the development server with optimal settings:
- Auto-configures PORT and environment variables
- Validates required secrets
- Provides clear startup feedback
- Handles graceful shutdown

**Usage:**
```bash
node automation/dev-server.mjs
```

### 🏥 `health-monitor.mjs`
**Automated Health Monitoring & Recovery**

Continuously monitors server health and automatically restarts on failures:
- Health checks every 30 seconds
- Automatic restart on failure
- Graceful shutdown handling
- Detailed logging

**Usage:**
```bash
node automation/health-monitor.mjs
```

**Features:**
- ✅ Automatic server restart on crashes
- ✅ Health endpoint monitoring
- ✅ Error recovery
- ✅ Production-ready logging

## Integration

### Replit Deployment

The platform is configured to use these automation tools in `.replit`:

```toml
run = "node automation/dev-server.mjs"
```

### Manual Usage

**Start with auto-configuration:**
```bash
npm run dev:auto
```

**Start with health monitoring:**
```bash
npm run dev:monitored
```

## Environment Variables

Required secrets (configured in Replit Secrets):
- `DATABASE_URL` - PostgreSQL connection
- `SESSION_SECRET` - Session encryption
- `OPENAI_API_KEY` - AI chat features
- `STRIPE_SECRET_KEY` - Payment processing
- `STRIPE_PUBLISHABLE_KEY` - Frontend Stripe integration
- `SENTRY_DSN` - Backend error tracking (optional)
- `VITE_SENTRY_DSN` - Frontend error tracking (optional)
- `CANVA_CLIENT_ID` - Design features (optional)
- `CANVA_CLIENT_SECRET` - Design features (optional)

## 888...^ Perfection Features

These automation tools achieve platform excellence through:

1. **Zero-Touch Startup** - No manual configuration needed
2. **Self-Healing** - Automatic recovery from failures
3. **Continuous Monitoring** - Real-time health checks
4. **Production-Grade** - Enterprise-level reliability
5. **Clear Feedback** - Detailed logging and status updates

---

**Platform Status:** Production-ready with enterprise-grade automation 🚀
