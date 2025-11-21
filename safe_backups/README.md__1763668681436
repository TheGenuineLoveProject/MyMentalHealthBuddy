# MyMentalHealthBuddy - Automation Tools 🤖

## Overview
Enterprise-grade platform automation with intelligent monitoring, self-healing capabilities, production verification, and orchestrated workflows for 888...^ perfection from A to Z 360 degrees.

## 🎯 Platform Orchestrator - MASTER COMMAND

### platform-orchestrator.mjs ⭐ NEW - Unified Automation
Single command to access all platform automation modes with interactive selection.

**Features:**
- 🎛️ Interactive mode selection (6 automation modes)
- 🚀 One-command platform management
- 🔄 Intelligent mode switching
- 📊 Comprehensive workflow orchestration
- ⏱️ Auto-start with 10-second timeout

**Usage:**
```bash
npm run orchestrate
```

**Available Modes:**
1. **Start Platform** - Auto-configured development server
2. **Monitor Health** - Continuous health monitoring
3. **Self-Evolving Mode** - Intelligent self-healing (default)
4. **Verify Platform** - Run all verification checks
5. **Production Build** - Build for deployment
6. **Pre-Deploy Check** - Comprehensive pre-deployment validation

## 🔍 Verification Tools - Production Readiness

### verify-predeploy.mjs - Pre-Deployment Validation
Comprehensive verification suite ensuring 888...^ production readiness.

**Features:**
- ✅ Production build compilation (TypeScript + Vite)
- 📦 Build output verification (artifacts, bundle sizes)
- ⏱️ Performance timing analysis
- 🎯 Critical failure detection
- 📊 Detailed summary reporting
- 🚫 Exits immediately on critical failures

**Usage:**
```bash
npm run verify:predeploy
```

**Validation Steps:**
1. Production Build - Compile TypeScript and build bundles (CRITICAL)
2. Build Output Validation - Verify artifacts and sizes (CRITICAL)

**Note:** Health endpoint check requires server to be running. Use `verify:health` separately if needed.

### verify-health.mjs - Health Endpoint Testing
Tests all health endpoints with detailed status reporting.

**Features:**
- 🏥 Multiple endpoint testing
- ⏱️ Response time tracking
- 📊 Detailed status reporting
- 🎯 Required vs. optional classification
- ❌ Critical failure detection

**Usage:**
```bash
npm run verify:health
```

**Endpoints Tested:**
- `/api/health` - Overall system health (REQUIRED)
- `/api/health/ready` - Readiness check (REQUIRED)
- `/api/health/live` - Liveness check (OPTIONAL)

### verify-build.mjs - Build Output Validation
Validates production build outputs and bundle sizes.

**Features:**
- 📁 Directory existence checks
- 📄 Required file validation
- 📊 Bundle size analysis
- ⚠️ Large chunk detection
- 📈 Build quality metrics

**Usage:**
```bash
npm run verify:build
```

**Validation Checks:**
- Client distribution directory
- Server distribution directory
- Required HTML/JS files
- Bundle size analysis
- Chunk size warnings (>800KB)

## 🔄 Monitoring Tools - Continuous Health

### 1. self-evolving-monitor.mjs ⭐ - 888...^ Perfection
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

## 📜 Complete npm Scripts Reference

### Orchestration & Master Commands
```bash
npm run orchestrate           # 🎯 Master platform orchestrator (interactive)
npm run dev:evolve           # 🔄 Self-evolving mode (recommended for dev)
npm run dev:monitored        # 🏥 Health monitoring mode
npm run dev:auto             # 🚀 Quick auto-configured start
```

### Verification & Quality Assurance
```bash
npm run verify:predeploy     # ✅ Full pre-deployment validation
npm run verify:health        # 🏥 Health endpoint testing
npm run verify:build         # 📦 Build output validation
npm run verify:all           # 🎯 All verification checks
```

### Build & Deployment
```bash
npm run build                # 🏗️ Production build
npm start                    # ▶️  Start production server
```

### Database Management
```bash
npm run db:push              # 📊 Push schema changes to database
npm run db:studio            # 🎨 Open Drizzle Studio (database GUI)
```

## 🎯 Recommended Usage

**Primary Development:** `npm run orchestrate` - Interactive mode selection  
**Self-Evolving Mode:** `npm run dev:evolve` - Intelligent self-healing  
**Pre-Deployment:** `npm run verify:predeploy` - Full validation suite  
**Quick Start:** `npm run dev:auto` - Fast auto-configured startup  
**Health Check:** `npm run verify:health` - Endpoint verification  

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
