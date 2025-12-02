import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const TEST_JWT_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'test-jwt-secret';

export function createTestUser(overrides = {}) {
  return {
    id: randomUUID(),
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    ...overrides,
  };
}

export function createAuthToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    TEST_JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}
