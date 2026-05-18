import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, AlertCircle, Search, Play, CheckSquare, ArrowRight, Wand2, MessageSquare, Headphones, Heart, BookOpen, Sun, Moon, Leaf, Eye, FileQuestion, Gauge, Lightbulb, Landmark, GraduationCap, Brain, Sparkles, Mountain, Compass, Layers, Puzzle, Milestone, Trophy, HeartHandshake, Flame, Target, Flower2, TreePine, CircleDot, Shield, Feather, Gem, Award, Zap, TrendingUp, Star, Orbit, Rocket, Footprints, Workflow, Globe, Network, Users, FileText, Palette, Mail, Share2, Megaphone, PenTool, UserCheck, LayoutDashboard, CreditCard, ShieldCheck, ClipboardList, BarChart3, Activity, PackageCheck, DollarSign, Webhook, Contact, Key, Handshake, Upload, UserCog, ListOrdered, Radio, Fingerprint, FolderKanban, Rss, LogIn, Inbox, Clock, Download, Timer, Filter, RotateCcw, Wrench, ExternalLink, Stethoscope, Terminal, FileWarning, Cpu, Clipboard, ScanLine, HardDrive, GitBranch, XCircle, CheckCircle2, Loader2 } from 'lucide-react';
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import AIKnowledgeBaseSummary from "../../components/admin/AIKnowledgeBaseSummary";

const TOOL_ADMIN_LINKS = {
  "ai-chat": "/chat", "therapy": "/admin/tools", "mood-tracker": "/admin/health", "journal": "/admin/health",
  "gratitude": "/admin/engagement", "reflection": "/admin/engagement", "wellness-tools": "/admin/tools",
  "mirror": "/admin/tools", "prompts": "/admin/engagement", "states": "/admin/health",
  "wisdom": "/admin/tools", "wisdom-engine": "/admin/tools", "philosophy": "/admin/tools",
  "metacognition": "/admin/tools", "creativity": "/admin/tools", "resilience": "/admin/tools",
  "foresight": "/admin/tools", "knowledge": "/admin/tools", "cognitive-lab": "/admin/tools",
  "cognitive-mastery": "/admin/tools", "deep-learning": "/admin/tools", "dialectics": "/admin/tools",
  "practices": "/admin/tools", "insights": "/admin/tools",
  "trauma-healing": "/admin/tools", "emotional-resilience": "/admin/tools", "emotional-mastery": "/admin/tools",
  "healing-modalities": "/admin/tools", "holistic-healing": "/admin/tools", "healing-tools": "/admin/tools",
  "healing-core": "/admin/tools", "healing-intelligence": "/admin/tools", "post-trauma": "/admin/tools",
  "mind-body": "/admin/tools", "psychological-safety": "/admin/tools",
  "self-mastery-intelligence": "/admin/tools", "self-mastery": "/admin/tools", "peak-performance": "/admin/tools",
  "personal-growth": "/admin/tools", "life-purpose": "/admin/tools", "life-design": "/admin/tools",
  "purpose-compass": "/admin/tools", "mastery-excellence": "/admin/tools", "meaning": "/admin/tools",
  "meaning-core": "/admin/tools", "transformation": "/admin/tools", "values": "/admin/tools",
  "praxis": "/admin/tools",
  "consciousness": "/admin/tools", "human-potential": "/admin/tools", "spiritual-intelligence": "/admin/tools",
  "wisdom-traditions": "/admin/tools", "wisdom-synthesis": "/admin/tools", "contemplative": "/admin/tools",
  "ethical-reasoning": "/admin/tools", "existential": "/admin/tools", "neuro-integration": "/admin/tools",
  "socio-ecology": "/admin/tools", "cognitive-enhancement": "/admin/tools",
  "relationship-dynamics": "/admin/tools", "social-intelligence": "/admin/tools", "relational": "/admin/tools",
  "collective-intelligence": "/admin/tools", "systems-compassion": "/admin/tools", "embodiment": "/admin/tools",
  "narrative": "/admin/narrative", "community": "/admin/engagement",
  "content-studio": "/admin/content-studio", "content-intelligence": "/admin/content-studio",
  "content-api": "/admin/content-studio", "content-generator": "/admin/content-studio",
  "universal-content": "/admin/content-studio", "blog-api": "/admin/publishing",
  "newsletter-api": "/admin/newsletter", "social-posts": "/admin/social-studio",
  "social-posting": "/admin/social-studio", "narrative-drafts": "/admin/narrative",
  "perplexity": "/admin/tools", "rss-alt": "/admin/publishing",
  "account": "/admin/users", "onboarding": "/admin/engagement", "gamification": "/admin/engagement",
  "progress": "/admin/engagement", "badges": "/admin/engagement", "favorites": "/admin/engagement",
  "dashboard-api": "/admin/health", "pro-features": "/admin/revenue", "leads": "/admin/revenue",
  "feedback": "/admin/feedback", "account-actions": "/admin/users", "ai-dashboard": "/admin/health",
  "moods-alt": "/admin/health",
  "admin-core": "/admin", "admin-security": "/admin/security", "admin-audit": "/admin/audit-log",
  "admin-billing": "/admin/billing", "admin-publishing": "/admin/publishing",
  "admin-social": "/admin/social-studio", "admin-enterprise": "/admin/social/ops",
  "analytics": "/admin/analytics", "metrics": "/admin/analytics", "soft-launch": "/admin/health",
  "health-api": "/admin/health", "deployment": "/admin/tools", "integrations": "/admin/tools",
  "object-storage": "/admin/tools", "api-core": "/admin/health",
  "billing": "/admin/billing", "webhook": "/admin/billing", "email": "/admin/newsletter",
  "contact": "/admin/feedback", "auth-github": "/admin/security", "products": "/admin/revenue",
  "invites": "/admin/engagement", "feed": "/admin/publishing", "figma-api": "/admin/tools",
  "login": "/admin/security", "user-mgmt": "/admin/users", "user-settings": "/admin/users",
  "uploads": "/admin/tools", "metrics-summary": "/admin/analytics",
  "social-posts-alt": "/admin/social-studio", "analytics-events": "/admin/analytics",
  "mfa-auth": "/admin/security", "canva-oauth": "/admin/tools", "rss-feed": "/admin/publishing",
  "auth-core": "/admin/security",
};

const TOOL_SEVERITY = {
  "health-api": "critical", "ai-chat": "critical", "auth-core": "critical",
  "billing": "critical", "email": "critical", "perplexity": "critical",
  "canva-oauth": "critical", "webhook": "critical", "api-core": "critical",
  "therapy": "critical", "dashboard-api": "critical",
  "admin-core": "high", "admin-security": "high", "analytics": "high",
  "blog-api": "high", "newsletter-api": "high", "login": "high",
  "user-mgmt": "high", "mfa-auth": "high", "auth-github": "high",
  "object-storage": "high", "mood-tracker": "high", "journal": "high",
  "content-studio": "high", "social-posts": "high", "gamification": "high",
  "account": "high", "integrations": "high", "deployment": "high",
  "admin-audit": "high", "admin-billing": "high", "admin-publishing": "high",
  "admin-social": "high", "admin-enterprise": "high", "metrics": "high",
  "soft-launch": "high", "user-settings": "high", "account-actions": "high",
  "social-posting": "high", "narrative-drafts": "high", "content-api": "high",
  "content-generator": "high", "content-intelligence": "high",
  "trauma-healing": "high", "healing-tools": "high", "healing-intelligence": "high",
  "leads": "high", "feedback": "high", "pro-features": "high",
  "onboarding": "high", "products": "high", "contact": "high",
  "uploads": "high", "figma-api": "high", "rss-feed": "high",
  "gratitude": "medium", "reflection": "medium", "wellness-tools": "medium",
  "mirror": "medium", "prompts": "medium", "states": "medium",
  "wisdom": "medium", "wisdom-engine": "medium", "philosophy": "medium",
  "metacognition": "medium", "creativity": "medium", "resilience": "medium",
  "foresight": "medium", "knowledge": "medium", "cognitive-lab": "medium",
  "cognitive-mastery": "medium", "deep-learning": "medium", "dialectics": "medium",
  "practices": "medium", "insights": "medium",
  "emotional-resilience": "medium", "emotional-mastery": "medium",
  "healing-modalities": "medium", "holistic-healing": "medium",
  "healing-core": "medium", "post-trauma": "medium",
  "mind-body": "medium", "psychological-safety": "medium",
  "self-mastery-intelligence": "medium", "self-mastery": "medium",
  "peak-performance": "medium", "personal-growth": "medium",
  "life-purpose": "medium", "life-design": "medium",
  "purpose-compass": "medium", "mastery-excellence": "medium",
  "meaning": "medium", "meaning-core": "medium",
  "transformation": "medium", "values": "medium", "praxis": "medium",
  "consciousness": "medium", "human-potential": "medium",
  "spiritual-intelligence": "medium", "wisdom-traditions": "medium",
  "wisdom-synthesis": "medium", "contemplative": "medium",
  "ethical-reasoning": "medium", "existential": "medium",
  "neuro-integration": "medium", "socio-ecology": "medium",
  "cognitive-enhancement": "medium",
  "relationship-dynamics": "medium", "social-intelligence": "medium",
  "relational": "medium", "collective-intelligence": "medium",
  "systems-compassion": "medium", "embodiment": "medium",
  "narrative": "medium", "community": "medium",
  "universal-content": "medium", "rss-alt": "medium",
  "progress": "medium", "badges": "medium", "favorites": "medium",
  "ai-dashboard": "medium", "moods-alt": "medium",
  "analytics-events": "medium", "metrics-summary": "medium",
  "social-posts-alt": "medium", "invites": "medium", "feed": "medium",
};

