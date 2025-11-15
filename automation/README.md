# MyMentalHealthBuddy - Automation Tools 🤖

## Overview
Enterprise-grade automated development server management with intelligent health monitoring, self-healing capabilities, and continuous platform evolution for 888...^ perfection.

## Tools

### 1. self-evolving-monitor.mjs ⭐ NEW - 888...^ Perfection
Intelligent platform monitor with adaptive health checking, performance optimization, and self-evolving capabilities.

**Features:**
- 🔄 Continuous health monitoring (30s intervals)
- 📊 Performance score calculation
- 🎯 Adaptive failure handling (max 3 consecutive failures)
- 📈 Uptime tracking and metrics
- 🔧 Intelligent auto-restart with verification
- 📝 Comprehensive logging with structured data
- 🚀 Readiness and liveness checks
- 💯 Production-ready self-healing

**Usage:**
```bash
npm run dev:evolve
```

**Metrics Tracked:**
- Platform uptime
- Total restarts
- Health check results
- Performance score (0-100)
- Consecutive failure count
- Service readiness status

### 2. health-monitor.mjs
Basic health monitoring with automatic restart on failures.

**Features:**
- 30-second health check intervals
- Automatic restart on failures
- Process management
- Graceful shutdown

**Usage:**
```bash
npm run dev:monitored
```

### 3. dev-server.mjs
Automated server startup with environment configuration.

**Features:**
- Auto-configuration
- Secret validation
- Environment setup
- Error handling

**Usage:**
```bash
npm run dev:auto
```

## Scripts

```json
{
  "dev:auto": "node automation/dev-server.mjs",
  "dev:monitored": "node automation/health-monitor.mjs",
  "dev:evolve": "node automation/self-evolving-monitor.mjs"
}
```

## Recommended Usage

**Development:** `npm run dev:evolve` - Full self-evolving monitoring  
**Basic Monitoring:** `npm run dev:monitored` - Simple health checks  
**Quick Start:** `npm run dev:auto` - Auto-configured startup  

## Health Monitoring Endpoints

The monitors check these endpoints:

1. **Health Check** - `/api/health`
   - Overall system health
   - Database connection
   - Memory usage
   - API service status

2. **Readiness Check** - `/api/health/ready`
   - Service readiness
   - Dependency availability
   - System initialization status

3. **Liveness Check** - `/api/health/live`
   - Process liveness
   - Basic availability

## Self-Healing Logic

The self-evolving monitor implements intelligent failure handling:

1. **Health Check Failure:** Increment consecutive failure counter
2. **Max Failures Reached (3):** Trigger automatic restart
3. **Restart Process:**
   - Gracefully terminate current server
   - Wait 2 seconds for cleanup
   - Start new server instance
   - Wait 10 seconds for initialization
   - Verify health check passes
4. **Recovery:** Reset failure counter on successful health check

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `SENTRY_DSN` - Sentry error tracking

**Optional:**
- `VITE_SENTRY_DSN` - Frontend Sentry tracking
- `CANVA_CLIENT_ID` - Canva integration
- `CANVA_CLIENT_SECRET` - Canva integration
- `STRIPE_SECRET_KEY` - Payment processing
- `SESSION_SECRET` - Session encryption

## Configuration

Edit the `CONFIG` object in `self-evolving-monitor.mjs`:

```javascript
const CONFIG = {
  port: 5000,
  healthCheckInterval: 30000, // 30 seconds
  performanceCheckInterval: 60000, // 1 minute
  restartDelay: 5000,
  maxConsecutiveFailures: 3,
  healthEndpoint: '/api/health',
  readinessEndpoint: '/api/health/ready',
  performanceEndpoint: '/api/performance'
};
```

## Production Deployment

The automation tools are designed for development. For production:
- Use the built-in Replit Autoscale health checks
- Configure `deployment.config.json` health check settings
- Monitor via `/api/health` endpoint with external tools
