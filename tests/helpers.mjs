import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { db } from '../server/db/connection.mjs';
import { users } from '../shared/schema.mjs';
import { eq } from 'drizzle-orm';

const TEST_JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export function createTestUser(overrides = {}) {
  return {
    id: randomUUID(),
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    role: 'user',
    ...overrides,
  };
}

export async function seedTestUser(user) {
  try {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      passwordHash: 'test-hash-not-for-login',
      createdAt: new Date(),
    }).onConflictDoNothing();
  } catch (err) {
    console.error('Failed to seed test user:', err.message);
  }
  return user;
}

export async function cleanupTestUser(userId) {
  try {
    await db.delete(users).where(eq(users.id, userId));
  } catch (err) {
    console.error('Failed to cleanup test user:', err.message);
  }
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