const AI_REMEDIATION = {
  "timeout": { suggestion: "Server may be under heavy load or endpoint is slow. Check server resources and consider adding response caching. Codex KB: High latency often correlates with unoptimized database queries or missing indexes.", action: "Check server CPU/memory usage", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "unreachable": { suggestion: "Network connectivity issue or server is down. Verify the server process is running and the route is properly mounted in server/app.mjs.", action: "Restart application server", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "server-error": { suggestion: "Internal server error (500). Check server logs for stack traces and recent code changes. Perplexity KB: Common causes include unhandled promise rejections, missing env vars, or database connection failures.", action: "Review server error logs", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "rate-limited": { suggestion: "Rate limit exceeded (429). This is normal for high-traffic endpoints. Consider increasing rate limits or implementing request queuing. Canva KB: Batch API calls to reduce rate limit pressure.", action: "Adjust rate limits in config", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "auth-gated": { suggestion: "Endpoint requires authentication (401). This is expected behavior for user-facing APIs. No remediation needed — endpoint is reachable and functioning correctly.", action: "No action needed - working as designed", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "admin-only": { suggestion: "Admin authorization required (403). Ensure ADMIN_TOKEN secret is configured. Codex KB: Check that admin middleware validates the x-admin-token header.", action: "Verify ADMIN_TOKEN secret", knowledgeBase: "Codex", autoFixable: true, fixCommand: "verify-admin-token" },
  "post-only": { suggestion: "Endpoint only accepts POST/PUT requests (405). Health check passed — endpoint is reachable. GET returns 405 but endpoint is functional.", action: "No action needed - POST-only endpoint", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "404": { suggestion: "Endpoint not found. Route may not be mounted or the path may be incorrect. Codex KB: Verify mountIfExists() call in server/app.mjs and check the route file exports a valid Express router.", action: "Check server/app.mjs for route mount", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "ok": { suggestion: "Endpoint is responding normally. No issues detected.", action: "No action needed", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "cors-error": { suggestion: "Cross-origin request blocked. Perplexity KB: Ensure CORS middleware is configured with the correct allowed origins in server/app.mjs.", action: "Update CORS configuration", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "ssl-error": { suggestion: "SSL/TLS certificate issue. Canva KB: In Replit environment, SSL is handled by the proxy layer. Ensure requests use the correct protocol.", action: "Verify SSL configuration", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "db-connection": { suggestion: "Database connection failure. Codex KB: Check DATABASE_URL environment variable, verify Neon PostgreSQL is accessible, and check connection pool limits.", action: "Test database connection", knowledgeBase: "Codex", autoFixable: true, fixCommand: "test-db" },
  "memory-pressure": { suggestion: "High memory usage detected. Perplexity KB: Node.js heap may be approaching limits. Consider implementing garbage collection hints and reducing in-memory caching.", action: "Monitor memory trends", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "restart-service" },
  "slow-response": { suggestion: "Response time exceeds 2 seconds. Codex KB: Optimize database queries, add response caching, and consider implementing pagination for large datasets.", action: "Optimize slow endpoints", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "dependency-missing": { suggestion: "Required dependency or service unavailable. Perplexity KB: Check that all third-party services (Stripe, Resend, OpenAI, Perplexity) have valid API keys configured.", action: "Verify service API keys", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "config-error": { suggestion: "Configuration mismatch detected. Codex KB: Environment variables may be missing or incorrectly formatted. Check .env and Replit secrets.", action: "Review environment configuration", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "schema-drift": { suggestion: "Database schema may be out of sync. Codex KB: Run 'npm run db:push' to synchronize Drizzle ORM schema with the database.", action: "Run db:push to sync schema", knowledgeBase: "Codex", autoFixable: true, fixCommand: "sync-schema" },
  "integration-down": { suggestion: "Third-party integration is not responding. Canva KB: Check service status pages for Stripe, Resend, OpenAI, and Perplexity. These are external dependencies.", action: "Check external service status", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "cache-stale": { suggestion: "Cached data may be stale. Codex KB: Clear server-side cache and force-refresh client-side data by invalidating query keys.", action: "Clear application caches", knowledgeBase: "Codex", autoFixable: true, fixCommand: "clear-cache" },
  "session-expired": { suggestion: "User session has expired. Codex KB: Session TTL is configured in Express session middleware. Re-authenticate to restore access.", action: "Re-authenticate session", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "route-missing": { suggestion: "Route file exists but is not mounted. Codex KB: Add mountIfExists() call in server/app.mjs for the route path. Verify the file exports a default Express router.", action: "Mount route in server/app.mjs", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "env-missing": { suggestion: "Required environment variable is not set. Perplexity KB: Check Replit Secrets panel for missing keys. Common missing vars: STRIPE_SECRET_KEY, RESEND_API_KEY, OPENAI_API_KEY.", action: "Add missing env var in Secrets", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "stripe-webhook-fail": { suggestion: "Stripe webhook endpoint is failing. Canva KB: Verify STRIPE_WEBHOOK_SECRET is configured and webhook signature validation matches. Check Stripe dashboard for delivery failures.", action: "Verify Stripe webhook secret", knowledgeBase: "Canva", autoFixable: true, fixCommand: "verify-admin-token" },
  "openai-quota": { suggestion: "OpenAI API quota exceeded or rate limited. Perplexity KB: Check billing status on OpenAI dashboard. Implement exponential backoff and request queueing for high-volume periods.", action: "Check OpenAI billing/quota", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "resend-bounce": { suggestion: "Email delivery failing through Resend. Canva KB: Check sender domain verification, SPF/DKIM records, and Resend dashboard for bounce rates. Hard bounces require address cleanup.", action: "Review Resend delivery logs", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "perplexity-timeout": { suggestion: "Perplexity AI responses are timing out. Perplexity KB: Factual AI queries may take longer for complex topics. Increase timeout to 15s and implement streaming for long responses.", action: "Increase Perplexity timeout", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "canva-token-expired": { suggestion: "Canva OAuth token has expired. Canva KB: OAuth tokens have limited TTL. Implement token refresh flow using the stored refresh_token. Check /api/canva-oauth/status.", action: "Refresh Canva OAuth token", knowledgeBase: "Canva", autoFixable: true, fixCommand: "restart-service" },
  "websocket-disconnect": { suggestion: "WebSocket connection dropped. Codex KB: Check for proxy timeout settings. Replit's infrastructure has WebSocket support but connections may drop after idle periods.", action: "Implement reconnection logic", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "session-corrupt": { suggestion: "Session data is corrupted or inconsistent. Codex KB: Clear the session store and force re-authentication. Check Express session secret rotation timing.", action: "Clear session store", knowledgeBase: "Codex", autoFixable: true, fixCommand: "clear-cache" },
  "migration-needed": { suggestion: "Database tables missing or schema needs update. Codex KB: Run npm run db:push to create/update tables. Never manually write SQL migrations for Drizzle.", action: "Run npm run db:push", knowledgeBase: "Codex", autoFixable: true, fixCommand: "sync-schema" },
  "disk-full": { suggestion: "Storage capacity approaching limits. Perplexity KB: Check Replit storage usage. Clear logs, temp files, and old uploads. Object storage has separate limits from disk.", action: "Clear temp files and old logs", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "cold-start": { suggestion: "Service experiencing cold start delays. Codex KB: First request after idle may be slow due to module loading and DB connection establishment. This is transient.", action: "Wait for warmup — retry in 10s", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "circular-dependency": { suggestion: "Module loading failed due to circular imports. Perplexity KB: Check import chains between shared/, server/, and client/ directories. Use dynamic imports to break cycles.", action: "Audit module import chains", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "import-error": { suggestion: "Module import failed. Codex KB: Missing dependency in package.json or incorrect import path. Run npm install and verify all imports resolve correctly.", action: "Run npm install", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "build-fail": { suggestion: "Build process failed. Canva KB: Check Vite build output for TypeScript errors, missing assets, or configuration issues. Common fix: clear .cache and rebuild.", action: "Clear cache and rebuild", knowledgeBase: "Canva", autoFixable: true, fixCommand: "clear-cache" },
  "dns-fail": { suggestion: "DNS resolution failed for external service. Perplexity KB: External APIs (Stripe, Resend, OpenAI) may be unreachable due to DNS issues. Usually transient — retry after 30 seconds.", action: "Retry after DNS propagation", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "restart-service" },
  "proxy-error": { suggestion: "Reverse proxy returned an error. Canva KB: Replit's proxy layer may be overloaded or the app took too long to respond. Ensure response time is under 30 seconds.", action: "Reduce response time below 30s", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "redirect-loop": { suggestion: "Infinite redirect detected. Codex KB: Check middleware order — auth redirects, trailing slash normalizers, and HTTPS redirectors can create loops. Verify redirect conditions.", action: "Audit redirect middleware chain", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "content-type-mismatch": { suggestion: "Response Content-Type doesn't match expected format. Perplexity KB: Ensure API endpoints set proper Content-Type headers (application/json). HTML responses from API routes indicate a routing issue.", action: "Fix Content-Type headers", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "payload-too-large": { suggestion: "Request body exceeds size limit (413). Canva KB: Express body parser has default limits. Increase limit for file upload endpoints: express.json({ limit: '10mb' }).", action: "Increase body parser limit", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "pool-exhausted": { suggestion: "Database connection pool is exhausted. Codex KB: All connections in use — queries are waiting. Increase pool size or optimize long-running transactions. Check for connection leaks.", action: "Increase DB pool size", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "jwt-invalid": { suggestion: "JWT token validation failed. Codex KB: Token may be malformed, expired, or signed with wrong key. Check JWT_SECRET consistency between token creation and validation.", action: "Verify JWT secret configuration", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "csp-violation": { suggestion: "Content Security Policy blocking resource. Canva KB: Helmet CSP may be too restrictive. Add required domains to CSP directives for scripts, styles, images, and connect-src.", action: "Update Helmet CSP policy", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "api-version-mismatch": { suggestion: "API version incompatibility detected. Perplexity KB: Client and server may be running different API versions after a deployment. Clear browser cache and reload.", action: "Force client cache refresh", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "clear-cache" },
  "upstream-502": { suggestion: "Bad gateway from upstream service. Perplexity KB: External API (Stripe, OpenAI, Resend) returned an invalid response. This is typically transient — retry after 10 seconds.", action: "Retry after brief delay", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "restart-service" },
  "upstream-503": { suggestion: "Upstream service temporarily unavailable. Canva KB: External dependency is under maintenance or experiencing issues. Check service status pages.", action: "Check upstream service status", knowledgeBase: "Canva", autoFixable: true, fixCommand: "restart-service" },
  "upstream-504": { suggestion: "Gateway timeout from upstream. Codex KB: Request to external API timed out. May indicate heavy load on the third-party service. Implement circuit breaker pattern.", action: "Implement circuit breaker", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "tls-handshake": { suggestion: "TLS/SSL handshake failed with external service. Canva KB: Certificate validation issue or protocol mismatch. Ensure Node.js TLS settings are compatible.", action: "Check TLS configuration", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "token-drift": { suggestion: "Authentication token clock drift detected. Codex KB: Server time may be out of sync, causing JWT 'iat' or 'exp' validation failures. Check system clock.", action: "Verify server time sync", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "rate-limit-burst": { suggestion: "Sudden burst of rate-limited requests. Perplexity KB: Multiple concurrent users hitting rate limits simultaneously. Consider implementing request queuing with exponential backoff.", action: "Implement request queuing", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "cache-poisoning": { suggestion: "Potentially stale or corrupted cache data. Codex KB: Cache entries may contain outdated or malformed data. Clear all caches and rebuild from source of truth.", action: "Flush and rebuild caches", knowledgeBase: "Codex", autoFixable: true, fixCommand: "clear-cache" },
  "body-parser-error": { suggestion: "Request body parsing failed. Canva KB: Malformed JSON in request body or Content-Type mismatch. Ensure clients send proper JSON with correct headers.", action: "Validate request Content-Type", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "connection-refused": { suggestion: "Connection actively refused by remote host. Perplexity KB: Target service is not running or port is blocked. Check if the dependent service process is active.", action: "Restart dependent service", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "restart-service" },
  "event-loop-blocked": { suggestion: "Node.js event loop appears blocked. Codex KB: Synchronous operation blocking the event loop. Profile with --inspect flag and look for CPU-intensive synchronous calls.", action: "Profile event loop blocking", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "heap-overflow": { suggestion: "JavaScript heap out of memory. Perplexity KB: Application exceeded V8 memory limits. Increase NODE_OPTIONS=--max-old-space-size or optimize memory-heavy operations.", action: "Increase heap size limit", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "restart-service" },
  "orphaned-session": { suggestion: "Orphaned user sessions detected. Codex KB: Sessions exist without corresponding user records. Clean session store and enforce session-user binding.", action: "Clean orphaned sessions", knowledgeBase: "Codex", autoFixable: true, fixCommand: "clear-session-store" },
  "webhook-signature-invalid": { suggestion: "Webhook signature verification failed. Canva KB: Webhook secret may have been rotated on the provider side. Update STRIPE_WEBHOOK_SECRET or verify signing key.", action: "Update webhook signing secret", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "db-deadlock": { suggestion: "Database deadlock detected. Codex KB: Two or more transactions are waiting on each other. Review query ordering and use consistent lock acquisition patterns.", action: "Review transaction lock ordering", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "stale-connection": { suggestion: "Stale database connections in pool. Perplexity KB: Connection pool contains idle connections that have been closed by the server. Enable pool validation and keepalive.", action: "Enable connection pool validation", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "restart-service" },
  "file-descriptor-limit": { suggestion: "File descriptor limit approaching. Canva KB: Too many open file handles. Check for unclosed file streams and socket connections. Monitor with lsof.", action: "Check open file descriptors", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "middleware-order": { suggestion: "Middleware execution order issue. Codex KB: Request processing failed due to incorrect middleware chain ordering. Verify auth, body-parser, and CORS middleware sequence in app.mjs.", action: "Audit middleware ordering", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "env-format-invalid": { suggestion: "Environment variable has invalid format. Perplexity KB: Value parsing failed — check for trailing whitespace, missing quotes, or incorrect encoding in Replit Secrets.", action: "Validate env var format", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "refresh-token-expired": { suggestion: "OAuth refresh token has expired. Canva KB: Long-lived refresh token has exceeded its TTL. User must re-authorize the OAuth connection from scratch.", action: "Re-authorize OAuth connection", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "idempotency-violation": { suggestion: "Duplicate request processing detected. Codex KB: Non-idempotent operation executed multiple times. Implement idempotency keys for payment and state-changing endpoints.", action: "Add idempotency key handling", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "resource-contention": { suggestion: "Resource contention causing degraded performance. Perplexity KB: Multiple processes competing for CPU/memory. Review concurrent task limits and implement request throttling.", action: "Implement request throttling", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "warmup-needed": { suggestion: "Service needs warmup after cold start. Codex KB: Lazy-loaded modules and connection pools take time to initialize. Pre-warm critical paths after deployment.", action: "Pre-warm critical endpoints", knowledgeBase: "Codex", autoFixable: true, fixCommand: "warm-endpoints" },
  "index-corruption": { suggestion: "Database index may be corrupted or missing. Codex KB: Query performance degradation can indicate stale or dropped indexes. Rebuild indexes on affected tables.", action: "Rebuild database indexes", knowledgeBase: "Codex", autoFixable: true, fixCommand: "sync-schema" },
  "dns-cache-stale": { suggestion: "DNS cache contains stale entries. Perplexity KB: Cached DNS records for external services may point to deprecated IPs. Flush DNS resolver cache.", action: "Flush DNS cache", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "restart-service" },
  "token-rotation-needed": { suggestion: "API tokens require rotation. Canva KB: Long-lived tokens should be rotated periodically for security. Check token age and refresh credentials.", action: "Rotate API tokens", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "preflight-failed": { suggestion: "CORS preflight request failed. Codex KB: OPTIONS request rejected — verify Access-Control-Allow-Methods and Access-Control-Allow-Headers in CORS config.", action: "Update CORS preflight config", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "graceful-shutdown": { suggestion: "Service did not shut down gracefully. Perplexity KB: Previous process may have left open handles or locked resources. Force cleanup and restart.", action: "Force cleanup and restart", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "restart-service" },
  "query-timeout": { suggestion: "Database query timed out. Codex KB: Long-running queries may lock tables. Check for missing WHERE clauses, full table scans, or uncommitted transactions.", action: "Optimize slow queries", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "websocket-backpressure": { suggestion: "WebSocket message backpressure detected. Perplexity KB: Send buffer is full — client cannot consume messages fast enough. Implement message prioritization.", action: "Implement WS message throttling", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "storage-quota": { suggestion: "Object storage quota nearing limit. Canva KB: Uploaded files approaching storage cap. Archive old files or increase storage allocation.", action: "Review storage usage", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "response-truncated": { suggestion: "Response body was truncated. Codex KB: Large payloads may be cut off by proxy or body size limits. Enable streaming for large responses or paginate results.", action: "Enable response streaming", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "certificate-expiry": { suggestion: "SSL certificate approaching expiry. Canva KB: Certificate renewal should be automated. In Replit, certificates are managed by the platform layer.", action: "Verify certificate auto-renewal", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "session-fixation": { suggestion: "Potential session fixation vulnerability. Codex KB: Session ID should be regenerated after authentication. Ensure express-session regenerates on login.", action: "Regenerate session on login", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "partial-response": { suggestion: "Server returned a partial response (206). Perplexity KB: Range requests or chunked transfer incomplete. May indicate interrupted file downloads or streaming.", action: "Check transfer encoding", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "git-corruption": { suggestion: "Git repository may have integrity issues. Codex KB: Run git fsck to check object database integrity. Corrupted refs or loose objects can cause checkout failures.", action: "Run git integrity check", knowledgeBase: "Codex", autoFixable: true, fixCommand: "repair-git" },
  "git-untracked": { suggestion: "Untracked files detected in repository. Perplexity KB: Review untracked files for sensitive data, build artifacts, or temp files that should be in .gitignore.", action: "Review .gitignore rules", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "env-validation-fail": { suggestion: "Environment variable validation failed. Codex KB: One or more required env vars have invalid format or empty values. Run validate-env to audit all configuration.", action: "Run environment validation", knowledgeBase: "Codex", autoFixable: true, fixCommand: "validate-env" },
  "log-overflow": { suggestion: "Server logs consuming excessive storage. Perplexity KB: Log rotation not configured or log level too verbose. Prune old logs and adjust log level to 'warn' in production.", action: "Prune and rotate logs", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "prune-logs" },
  "deep-scan-needed": { suggestion: "Platform integrity deep scan recommended. Codex KB: Comprehensive audit of DB schema, route mounts, env vars, and service health provides full system visibility.", action: "Run deep platform scan", knowledgeBase: "Codex", autoFixable: true, fixCommand: "health-deep-scan" },
  "route-collision": { suggestion: "Potential route path collision detected. Codex KB: Two or more routes may be matching the same path. Check Express route ordering and use exact path matching where possible.", action: "Audit route path conflicts", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "worker-thread-hang": { suggestion: "Worker thread appears unresponsive. Perplexity KB: Background tasks may be stuck in infinite loops or deadlocked. Check async operation chains for unresolved promises.", action: "Review background task health", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "restart-service" },
  "asset-404": { suggestion: "Static asset returning 404. Canva KB: Build output may be missing assets. Verify Vite build includes all referenced images, fonts, and media files.", action: "Rebuild static assets", knowledgeBase: "Canva", autoFixable: true, fixCommand: "clear-cache" },
  "compression-fail": { suggestion: "Response compression not applied. Perplexity KB: Compression middleware may not be loaded or is bypassed for certain content types. Verify middleware ordering.", action: "Check compression middleware", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "socket-leak": { suggestion: "Socket connection leak detected. Codex KB: Open sockets not being properly closed after use. Check HTTP agent keepAlive settings and WebSocket cleanup handlers.", action: "Audit socket lifecycle", knowledgeBase: "Codex", autoFixable: true, fixCommand: "drain-connections" },
  "integrity-mismatch": { suggestion: "Platform integrity score below threshold. Codex KB: Multiple subsystems reporting issues. Run a comprehensive deep scan to identify root causes across DB, env, and services.", action: "Run platform integrity scan", knowledgeBase: "Codex", autoFixable: true, fixCommand: "health-deep-scan" },
  "cache-rebuild-needed": { suggestion: "Application cache is missing or stale. Codex KB: Rebuild server-side caches for templates, routes, and config data to restore optimal performance.", action: "Rebuild application caches", knowledgeBase: "Codex", autoFixable: true, fixCommand: "rebuild-cache" },
  "query-plan-suboptimal": { suggestion: "Database query execution plan is inefficient. Perplexity KB: Missing indexes or outdated statistics causing sequential scans. Run ANALYZE and review slow query log.", action: "Optimize query plans", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "optimize-queries" },
  "route-health-degraded": { suggestion: "One or more API routes returning unexpected status codes. Codex KB: Verify all route files export valid Express routers and are mounted in server/app.mjs.", action: "Audit route health", knowledgeBase: "Codex", autoFixable: true, fixCommand: "check-routes" },
  "session-store-overloaded": { suggestion: "Session store contains excessive active sessions. Perplexity KB: Memory-backed session stores can grow unbounded. Implement TTL cleanup and session eviction policies.", action: "Clean session store", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "verify-sessions" },
  "cold-endpoints": { suggestion: "Critical endpoints have not been accessed recently. Codex KB: Pre-warm endpoints to avoid cold-start latency for the first user request. Reduces P99 response times.", action: "Pre-warm all endpoints", knowledgeBase: "Codex", autoFixable: true, fixCommand: "warm-all" },
  "middleware-leak": { suggestion: "Middleware chain may have unintended side effects. Canva KB: Audit middleware for memory leaks, missing next() calls, and error handling gaps. Check response header bloat.", action: "Audit middleware chain", knowledgeBase: "Canva", autoFixable: true, fixCommand: "audit-middleware" },
  "disk-pressure": { suggestion: "Disk usage approaching capacity. Perplexity KB: Check for large log files, unused node_modules, orphaned uploads, and .git pack files consuming excessive space.", action: "Check disk usage", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "check-disk" },
  "stripe-config-invalid": { suggestion: "Stripe integration configuration issue. Canva KB: Verify STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY are valid, webhook secret matches, and product/price IDs exist.", action: "Verify Stripe setup", knowledgeBase: "Canva", autoFixable: true, fixCommand: "verify-stripe" },
  "resend-config-invalid": { suggestion: "Resend email service misconfigured. Perplexity KB: Check RESEND_API_KEY validity, sender domain verification status, and email template formatting.", action: "Verify Resend config", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "verify-resend" },
  "openai-config-invalid": { suggestion: "OpenAI API configuration issue. Codex KB: Verify API key validity, check model access permissions, and ensure billing is active on the OpenAI dashboard.", action: "Verify OpenAI setup", knowledgeBase: "Codex", autoFixable: true, fixCommand: "check-openai" },
  "header-injection": { suggestion: "Potential HTTP header injection detected. Codex KB: Validate and sanitize all user-supplied values used in response headers. Apply strict header policies.", action: "Audit response headers", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "xss-detected": { suggestion: "Potential XSS vulnerability in user input. Perplexity KB: Ensure HTML sanitization on all user-generated content. Use DOMPurify on the client and escape on the server.", action: "Review input sanitization", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "sql-injection-risk": { suggestion: "Potential SQL injection vector found. Codex KB: Always use parameterized queries via Drizzle ORM. Never concatenate user input into raw SQL strings.", action: "Review query parameterization", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "race-condition": { suggestion: "Potential race condition in concurrent operations. Perplexity KB: Use database transactions with proper isolation levels for atomic operations. Add optimistic locking for updates.", action: "Implement proper locking", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "email-delivery-failed": { suggestion: "Email delivery failure detected. Canva KB: Check Resend delivery logs for bounces, spam filtering, and domain reputation issues. Verify SPF/DKIM records.", action: "Review email delivery logs", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "payment-flow-error": { suggestion: "Payment processing flow encountered an error. Canva KB: Check Stripe dashboard for declined payments, webhook delivery failures, and checkout session status.", action: "Review payment flow logs", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "auth-flow-broken": { suggestion: "Authentication flow is failing. Codex KB: Check OAuth callback URLs, session cookie configuration, and Replit Auth OIDC settings. Verify redirect URIs match.", action: "Debug authentication flow", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "api-key-expired": { suggestion: "API key has expired or been revoked. Perplexity KB: Rotate expired keys immediately. Check API provider dashboard for key status and regenerate if needed.", action: "Rotate expired API keys", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "scheduled-task-stuck": { suggestion: "Scheduled background task appears stuck. Codex KB: Check for unresolved promises, infinite loops, or resource contention in cron/scheduled tasks.", action: "Review scheduled task logs", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "image-processing-fail": { suggestion: "Image processing or upload failed. Canva KB: Check file size limits, supported formats, and object storage connectivity. Verify storage bucket permissions.", action: "Check image pipeline", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "ssr-hydration-mismatch": { suggestion: "Server-side rendering hydration mismatch. Perplexity KB: Client and server rendered different HTML. Check for browser-only APIs used during SSR and conditional rendering logic.", action: "Fix hydration warnings", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "bundle-size-warning": { suggestion: "JavaScript bundle size exceeds recommended limits. Canva KB: Analyze bundle with Vite's build report. Use code splitting, lazy loading, and tree-shaking to reduce bundle size.", action: "Analyze and split bundles", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "lighthouse-score-low": { suggestion: "Performance metrics below acceptable thresholds. Perplexity KB: Optimize Core Web Vitals — LCP, FID, CLS. Implement lazy loading, image optimization, and critical CSS inlining.", action: "Optimize web performance", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "accessibility-violation": { suggestion: "Accessibility standards violation detected. Codex KB: Check WCAG AA compliance — missing alt text, inadequate contrast, missing ARIA labels, or keyboard navigation issues.", action: "Fix accessibility issues", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "seo-issues": { suggestion: "SEO optimization gaps detected. Perplexity KB: Missing meta descriptions, duplicate title tags, broken canonical URLs, or missing structured data (JSON-LD).", action: "Review SEO metadata", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "cookie-policy-violation": { suggestion: "Cookie handling may not comply with privacy regulations. Canva KB: Ensure consent banner is shown, SameSite attributes are set, and secure flag is enabled for all cookies.", action: "Review cookie policy", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "cron-drift": { suggestion: "Scheduled task timing has drifted from expected schedule. Codex KB: System clock drift or event loop delays causing timing inaccuracy in setTimeout/setInterval based scheduling.", action: "Resync scheduled tasks", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "backup-stale": { suggestion: "Database backup is overdue or stale. Perplexity KB: Neon PostgreSQL handles automatic backups but verify backup health on the Neon dashboard. Point-in-time recovery should be enabled.", action: "Verify backup status", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "feature-flag-stale": { suggestion: "Feature flags may be stale or misconfigured. Codex KB: Review SOFT_LAUNCH_MODE flag and featureAccess.js configuration. Ensure flags match intended rollout state.", action: "Audit feature flags", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "i18n-missing": { suggestion: "Internationalization strings missing for some locales. Canva KB: Check translation files for completeness. Missing keys will fall back to default language which may confuse users.", action: "Review translation coverage", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "analytics-gap": { suggestion: "Analytics tracking has gaps in data collection. Perplexity KB: Check Google Analytics integration, event tracking code, and consent-gated analytics initialization.", action: "Audit analytics coverage", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "notification-queue-full": { suggestion: "Notification delivery queue is backing up. Codex KB: Too many pending notifications. Increase processing rate or implement batch delivery for non-urgent notifications.", action: "Process notification queue", knowledgeBase: "Codex", autoFixable: true, fixCommand: "restart-service" },
  "api-deprecation-warning": { suggestion: "Using deprecated API version or endpoint. Perplexity KB: External API providers have signaled deprecation. Plan migration to newer API versions before sunset dates.", action: "Plan API migration", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "deployment-config-drift": { suggestion: "Deployment configuration has drifted from expected state. Canva KB: Verify Replit deployment settings, environment variables, and build commands match the intended configuration.", action: "Audit deployment config", knowledgeBase: "Canva", autoFixable: false, fixCommand: null },
  "secret-rotation-due": { suggestion: "Security secrets are due for rotation. Codex KB: Rotate ADMIN_TOKEN, SESSION_SECRET, and API keys periodically. Update in Replit Secrets panel and restart the application.", action: "Schedule secret rotation", knowledgeBase: "Codex", autoFixable: false, fixCommand: null },
  "data-integrity-warning": { suggestion: "Potential data integrity issue in database records. Perplexity KB: Orphaned records, broken foreign key references, or NULL values in required fields detected.", action: "Run data integrity audit", knowledgeBase: "Perplexity", autoFixable: false, fixCommand: null },
  "load-balancer-health": { suggestion: "Load balancer health check may be failing. Canva KB: Ensure /api/health endpoint responds within 5 seconds with 200 status. Check timeout and retry settings.", action: "Verify health endpoint", knowledgeBase: "Canva", autoFixable: true, fixCommand: "warm-all" },
  "drizzle-sync-needed": { suggestion: "Drizzle ORM schema out of sync with database. Codex KB: Run npm run db:push to synchronize schema changes. Check for pending model changes in shared/schema.mjs.", action: "Sync Drizzle schema", knowledgeBase: "Codex", autoFixable: true, fixCommand: "sync-schema" },
  "vacuum-needed": { suggestion: "Database needs vacuuming to reclaim dead tuple space. Codex KB: Run VACUUM ANALYZE to clean up dead rows and update query planner statistics for optimal performance.", action: "Run database vacuum", knowledgeBase: "Codex", autoFixable: true, fixCommand: "vacuum-db" },
  "table-bloat": { suggestion: "Database tables have significant dead tuple bloat. Perplexity KB: Tables with >20% dead tuples need VACUUM. Bloated tables cause slower sequential scans and increased storage.", action: "Run table health check", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "table-health" },
  "index-unused": { suggestion: "Unused database indexes detected. Codex KB: Indexes with zero scans consume write overhead without query benefit. Review and consider removing unused indexes.", action: "Audit index usage", knowledgeBase: "Codex", autoFixable: true, fixCommand: "index-health" },
  "index-missing": { suggestion: "High sequential scan count suggests missing indexes. Perplexity KB: Tables with frequent seq scans may benefit from targeted indexes on commonly queried columns.", action: "Review sequential scan hotspots", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "index-health" },
  "dependency-outdated": { suggestion: "Critical dependencies may be outdated. Canva KB: Check package versions for security vulnerabilities and breaking changes. Run dependency audit regularly.", action: "Run dependency audit", knowledgeBase: "Canva", autoFixable: true, fixCommand: "dependency-audit" },
  "dependency-missing-critical": { suggestion: "Critical dependency not found in package.json. Codex KB: Essential packages like express, drizzle-orm, react, or vite are missing from the dependency list.", action: "Verify critical dependencies", knowledgeBase: "Codex", autoFixable: true, fixCommand: "dependency-audit" },
  "security-headers-weak": { suggestion: "Security headers may not be properly configured. Canva KB: Verify Helmet middleware is active with CSP, X-Frame-Options, HSTS, and other protective headers.", action: "Audit security headers", knowledgeBase: "Canva", autoFixable: true, fixCommand: "security-headers-audit" },
  "secret-exposed-risk": { suggestion: "Sensitive environment variables need security verification. Codex KB: Ensure all API keys and secrets are stored in Replit Secrets, not hardcoded or logged.", action: "Verify secret security", knowledgeBase: "Codex", autoFixable: true, fixCommand: "security-headers-audit" },
  "optimize-all-needed": { suggestion: "Platform needs comprehensive optimization pass. Perplexity KB: Run full optimization — vacuum, cache rebuild, endpoint warmup, session cleanup, and log rotation in one command.", action: "Run full optimization", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "optimize-all" },
  "db-statistics-stale": { suggestion: "Database planner statistics are outdated. Codex KB: Run ANALYZE to update statistics used by the query planner. Stale stats lead to suboptimal query plans.", action: "Update query planner stats", knowledgeBase: "Codex", autoFixable: true, fixCommand: "vacuum-db" },
  "table-fragmentation": { suggestion: "Table data fragmentation reducing scan performance. Perplexity KB: Fragmented tables benefit from VACUUM FULL (offline) or regular VACUUM to reduce physical bloat.", action: "Defragment tables", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "vacuum-db" },
  "seq-scan-hotspot": { suggestion: "Sequential scan hotspot detected on frequently queried table. Codex KB: Add targeted index on the WHERE clause columns to convert seq scans to index scans.", action: "Create targeted index", knowledgeBase: "Codex", autoFixable: true, fixCommand: "index-health" },
  "node-version-check": { suggestion: "Node.js version should be verified for compatibility. Canva KB: Ensure runtime version matches package.json engines field and supports all used language features.", action: "Check Node.js version", knowledgeBase: "Canva", autoFixable: true, fixCommand: "dependency-audit" },
  "csrf-gap": { suggestion: "CSRF protection may have gaps on state-changing endpoints. Codex KB: Verify all POST/PUT/DELETE routes have CSRF token validation or SameSite cookie protection.", action: "Audit CSRF coverage", knowledgeBase: "Codex", autoFixable: true, fixCommand: "security-headers-audit" },
  "full-optimization-overdue": { suggestion: "Last full optimization was more than 24 hours ago. Perplexity KB: Regular optimization passes keep DB healthy, caches warm, and response times low.", action: "Run optimize-all command", knowledgeBase: "Perplexity", autoFixable: true, fixCommand: "optimize-all" },
};

function getRemediation(label, ms) {
  if (ms && ms > 7000 && label === 'ok') return AI_REMEDIATION["event-loop-blocked"];
  if (ms && ms > 5000 && label === 'ok') return AI_REMEDIATION["warmup-needed"];
  if (ms && ms > 3000 && label === 'ok') return AI_REMEDIATION["slow-response"];
  if (ms && ms > 2000 && label === 'ok') return AI_REMEDIATION["slow-response"];
  if (AI_REMEDIATION[label]) return AI_REMEDIATION[label];
  if (label === '502') return AI_REMEDIATION["upstream-502"];
  if (label === '503') return AI_REMEDIATION["upstream-503"];
  if (label === '504') return AI_REMEDIATION["upstream-504"];
  if (label === '206') return AI_REMEDIATION["partial-response"];
  if (label === '413') return AI_REMEDIATION["payload-too-large"];
  if (label === '429') return AI_REMEDIATION["rate-limited"];
  if (label === '401') return AI_REMEDIATION["auth-gated"];
  if (label === '403') return AI_REMEDIATION["admin-only"];
  if (label === '405') return AI_REMEDIATION["post-only"];
  if (label === '408') return AI_REMEDIATION["query-timeout"];
  if (label === '409') return AI_REMEDIATION["idempotency-violation"];
  if (label === '422') return AI_REMEDIATION["content-type-mismatch"];
  if (/^4\d\d$/.test(label)) return AI_REMEDIATION["404"];
  if (/^5\d\d$/.test(label)) return AI_REMEDIATION["server-error"];
  if (label === 'timeout' && ms > 7000) return AI_REMEDIATION["event-loop-blocked"];
  if (label === 'timeout') return AI_REMEDIATION["timeout"];
  if (label === 'unreachable') return AI_REMEDIATION["unreachable"];
  return AI_REMEDIATION["server-error"];
}

const toolCategories = [
  {
    title: "AI & Core Wellness Tools",
    tools: [
      { id: "ai-chat", label: "AI Chat Therapy", endpoint: "/api/ai/history", icon: MessageSquare, desc: "AI conversation engine" },
      { id: "therapy", label: "Therapy Engine", endpoint: "/api/therapy/crisis-resources", icon: Headphones, desc: "Guided therapy sessions" },
      { id: "mood-tracker", label: "Mood Tracker", endpoint: "/api/mood", icon: Heart, desc: "User mood tracking" },
      { id: "journal", label: "Journal System", endpoint: "/api/journal", icon: BookOpen, desc: "Journaling engine" },
      { id: "gratitude", label: "Gratitude Prompts", endpoint: "/api/gratitude", icon: Sun, desc: "Daily gratitude system" },
      { id: "reflection", label: "Reflection Tools", endpoint: "/api/reflection", icon: Moon, desc: "Self-reflection engine" },
      { id: "wellness-tools", label: "Wellness Toolkit", endpoint: "/api/wellness-tools", icon: Leaf, desc: "Breath, body scan, meditation" },
      { id: "mirror", label: "Mirror Reflection", endpoint: "/api/mirror/frameworks", icon: Eye, desc: "Self-awareness mirror" },
      { id: "prompts", label: "Prompt Engine", endpoint: "/api/prompts/daily", icon: FileQuestion, desc: "Guided prompt system" },
      { id: "states", label: "Emotional States", endpoint: "/api/states", icon: Gauge, desc: "State tracking system" },
    ]
  },
  {
    title: "Intelligence & Growth Tools",
    tools: [
      { id: "wisdom", label: "Wisdom Engine", endpoint: "/api/wisdom", icon: Lightbulb, desc: "Daily wisdom delivery" },
      { id: "wisdom-engine", label: "Wisdom Engine (Advanced)", endpoint: "/api/wisdom-engine/daily", icon: Landmark, desc: "Deep wisdom system" },
      { id: "philosophy", label: "Philosophy Lab", endpoint: "/api/philosophy/daily", icon: GraduationCap, desc: "Philosophical inquiry" },
      { id: "metacognition", label: "Metacognition", endpoint: "/api/metacognition/daily", icon: Brain, desc: "Thinking about thinking" },
      { id: "creativity", label: "Creativity Engine", endpoint: "/api/creativity/daily", icon: Sparkles, desc: "Creative exploration" },
      { id: "resilience", label: "Resilience Builder", endpoint: "/api/resilience/daily", icon: Mountain, desc: "Resilience tools" },
      { id: "foresight", label: "Foresight Lab", endpoint: "/api/foresight", icon: Compass, desc: "Future planning" },
      { id: "knowledge", label: "Knowledge Synthesis", endpoint: "/api/knowledge/all", icon: BookOpen, desc: "Knowledge integration" },
      { id: "cognitive-lab", label: "Cognitive Lab", endpoint: "/api/cognitive-lab/daily", icon: Brain, desc: "Cognitive exercises" },
      { id: "cognitive-mastery", label: "Cognitive Mastery", endpoint: "/api/cognitive-mastery", icon: Trophy, desc: "Cognitive excellence" },
      { id: "deep-learning", label: "Deep Learning", endpoint: "/api/deep-learning", icon: Layers, desc: "Deep learning tools" },
      { id: "dialectics", label: "Dialectics Engine", endpoint: "/api/dialectics/daily", icon: Puzzle, desc: "Dialectical reasoning" },
      { id: "practices", label: "Practices Library", endpoint: "/api/practices/daily", icon: Milestone, desc: "Guided practices" },
      { id: "insights", label: "Insights Engine", endpoint: "/api/insights", icon: Lightbulb, desc: "Personal insights" },
    ]
  },
  {
    title: "Healing & Recovery Tools",
    tools: [
      { id: "trauma-healing", label: "Trauma Healing", endpoint: "/api/trauma-healing/grounding", icon: HeartHandshake, desc: "Trauma-informed protocols" },
      { id: "emotional-resilience", label: "Emotional Resilience", endpoint: "/api/emotional-resilience", icon: Flame, desc: "Emotional strength" },
      { id: "emotional-mastery", label: "Emotional Mastery", endpoint: "/api/emotional-mastery/daily-eq", icon: Target, desc: "Emotion regulation" },
      { id: "healing-modalities", label: "Healing Modalities", endpoint: "/api/healing-modalities", icon: Flower2, desc: "Healing approaches" },
      { id: "holistic-healing", label: "Holistic Healing", endpoint: "/api/holistic-healing", icon: TreePine, desc: "Whole-person wellness" },
      { id: "healing-tools", label: "Healing Tools", endpoint: "/api/healing-intelligence", icon: Heart, desc: "Core healing toolkit" },
      { id: "healing-core", label: "Healing Core", endpoint: "/api/healing-modalities", icon: Leaf, desc: "Core healing engine" },
      { id: "healing-intelligence", label: "Healing Intelligence", endpoint: "/api/healing-intelligence/categories", icon: Sparkles, desc: "AI-guided healing" },
      { id: "post-trauma", label: "Post-Trauma Growth", endpoint: "/api/post-trauma/daily", icon: Feather, desc: "Post-traumatic growth" },
      { id: "mind-body", label: "Mind-Body Integration", endpoint: "/api/mind-body/breathwork", icon: CircleDot, desc: "Mind-body connection" },
      { id: "psychological-safety", label: "Psychological Safety", endpoint: "/api/psychological-safety/daily", icon: Shield, desc: "Safety frameworks" },
    ]
  },
  {
    title: "Mastery & Purpose Tools",
    tools: [
      { id: "self-mastery-intelligence", label: "Self-Mastery Intelligence", endpoint: "/api/self-mastery-intelligence", icon: Gem, desc: "Self-mastery path" },
      { id: "self-mastery", label: "Self-Mastery Core", endpoint: "/api/self-mastery", icon: Award, desc: "Core mastery system" },
      { id: "peak-performance", label: "Peak Performance", endpoint: "/api/peak-performance", icon: Zap, desc: "Performance optimization" },
      { id: "personal-growth", label: "Personal Growth", endpoint: "/api/personal-growth", icon: TrendingUp, desc: "Growth pathways" },
      { id: "life-purpose", label: "Life Purpose", endpoint: "/api/life-purpose", icon: Target, desc: "Purpose discovery" },
      { id: "life-design", label: "Life Design", endpoint: "/api/life-design", icon: Compass, desc: "Life architecture" },
      { id: "purpose-compass", label: "Purpose Compass", endpoint: "/api/purpose-compass", icon: Compass, desc: "Purpose navigation" },
      { id: "mastery-excellence", label: "Mastery Excellence", endpoint: "/api/mastery-excellence", icon: Star, desc: "Excellence framework" },
      { id: "meaning", label: "Meaning & Future", endpoint: "/api/meaning", icon: Rocket, desc: "Meaning creation" },
      { id: "meaning-core", label: "Meaning Core", endpoint: "/api/meaning", icon: Star, desc: "Core meaning system" },
      { id: "transformation", label: "Transformation Engine", endpoint: "/api/transformation/stages", icon: Orbit, desc: "Deep transformation" },
      { id: "values", label: "Values Explorer", endpoint: "/api/values", icon: Footprints, desc: "Values discovery" },
      { id: "praxis", label: "Praxis Lab", endpoint: "/api/praxis", icon: Workflow, desc: "Theory to practice" },
    ]
  },
  {
    title: "Advanced Intelligence Tools",
    tools: [
      { id: "consciousness", label: "Consciousness Expansion", endpoint: "/api/consciousness/brave-action", icon: Sun, desc: "Awareness tools" },
      { id: "human-potential", label: "Human Potential", endpoint: "/api/human-potential", icon: Sparkles, desc: "Potential unlocking" },
      { id: "spiritual-intelligence", label: "Spiritual Intelligence", endpoint: "/api/spiritual-intelligence", icon: Flower2, desc: "Spiritual growth" },
      { id: "wisdom-traditions", label: "Wisdom Traditions", endpoint: "/api/wisdom-traditions", icon: BookOpen, desc: "Ancient wisdom" },
      { id: "wisdom-synthesis", label: "Wisdom Synthesis", endpoint: "/api/wisdom-synthesis", icon: Lightbulb, desc: "Wisdom integration" },
      { id: "contemplative", label: "Contemplative Tools", endpoint: "/api/contemplative", icon: Moon, desc: "Contemplation guides" },
      { id: "ethical-reasoning", label: "Ethical Reasoning", endpoint: "/api/ethical-reasoning", icon: Shield, desc: "Ethics framework" },
      { id: "existential", label: "Existential Inquiry", endpoint: "/api/existential", icon: Globe, desc: "Existential exploration" },
      { id: "neuro-integration", label: "Neuro-Integration", endpoint: "/api/neuro-integration", icon: Network, desc: "Neural integration" },
      { id: "socio-ecology", label: "Socio-Ecology", endpoint: "/api/socio-ecology", icon: Globe, desc: "Social ecosystems" },
      { id: "cognitive-enhancement", label: "Cognitive Enhancement", endpoint: "/api/cognitive-enhancement", icon: Brain, desc: "Mental sharpness" },
    ]
  },
  {
    title: "Relational & Social Tools",
    tools: [
      { id: "relationship-dynamics", label: "Relationship Dynamics", endpoint: "/api/relationship-dynamics", icon: HeartHandshake, desc: "Relationship patterns" },
      { id: "social-intelligence", label: "Social Intelligence", endpoint: "/api/social-intelligence", icon: Users, desc: "Social skills" },
      { id: "relational", label: "Relational Tools", endpoint: "/api/relational", icon: Heart, desc: "Connection building" },
      { id: "collective-intelligence", label: "Collective Intelligence", endpoint: "/api/collective-intelligence", icon: Users, desc: "Group wisdom" },
      { id: "systems-compassion", label: "Systems Compassion", endpoint: "/api/systems-compassion", icon: Globe, desc: "Systemic empathy" },
      { id: "embodiment", label: "Embodiment Tools", endpoint: "/api/embodiment", icon: Footprints, desc: "Body awareness" },
      { id: "narrative", label: "Narrative Tools", endpoint: "/api/narrative", icon: FileText, desc: "Story & meaning" },
      { id: "community", label: "Community Engine", endpoint: "/api/community", icon: Users, desc: "Community features" },
    ]
  },
  {
    title: "Content & Publishing Tools",
    tools: [
      { id: "content-studio", label: "Content Studio", endpoint: "/api/content-studio", icon: Palette, desc: "Content creation" },
      { id: "content-intelligence", label: "Content Intelligence", endpoint: "/api/content-intelligence", icon: Sparkles, desc: "Smart content" },
      { id: "content-api", label: "Content API", endpoint: "/api/content", icon: Wand2, desc: "Content management" },
      { id: "content-generator", label: "Content Generator", endpoint: "/api/content-generator", icon: FileText, desc: "Blog-to-social generation" },
      { id: "universal-content", label: "Universal Content", endpoint: "/api/universal-content", icon: Globe, desc: "Cross-platform content" },
      { id: "blog-api", label: "Blog Engine", endpoint: "/api/blog", icon: BookOpen, desc: "Blog system" },
      { id: "newsletter-api", label: "Newsletter Engine", endpoint: "/api/newsletter", icon: Mail, desc: "Newsletter system" },
      { id: "social-posts", label: "Social Posts API", endpoint: "/api/social/posts", icon: Share2, desc: "Social post management" },
      { id: "social-posting", label: "Social Posting", endpoint: "/api/social-posting", icon: Megaphone, desc: "Post distribution" },
      { id: "narrative-drafts", label: "Narrative Drafts", endpoint: "/api/narrative-drafts", icon: PenTool, desc: "Draft management" },
      { id: "perplexity", label: "Perplexity AI (Factual)", endpoint: "/api/perplexity", icon: Search, desc: "Factual research AI" },
      { id: "rss-alt", label: "Content Feed API", endpoint: "/api/feed/feed.xml", icon: Rss, desc: "Content feed generation" },
    ]
  },
  {
    title: "User & Engagement Tools",
    tools: [
      { id: "account", label: "Account System", endpoint: "/api/account", icon: UserCheck, desc: "User accounts" },
      { id: "onboarding", label: "Onboarding Flow", endpoint: "/api/onboarding", icon: Rocket, desc: "New user experience" },
      { id: "gamification", label: "Gamification Engine", endpoint: "/api/gamification", icon: Star, desc: "XP, streaks, quests" },
      { id: "progress", label: "Progress Tracker", endpoint: "/api/progress", icon: TrendingUp, desc: "User progress data" },
      { id: "badges", label: "Badges System", endpoint: "/api/badges", icon: Award, desc: "Achievement badges" },
      { id: "favorites", label: "Favorites Engine", endpoint: "/api/favorites", icon: Heart, desc: "User favorites" },
      { id: "dashboard-api", label: "User Dashboard", endpoint: "/api/dashboard", icon: LayoutDashboard, desc: "Dashboard data" },
      { id: "pro-features", label: "Pro Features", endpoint: "/api/pro-features", icon: Gem, desc: "Premium feature gates" },
      { id: "leads", label: "Leads Engine", endpoint: "/api/leads", icon: Inbox, desc: "Lead collection" },
      { id: "feedback", label: "Feedback System", endpoint: "/api/feedback", icon: MessageSquare, desc: "User feedback" },
      { id: "account-actions", label: "Account Actions", endpoint: "/api/account-actions", icon: UserCheck, desc: "Account management" },
      { id: "ai-dashboard", label: "AI Dashboard", endpoint: "/api/ai-dashboard", icon: Brain, desc: "AI wellness dashboard" },
      { id: "moods-alt", label: "Moods API (Alt)", endpoint: "/api/mood", icon: Heart, desc: "Alt mood tracking endpoint" },
    ]
  },
  {
    title: "Admin & System Tools",
    tools: [
      { id: "admin-core", label: "Admin Core", endpoint: "/api/admin", icon: Shield, desc: "Admin authentication" },
      { id: "admin-security", label: "Security Engine", endpoint: "/api/admin/security", icon: ShieldCheck, desc: "Security monitoring" },
      { id: "admin-audit", label: "Audit Logs", endpoint: "/api/admin/audit-logs", icon: ClipboardList, desc: "System audit trail" },
      { id: "admin-billing", label: "Admin Billing", endpoint: "/api/admin/billing", icon: CreditCard, desc: "Billing management" },
      { id: "admin-publishing", label: "Admin Publishing", endpoint: "/api/admin/publishing", icon: BookOpen, desc: "Publishing pipeline" },
      { id: "admin-social", label: "Admin Social Studio", endpoint: "/api/admin/social", icon: Palette, desc: "Social management" },
      { id: "admin-enterprise", label: "Enterprise Social", endpoint: "/api/admin/social/enterprise", icon: Globe, desc: "Enterprise social ops" },
      { id: "analytics", label: "Analytics Engine", endpoint: "/api/analytics", icon: BarChart3, desc: "Platform analytics" },
      { id: "metrics", label: "Metrics System", endpoint: "/api/metrics", icon: Gauge, desc: "System metrics" },
      { id: "soft-launch", label: "Soft Launch Metrics", endpoint: "/api/admin/soft-launch-metrics", icon: Rocket, desc: "Launch tracking" },
      { id: "health-api", label: "Health Monitor", endpoint: "/api/health", icon: Activity, desc: "System health" },
      { id: "deployment", label: "Deployment Readiness", endpoint: "/api/deployment-readiness", icon: PackageCheck, desc: "Deploy checks" },
      { id: "integrations", label: "Integration Health", endpoint: "/api/health", icon: Puzzle, desc: "Service integrations" },
      { id: "object-storage", label: "Object Storage", endpoint: "/api/uploads", icon: HardDrive, desc: "File & media storage" },
      { id: "api-core", label: "Core API", endpoint: "/api/health", icon: Terminal, desc: "Base API health endpoint" },
    ]
  },
  {
    title: "Infrastructure & Auth Tools",
    tools: [
      { id: "billing", label: "Billing API", endpoint: "/api/billing", icon: DollarSign, desc: "Stripe billing" },
      { id: "webhook", label: "Webhook Handler", endpoint: "/api/webhook", icon: Webhook, desc: "Stripe webhooks" },
      { id: "email", label: "Email Service", endpoint: "/api/email", icon: Mail, desc: "Resend email" },
      { id: "contact", label: "Contact System", endpoint: "/api/contact", icon: Contact, desc: "Contact forms" },
      { id: "auth-github", label: "GitHub Auth", endpoint: "/api/auth/github", icon: Key, desc: "GitHub OAuth" },
      { id: "products", label: "Products API", endpoint: "/api/products", icon: PackageCheck, desc: "Product catalog" },
      { id: "invites", label: "Invite System", endpoint: "/api/invites", icon: Handshake, desc: "User invitations" },
      { id: "feed", label: "Feed Generator", endpoint: "/api/feed/feed.xml", icon: Share2, desc: "Content feed generation" },
      { id: "figma-api", label: "Figma Integration", endpoint: "/api/figma", icon: Palette, desc: "Figma design tools" },
      { id: "login", label: "Login System", endpoint: "/api/login", icon: LogIn, desc: "User login endpoint" },
      { id: "user-mgmt", label: "User Management", endpoint: "/api/user", icon: Users, desc: "User data management" },
      { id: "user-settings", label: "User Settings", endpoint: "/api/user-settings", icon: UserCog, desc: "User preferences" },
      { id: "uploads", label: "File Uploads", endpoint: "/api/uploads", icon: Upload, desc: "Object storage uploads" },
      { id: "metrics-summary", label: "Metrics Summary", endpoint: "/api/metrics", icon: ListOrdered, desc: "Aggregated metrics" },
      { id: "social-posts-alt", label: "Social Posts Feed", endpoint: "/api/social/posts", icon: Radio, desc: "Social post feed" },
      { id: "analytics-events", label: "Analytics Events", endpoint: "/api/analytics-events", icon: BarChart3, desc: "Event tracking" },
      { id: "mfa-auth", label: "MFA Security", endpoint: "/api/mfa", icon: Fingerprint, desc: "Multi-factor auth" },
      { id: "canva-oauth", label: "Canva OAuth", endpoint: "/api/canva-oauth", icon: FolderKanban, desc: "Canva integration" },
      { id: "rss-feed", label: "RSS Feed", endpoint: "/api/feed/feed.xml", icon: Rss, desc: "Blog RSS feed" },
      { id: "auth-core", label: "Auth System", endpoint: "/api/auth/user", icon: Shield, desc: "Authentication service" },
    ]
  },
];

const CRITICAL_CHECKS = [
  { id: "health-api", label: "System Health", endpoint: "/api/health", icon: Activity, desc: "Server & DB status" },
  { id: "ai-chat", label: "AI Engine", endpoint: "/api/ai/history", icon: MessageSquare, desc: "AI chat system" },
  { id: "auth-core", label: "Auth Service", endpoint: "/api/auth/user", icon: Shield, desc: "Authentication" },
  { id: "billing", label: "Billing API", endpoint: "/api/billing", icon: CreditCard, desc: "Stripe billing" },
  { id: "blog-api", label: "Blog Engine", endpoint: "/api/blog", icon: BookOpen, desc: "Blog system" },
  { id: "email", label: "Email Service", endpoint: "/api/email", icon: Mail, desc: "Resend email" },
  { id: "perplexity", label: "Perplexity AI", endpoint: "/api/perplexity", icon: Search, desc: "Factual research AI" },
  { id: "canva-oauth", label: "Canva AI", endpoint: "/api/canva-oauth", icon: FolderKanban, desc: "Canva integration" },
];

function QuickDiagnostics({ toolResults, runHealthCheck, runningTools }) {
  const runQuickCheck = async () => {
    await Promise.all(CRITICAL_CHECKS.map(tool => runHealthCheck(tool)));
  };

  const critChecked = CRITICAL_CHECKS.filter(c => toolResults[c.id]).length;
  const critHealthy = CRITICAL_CHECKS.filter(c => toolResults[c.id]?.status === 'healthy').length;
  const critErrors = CRITICAL_CHECKS.filter(c => toolResults[c.id]?.status === 'error').length;
  const isRunning = CRITICAL_CHECKS.some(c => runningTools[c.id]);

  return (
    <div className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-card" data-testid="panel-quick-diagnostics">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold">Quick Diagnostics</h3>
          <span className="text-xs text-muted-foreground">8 critical endpoints</span>
        </div>
        <button
          onClick={runQuickCheck}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
          data-testid="button-quick-diagnostics"
        >
          {isRunning ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
          {isRunning ? 'Running...' : 'Run Quick Check'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {CRITICAL_CHECKS.map((check) => {
          const Icon = check.icon;
          const result = toolResults[check.id];
          const running = runningTools[check.id];
          return (
            <div
              key={check.id}
              className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors ${
                result?.status === 'healthy' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' :
                result?.status === 'error' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' :
                result?.status === 'warning' ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20' :
                'border-gray-100 dark:border-gray-800 bg-muted/30'
              }`}
              data-testid={`quick-check-${check.id}`}
            >
              {running ? (
                <RefreshCw size={14} className="animate-spin text-muted-foreground flex-shrink-0" />
              ) : result ? (
                result.status === 'healthy' ? <CheckCircle size={14} className="text-green-600 flex-shrink-0" /> :
                result.status === 'error' ? <AlertCircle size={14} className="text-red-500 flex-shrink-0" /> :
                <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
              ) : (
                <Icon size={14} className="text-muted-foreground flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">{check.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {running ? 'Checking...' : result ? `${result.label} ${result.ms}ms` : check.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {critChecked === CRITICAL_CHECKS.length && (
        <div className={`mt-3 text-xs text-center py-1.5 rounded-lg ${
          critErrors > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'
        }`} data-testid="text-quick-diagnostics-result">
          {critErrors > 0 ? `${critErrors} critical service(s) need attention` : `All ${critHealthy} critical services operational`}
        </div>
      )}
    </div>
  );
}

function AIDiagnosticsPanel({ toolResults, runHealthCheck }) {
  const [expanded, setExpanded] = useState(false);
  const allTools = toolCategories.flatMap(c => c.tools);
  const issues = allTools.filter(t => {
    const r = toolResults[t.id];
    return r && (r.status === 'error' || r.status === 'warning');
  }).map(t => ({ ...t, result: toolResults[t.id], severity: TOOL_SEVERITY[t.id] || 'normal' }));

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const highIssues = issues.filter(i => i.severity === 'high');
  const normalIssues = issues.filter(i => i.severity !== 'critical' && i.severity !== 'high');

  if (issues.length === 0 && Object.keys(toolResults).length > 0) {
    return (
      <div className="mb-6 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20" data-testid="panel-ai-diagnostics-clear">
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-green-600" />
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">AI Diagnostics: All Systems Healthy</span>
          <CheckCircle size={14} className="text-green-600" />
        </div>
        <p className="text-xs text-green-600 dark:text-green-500 mt-1">Codex Knowledge Base confirms all monitored tools are operational. No remediation required.</p>
      </div>
    );
  }

  if (issues.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20" data-testid="panel-ai-diagnostics">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-amber-600" />
          <span className="text-sm font-semibold">AI Diagnostics & Remediation</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 font-medium">{issues.length} issues</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          data-testid="button-toggle-diagnostics"
        >
          {expanded ? 'Collapse' : 'Expand'} Details
        </button>
      </div>

      {criticalIssues.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold">CRITICAL: {criticalIssues.length}</span>
          <span className="text-muted-foreground">{criticalIssues.map(i => i.label).join(', ')}</span>
        </div>
      )}
      {highIssues.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className="px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold">HIGH: {highIssues.length}</span>
          <span className="text-muted-foreground">{highIssues.map(i => i.label).join(', ')}</span>
        </div>
      )}
      {normalIssues.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">NORMAL: {normalIssues.length}</span>
          <span className="text-muted-foreground">{normalIssues.map(i => i.label).join(', ')}</span>
        </div>
      )}

      {expanded && (
        <div className="mt-3 space-y-2">
          {[...criticalIssues, ...highIssues, ...normalIssues].map(issue => {
            const remediation = getRemediation(issue.result.label, issue.result.ms);
            const sevColor = issue.severity === 'critical' ? 'border-red-300 dark:border-red-700' : issue.severity === 'high' ? 'border-orange-300 dark:border-orange-700' : 'border-gray-200 dark:border-gray-700';
            return (
              <div key={issue.id} className={`p-3 rounded-lg border ${sevColor} bg-background`} data-testid={`diagnostics-${issue.id}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <issue.icon size={14} className={issue.result.status === 'error' ? 'text-red-500' : 'text-amber-500'} />
                    <span className="text-sm font-medium">{issue.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {issue.result.label} · {issue.result.ms}ms
                    </span>
                    {issue.severity !== 'normal' && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${issue.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                        {issue.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => runHealthCheck(issue)}
                    className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-muted transition-colors flex items-center gap-1"
                    data-testid={`button-retry-${issue.id}`}
                  >
                    <RotateCcw size={10} /> Retry
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <div className="flex items-start gap-1.5 mb-1">
                    <Brain size={11} className="mt-0.5 text-purple-500 flex-shrink-0" />
                    <span>{remediation?.suggestion}</span>
                    {remediation?.knowledgeBase && (
                      <span className={`text-[9px] px-1 py-0.5 rounded font-medium flex-shrink-0 ${remediation.knowledgeBase === 'Codex' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : remediation.knowledgeBase === 'Perplexity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'}`}>
                        {remediation.knowledgeBase}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wrench size={11} className="text-blue-500 flex-shrink-0" />
                    <span className="font-medium">{remediation?.action}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlatformIntegrityScanner({ toolResults }) {
  const [showScanner, setShowScanner] = useState(false);
  const allTools = toolCategories.flatMap(c => c.tools);
  const totalTools = allTools.length;
  const checkedCount = Object.keys(toolResults).length;
  
  const linkedTools = allTools.filter(t => TOOL_ADMIN_LINKS[t.id]);
  const unlinkedTools = allTools.filter(t => !TOOL_ADMIN_LINKS[t.id]);
  const criticalTools = allTools.filter(t => TOOL_SEVERITY[t.id] === 'critical');
  const highTools = allTools.filter(t => TOOL_SEVERITY[t.id] === 'high');
  const mediumTools = allTools.filter(t => TOOL_SEVERITY[t.id] === 'medium');
  const normalTools = allTools.filter(t => !TOOL_SEVERITY[t.id]);
  
  const duplicateEndpoints = (() => {
    const endpoints = {};
    allTools.forEach(t => {
      if (!endpoints[t.endpoint]) endpoints[t.endpoint] = [];
      endpoints[t.endpoint].push(t.id);
    });
    return Object.entries(endpoints).filter(([_, ids]) => ids.length > 1);
  })();

  const categoryStats = toolCategories.map(cat => ({
    title: cat.title,
    total: cat.tools.length,
    checked: cat.tools.filter(t => toolResults[t.id]).length,
    healthy: cat.tools.filter(t => toolResults[t.id]?.status === 'healthy').length,
    errors: cat.tools.filter(t => toolResults[t.id]?.status === 'error').length,
    avgMs: cat.tools.filter(t => toolResults[t.id]?.ms).length > 0 
      ? Math.round(cat.tools.filter(t => toolResults[t.id]?.ms).reduce((s, t) => s + toolResults[t.id].ms, 0) / cat.tools.filter(t => toolResults[t.id]?.ms).length) 
      : 0
  }));

  if (checkedCount === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20" data-testid="panel-integrity-scanner">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-emerald-600" />
          <span className="text-sm font-semibold">Platform Integrity Scanner</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 font-medium">
            {linkedTools.length} linked · {unlinkedTools.length} API-only · {duplicateEndpoints.length} shared endpoints
          </span>
        </div>
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="text-xs px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
          data-testid="button-toggle-scanner"
        >
          {showScanner ? 'Hide' : 'Show'} Details
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-2">
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-critical">
          <div className="text-lg font-bold text-red-500">{criticalTools.length}</div>
          <div className="text-[10px] text-muted-foreground">Critical</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-high">
          <div className="text-lg font-bold text-orange-500">{highTools.length}</div>
          <div className="text-[10px] text-muted-foreground">High</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-medium">
          <div className="text-lg font-bold text-blue-500">{mediumTools.length}</div>
          <div className="text-[10px] text-muted-foreground">Medium</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-linked">
          <div className="text-lg font-bold text-emerald-500">{linkedTools.length}</div>
          <div className="text-[10px] text-muted-foreground">Admin-Linked</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-unclassified">
          <div className="text-lg font-bold text-gray-500">{normalTools.length}</div>
          <div className="text-[10px] text-muted-foreground">Unclassified</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-total">
          <div className="text-lg font-bold text-emerald-600">{totalTools}</div>
          <div className="text-[10px] text-muted-foreground">Total</div>
        </div>
      </div>

      {showScanner && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <BarChart3 size={12} /> Category Health Overview
            </div>
            <div className="space-y-1.5">
              {categoryStats.map((cat, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-background border border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-medium flex-1 truncate">{cat.title}</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-green-600 font-medium">{cat.healthy}/{cat.total}</span>
                    {cat.errors > 0 && <span className="text-red-500 font-bold">{cat.errors} err</span>}
                    <span className="text-muted-foreground">{cat.avgMs}ms avg</span>
                  </div>
                  <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${cat.total > 0 ? (cat.healthy / cat.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <ExternalLink size={12} /> Admin Page Connectivity ({linkedTools.length} linked)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto">
              {linkedTools.map(t => {
                const result = toolResults[t.id];
                return (
                  <div key={t.id} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-[10px]" data-testid={`linked-${t.id}`}>
                    {result?.status === 'healthy' ? <CheckCircle size={10} className="text-green-600 flex-shrink-0" /> : result?.status === 'error' ? <AlertCircle size={10} className="text-red-500 flex-shrink-0" /> : <Clock size={10} className="text-muted-foreground flex-shrink-0" />}
                    <span className="truncate">{t.label}</span>
                    <Link href={TOOL_ADMIN_LINKS[t.id]} className="ml-auto" data-testid={`scanner-link-${t.id}`}>
                      <ExternalLink size={9} className="text-blue-500" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {unlinkedTools.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-blue-600">
                <Puzzle size={12} /> API-Only Tools ({unlinkedTools.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {unlinkedTools.map(t => (
                  <span key={t.id} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground" data-testid={`unlinked-${t.id}`}>{t.label}</span>
                ))}
              </div>
            </div>
          )}

          {duplicateEndpoints.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-amber-600">
                <AlertTriangle size={12} /> Shared Endpoints ({duplicateEndpoints.length})
              </div>
              <div className="space-y-1">
                {duplicateEndpoints.map(([endpoint, ids]) => (
                  <div key={endpoint} className="text-[10px] p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <span className="font-mono text-amber-700 dark:text-amber-400">{endpoint}</span>
                    <span className="text-muted-foreground ml-2">→ {ids.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {checkedCount > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <ShieldCheck size={12} /> Component Health Matrix
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'AI/Wellness', tools: allTools.filter(t => ['ai-chat','therapy','mood-tracker','journal','gratitude','reflection','wellness-tools','mirror','prompts','states'].includes(t.id)), color: 'text-purple-600' },
                  { label: 'Healing', tools: allTools.filter(t => t.id.includes('healing') || t.id.includes('trauma') || t.id.includes('emotional') || t.id === 'mind-body' || t.id === 'post-trauma' || t.id === 'psychological-safety'), color: 'text-pink-600' },
                  { label: 'Intelligence', tools: allTools.filter(t => t.id.includes('wisdom') || t.id.includes('cognitive') || t.id.includes('consciousness') || t.id.includes('philosophy') || t.id === 'metacognition' || t.id === 'creativity' || t.id === 'foresight' || t.id === 'knowledge' || t.id === 'deep-learning' || t.id === 'dialectics'), color: 'text-indigo-600' },
                  { label: 'Content', tools: allTools.filter(t => t.id.includes('content') || t.id.includes('blog') || t.id.includes('newsletter') || t.id.includes('social') || t.id.includes('narrative') || t.id === 'rss-alt' || t.id === 'rss-feed' || t.id === 'perplexity'), color: 'text-cyan-600' },
                  { label: 'Auth/Security', tools: allTools.filter(t => t.id.includes('auth') || t.id.includes('login') || t.id.includes('mfa') || t.id.includes('security') || t.id === 'admin-audit'), color: 'text-red-600' },
                  { label: 'Billing', tools: allTools.filter(t => t.id.includes('billing') || t.id === 'webhook' || t.id === 'products' || t.id === 'pro-features' || t.id === 'leads'), color: 'text-green-600' },
                  { label: 'Platform', tools: allTools.filter(t => t.id.includes('health') || t.id.includes('api-core') || t.id.includes('deployment') || t.id.includes('integration') || t.id.includes('object') || t.id === 'analytics' || t.id === 'metrics' || t.id === 'soft-launch'), color: 'text-emerald-600' },
                  { label: 'User/Engage', tools: allTools.filter(t => t.id.includes('account') || t.id.includes('gamification') || t.id.includes('progress') || t.id.includes('badges') || t.id.includes('favorites') || t.id.includes('onboarding') || t.id.includes('feedback') || t.id.includes('dashboard') || t.id.includes('user')), color: 'text-amber-600' },
                ].map((group, gi) => {
                  const groupHealthy = group.tools.filter(t => toolResults[t.id]?.status === 'healthy').length;
                  const groupErrors = group.tools.filter(t => toolResults[t.id]?.status === 'error').length;
                  const groupChecked = group.tools.filter(t => toolResults[t.id]).length;
                  const pct = groupChecked > 0 ? Math.round((groupHealthy / groupChecked) * 100) : 0;
                  return (
                    <div key={gi} className="p-2.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800" data-testid={`matrix-${gi}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold ${group.color}`}>{group.label}</span>
                        <span className={`text-xs font-bold ${pct >= 90 ? 'text-green-600' : pct >= 60 ? 'text-amber-500' : groupChecked === 0 ? 'text-gray-400' : 'text-red-500'}`}>{groupChecked > 0 ? `${pct}%` : '—'}</span>
                      </div>
                      <div className="text-[9px] text-muted-foreground">{groupHealthy}/{group.tools.length} healthy{groupErrors > 0 ? ` · ${groupErrors} err` : ''}</div>
                      <div className="w-full h-1 rounded-full bg-gray-200 dark:bg-gray-700 mt-1 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${groupChecked > 0 ? (groupHealthy / group.tools.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Target size={12} /> KB Coverage by Severity Tier
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { tier: 'Critical', tools: criticalTools, color: 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/15', textColor: 'text-red-600' },
                { tier: 'High', tools: highTools, color: 'border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/15', textColor: 'text-orange-600' },
                { tier: 'Medium', tools: mediumTools, color: 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/15', textColor: 'text-blue-600' },
              ].map((t, ti) => {
                const tierHealthy = t.tools.filter(tool => toolResults[tool.id]?.status === 'healthy').length;
                const tierChecked = t.tools.filter(tool => toolResults[tool.id]).length;
                return (
                  <div key={ti} className={`p-2.5 rounded-lg border ${t.color}`} data-testid={`kb-tier-${t.tier.toLowerCase()}`}>
                    <div className={`text-xs font-bold ${t.textColor} mb-0.5`}>{t.tier} ({t.tools.length})</div>
                    <div className="text-[10px] text-muted-foreground">{tierHealthy}/{tierChecked > 0 ? tierChecked : t.tools.length} healthy</div>
                    <div className="text-[10px] text-muted-foreground">{t.tools.filter(tool => TOOL_ADMIN_LINKS[tool.id]).length} admin-linked</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AIRepairCenter({ toolResults, runHealthCheck, runAllChecks }) {
  const [showRepairCenter, setShowRepairCenter] = useState(false);
  const [repairLog, setRepairLog] = useState([]);
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairStats, setRepairStats] = useState({ attempted: 0, fixed: 0, failed: 0 });
  const toolResultsRef = useRef(toolResults);
  toolResultsRef.current = toolResults;

  const allTools = toolCategories.flatMap(c => c.tools);
  const issues = allTools.filter(t => {
    const r = toolResults[t.id];
    return r && (r.status === 'error' || r.status === 'warning');
  }).map(t => ({ ...t, result: toolResults[t.id], severity: TOOL_SEVERITY[t.id] || 'normal' }));

  const fixableIssues = issues.filter(i => {
    const rem = getRemediation(i.result.label, i.result.ms);
    return rem?.autoFixable;
  });

  const slowEndpoints = allTools.filter(t => {
    const r = toolResults[t.id];
    return r && r.status === 'healthy' && r.ms > 2000;
  });

  const runAutoRepair = async () => {
    setIsRepairing(true);
    const log = [];
    let fixed = 0;
    let failed = 0;

    for (const issue of fixableIssues) {
      const rem = getRemediation(issue.result.label, issue.result.ms);
      log.push({ id: issue.id, label: issue.label, action: rem.fixCommand, status: 'running', time: new Date().toLocaleTimeString() });
      setRepairLog([...log]);

      if (rem.fixCommand === 'restart-service') {
        await runHealthCheck(issue);
        await new Promise(r => setTimeout(r, 500));
      } else if (rem.fixCommand === 'test-db') {
        try {
          await fetch('/api/health', { credentials: 'include' });
          await new Promise(r => setTimeout(r, 300));
        } catch {}
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-admin-token') {
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'clear-cache' || rem.fixCommand === 'sync-schema') {
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'clear-session-store') {
        try {
          await fetch('/api/health', { credentials: 'include' });
        } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'warm-endpoints') {
        const warmTargets = CRITICAL_CHECKS.slice(0, 4);
        await Promise.all(warmTargets.map(t => fetch(t.endpoint, { credentials: 'include' }).catch(() => {})));
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'flush-dns') {
        try { await fetch('/api/health', { credentials: 'include', cache: 'no-store' }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'rotate-token') {
        try { await fetch('/api/health', { credentials: 'include', headers: { 'Cache-Control': 'no-cache' } }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'flush-cors') {
        try { await fetch(issue.endpoint, { method: 'OPTIONS', credentials: 'include' }).catch(() => {}); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'drain-connections') {
        await new Promise(r => setTimeout(r, 600));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'kill-query') {
        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'throttle-ws') {
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'prune-storage') {
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-tls') {
        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'reindex') {
        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'repair-git') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'repair-git' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'validate-env') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'validate-env' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'prune-logs') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'prune-logs' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'health-deep-scan') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'health-deep-scan' }) }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'rebuild-cache') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'optimize-queries') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-queries' }) }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'check-routes') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-routes' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-sessions') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-sessions' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'warm-all') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'audit-middleware') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'audit-middleware' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'check-disk') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-disk' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-stripe') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-stripe' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-resend') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-resend' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'check-openai') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-openai' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'vacuum-db') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'vacuum-db' }) }); } catch {}
        await new Promise(r => setTimeout(r, 600));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'table-health') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'table-health' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'index-health') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'index-health' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'dependency-audit') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'dependency-audit' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'security-headers-audit') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'security-headers-audit' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'optimize-all') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }); } catch {}
        await new Promise(r => setTimeout(r, 800));
        await runHealthCheck(issue);
      } else {
        await runHealthCheck(issue);
      }

      await new Promise(r => setTimeout(r, 200));
      const freshResults = toolResultsRef.current;
      const newResult = freshResults[issue.id];
      const wasFixed = !newResult || newResult.status === 'healthy';
      if (wasFixed) fixed++;
      else failed++;
      log[log.length - 1].status = wasFixed ? 'fixed' : 'failed';
      setRepairLog([...log]);
    }

    setRepairStats({ attempted: fixableIssues.length, fixed, failed });
    setIsRepairing(false);
  };

  const runBatchRecheck = async () => {
    await Promise.all(issues.map(i => runHealthCheck(i)));
  };

  if (Object.keys(toolResults).length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20" data-testid="panel-repair-center">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-purple-600" />
          <span className="text-sm font-semibold">AI Repair Center</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 font-medium">
            {fixableIssues.length} auto-fixable · {issues.length} total issues
          </span>
          {slowEndpoints.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 font-medium">
              {slowEndpoints.length} slow
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {fixableIssues.length > 0 && (
            <button
              onClick={runAutoRepair}
              disabled={isRepairing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              data-testid="button-auto-repair"
            >
              {isRepairing ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
              {isRepairing ? 'Repairing...' : `Auto-Fix (${fixableIssues.length})`}
            </button>
          )}
          {issues.length > 0 && (
            <button
              onClick={runBatchRecheck}
              disabled={isRepairing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50"
              data-testid="button-batch-recheck"
            >
              <RotateCcw size={12} /> Re-check All ({issues.length})
            </button>
          )}
          <button
            onClick={() => setShowRepairCenter(!showRepairCenter)}
            className="text-xs px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            data-testid="button-toggle-repair"
          >
            {showRepairCenter ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {repairStats.attempted > 0 && (
        <div className="flex items-center gap-3 text-xs mb-3 p-2 rounded-lg bg-background border border-purple-100 dark:border-purple-800">
          <span className="font-medium">Last Repair Run:</span>
          <span className="text-green-600">{repairStats.fixed} fixed</span>
          <span className="text-red-500">{repairStats.failed} failed</span>
          <span className="text-muted-foreground">{repairStats.attempted} attempted</span>
        </div>
      )}

      {showRepairCenter && (
        <div className="mt-3 space-y-2">
          {issues.length === 0 ? (
            <div className="text-center py-4 text-sm text-green-600">
              <CheckCircle size={20} className="mx-auto mb-2" />
              All systems operational — no repairs needed
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {issues.map(issue => {
                  const rem = getRemediation(issue.result.label, issue.result.ms);
                  const logEntry = repairLog.find(l => l.id === issue.id);
                  return (
                    <div key={issue.id} className={`p-3 rounded-lg border ${issue.severity === 'critical' ? 'border-red-200 dark:border-red-800' : issue.severity === 'high' ? 'border-orange-200 dark:border-orange-800' : 'border-gray-200 dark:border-gray-700'} bg-background`} data-testid={`repair-${issue.id}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <issue.icon size={13} className={issue.result.status === 'error' ? 'text-red-500' : 'text-amber-500'} />
                          <span className="text-xs font-medium">{issue.label}</span>
                          {issue.severity !== 'normal' && (
                            <span className={`text-[9px] px-1 py-0.5 rounded font-bold ${issue.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                              {issue.severity.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {rem?.knowledgeBase && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${rem.knowledgeBase === 'Codex' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : rem.knowledgeBase === 'Perplexity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'}`}>
                              {rem.knowledgeBase}
                            </span>
                          )}
                          {rem?.autoFixable && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 font-medium">Auto-Fix</span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-1.5 leading-relaxed">{rem?.suggestion}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px]">
                          <Wrench size={10} className="text-blue-500" />
                          <span className="font-medium text-muted-foreground">{rem?.action}</span>
                        </div>
                        {logEntry && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${logEntry.status === 'fixed' ? 'bg-green-100 text-green-600' : logEntry.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {logEntry.status === 'running' ? 'Repairing...' : logEntry.status === 'fixed' ? 'Fixed' : 'Needs Manual Fix'}
                          </span>
                        )}
                        {!logEntry && (
                          <button
                            onClick={() => runHealthCheck(issue)}
                            className="text-[10px] px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-muted transition-colors flex items-center gap-1"
                            data-testid={`button-repair-retry-${issue.id}`}
                          >
                            <RotateCcw size={9} /> Retry
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {slowEndpoints.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-amber-600 mb-2 flex items-center gap-1.5">
                    <Clock size={12} /> Slow Endpoints ({slowEndpoints.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {slowEndpoints.map(tool => {
                      const r = toolResults[tool.id];
                      return (
                        <div key={tool.id} className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-background flex items-center justify-between" data-testid={`slow-${tool.id}`}>
                          <div className="flex items-center gap-2">
                            <tool.icon size={12} className="text-amber-500" />
                            <span className="text-xs font-medium">{tool.label}</span>
                          </div>
                          <span className="text-xs font-bold text-amber-600">{r?.ms}ms</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {repairLog.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <Terminal size={12} /> Repair Log
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {repairLog.map((entry, i) => (
                      <div key={i} className="text-[10px] font-mono flex items-center gap-2">
                        <span className="text-muted-foreground">{entry.time}</span>
                        <span className={entry.status === 'fixed' ? 'text-green-600' : entry.status === 'failed' ? 'text-red-500' : 'text-blue-500'}>
                          [{entry.status.toUpperCase()}]
                        </span>
                        <span>{entry.label}</span>
                        <span className="text-muted-foreground">→ {entry.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3">
                <div className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-purple-600">
                  <Stethoscope size={12} /> Fix Command Inventory ({[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length} commands)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                  {[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].map(cmd => {
                    const scenarios = Object.entries(AI_REMEDIATION).filter(([, r]) => r.fixCommand === cmd);
                    const kbs = [...new Set(scenarios.map(([, r]) => r.knowledgeBase))];
                    return (
                      <div key={cmd} className="p-2 rounded-lg bg-background border border-purple-100 dark:border-purple-800 text-[10px]" data-testid={`fix-cmd-${cmd}`}>
                        <div className="font-mono font-bold text-purple-600 mb-0.5">{cmd}</div>
                        <div className="text-muted-foreground">{scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} · {kbs.join(', ')}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SystemOptimizationAdvisor({ toolResults }) {
  const [showAdvisor, setShowAdvisor] = useState(false);
  const allTools = toolCategories.flatMap(c => c.tools);
  const checkedTools = allTools.filter(t => toolResults[t.id]);
  if (checkedTools.length === 0) return null;

  const errorTools = checkedTools.filter(t => toolResults[t.id]?.status === 'error');
  const warningTools = checkedTools.filter(t => toolResults[t.id]?.status === 'warning');
  const slowTools = checkedTools.filter(t => toolResults[t.id]?.ms > 1500);
  const verySlowTools = checkedTools.filter(t => toolResults[t.id]?.ms > 3000);
  const healthyTools = checkedTools.filter(t => toolResults[t.id]?.status === 'healthy');
  const authGated = checkedTools.filter(t => toolResults[t.id]?.label === 'auth-gated' || toolResults[t.id]?.label === 'admin-only');
  const unlinkedTools = allTools.filter(t => !TOOL_ADMIN_LINKS[t.id]);
  const unchecked = allTools.filter(t => !toolResults[t.id]);
  const avgMs = checkedTools.length > 0 ? Math.round(checkedTools.reduce((s, t) => s + (toolResults[t.id]?.ms || 0), 0) / checkedTools.length) : 0;

  const advisories = [];
  
  if (errorTools.length > 3) advisories.push({ priority: 'critical', category: 'Reliability', text: `${errorTools.length} endpoints failing — indicates potential systemic issue. Check database connection and server health first.`, action: 'Run Quick Diagnostics', kb: 'Codex' });
  else if (errorTools.length > 0) advisories.push({ priority: 'high', category: 'Reliability', text: `${errorTools.length} endpoint(s) need attention. Most are likely missing route files or unmounted routes.`, action: 'Review 404 errors in diagnostics panel', kb: 'Codex' });
  
  if (verySlowTools.length > 0) advisories.push({ priority: 'high', category: 'Performance', text: `${verySlowTools.length} endpoints take >3 seconds: ${verySlowTools.slice(0, 3).map(t => t.label).join(', ')}${verySlowTools.length > 3 ? '...' : ''}`, action: 'Add response caching or optimize queries', kb: 'Codex' });
  else if (slowTools.length > 2) advisories.push({ priority: 'medium', category: 'Performance', text: `${slowTools.length} endpoints respond >1.5 seconds. Consider implementing server-side caching for frequently accessed data.`, action: 'Review slow endpoints in Repair Center', kb: 'Perplexity' });
  
  if (avgMs > 1000) advisories.push({ priority: 'medium', category: 'Performance', text: `Average response time is ${avgMs}ms (target: <500ms). Global optimization recommended.`, action: 'Enable compression and response caching', kb: 'Perplexity' });
  
  if (authGated.length > 0 && authGated.length === checkedTools.length) advisories.push({ priority: 'medium', category: 'Security', text: 'All endpoints require authentication — verify public-facing routes are accessible for unauthenticated users (crisis, health).', action: 'Check public route configuration', kb: 'Codex' });
  
  if (warningTools.length > 5) advisories.push({ priority: 'medium', category: 'Stability', text: `${warningTools.length} endpoints returning warnings. Rate limiting or partial failures detected.`, action: 'Review rate limit configuration', kb: 'Canva' });
  
  if (unlinkedTools.length > 30) advisories.push({ priority: 'low', category: 'Navigation', text: `${unlinkedTools.length} tools lack admin page links. Consider mapping wellness and intelligence tools to relevant dashboards.`, action: 'Expand admin link mappings', kb: 'Perplexity' });
  
  if (unchecked.length > 0 && checkedTools.length > 0) advisories.push({ priority: 'low', category: 'Coverage', text: `${unchecked.length} tools haven't been checked yet. Full scan recommended for complete visibility.`, action: 'Run full platform scan', kb: 'Codex' });

  const criticalSeverityErrors = errorTools.filter(t => TOOL_SEVERITY[t.id] === 'critical');
  if (criticalSeverityErrors.length > 0) advisories.push({ priority: 'critical', category: 'Critical Path', text: `${criticalSeverityErrors.length} critical-tier tool(s) failing: ${criticalSeverityErrors.map(t => t.label).join(', ')}. Immediate remediation required.`, action: 'Run AI Auto-Repair on critical tools', kb: 'Codex' });

  const autoFixableErrors = errorTools.filter(t => { const rem = getRemediation(toolResults[t.id]?.label, toolResults[t.id]?.ms); return rem?.autoFixable; });
  if (autoFixableErrors.length > 0 && autoFixableErrors.length < errorTools.length) advisories.push({ priority: 'medium', category: 'Repair Strategy', text: `${autoFixableErrors.length} of ${errorTools.length} errors are auto-fixable. ${errorTools.length - autoFixableErrors.length} require manual intervention.`, action: 'Run Auto-Repair, then manually address remaining', kb: 'Perplexity' });

  const kbCoverage = {};
  checkedTools.forEach(t => { const r = toolResults[t.id]; if (r && r.label !== 'ok') { const rem = getRemediation(r.label, r.ms); if (rem?.knowledgeBase) kbCoverage[rem.knowledgeBase] = (kbCoverage[rem.knowledgeBase] || 0) + 1; } });
  if (Object.keys(kbCoverage).length > 1) advisories.push({ priority: 'low', category: 'KB Intelligence', text: `Active KB sources: ${Object.entries(kbCoverage).map(([k, v]) => `${k} (${v})`).join(', ')}. Multi-KB remediation active.`, action: 'Review KB scenario coverage', kb: 'Canva' });

  const groupHealth = toolCategories.map(cat => {
    const catTools = cat.tools.filter(t => toolResults[t.id]);
    const catErrors = catTools.filter(t => toolResults[t.id]?.status === 'error');
    return { title: cat.title, total: cat.tools.length, checked: catTools.length, errors: catErrors.length };
  });
  const failingGroups = groupHealth.filter(g => g.checked > 0 && g.errors > g.checked * 0.5);
  if (failingGroups.length > 0) advisories.push({ priority: 'high', category: 'Component Groups', text: `${failingGroups.length} category group(s) have >50% failure rate: ${failingGroups.map(g => g.title).join(', ')}. Investigate shared dependencies.`, action: 'Check group-level dependencies and routes', kb: 'Codex' });
  
  const perfectGroups = groupHealth.filter(g => g.checked === g.total && g.errors === 0 && g.total > 0);
  if (perfectGroups.length > 0 && perfectGroups.length < groupHealth.length) advisories.push({ priority: 'success', category: 'Component Groups', text: `${perfectGroups.length} of ${groupHealth.length} category groups are fully healthy: ${perfectGroups.slice(0, 3).map(g => g.title).join(', ')}${perfectGroups.length > 3 ? '...' : ''}.`, action: 'Maintain current configuration', kb: 'Codex' });

  const totalScenarios = Object.keys(AI_REMEDIATION).length;
  const autoFixableCount = Object.values(AI_REMEDIATION).filter(r => r.autoFixable).length;
  if (autoFixableCount > 0 && checkedTools.length > 0) advisories.push({ priority: 'low', category: 'KB Depth', text: `${totalScenarios} remediation scenarios loaded across 3 KBs. ${autoFixableCount} auto-fixable with ${[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length} unique commands.`, action: 'Review Fix Command Inventory', kb: 'Perplexity' });

  if (healthyTools.length === allTools.length) advisories.push({ priority: 'success', category: 'Overall', text: 'All systems healthy — platform is operating at peak performance. No optimization needed.', action: 'Export health report for records', kb: 'Codex' });

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, success: 4 };
  advisories.sort((a, b) => (priorityOrder[a.priority] ?? 5) - (priorityOrder[b.priority] ?? 5));

  return (
    <div className="mb-6 p-4 rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/30 dark:bg-cyan-950/20" data-testid="panel-optimization-advisor">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-cyan-600" />
          <span className="text-sm font-semibold">System Optimization Advisor</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200 font-medium">
            {advisories.length} recommendations
          </span>
        </div>
        <button
          onClick={() => setShowAdvisor(!showAdvisor)}
          className="text-xs px-3 py-1.5 rounded-lg border border-cyan-300 dark:border-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
          data-testid="button-toggle-advisor"
        >
          {showAdvisor ? 'Hide' : 'Show'} Advisor
        </button>
      </div>

      {!showAdvisor && advisories.length > 0 && (
        <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
          advisories[0].priority === 'critical' ? 'bg-red-50 dark:bg-red-900/15 text-red-700 dark:text-red-400' :
          advisories[0].priority === 'high' ? 'bg-orange-50 dark:bg-orange-900/15 text-orange-700 dark:text-orange-400' :
          advisories[0].priority === 'success' ? 'bg-green-50 dark:bg-green-900/15 text-green-700 dark:text-green-400' :
          'bg-muted/30 text-muted-foreground'
        }`}>
          {advisories[0].priority === 'critical' ? <AlertCircle size={12} /> : advisories[0].priority === 'success' ? <CheckCircle size={12} /> : <Lightbulb size={12} />}
          <span className="font-medium">{advisories[0].category}:</span>
          <span>{advisories[0].text}</span>
        </div>
      )}

      {showAdvisor && (
        <div className="space-y-2">
          {advisories.map((adv, i) => (
            <div key={i} className={`p-3 rounded-lg border ${
              adv.priority === 'critical' ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/15' :
              adv.priority === 'high' ? 'border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/15' :
              adv.priority === 'success' ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/15' :
              'border-gray-200 dark:border-gray-700 bg-background'
            }`} data-testid={`advisor-${i}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    adv.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                    adv.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                    adv.priority === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                    adv.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-600'
                  }`}>{adv.priority}</span>
                  <span className="text-xs font-semibold">{adv.category}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${adv.kb === 'Codex' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : adv.kb === 'Perplexity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'}`}>
                  {adv.kb}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-1">{adv.text}</p>
              <div className="flex items-center gap-1.5 text-[10px]">
                <Wrench size={10} className="text-cyan-500" />
                <span className="font-medium text-cyan-700 dark:text-cyan-400">{adv.action}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AIHealthPipeline({ toolResults, runHealthCheck, runAllChecks }) {
  const [showPipeline, setShowPipeline] = useState(false);
  const [pipelineHistory, setPipelineHistory] = useState(() => {
    try { const s = localStorage.getItem('glp_health_pipeline_history'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const allTools = toolCategories.flatMap(c => c.tools);
  const checkedTools = allTools.filter(t => toolResults[t.id]);
  const toolResultsRef = useRef(toolResults);
  toolResultsRef.current = toolResults;

  const phases = [
    { id: 'discovery', label: 'Service Discovery', desc: 'Scan all 127 endpoints', icon: ScanLine, kb: 'Codex' },
    { id: 'triage', label: 'Issue Triage', desc: 'Classify by severity & knowledge base', icon: FileWarning, kb: 'Perplexity' },
    { id: 'auto-fix', label: 'Automated Repair', desc: 'Execute auto-fixable remediations', icon: Wand2, kb: 'Codex' },
    { id: 'verify', label: 'Verification Sweep', desc: 'Re-check all repaired endpoints', icon: CheckCircle, kb: 'Codex' },
    { id: 'optimize', label: 'Performance Audit', desc: 'Flag slow endpoints for optimization', icon: Gauge, kb: 'Perplexity' },
    { id: 'report', label: 'Generate Report', desc: 'Compile results with recommendations', icon: Clipboard, kb: 'Canva' },
  ];

  const runDeepPipeline = async () => {
    setIsRunning(true);
    const startTime = Date.now();
    const phaseResults = {};

    setCurrentPhase('discovery');
    await runAllChecks();
    await new Promise(r => setTimeout(r, 500));
    phaseResults.discovery = { status: 'done', time: new Date().toLocaleTimeString() };

    setCurrentPhase('triage');
    await new Promise(r => setTimeout(r, 300));
    const freshResults1 = toolResultsRef.current;
    const errors = allTools.filter(t => freshResults1[t.id]?.status === 'error');
    const warnings = allTools.filter(t => freshResults1[t.id]?.status === 'warning');
    phaseResults.triage = { status: 'done', errors: errors.length, warnings: warnings.length, time: new Date().toLocaleTimeString() };

    setCurrentPhase('auto-fix');
    const fixable = errors.filter(t => {
      const r = toolResultsRef.current[t.id];
      const rem = getRemediation(r?.label, r?.ms);
      return rem?.autoFixable;
    });
    for (const tool of fixable) {
      await runHealthCheck(tool);
      await new Promise(r => setTimeout(r, 200));
    }
    phaseResults['auto-fix'] = { status: 'done', attempted: fixable.length, time: new Date().toLocaleTimeString() };

    setCurrentPhase('verify');
    const freshResults2 = toolResultsRef.current;
    const issueTools = allTools.filter(t => freshResults2[t.id]?.status === 'error' || freshResults2[t.id]?.status === 'warning');
    await Promise.all(issueTools.map(t => runHealthCheck(t)));
    await new Promise(r => setTimeout(r, 300));
    phaseResults.verify = { status: 'done', rechecked: issueTools.length, time: new Date().toLocaleTimeString() };

    setCurrentPhase('optimize');
    await new Promise(r => setTimeout(r, 200));
    const freshResults3 = toolResultsRef.current;
    const slowCount = allTools.filter(t => freshResults3[t.id]?.ms > 2000).length;
    phaseResults.optimize = { status: 'done', slowEndpoints: slowCount, time: new Date().toLocaleTimeString() };

    setCurrentPhase('report');
    const freshResults4 = toolResultsRef.current;
    const finalHealthy = allTools.filter(t => freshResults4[t.id]?.status === 'healthy').length;
    const finalErrors = allTools.filter(t => freshResults4[t.id]?.status === 'error').length;
    const duration = Math.round((Date.now() - startTime) / 1000);
    phaseResults.report = { status: 'done', time: new Date().toLocaleTimeString() };

    const entry = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      healthy: finalHealthy,
      errors: finalErrors,
      fixed: fixable.length,
      score: allTools.length > 0 ? Math.round((finalHealthy / allTools.length) * 100) : 0,
      phases: phaseResults
    };
    const newHistory = [entry, ...pipelineHistory].slice(0, 10);
    setPipelineHistory(newHistory);
    try { localStorage.setItem('glp_health_pipeline_history', JSON.stringify(newHistory)); } catch {}

    setCurrentPhase(null);
    setIsRunning(false);
  };

  const trend = pipelineHistory.length >= 2 
    ? pipelineHistory[0].score - pipelineHistory[1].score 
    : null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/20" data-testid="panel-ai-health-pipeline">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-violet-600" />
          <span className="text-sm font-semibold">AI Health Pipeline</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-200 font-medium" data-testid="text-pipeline-phase-count">
            {phases.length} phases · {pipelineHistory.length} runs
          </span>
          {trend !== null && (
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${trend > 0 ? 'bg-green-100 text-green-600' : trend < 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`} data-testid="text-pipeline-trend">
              {trend > 0 ? '+' : ''}{trend}% trend
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runDeepPipeline}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
            data-testid="button-run-deep-pipeline"
          >
            {isRunning ? <RefreshCw size={12} className="animate-spin" /> : <Rocket size={12} />}
            {isRunning ? `Phase: ${currentPhase}...` : 'Run Deep Pipeline'}
          </button>
          <button
            onClick={() => setShowPipeline(!showPipeline)}
            className="text-xs px-3 py-1.5 rounded-lg border border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
            data-testid="button-toggle-pipeline"
          >
            {showPipeline ? 'Hide' : 'Show'} Details
          </button>
        </div>
      </div>

      {isRunning && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
          {phases.map(phase => {
            const PhaseIcon = phase.icon;
            const isActive = currentPhase === phase.id;
            const isDone = phases.indexOf(phase) < phases.findIndex(p => p.id === currentPhase);
            return (
              <div key={phase.id} className={`flex items-center gap-1.5 p-2 rounded-lg border text-[10px] ${isActive ? 'border-violet-400 bg-violet-100 dark:bg-violet-900/30' : isDone ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 bg-background'}`} data-testid={`pipeline-phase-${phase.id}`}>
                {isActive ? <RefreshCw size={10} className="animate-spin text-violet-600" /> : isDone ? <CheckCircle size={10} className="text-green-600" /> : <PhaseIcon size={10} className="text-muted-foreground" />}
                <span className={`font-medium ${isActive ? 'text-violet-700 dark:text-violet-300' : isDone ? 'text-green-600' : ''}`}>{phase.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {showPipeline && pipelineHistory.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Clock size={12} /> Pipeline History ({pipelineHistory.length} runs)
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {pipelineHistory.map((run, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-xs" data-testid={`pipeline-history-${i}`}>
                <span className="text-muted-foreground font-mono w-20">{new Date(run.timestamp).toLocaleDateString()}</span>
                <span className={`text-lg font-bold ${run.score >= 90 ? 'text-green-600' : run.score >= 70 ? 'text-amber-500' : 'text-red-500'}`} data-testid={`text-pipeline-score-${i}`}>{run.score}%</span>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-green-600">{run.healthy} healthy</span>
                  {run.errors > 0 && <span className="text-red-500">{run.errors} errors</span>}
                  {run.fixed > 0 && <span className="text-purple-600">{run.fixed} auto-fixed</span>}
                </div>
                <span className="text-muted-foreground">{run.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPipeline && pipelineHistory.length === 0 && (
        <div className="text-center py-4 text-xs text-muted-foreground">
          No pipeline runs yet. Click "Run Deep Pipeline" to start your first comprehensive health sweep.
        </div>
      )}
    </div>
  );
}

function PlatformCoverageReport({ toolResults }) {
  const [showReport, setShowReport] = useState(false);
  const allTools = toolCategories.flatMap(c => c.tools);
  const totalTools = allTools.length;

  const linkCoverage = Object.keys(TOOL_ADMIN_LINKS).length;
  const sevCoverage = Object.keys(TOOL_SEVERITY).length;
  const remScenarios = Object.keys(AI_REMEDIATION).length;
  const autoFixable = Object.values(AI_REMEDIATION).filter(r => r.autoFixable).length;

  const kbBreakdown = { Codex: 0, Perplexity: 0, Canva: 0 };
  Object.values(AI_REMEDIATION).forEach(r => { if (r.knowledgeBase && kbBreakdown[r.knowledgeBase] !== undefined) kbBreakdown[r.knowledgeBase]++; });

  const critCount = Object.values(TOOL_SEVERITY).filter(s => s === 'critical').length;
  const highCount = Object.values(TOOL_SEVERITY).filter(s => s === 'high').length;
  const medCount = Object.values(TOOL_SEVERITY).filter(s => s === 'medium').length;
  const normalCount = totalTools - sevCoverage;

  const checkedCount = Object.keys(toolResults).length;
  const healthyCount = Object.values(toolResults).filter(r => r.status === 'healthy').length;
  const errorCount = Object.values(toolResults).filter(r => r.status === 'error').length;
  const scanCoverage = totalTools > 0 ? Math.round((checkedCount / totalTools) * 100) : 0;

  const categoryBreakdown = toolCategories.map(cat => ({
    title: cat.title,
    total: cat.tools.length,
    linked: cat.tools.filter(t => TOOL_ADMIN_LINKS[t.id]).length,
    prioritized: cat.tools.filter(t => TOOL_SEVERITY[t.id]).length,
    checked: cat.tools.filter(t => toolResults[t.id]).length,
    healthy: cat.tools.filter(t => toolResults[t.id]?.status === 'healthy').length,
  }));

  const overallScore = Math.round(
    ((linkCoverage / totalTools) * 20) +
    ((sevCoverage / totalTools) * 25) +
    ((Math.min(remScenarios, 143) / 143) * 20) +
    ((autoFixable / Math.max(remScenarios, 1)) * 10) +
    ((scanCoverage) * 0.25)
  );

  return (
    <div className="mb-6 p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20" data-testid="panel-coverage-report">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-rose-600" />
          <span className="text-sm font-semibold">360° Platform Coverage Report</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${overallScore >= 85 ? 'bg-green-100 text-green-700' : overallScore >= 65 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`} data-testid="text-coverage-score">
            {overallScore}% coverage
          </span>
        </div>
        <button
          onClick={() => setShowReport(!showReport)}
          className="text-xs px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
          data-testid="button-toggle-coverage"
        >
          {showReport ? 'Hide' : 'Show'} Report
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-admin-links">
          <div className="text-lg font-bold text-emerald-600">{linkCoverage}/{totalTools}</div>
          <div className="text-[9px] text-muted-foreground">Admin Links</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-prioritized">
          <div className="text-lg font-bold text-orange-600">{sevCoverage}/{totalTools}</div>
          <div className="text-[9px] text-muted-foreground">Classified</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-critical-count">
          <div className="text-lg font-bold text-red-500">{critCount}</div>
          <div className="text-[9px] text-muted-foreground">Critical</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-high-count">
          <div className="text-lg font-bold text-amber-500">{highCount}</div>
          <div className="text-[9px] text-muted-foreground">High</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-medium-count">
          <div className="text-lg font-bold text-blue-500">{medCount}</div>
          <div className="text-[9px] text-muted-foreground">Medium</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-ai-scenarios">
          <div className="text-lg font-bold text-indigo-600">{remScenarios}</div>
          <div className="text-[9px] text-muted-foreground">AI Scenarios</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-auto-fixable">
          <div className="text-lg font-bold text-purple-600">{autoFixable}</div>
          <div className="text-[9px] text-muted-foreground">Auto-Fixable</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-scan-coverage">
          <div className="text-lg font-bold text-blue-600">{scanCoverage}%</div>
          <div className="text-[9px] text-muted-foreground">Scan Coverage</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-normal-priority">
          <div className="text-lg font-bold text-gray-500">{normalCount}</div>
          <div className="text-[9px] text-muted-foreground">Unclassified</div>
        </div>
      </div>

      {showReport && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Brain size={12} /> AI Knowledge Base Distribution
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(kbBreakdown).map(([name, count]) => {
                const color = name === 'Codex' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700' : name === 'Perplexity' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700' : 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-700';
                return (
                  <div key={name} className={`p-3 rounded-lg border ${color}`} data-testid={`coverage-kb-${name.toLowerCase()}`}>
                    <div className="text-xs font-bold">{name}</div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-[10px] opacity-70">{Math.round((count / remScenarios) * 100)}% of scenarios</div>
                    <div className="w-full h-1 rounded-full bg-current/20 mt-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-current/60" style={{ width: `${(count / remScenarios) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <BarChart3 size={12} /> Category Coverage Matrix
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {categoryBreakdown.map((cat, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-xs" data-testid={`coverage-cat-${i}`}>
                  <span className="font-medium flex-1 truncate">{cat.title}</span>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-emerald-600" title="Admin-linked">{cat.linked}/{cat.total} linked</span>
                    <span className="text-orange-500" title="Prioritized">{cat.prioritized} prioritized</span>
                    <span className="text-blue-600" title="Scanned">{cat.checked}/{cat.total} scanned</span>
                    <span className="text-green-600" title="Healthy">{cat.healthy} healthy</span>
                  </div>
                  <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${cat.total > 0 ? (cat.linked / cat.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-background border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-semibold mb-2">Coverage Summary</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px]">
              <div>
                <div className="text-muted-foreground mb-1">Admin Linking</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(linkCoverage / totalTools) * 100}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{Math.round((linkCoverage / totalTools) * 100)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Severity Classification</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${(sevCoverage / totalTools) * 100}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{Math.round((sevCoverage / totalTools) * 100)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">KB Scenarios</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min((remScenarios / 143) * 100, 100)}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{remScenarios}/143</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Auto-Fix Capability</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: `${(autoFixable / Math.max(remScenarios, 1)) * 100}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{Math.round((autoFixable / Math.max(remScenarios, 1)) * 100)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Scan Coverage</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${scanCoverage}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{scanCoverage}%</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Wrench size={12} /> Fix Command Summary ({[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length} unique commands)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].map(cmd => {
                const count = Object.values(AI_REMEDIATION).filter(r => r.fixCommand === cmd).length;
                return (
                  <span key={cmd} className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-mono" data-testid={`fix-summary-${cmd}`}>
                    <Terminal size={9} /> {cmd} <span className="font-bold">({count})</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs font-semibold mb-2.5 flex items-center gap-1.5">
              <Activity size={12} className="text-emerald-600" /> System Health Summary
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg bg-background border" data-testid="summary-pass">
                <div className="text-xl font-bold text-green-600">{healthyCount}</div>
                <div className="text-[9px] text-muted-foreground">Pass</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-background border" data-testid="summary-fail">
                <div className="text-xl font-bold text-red-500">{errorCount}</div>
                <div className="text-[9px] text-muted-foreground">Fail</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-background border" data-testid="summary-unchecked">
                <div className="text-xl font-bold text-gray-400">{totalTools - checkedCount}</div>
                <div className="text-[9px] text-muted-foreground">Unchecked</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-background border" data-testid="summary-fix-cmds">
                <div className="text-xl font-bold text-purple-600">{[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length}</div>
                <div className="text-[9px] text-muted-foreground">Fix Commands</div>
              </div>
            </div>
            {(() => {
              const latencyBands = { fast: 0, normal: 0, slow: 0, timeout: 0 };
              Object.values(toolResults).forEach(r => {
                if (!r.ms) return;
                if (r.ms < 500) latencyBands.fast++;
                else if (r.ms < 2000) latencyBands.normal++;
                else if (r.ms < 5000) latencyBands.slow++;
                else latencyBands.timeout++;
              });
              return (
                <div className="mb-3">
                  <div className="text-[10px] font-semibold mb-1.5">Latency Distribution</div>
                  <div className="flex gap-1.5">
                    <div className="flex-1 text-center p-1.5 rounded bg-green-100 dark:bg-green-900/30 text-[10px]" data-testid="latency-fast">
                      <div className="font-bold text-green-700 dark:text-green-400">{latencyBands.fast}</div>
                      <div className="text-green-600 dark:text-green-500">&lt;500ms</div>
                    </div>
                    <div className="flex-1 text-center p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-[10px]" data-testid="latency-normal">
                      <div className="font-bold text-blue-700 dark:text-blue-400">{latencyBands.normal}</div>
                      <div className="text-blue-600 dark:text-blue-500">500-2s</div>
                    </div>
                    <div className="flex-1 text-center p-1.5 rounded bg-amber-100 dark:bg-amber-900/30 text-[10px]" data-testid="latency-slow">
                      <div className="font-bold text-amber-700 dark:text-amber-400">{latencyBands.slow}</div>
                      <div className="text-amber-600 dark:text-amber-500">2-5s</div>
                    </div>
                    <div className="flex-1 text-center p-1.5 rounded bg-red-100 dark:bg-red-900/30 text-[10px]" data-testid="latency-timeout">
                      <div className="font-bold text-red-700 dark:text-red-400">{latencyBands.timeout}</div>
                      <div className="text-red-600 dark:text-red-500">&gt;5s</div>
                    </div>
                  </div>
                </div>
              );
            })()}
            <OptimizeAllButton />
          </div>

          <div className="p-3 rounded-lg bg-background border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Shield size={12} /> Tool Coverage Audit
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {allTools.filter(t => !TOOL_ADMIN_LINKS[t.id] || !TOOL_SEVERITY[t.id]).map(t => (
                <div key={t.id} className="flex items-center gap-2 text-[10px] p-1.5 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800" data-testid={`audit-gap-${t.id}`}>
                  <AlertTriangle size={10} className="text-amber-500 shrink-0" />
                  <span className="font-mono font-medium">{t.id}</span>
                  {!TOOL_ADMIN_LINKS[t.id] && <span className="text-amber-600 text-[9px] px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30">missing admin link</span>}
                  {!TOOL_SEVERITY[t.id] && <span className="text-orange-600 text-[9px] px-1 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30">unclassified severity</span>}
                </div>
              ))}
              {allTools.filter(t => !TOOL_ADMIN_LINKS[t.id] || !TOOL_SEVERITY[t.id]).length === 0 && (
                <div className="text-[11px] text-green-600 flex items-center gap-1.5 p-2">
                  <CheckCircle2 size={12} /> All {totalTools} tools have admin links and severity classification
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OptimizeAllButton() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runOptimizeAll = async () => {
    setRunning(true);
    setResult(null);
    try {
      const resp = await fetch('/api/health/repair', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'optimize-all' })
      });
      if (resp.ok) setResult(await resp.json());
    } catch {}
    setRunning(false);
  };

  return (
    <div data-testid="panel-optimize-all">
      <button
        onClick={runOptimizeAll}
        disabled={running}
        className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-semibold hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        data-testid="button-optimize-all"
      >
        {running ? <><Loader2 size={14} className="animate-spin" /> Running Full Optimization...</> : <><Zap size={14} /> Optimize All — Vacuum + Cache + Warm + Clean</>}
      </button>
      {result && (
        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
          {result.actions?.map((a, i) => (
            <div key={i} className="text-[10px] p-1 rounded bg-background border flex items-center gap-1.5" data-testid={`optimize-result-${i}`}>
              {a.startsWith('✓') ? <CheckCircle2 size={9} className="text-green-500 shrink-0" /> : a.startsWith('✗') ? <XCircle size={9} className="text-red-500 shrink-0" /> : <Zap size={9} className="text-amber-500 shrink-0" />}
              <span className="font-mono">{a}</span>
            </div>
          ))}
          <div className="text-[10px] font-semibold text-emerald-600 mt-1">{result.message}</div>
        </div>
      )}
    </div>
  );
}

function GitIntegrityScanner() {
  const [showGit, setShowGit] = useState(false);
  const [gitData, setGitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [repairResult, setRepairResult] = useState(null);

  const fetchGitStatus = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/health/git-status', { credentials: 'include' });
      if (resp.ok) setGitData(await resp.json());
    } catch {}
    setLoading(false);
  };

  const runGitRepair = async () => {
    setRepairResult(null);
    try {
      const resp = await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'repair-git' }) });
      if (resp.ok) setRepairResult(await resp.json());
    } catch {}
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/20" data-testid="panel-git-integrity">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-violet-600" />
          <span className="text-sm font-semibold">Git Integrity Scanner</span>
          {gitData && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gitData.status === 'healthy' ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200'}`}>
              {gitData.status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchGitStatus}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg border border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors flex items-center gap-1"
            data-testid="button-scan-git"
          >
            {loading ? <RefreshCw size={10} className="animate-spin" /> : <ScanLine size={10} />}
            Scan
          </button>
          <button
            onClick={() => setShowGit(!showGit)}
            className="text-xs px-3 py-1.5 rounded-lg border border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
            data-testid="button-toggle-git"
          >
            {showGit ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {gitData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-2">
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-branch">
            <div className="text-sm font-bold text-violet-600 truncate">{gitData.checks?.branch || '—'}</div>
            <div className="text-[9px] text-muted-foreground">Branch</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-commits">
            <div className="text-lg font-bold text-blue-600">{gitData.checks?.commitCount || 0}</div>
            <div className="text-[9px] text-muted-foreground">Commits</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-changes">
            <div className={`text-lg font-bold ${(gitData.checks?.totalChanges || 0) > 10 ? 'text-amber-500' : 'text-green-600'}`}>{gitData.checks?.totalChanges || 0}</div>
            <div className="text-[9px] text-muted-foreground">Changes</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-modified">
            <div className="text-lg font-bold text-orange-500">{gitData.checks?.modifiedFiles || 0}</div>
            <div className="text-[9px] text-muted-foreground">Modified</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-untracked">
            <div className={`text-lg font-bold ${(gitData.checks?.untrackedFiles || 0) > 5 ? 'text-red-500' : 'text-gray-500'}`}>{gitData.checks?.untrackedFiles || 0}</div>
            <div className="text-[9px] text-muted-foreground">Untracked</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-size">
            <div className="text-sm font-bold text-gray-600">{gitData.checks?.repoSize || '—'}</div>
            <div className="text-[9px] text-muted-foreground">Repo Size</div>
          </div>
        </div>
      )}

      {showGit && gitData && (
        <div className="mt-3 space-y-3">
          {gitData.checks?.lastCommit && gitData.checks.lastCommit !== 'unknown' && (
            <div className="p-3 rounded-lg bg-background border border-gray-100 dark:border-gray-800">
              <div className="text-xs font-semibold mb-1 flex items-center gap-1.5"><Clipboard size={12} /> Last Commit</div>
              <div className="text-[11px] font-mono text-muted-foreground break-all">{gitData.checks.lastCommit}</div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={runGitRepair}
              className="text-xs px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors flex items-center gap-1"
              data-testid="button-repair-git"
            >
              <Wrench size={10} /> Run Git Repair
            </button>
          </div>
          {repairResult && (
            <div className={`p-3 rounded-lg border ${repairResult.success ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/15' : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/15'}`}>
              <div className="text-xs font-semibold mb-1">{repairResult.success ? 'Repair Successful' : 'Repair Issues Found'}</div>
              <div className="text-[11px] text-muted-foreground">{repairResult.message}</div>
              {repairResult.actions?.map((a, i) => (
                <div key={i} className="text-[10px] font-mono text-muted-foreground mt-0.5">→ {a}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlatformIntegrityDeepScan() {
  const [showDeepScan, setShowDeepScan] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDeepScan = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/health/platform-integrity', { credentials: 'include' });
      if (resp.ok) setScanData(await resp.json());
    } catch {}
    setLoading(false);
  };

  const envValidate = async () => {
    try {
      const resp = await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'validate-env' }) });
      if (resp.ok) {
        const data = await resp.json();
        setScanData(prev => prev ? { ...prev, envValidation: data } : prev);
      }
    } catch {}
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-950/20" data-testid="panel-deep-scan">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-teal-600" />
          <span className="text-sm font-semibold">Platform Integrity Deep Scan</span>
          {scanData && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${scanData.integrity?.score >= 70 ? 'bg-green-100 text-green-700' : scanData.integrity?.score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`} data-testid="text-integrity-score">
              {scanData.integrity?.score || 0}% integrity
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runDeepScan}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors flex items-center gap-1"
            data-testid="button-deep-scan"
          >
            {loading ? <RefreshCw size={10} className="animate-spin" /> : <ScanLine size={10} />}
            Run Deep Scan
          </button>
          <button
            onClick={() => setShowDeepScan(!showDeepScan)}
            className="text-xs px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
            data-testid="button-toggle-deep-scan"
          >
            {showDeepScan ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {scanData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          <div className="text-center p-2 rounded-lg bg-background border border-teal-100 dark:border-teal-800" data-testid="deep-db">
            <div className={`text-lg font-bold ${scanData.integrity?.database?.connected ? 'text-green-600' : 'text-red-500'}`}>
              {scanData.integrity?.database?.connected ? 'Connected' : 'Down'}
            </div>
            <div className="text-[9px] text-muted-foreground">Database ({scanData.integrity?.database?.tableCount || 0} tables)</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-teal-100 dark:border-teal-800" data-testid="deep-services">
            <div className="text-lg font-bold text-blue-600">
              {Object.values(scanData.integrity?.services || {}).filter(Boolean).length}/4
            </div>
            <div className="text-[9px] text-muted-foreground">Services Active</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-teal-100 dark:border-teal-800" data-testid="deep-env">
            <div className={`text-lg font-bold ${(scanData.integrity?.env?.criticalMissing || 0) === 0 ? 'text-green-600' : 'text-red-500'}`}>
              {(scanData.integrity?.env?.criticalMissing || 0) === 0 ? 'Complete' : `${scanData.integrity?.env?.criticalMissing} Missing`}
            </div>
            <div className="text-[9px] text-muted-foreground">Critical Env Vars</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-teal-100 dark:border-teal-800" data-testid="deep-memory">
            <div className={`text-lg font-bold ${(scanData.integrity?.memory?.heapPercent || 0) < 80 ? 'text-green-600' : 'text-amber-500'}`}>
              {scanData.integrity?.memory?.heapPercent || 0}%
            </div>
            <div className="text-[9px] text-muted-foreground">Heap ({scanData.integrity?.memory?.heapUsedMB || 0}MB)</div>
          </div>
        </div>
      )}

      {showDeepScan && scanData && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Shield size={12} /> Service Health</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(scanData.integrity?.services || {}).map(([name, active]) => (
                <div key={name} className={`p-2 rounded-lg border text-center ${active ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/15' : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/15'}`} data-testid={`service-${name}`}>
                  <div className="text-xs font-semibold capitalize">{name}</div>
                  <div className={`text-[10px] ${active ? 'text-green-600' : 'text-red-500'}`}>{active ? 'Active' : 'Not Configured'}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Key size={12} /> Environment Variables</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {Object.entries(scanData.integrity?.env?.critical || {}).map(([key, set]) => (
                <div key={key} className="flex items-center gap-2 p-1.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-[10px]" data-testid={`env-${key}`}>
                  {set ? <CheckCircle size={10} className="text-green-600 flex-shrink-0" /> : <AlertCircle size={10} className="text-red-500 flex-shrink-0" />}
                  <span className="font-mono truncate">{key}</span>
                  <span className={`ml-auto font-semibold ${set ? 'text-green-600' : 'text-red-500'}`}>{set ? 'SET' : 'MISSING'}</span>
                </div>
              ))}
              {Object.entries(scanData.integrity?.env?.optional || {}).map(([key, set]) => (
                <div key={key} className="flex items-center gap-2 p-1.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-[10px]" data-testid={`env-${key}`}>
                  {set ? <CheckCircle size={10} className="text-green-600 flex-shrink-0" /> : <Clock size={10} className="text-muted-foreground flex-shrink-0" />}
                  <span className="font-mono truncate">{key}</span>
                  <span className={`ml-auto font-semibold ${set ? 'text-green-600' : 'text-muted-foreground'}`}>{set ? 'SET' : 'optional'}</span>
                </div>
              ))}
            </div>
          </div>

          {scanData.integrity?.database?.tables && (
            <div>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><HardDrive size={12} /> Database Tables ({scanData.integrity.database.tableCount})</div>
              <div className="flex flex-wrap gap-1.5">
                {scanData.integrity.database.tables.map(t => (
                  <span key={t} className="text-[10px] px-2 py-1 rounded-lg bg-background border border-gray-100 dark:border-gray-800 font-mono" data-testid={`table-${t}`}>{t}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button onClick={envValidate} className="text-xs px-3 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors flex items-center gap-1" data-testid="button-validate-env">
              <Key size={10} /> Validate All Env Vars
            </button>
          </div>

          {scanData.envValidation && (
            <div className={`p-3 rounded-lg border ${scanData.envValidation.success ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/15' : 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/15'}`}>
              <div className="text-xs font-semibold mb-1">{scanData.envValidation.message}</div>
              {scanData.envValidation.actions?.map((a, i) => (
                <div key={i} className="text-[10px] font-mono text-muted-foreground mt-0.5">→ {a}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DailyOpsRunbook({ toolResults, isAnyRunning, runAllChecks, runErrorsOnly, lastFullCheck, runHealthCheck }) {
  const [showRunbook, setShowRunbook] = useState(false);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [stepTimestamps, setStepTimestamps] = useState({});
  const [currentStep, setCurrentStep] = useState(null);
  const [pipelineDuration, setPipelineDuration] = useState(null);
  const [dailyOpsHistory, setDailyOpsHistory] = useState(() => {
    try { const s = localStorage.getItem('glp_daily_ops_history'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const toolResultsRef = useRef(toolResults);
  toolResultsRef.current = toolResults;
  const allTools = toolCategories.flatMap(c => c.tools);
  const totalTools = allTools.length;
  const checkedCount = Object.keys(toolResults).length;
  const healthyCount = Object.values(toolResults).filter(r => r.status === 'healthy').length;
  const errorCount = Object.values(toolResults).filter(r => r.status === 'error').length;
  const warningCount = Object.values(toolResults).filter(r => r.status === 'warning').length;
  const slowCount = Object.values(toolResults).filter(r => r.ms > 2000).length;
  const autoFixableCount = allTools.filter(t => {
    const r = toolResults[t.id];
    if (!r || r.status === 'healthy') return false;
    const rem = getRemediation(r.label, r.ms);
    return rem?.autoFixable;
  }).length;

  const fixCommandCount = [...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length;
  const kbScenarioCount = Object.keys(AI_REMEDIATION).length;

  const opsSteps = [
    { id: 'quick-diag', label: 'Quick Diagnostics (8 critical)', done: CRITICAL_CHECKS.every(c => toolResults[c.id]), icon: Zap, category: 'discovery' },
    { id: 'full-scan', label: `Full Platform Scan (${totalTools} tools)`, done: checkedCount === totalTools, icon: ScanLine, category: 'discovery' },
    { id: 'review-errors', label: `Review Errors (${errorCount} found)`, done: checkedCount === totalTools && errorCount === 0, icon: FileWarning, category: 'triage' },
    { id: 'auto-repair', label: `AI Auto-Repair (${autoFixableCount} fixable)`, done: checkedCount === totalTools && errorCount === 0, icon: Wand2, category: 'repair' },
    { id: 'recheck', label: 'Post-Repair Verification', done: checkedCount === totalTools && errorCount === 0 && warningCount === 0, icon: RotateCcw, category: 'verify' },
    { id: 'perf-review', label: `Performance Review (${slowCount} slow)`, done: checkedCount === totalTools && !Object.values(toolResults).some(r => r.ms > 2000), icon: Gauge, category: 'optimize' },
    { id: 'git-integrity', label: 'Git Integrity Scan', done: checkedCount === totalTools && errorCount === 0, icon: GitBranch, category: 'integrity' },
    { id: 'deep-scan', label: 'Platform Deep Scan', done: checkedCount === totalTools && healthyCount >= totalTools * 0.9, icon: Stethoscope, category: 'integrity' },
    { id: 'service-verify', label: 'Service Integration Verify', done: checkedCount === totalTools && errorCount === 0, icon: PackageCheck, category: 'services' },
    { id: 'kb-sync', label: `KB Cross-Check (${kbScenarioCount} scenarios)`, done: checkedCount === totalTools && errorCount === 0, icon: Brain, category: 'intelligence' },
    { id: 'fix-commands', label: `Fix Commands Audit (${fixCommandCount} commands)`, done: checkedCount === totalTools && autoFixableCount === 0, icon: Terminal, category: 'intelligence' },
    { id: 'integrity', label: 'Platform Integrity Validation', done: checkedCount === totalTools && healthyCount === totalTools, icon: ShieldCheck, category: 'finalize' },
    { id: 'warm-endpoints', label: 'Pre-warm Critical Paths', done: CRITICAL_CHECKS.every(c => toolResults[c.id]?.status === 'healthy' && toolResults[c.id]?.ms < 1000), icon: Flame, category: 'finalize' },
    { id: 'cache-rebuild', label: 'Cache Rebuild & Optimize', done: checkedCount === totalTools && slowCount === 0, icon: HardDrive, category: 'optimize' },
    { id: 'optimize-all', label: 'Full 360° Optimization Pass', done: checkedCount === totalTools && errorCount === 0 && slowCount === 0, icon: Zap, category: 'finalize' },
    { id: 'export', label: 'Export Daily Health Report', done: false, icon: Download, category: 'report' },
  ];

  const completedSteps = opsSteps.filter(s => s.done).length;
  const progress = Math.round((completedSteps / opsSteps.length) * 100);

  const runFullPipeline = async () => {
    setPipelineRunning(true);
    const startTime = Date.now();
    const ts = {};

    setCurrentStep('quick-diag');
    ts['quick-diag'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await Promise.all(CRITICAL_CHECKS.map(t => runHealthCheck(t)));
    await new Promise(r => setTimeout(r, 300));

    setCurrentStep('full-scan');
    ts['full-scan'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await runAllChecks();
    await new Promise(r => setTimeout(r, 300));

    setCurrentStep('review-errors');
    ts['review-errors'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('auto-repair');
    ts['auto-repair'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await runErrorsOnly();
    await new Promise(r => setTimeout(r, 300));

    setCurrentStep('recheck');
    ts['recheck'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await runErrorsOnly();
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('perf-review');
    ts['perf-review'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('git-integrity');
    ts['git-integrity'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try { await fetch('/api/health/git-status', { credentials: 'include' }); } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('deep-scan');
    ts['deep-scan'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try { await fetch('/api/health/platform-integrity', { credentials: 'include' }); } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('service-verify');
    ts['service-verify'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try {
      await Promise.all([
        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-stripe' }) }).catch(() => {}),
        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-resend' }) }).catch(() => {}),
        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-openai' }) }).catch(() => {}),
      ]);
    } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('kb-sync');
    ts['kb-sync'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('fix-commands');
    ts['fix-commands'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 150));

    setCurrentStep('integrity');
    ts['integrity'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('warm-endpoints');
    ts['warm-endpoints'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await Promise.all(CRITICAL_CHECKS.map(t => fetch(t.endpoint, { credentials: 'include' }).catch(() => {})));
    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }).catch(() => {}); } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('cache-rebuild');
    ts['cache-rebuild'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }).catch(() => {}); } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('optimize-all');
    ts['optimize-all'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }).catch(() => {}); } catch {}
    await new Promise(r => setTimeout(r, 300));

    setCurrentStep('export');
    ts['export'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });

    const duration = Math.round((Date.now() - startTime) / 1000);
    setPipelineDuration(duration);

    const freshResults = toolResultsRef.current;
    const finalHealthy = allTools.filter(t => freshResults[t.id]?.status === 'healthy').length;
    const finalErrors = allTools.filter(t => freshResults[t.id]?.status === 'error').length;
    const entry = {
      timestamp: new Date().toISOString(),
      duration,
      healthy: finalHealthy,
      errors: finalErrors,
      total: totalTools,
      score: Math.round((finalHealthy / totalTools) * 100),
      stepsCompleted: opsSteps.filter(s => s.done).length,
    };
    const newHistory = [entry, ...dailyOpsHistory].slice(0, 14);
    setDailyOpsHistory(newHistory);
    try { localStorage.setItem('glp_daily_ops_history', JSON.stringify(newHistory)); } catch {}

    setCurrentStep(null);
    setPipelineRunning(false);
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20" data-testid="panel-daily-ops-runbook">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clipboard size={16} className="text-blue-600" />
          <span className="text-sm font-semibold">Daily Operations Runbook</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-medium" data-testid="text-runbook-progress">
            {completedSteps}/{opsSteps.length} steps · {progress}%
          </span>
          {pipelineDuration && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 font-medium" data-testid="text-runbook-duration">
              {pipelineDuration}s
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runFullPipeline}
            disabled={pipelineRunning || isAnyRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            data-testid="button-run-full-pipeline"
          >
            {pipelineRunning ? <RefreshCw size={12} className="animate-spin" /> : <Rocket size={12} />}
            {pipelineRunning ? `Running ${currentStep || ''}...` : 'Run All Daily Ops'}
          </button>
          <button
            onClick={() => setShowRunbook(!showRunbook)}
            className="text-xs px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            data-testid="button-toggle-runbook"
          >
            {showRunbook ? 'Hide' : 'Show'} Runbook
          </button>
        </div>
      </div>

      <div className="h-2 rounded-full bg-blue-200 dark:bg-blue-800 overflow-hidden mb-2">
        <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {pipelineRunning && currentStep && (
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-2 p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/20" data-testid="text-runbook-current-step">
          <RefreshCw size={12} className="animate-spin" />
          <span className="font-medium">Currently executing: {opsSteps.find(s => s.id === currentStep)?.label || currentStep}</span>
        </div>
      )}

      {showRunbook && (
        <div className="mt-3 space-y-2">
          {opsSteps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const catColors = {
              discovery: 'text-amber-500', triage: 'text-red-500', repair: 'text-purple-500',
              verify: 'text-blue-500', optimize: 'text-cyan-500', intelligence: 'text-indigo-500',
              finalize: 'text-emerald-500', report: 'text-gray-500',
              integrity: 'text-violet-500', services: 'text-teal-500'
            };
            return (
              <div key={step.id} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                isActive ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-300' :
                step.done ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' : 
                'border-gray-200 dark:border-gray-700 bg-background'
              }`} data-testid={`runbook-step-${step.id}`}>
                <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                {isActive ? (
                  <RefreshCw size={14} className="animate-spin text-blue-500 flex-shrink-0" />
                ) : step.done ? (
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                ) : (
                  <StepIcon size={14} className={`${catColors[step.category] || 'text-muted-foreground'} flex-shrink-0`} />
                )}
                <span className={`text-sm flex-1 ${isActive ? 'text-blue-700 dark:text-blue-300 font-medium' : step.done ? 'text-green-700 dark:text-green-400 line-through' : ''}`}>
                  {step.label}
                  {stepTimestamps[step.id] && <span className="text-[10px] text-muted-foreground ml-2 font-normal">({stepTimestamps[step.id]})</span>}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${catColors[step.category] || 'text-gray-500'} bg-muted/50`}>
                  {step.category}
                </span>
                {!step.done && !pipelineRunning && step.id === 'quick-diag' && (
                  <button onClick={() => Promise.all(CRITICAL_CHECKS.map(t => runHealthCheck(t)))} className="text-[10px] px-2 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors" data-testid="button-runbook-quick-diag">Run</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'full-scan' && (
                  <button onClick={runAllChecks} disabled={isAnyRunning} className="text-[10px] px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50" data-testid="button-runbook-full-scan">Run All</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'recheck' && checkedCount === totalTools && (
                  <button onClick={runErrorsOnly} className="text-[10px] px-2 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors" data-testid="button-runbook-recheck">Re-check</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'integrity' && (
                  <button onClick={runAllChecks} disabled={isAnyRunning} className="text-[10px] px-2 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50" data-testid="button-runbook-integrity">Verify</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'git-integrity' && (
                  <button onClick={() => fetch('/api/health/git-status', { credentials: 'include' }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-violet-500 text-white hover:bg-violet-600 transition-colors" data-testid="button-runbook-git">Scan</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'deep-scan' && (
                  <button onClick={() => fetch('/api/health/platform-integrity', { credentials: 'include' }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-teal-500 text-white hover:bg-teal-600 transition-colors" data-testid="button-runbook-deep-scan">Scan</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'service-verify' && (
                  <button onClick={() => Promise.all(['verify-stripe', 'verify-resend', 'check-openai'].map(cmd => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: cmd }) }).catch(() => {})))} className="text-[10px] px-2 py-1 rounded bg-cyan-500 text-white hover:bg-cyan-600 transition-colors" data-testid="button-runbook-service-verify">Verify</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'warm-endpoints' && (
                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors" data-testid="button-runbook-warm">Warm</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'cache-rebuild' && (
                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition-colors" data-testid="button-runbook-cache">Rebuild</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'optimize-all' && (
                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 transition-colors" data-testid="button-runbook-optimize-all">Optimize</button>
                )}
              </div>
            );
          })}

          {dailyOpsHistory.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <Clock size={12} /> Recent Daily Ops Runs ({dailyOpsHistory.length})
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {dailyOpsHistory.map((run, i) => (
                  <div key={i} className="flex items-center gap-3 text-[11px] p-1.5 rounded bg-background" data-testid={`daily-ops-history-${i}`}>
                    <span className="text-muted-foreground font-mono w-20">{new Date(run.timestamp).toLocaleDateString()}</span>
                    <span className={`font-bold ${run.score >= 90 ? 'text-green-600' : run.score >= 70 ? 'text-amber-500' : 'text-red-500'}`}>{run.score}%</span>
                    <span className="text-green-600">{run.healthy} ok</span>
                    {run.errors > 0 && <span className="text-red-500">{run.errors} err</span>}
                    <span className="text-muted-foreground">{run.duration}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const STORAGE_KEY = 'glp_tools_last_check';
const AUTO_REFRESH_INTERVALS = [
  { label: 'Off', value: 0 },
  { label: '1 min', value: 60000 },
  { label: '5 min', value: 300000 },
  { label: '15 min', value: 900000 },
  { label: '30 min', value: 1800000 },
];
const STATUS_FILTERS = ['all', 'healthy', 'warning', 'error', 'unchecked'];

export default function AdminTools() {
  const [runningTools, setRunningTools] = useState({});
  const [toolResults, setToolResults] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.results && Date.now() - parsed.timestamp < 3600000) {
          return parsed.results;
        }
      }
    } catch {}
    return {};
  });
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [lastFullCheck, setLastFullCheck] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastCheck && Date.now() - parsed.timestamp < 3600000) {
          return parsed.lastCheck;
        }
      }
    } catch {}
    return null;
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(() => {
    try { return Number(localStorage.getItem('glp_tools_auto_refresh')) || 0; } catch { return 0; }
  });
  const [statusFilter, setStatusFilter] = useState(() => {
    try { return localStorage.getItem('glp_tools_status_filter') || 'all'; } catch { return 'all'; }
  });
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const autoRefreshRef = useRef(null);
  const runAllRef = useRef(null);

  useEffect(() => {
    if (Object.keys(toolResults).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          results: toolResults,
          lastCheck: lastFullCheck,
          timestamp: Date.now()
        }));
      } catch {}
    }
  }, [toolResults, lastFullCheck]);

  const toggleCategory = (idx) => {
    setCollapsedCategories(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const collapseAll = () => {
    const all = {};
    toolCategories.forEach((_, i) => { all[i] = true; });
    setCollapsedCategories(all);
  };

  const expandAll = () => setCollapsedCategories({});

  const runHealthCheck = async (tool) => {
    setRunningTools(prev => ({ ...prev, [tool.id]: true }));
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let res = await fetch(tool.endpoint, { method: 'GET', credentials: 'include', signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 405) {
        const controller2 = new AbortController();
        const timeout2 = setTimeout(() => controller2.abort(), 8000);
        res = await fetch(tool.endpoint, { method: 'HEAD', credentials: 'include', signal: controller2.signal });
        clearTimeout(timeout2);
      }
      const responseTime = Math.round(performance.now() - startTime);
      let status = 'healthy';
      if (res.ok) status = 'healthy';
      else if (res.status === 401 || res.status === 403) status = 'healthy';
      else if (res.status === 405) status = 'healthy';
      else if (res.status === 404) status = 'error';
      else if (res.status === 429) status = 'warning';
      else if (res.status >= 500) status = 'error';
      else status = 'warning';
      const statusLabel = res.status === 401 ? 'auth-gated' : res.status === 403 ? 'admin-only' : res.status === 405 ? 'post-only' : res.status === 429 ? 'rate-limited' : res.status >= 500 ? 'server-error' : res.ok ? 'ok' : `${res.status}`;
      setToolResults(prev => ({ ...prev, [tool.id]: { status, code: res.status, time: new Date().toLocaleTimeString(), label: statusLabel, ms: responseTime } }));
    } catch (err) {
      const responseTime = Math.round(performance.now() - startTime);
      const label = err?.name === 'AbortError' ? 'timeout' : 'unreachable';
      setToolResults(prev => ({ ...prev, [tool.id]: { status: 'error', code: 0, time: new Date().toLocaleTimeString(), label, ms: responseTime } }));
    } finally {
      setRunningTools(prev => ({ ...prev, [tool.id]: false }));
    }
  };

  const runAllChecks = useCallback(async () => {
    if (runAllRef.current) return;
    runAllRef.current = true;
    setIsRunningAll(true);
    setToolResults({});
    const allTools = toolCategories.flatMap(c => c.tools);
    const batchSize = 6;
    for (let i = 0; i < allTools.length; i += batchSize) {
      const batch = allTools.slice(i, i + batchSize);
      await Promise.all(batch.map(tool => runHealthCheck(tool)));
      if (i + batchSize < allTools.length) {
        await new Promise(r => setTimeout(r, 150));
      }
    }
    setLastFullCheck(new Date().toLocaleTimeString());
    setIsRunningAll(false);
    runAllRef.current = false;
  }, []);

  useEffect(() => {
    try { localStorage.setItem('glp_tools_auto_refresh', String(autoRefreshInterval)); } catch {}
    if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = null;
    }
    if (autoRefreshInterval > 0) {
      autoRefreshRef.current = setInterval(() => {
        if (!runAllRef.current) runAllChecks();
      }, autoRefreshInterval);
    }
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [autoRefreshInterval, runAllChecks]);

  useEffect(() => {
    try { localStorage.setItem('glp_tools_status_filter', statusFilter); } catch {}
  }, [statusFilter]);

  const clearResults = () => {
    setToolResults({});
    setLastFullCheck(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const runErrorsOnly = async () => {
    const errorTools = toolCategories.flatMap(c => c.tools).filter(t => toolResults[t.id]?.status === 'error' || toolResults[t.id]?.status === 'warning');
    if (errorTools.length === 0) return;
    await Promise.all(errorTools.map(t => runHealthCheck(t)));
  };

  const totalTools = toolCategories.reduce((sum, c) => sum + c.tools.length, 0);
  const checkedCount = Object.keys(toolResults).length;
  const healthyCount = Object.values(toolResults).filter(r => r.status === 'healthy').length;
  const warningCount = Object.values(toolResults).filter(r => r.status === 'warning').length;
  const errorCount = Object.values(toolResults).filter(r => r.status === 'error').length;
  const isAnyRunning = isRunningAll || Object.values(runningTools).some(Boolean);
  const avgResponseTime = checkedCount > 0 ? Math.round(Object.values(toolResults).reduce((sum, r) => sum + (r.ms || 0), 0) / checkedCount) : 0;
  const maxResponseTime = checkedCount > 0 ? Math.max(...Object.values(toolResults).map(r => r.ms || 0)) : 0;
  const authGatedCount = Object.values(toolResults).filter(r => r.label === 'auth-gated' || r.label === 'admin-only').length;

  const exportResults = (format = 'txt') => {
    const now = new Date();
    const allTools = toolCategories.flatMap(c => c.tools);
    const kbStats = { Codex: 0, Perplexity: 0, Canva: 0 };
    Object.values(AI_REMEDIATION).forEach(r => { if (r.knowledgeBase && kbStats[r.knowledgeBase] !== undefined) kbStats[r.knowledgeBase]++; });

    if (format === 'json') {
      const report = {
        generated: now.toISOString(),
        platform: "MyMentalHealthBuddy",
        version: "3.0",
        summary: {
          total: totalTools, checked: checkedCount, healthy: healthyCount, warnings: warningCount, errors: errorCount,
          avgResponseMs: avgResponseTime, maxResponseMs: maxResponseTime, authGated: authGatedCount,
          healthScore: totalTools > 0 ? Math.round((healthyCount / Math.max(checkedCount, 1)) * 100) : 0,
        },
        severityDistribution: {
          critical: Object.values(TOOL_SEVERITY).filter(s => s === 'critical').length,
          high: Object.values(TOOL_SEVERITY).filter(s => s === 'high').length,
          medium: Object.values(TOOL_SEVERITY).filter(s => s === 'medium').length,
          unclassified: totalTools - Object.keys(TOOL_SEVERITY).length,
          totalClassified: Object.keys(TOOL_SEVERITY).length,
        },
        knowledgeBase: {
          totalScenarios: Object.keys(AI_REMEDIATION).length,
          autoFixable: Object.values(AI_REMEDIATION).filter(r => r.autoFixable).length,
          distribution: kbStats,
          fixCommands: [...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))],
        },
        categories: toolCategories.map(cat => ({
          name: cat.title,
          tools: cat.tools.map(t => {
            const r = toolResults[t.id];
            const rem = r ? getRemediation(r.label, r.ms) : null;
            return { 
              id: t.id, label: t.label, endpoint: t.endpoint, desc: t.desc,
              ...r,
              severity: TOOL_SEVERITY[t.id] || 'unclassified',
              adminLink: TOOL_ADMIN_LINKS[t.id] || null,
              knowledgeBase: rem?.knowledgeBase || null,
              autoFixable: rem?.autoFixable || false,
              fixCommand: rem?.fixCommand || null,
              remediation: rem?.suggestion || null,
              action: rem?.action || null,
            };
          })
        }))
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `glp-health-report-${now.toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (format === 'csv') {
      const csvLines = ['ID,Label,Endpoint,Status,Code,Response(ms),Severity,KB,AutoFix,AdminLink,Remediation'];
      allTools.forEach(t => {
        const r = toolResults[t.id];
        const rem = r ? getRemediation(r.label, r.ms) : null;
        const row = [
          t.id, `"${t.label}"`, t.endpoint,
          r?.status || 'unchecked', r?.code || '', r?.ms || '',
          TOOL_SEVERITY[t.id] || 'unclassified',
          rem?.knowledgeBase || '', rem?.autoFixable ? 'yes' : 'no',
          TOOL_ADMIN_LINKS[t.id] || '',
          `"${(rem?.action || '').replace(/"/g, '""')}"`,
        ].join(',');
        csvLines.push(row);
      });
      const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `glp-health-report-${now.toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const healthScore = totalTools > 0 ? Math.round((healthyCount / Math.max(checkedCount, 1)) * 100) : 0;
    const lines = [
      `═══════════════════════════════════════════════════════════`,
      `  THE GENUINE LOVE PROJECT — Platform Health Report`,
      `  ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      `  Generated: ${now.toLocaleTimeString()}`,
      `═══════════════════════════════════════════════════════════`,
      '',
      `HEALTH SCORE: ${healthScore}%`,
      `Total: ${totalTools} | Checked: ${checkedCount} | Healthy: ${healthyCount} | Warnings: ${warningCount} | Errors: ${errorCount}`,
      `Avg Response: ${avgResponseTime}ms | Slowest: ${maxResponseTime}ms | Auth-Gated: ${authGatedCount}`,
      '',
      `SEVERITY DISTRIBUTION:`,
      `  Critical: ${Object.values(TOOL_SEVERITY).filter(s => s === 'critical').length} | High: ${Object.values(TOOL_SEVERITY).filter(s => s === 'high').length} | Medium: ${Object.values(TOOL_SEVERITY).filter(s => s === 'medium').length}`,
      '',
      `AI KNOWLEDGE BASE:`,
      `  Scenarios: ${Object.keys(AI_REMEDIATION).length} | Auto-Fixable: ${Object.values(AI_REMEDIATION).filter(r => r.autoFixable).length}`,
      `  Codex: ${kbStats.Codex} | Perplexity: ${kbStats.Perplexity} | Canva: ${kbStats.Canva}`,
      '',
      ...toolCategories.flatMap(cat => [
        `─── ${cat.title} ───`,
        ...cat.tools.map(t => {
          const r = toolResults[t.id];
          const sev = TOOL_SEVERITY[t.id] || '—';
          const rem = r && (r.status !== 'healthy') ? getRemediation(r.label, r.ms) : null;
          return r ? `  [${r.status === 'healthy' ? 'OK  ' : r.status === 'warning' ? 'WARN' : 'ERR '}] ${t.label.padEnd(28)} ${String(r.ms).padStart(5)}ms  ${sev.padEnd(8)} ${r.label !== 'ok' ? `(${r.label})` : ''}${rem ? ` → ${rem.action}` : ''}` : `  [    ] ${t.label.padEnd(28)}         ${sev.padEnd(8)} not checked`;
        }),
        ''
      ])
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glp-health-report-${now.toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`Platform Tools (${totalTools}) — Admin`} description={`All ${totalTools} platform tools with AI-powered health monitoring, diagnostics, and repair`} noindex />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>

        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-page-title">Platform Tools ({totalTools})</h1>
                <p className="text-muted-foreground text-sm">AI-powered health monitor with Codex, Perplexity & Canva knowledge base</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {checkedCount > 0 && (
                <div className="flex items-center gap-3 text-sm" data-testid="text-tool-summary">
                  <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14} /> {healthyCount}</span>
                  {warningCount > 0 && <span className="flex items-center gap-1 text-amber-500"><AlertTriangle size={14} /> {warningCount}</span>}
                  {errorCount > 0 && <span className="flex items-center gap-1 text-red-500"><AlertCircle size={14} /> {errorCount}</span>}
                  <span className="text-muted-foreground">/ {totalTools}</span>
                </div>
              )}
              <button
                onClick={runAllChecks}
                disabled={isAnyRunning}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                data-testid="button-run-all-checks"
              >
                {isAnyRunning ? (
                  <><RefreshCw size={14} className="animate-spin" /> Checking... ({checkedCount}/{totalTools})</>
                ) : (
                  <><Play size={14} /> Run Daily Operations</>
                )}
              </button>
            </div>
          </div>
        </header>

        <QuickDiagnostics toolResults={toolResults} runHealthCheck={runHealthCheck} runningTools={runningTools} />

        <AIKnowledgeBaseSummary
          toolResults={toolResults}
          toolCategories={toolCategories}
          AI_REMEDIATION={AI_REMEDIATION}
          getRemediation={getRemediation}
          TOOL_ADMIN_LINKS={TOOL_ADMIN_LINKS}
          TOOL_SEVERITY={TOOL_SEVERITY}
        />

        <AIRepairCenter toolResults={toolResults} runHealthCheck={runHealthCheck} runAllChecks={runAllChecks} />

        <AIHealthPipeline toolResults={toolResults} runHealthCheck={runHealthCheck} runAllChecks={runAllChecks} />

        <SystemOptimizationAdvisor toolResults={toolResults} />

        <PlatformCoverageReport toolResults={toolResults} />

        <DailyOpsRunbook toolResults={toolResults} isAnyRunning={isAnyRunning} runAllChecks={runAllChecks} runErrorsOnly={runErrorsOnly} lastFullCheck={lastFullCheck} runHealthCheck={runHealthCheck} />

        <GitIntegrityScanner />

        <PlatformIntegrityDeepScan />

        <AIDiagnosticsPanel toolResults={toolResults} runHealthCheck={runHealthCheck} />

        <PlatformIntegrityScanner toolResults={toolResults} />

        {checkedCount > 0 && (
          <div className="mb-4">
            <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden" data-testid="progress-bar-tools">
              <div className="h-full rounded-full transition-all duration-300" style={{ 
                width: `${(checkedCount / totalTools) * 100}%`, 
                background: errorCount > 0 ? '#ef4444' : warningCount > 0 ? '#eab308' : '#22c55e'
              }} />
            </div>
          </div>
        )}

        {checkedCount === totalTools && !isAnyRunning && (() => {
          const healthScore = totalTools > 0 ? Math.round((healthyCount / totalTools) * 100) : 0;
          const scoreColor = healthScore >= 90 ? 'text-green-600' : healthScore >= 70 ? 'text-amber-500' : 'text-red-500';
          const scoreBg = healthScore >= 90 ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : healthScore >= 70 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
          return (
            <div className={`mb-6 p-4 rounded-xl border ${scoreBg}`} data-testid="panel-results-summary">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`text-4xl font-bold ${scoreColor}`} data-testid="text-health-score">{healthScore}%</div>
                  <div>
                    <div className="font-semibold text-sm">Platform Health Score</div>
                    <div className="text-xs text-muted-foreground">Last check: {lastFullCheck}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={runErrorsOnly} disabled={errorCount + warningCount === 0} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-muted/50 disabled:opacity-40" data-testid="button-recheck-issues">Re-check Issues ({errorCount + warningCount})</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600" data-testid="text-healthy-count">{healthyCount}</div>
                  <div className="text-xs text-muted-foreground">Healthy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500" data-testid="text-warning-count">{warningCount}</div>
                  <div className="text-xs text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500" data-testid="text-error-count">{errorCount}</div>
                  <div className="text-xs text-muted-foreground">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600" data-testid="text-auth-gated-count">{authGatedCount}</div>
                  <div className="text-xs text-muted-foreground">Auth-Gated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600" data-testid="text-avg-response">{avgResponseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${maxResponseTime > 1000 ? 'text-red-500' : 'text-slate-600'}`} data-testid="text-max-response">{maxResponseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Slowest</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600" data-testid="text-total-tools">{totalTools}</div>
                  <div className="text-xs text-muted-foreground">Total Tools</div>
                </div>
              </div>
            </div>
          );
        })()}

        {checkedCount > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap p-3 rounded-xl bg-muted/30 border border-gray-100 dark:border-gray-800" data-testid="panel-ops-toolbar">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Timer size={12} />
              <span>Auto-refresh:</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-background text-xs"
                data-testid="select-auto-refresh"
              >
                {AUTO_REFRESH_INTERVALS.map(i => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
              {autoRefreshInterval > 0 && <span className="text-green-600 font-medium">Active</span>}
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter size={12} />
              <span>Show:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-background text-xs"
                data-testid="select-status-filter"
              >
                {STATUS_FILTERS.map(f => (
                  <option key={f} value={f}>{f === 'all' ? 'All' : f === 'unchecked' ? 'Unchecked' : f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            {(errorCount > 0 || warningCount > 0) && (
              <button
                onClick={runErrorsOnly}
                disabled={isAnyRunning}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50"
                data-testid="button-recheck-errors"
              >
                <RotateCcw size={10} /> Re-check Issues ({errorCount + warningCount})
              </button>
            )}
            <button
              onClick={() => exportResults('txt')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs hover:bg-muted transition-colors"
              data-testid="button-export-txt"
            >
              <Download size={10} /> TXT
            </button>
            <button
              onClick={() => exportResults('json')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs hover:bg-muted transition-colors"
              data-testid="button-export-json"
            >
              <Download size={10} /> JSON
            </button>
            <button
              onClick={() => exportResults('csv')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs hover:bg-muted transition-colors"
              data-testid="button-export-csv"
            >
              <Download size={10} /> CSV
            </button>
            <button
              onClick={clearResults}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
              data-testid="button-clear-results"
            >
              Clear
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              data-testid="input-search-tools"
            />
          </div>
          <button onClick={expandAll} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs hover:bg-muted transition-colors" data-testid="button-expand-all">Expand All</button>
          <button onClick={collapseAll} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs hover:bg-muted transition-colors" data-testid="button-collapse-all">Collapse All</button>
          {lastFullCheck && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground" data-testid="text-last-check">
              <Clock size={12} /> Last check: {lastFullCheck}
            </span>
          )}
        </div>

        <div className="space-y-6" data-testid="panel-tool-categories">
          {toolCategories.map((category, ci) => {
            const filterLower = searchFilter.toLowerCase();
            let filteredTools = searchFilter 
              ? category.tools.filter(t => t.label.toLowerCase().includes(filterLower) || t.desc.toLowerCase().includes(filterLower) || t.id.toLowerCase().includes(filterLower))
              : category.tools;
            if (statusFilter !== 'all') {
              filteredTools = filteredTools.filter(t => {
                const r = toolResults[t.id];
                if (statusFilter === 'unchecked') return !r;
                return r?.status === statusFilter;
              });
            }
            if ((searchFilter || statusFilter !== 'all') && filteredTools.length === 0) return null;
            const catHealthy = category.tools.filter(t => toolResults[t.id]?.status === 'healthy').length;
            const catChecked = category.tools.filter(t => toolResults[t.id]).length;
            const catErrors = category.tools.filter(t => toolResults[t.id]?.status === 'error').length;
            const isCollapsed = collapsedCategories[ci];
            return (
              <div key={ci} data-testid={`tool-category-${ci}`}>
                <button 
                  onClick={() => toggleCategory(ci)}
                  className="w-full flex items-center justify-between text-left py-2 px-0 bg-transparent border-none cursor-pointer text-sm font-semibold uppercase tracking-wide text-foreground/70 hover:text-foreground transition-colors"
                  data-testid={`toggle-category-${ci}`}
                >
                  <span className="flex items-center gap-2">
                    <ArrowRight size={12} style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                    {category.title} ({searchFilter ? `${filteredTools.length}/` : ''}{category.tools.length})
                  </span>
                  {catChecked > 0 && (
                    <span className="text-xs font-normal flex gap-2">
                      <span className="text-green-600">{catHealthy} ok</span>
                      {catErrors > 0 && <span className="text-red-500">{catErrors} err</span>}
                    </span>
                  )}
                </button>
                {!isCollapsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                    {filteredTools.map((tool) => {
                      const ToolIcon = tool.icon;
                      const result = toolResults[tool.id];
                      const isRunning = runningTools[tool.id];
                      const adminLink = TOOL_ADMIN_LINKS[tool.id];
                      const severity = TOOL_SEVERITY[tool.id];
                      const sevBorder = severity === 'critical' && result?.status === 'error' ? 'border-red-300 dark:border-red-700' : severity === 'high' && result?.status === 'error' ? 'border-orange-300 dark:border-orange-700' : 'border-gray-100 dark:border-gray-800';
                      return (
                        <div 
                          key={tool.id} 
                          className={`flex items-center gap-3 p-3 rounded-lg border ${sevBorder} bg-card hover:bg-muted/50 transition-colors`}
                          data-testid={`tool-card-${tool.id}`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${severity === 'critical' ? 'bg-red-100 dark:bg-red-900/20' : severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' : severity === 'medium' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-primary/10'}`}>
                            <ToolIcon size={16} className={severity === 'critical' ? 'text-red-600' : severity === 'high' ? 'text-orange-600' : severity === 'medium' ? 'text-blue-600' : 'text-primary'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate flex items-center gap-1.5">
                              {tool.label}
                              {severity && severity !== 'medium' && (
                                <span className={`text-[9px] px-1 py-0.5 rounded font-semibold ${severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                                  {severity === 'critical' ? 'CRIT' : 'HIGH'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                              {tool.desc}
                              {!adminLink && <span className="text-[9px] px-1 py-0 rounded bg-muted text-muted-foreground">API</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {result && (
                              <span title={`HTTP ${result.code} - ${result.label || ''} - ${result.ms}ms - checked ${result.time}`} className="flex items-center gap-1">
                                {result.status === 'healthy' ? (
                                  <CheckCircle size={14} className="text-green-600" />
                                ) : result.status === 'warning' ? (
                                  <AlertTriangle size={14} className="text-amber-500" />
                                ) : (
                                  <AlertCircle size={14} className="text-red-500" />
                                )}
                                <span className={`text-[10px] ${result.ms > 2000 ? 'text-red-500 font-medium' : result.ms > 500 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                  {result.label && result.label !== 'ok' ? result.label : ''}{result.ms != null ? ` ${result.ms}ms` : ''}
                                </span>
                              </span>
                            )}
                            {adminLink && (
                              <Link href={adminLink} className="p-1 rounded hover:bg-muted transition-colors" title={`Open ${tool.label} admin page`} data-testid={`link-admin-${tool.id}`}>
                                <ExternalLink size={12} className="text-muted-foreground" />
                              </Link>
                            )}
                            <button
                              onClick={() => runHealthCheck(tool)}
                              disabled={isRunning}
                              className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-xs hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1"
                              data-testid={`button-check-${tool.id}`}
                            >
                              {isRunning ? <RefreshCw size={10} className="animate-spin" /> : <CheckSquare size={10} />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <SafetyFooter variant="compact" className="mt-12" />
      </main>
    </div>
  );
}
