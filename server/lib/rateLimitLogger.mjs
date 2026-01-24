const rateLimitLogs = [];
const MAX_LOGS = 1000;

export function logRateLimitEvent(log) {
  rateLimitLogs.unshift(log);
  
  if (rateLimitLogs.length > MAX_LOGS) {
    rateLimitLogs.length = MAX_LOGS;
  }
}

export function getRateLimitLogs(options = {}) {
  let logs = [...rateLimitLogs];
  
  if (options.blockedOnly) {
    logs = logs.filter(log => log.blocked);
  }
  
  if (options.ip) {
    logs = logs.filter(log => log.ip === options.ip);
  }
  
  if (options.path) {
    logs = logs.filter(log => log.path.includes(options.path));
  }
  
  if (options.since) {
    logs = logs.filter(log => log.timestamp >= options.since);
  }
  
  if (options.limit) {
    logs = logs.slice(0, options.limit);
  }
  
  return logs;
}

export function getRateLimitStats() {
  const blocked = rateLimitLogs.filter(log => log.blocked);
  
  const ipCounts = new Map();
  const pathCounts = new Map();
  const hourlyData = new Map();
  
  for (const log of rateLimitLogs) {
    if (log.blocked) {
      ipCounts.set(log.ip, (ipCounts.get(log.ip) || 0) + 1);
      pathCounts.set(log.path, (pathCounts.get(log.path) || 0) + 1);
    }
    
    const hour = new Date(log.timestamp).toISOString().slice(0, 13);
    const existing = hourlyData.get(hour) || { total: 0, blocked: 0 };
    existing.total++;
    if (log.blocked) existing.blocked++;
    hourlyData.set(hour, existing);
  }
  
  const topBlockedIPs = Array.from(ipCounts.entries())
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const topBlockedPaths = Array.from(pathCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const hourlyBreakdown = Array.from(hourlyData.entries())
    .map(([hour, data]) => ({ hour, ...data }))
    .sort((a, b) => b.hour.localeCompare(a.hour))
    .slice(0, 24);
  
  return {
    totalRequests: rateLimitLogs.length,
    blockedRequests: blocked.length,
    blockRate: rateLimitLogs.length > 0 
      ? Math.round((blocked.length / rateLimitLogs.length) * 10000) / 100 
      : 0,
    topBlockedIPs,
    topBlockedPaths,
    hourlyBreakdown,
  };
}

export function createRateLimitMiddleware(limiter) {
  return (req, res, next) => {
    const originalSend = res.send.bind(res);
    
    res.send = function(body) {
      const remaining = parseInt(res.getHeader('X-RateLimit-Remaining')) || 0;
      const limit = parseInt(res.getHeader('X-RateLimit-Limit')) || 0;
      const reset = parseInt(res.getHeader('X-RateLimit-Reset')) || 0;
      
      logRateLimitEvent({
        timestamp: Date.now(),
        ip: req.ip || req.socket.remoteAddress || 'unknown',
        path: req.path,
        method: req.method,
        userId: req.user?.id,
        blocked: res.statusCode === 429,
        remaining,
        limit,
        resetTime: reset,
      });
      
      return originalSend(body);
    };
    
    limiter(req, res, next);
  };
}

export function clearRateLimitLogs() {
  rateLimitLogs.length = 0;
}
