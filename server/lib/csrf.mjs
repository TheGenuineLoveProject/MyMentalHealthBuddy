import crypto from 'crypto';

const TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour
const ROTATION_INTERVAL = 15 * 60 * 1000; // 15 minutes

const tokenStore = new Map();

export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function getOrCreateCSRFToken(sessionId) {
  const existing = tokenStore.get(sessionId);
  const now = Date.now();
  
  if (existing) {
    if (now - existing.createdAt > TOKEN_LIFETIME) {
      const newToken = generateCSRFToken();
      tokenStore.set(sessionId, {
        token: newToken,
        createdAt: now,
        rotatedAt: now,
      });
      return newToken;
    }
    
    if (now - existing.rotatedAt > ROTATION_INTERVAL) {
      const newToken = generateCSRFToken();
      tokenStore.set(sessionId, {
        token: newToken,
        createdAt: existing.createdAt,
        rotatedAt: now,
      });
      return newToken;
    }
    
    return existing.token;
  }
  
  const newToken = generateCSRFToken();
  tokenStore.set(sessionId, {
    token: newToken,
    createdAt: now,
    rotatedAt: now,
  });
  return newToken;
}

export function validateCSRFToken(sessionId, token) {
  const stored = tokenStore.get(sessionId);
  if (!stored) return false;
  
  const now = Date.now();
  if (now - stored.createdAt > TOKEN_LIFETIME) {
    tokenStore.delete(sessionId);
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(stored.token),
    Buffer.from(token)
  );
}

export function cleanupExpiredTokens() {
  const now = Date.now();
  const entries = Array.from(tokenStore.entries());
  for (const [sessionId, data] of entries) {
    if (now - data.createdAt > TOKEN_LIFETIME) {
      tokenStore.delete(sessionId);
    }
  }
}

setInterval(cleanupExpiredTokens, 5 * 60 * 1000);

export function csrfProtection(req, res, next) {
  const sessionId = req.session?.id || req.ip || 'anonymous';
  
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const token = getOrCreateCSRFToken(sessionId);
    res.locals.csrfToken = token;
    res.setHeader('X-CSRF-Token', token);
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || req.body?._csrf;
  
  if (!token || !validateCSRFToken(sessionId, token)) {
    res.status(403).json({ 
      error: 'Invalid or expired CSRF token',
      code: 'CSRF_VALIDATION_FAILED'
    });
    return;
  }
  
  const newToken = getOrCreateCSRFToken(sessionId);
  res.locals.csrfToken = newToken;
  res.setHeader('X-CSRF-Token', newToken);
  
  next();
}

export function getCSRFStats() {
  let oldest = null;
  let newest = null;
  
  const values = Array.from(tokenStore.values());
  for (const data of values) {
    if (oldest === null || data.createdAt < oldest) {
      oldest = data.createdAt;
    }
    if (newest === null || data.createdAt > newest) {
      newest = data.createdAt;
    }
  }
  
  return {
    activeTokens: tokenStore.size,
    oldestToken: oldest,
    newestToken: newest,
  };
}
