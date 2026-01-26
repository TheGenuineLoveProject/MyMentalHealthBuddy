# Capacity Planning

## Current Baseline

### Resource Usage (as of January 2026)

| Resource | Current | Limit | Utilization |
|----------|---------|-------|-------------|
| Replit Memory | ~512MB | 2GB | 25% |
| Database | ~50MB | 5GB | 1% |
| Build time | ~25s | 120s | 21% |

### Traffic Estimates

| Metric | Current | Growth Rate |
|--------|---------|-------------|
| Daily Active Users | TBD | - |
| API requests/day | TBD | - |
| AI interactions/day | TBD | - |

## Scaling Considerations

### Replit Autoscale

- Automatically scales based on traffic
- No manual intervention needed
- Cost scales with usage

### Database Scaling

| Tier | Connections | Storage | Use Case |
|------|-------------|---------|----------|
| Free | 5 | 5GB | Development |
| Pro | 50 | 50GB | Production |
| Business | 500 | 500GB | Scale |

### AI API Limits

| Provider | Rate Limit | Tokens/day |
|----------|------------|------------|
| OpenAI | 60 RPM | 150K (tier 1) |

## Growth Projections

### Month 1-3
- Expected: < 100 DAU
- Focus: Feature development
- Tier: Free/starter

### Month 3-6
- Expected: 100-1000 DAU
- Focus: Stability
- Tier: Pro

### Month 6-12
- Expected: 1000-10000 DAU
- Focus: Performance
- Tier: Business

## Cost Projections

### Current Monthly Costs

| Service | Cost | Notes |
|---------|------|-------|
| Replit | $25 | Core plan |
| Database | $0 | Included |
| OpenAI | Variable | Per-use |
| Stripe | 2.9% + 30¢ | Per transaction |

### Cost Optimization

1. **AI Costs**: Implement caching for common queries
2. **Database**: Regular cleanup of old data
3. **Bundle Size**: Keep assets optimized

## Monitoring Triggers

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Memory usage | 70% | 90% |
| API latency (p95) | 500ms | 1000ms |
| Error rate | 1% | 5% |
| Database connections | 40% | 80% |

## Action Plans

### If approaching limits:

1. **Memory**: Review code for memory leaks, optimize caching
2. **Database**: Add indexes, optimize queries, archive old data
3. **API limits**: Implement request coalescing, caching
4. **Build time**: Code splitting, lazy loading
