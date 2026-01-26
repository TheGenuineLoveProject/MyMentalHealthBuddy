# Load Testing Guide

## Overview

This document outlines the approach to load testing The Genuine Love Project platform.

## Tools

### Recommended: k6

k6 is a modern load testing tool that works well with Replit.

```bash
# Install locally
brew install k6

# Or use Docker
docker run -i grafana/k6 run - <script.js
```

## Test Scenarios

### 1. Baseline Test

Establish normal performance baseline.

```javascript
// load-tests/baseline.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('https://your-app.replit.dev/healthz');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

### 2. Stress Test

Find breaking points.

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up
    { duration: '5m', target: 50 },   // Hold
    { duration: '2m', target: 100 },  // Push limits
    { duration: '2m', target: 0 },    // Ramp down
  ],
};
```

### 3. Spike Test

Test sudden traffic bursts.

```javascript
export const options = {
  stages: [
    { duration: '10s', target: 100 },  // Sudden spike
    { duration: '1m', target: 100 },   // Hold
    { duration: '10s', target: 0 },    // Drop
  ],
};
```

## Key Endpoints to Test

| Endpoint | Priority | Expected p95 |
|----------|----------|--------------|
| `/healthz` | High | < 100ms |
| `/api/wisdom/daily` | High | < 300ms |
| `/api/journal` (GET) | High | < 300ms |
| `/api/ai/chat` | Medium | < 5s |

## Running Tests

```bash
# Run baseline test
k6 run load-tests/baseline.js

# Run with output to file
k6 run --out json=results.json load-tests/baseline.js

# Run against specific host
k6 run -e HOST=https://your-app.replit.dev load-tests/baseline.js
```

## Interpreting Results

### Key Metrics

| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| http_req_duration (p95) | < 300ms | < 500ms | > 500ms |
| http_req_failed | < 0.1% | < 1% | > 1% |
| iteration_duration | < 1s | < 2s | > 2s |

### Sample Output

```
✓ status is 200
✓ response time < 500ms

http_reqs........................: 3000    100/s
http_req_duration................: avg=45ms min=20ms med=42ms max=200ms p(90)=80ms p(95)=100ms
http_req_failed..................: 0.00%   ✓ 0    ✗ 3000
```

## Best Practices

1. **Don't test production** during peak hours
2. **Start small** and increase gradually
3. **Monitor during tests** using health dashboard
4. **Document baselines** for comparison
5. **Automate** for consistent results
