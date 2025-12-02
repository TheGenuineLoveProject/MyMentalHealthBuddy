import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createTestApp } from './app.mjs';
import { createTestUser, createAuthToken, authHeader } from './helpers.mjs';
import { db } from '../server/db/connection.mjs';
import { aiMessages } from '../shared/schema.mjs';
import { eq } from 'drizzle-orm';

describe('AI Chat Routes', () => {
  let app;
  let testUser;
  let authToken;

  beforeAll(() => {
    app = createTestApp();
    testUser = createTestUser();
    authToken = createAuthToken(testUser);
  });

  afterAll(async () => {
    await db.delete(aiMessages).where(eq(aiMessages.userId, testUser.id));
  });

  describe('GET /api/ai/history', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/ai/history');
      expect(res.status).toBe(401);
    });

    it('should return empty history for new user', async () => {
      const res = await request(app)
        .get('/api/ai/history')
        .set(authHeader(authToken));

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.messages).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/ai/chat', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ message: 'Hello' });

      expect(res.status).toBe(401);
    });

    it('should return 400 for missing message', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set(authHeader(authToken))
        .send({});

      expect(res.status).toBe(400);
    });

    it('should accept and respond to valid message', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set(authHeader(authToken))
        .send({ message: 'Hello, I am feeling a bit anxious today.' });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.reply).toBeDefined();
    });

    it('should persist message to history', async () => {
      const historyRes = await request(app)
        .get('/api/ai/history')
        .set(authHeader(authToken));

      expect(historyRes.status).toBe(200);
      expect(historyRes.body.data.messages.length).toBeGreaterThan(0);
      
      const userMessages = historyRes.body.data.messages.filter(m => m.role === 'user');
      expect(userMessages.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /api/ai/history', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).delete('/api/ai/history');
      expect(res.status).toBe(401);
    });

    it('should clear chat history', async () => {
      const deleteRes = await request(app)
        .delete('/api/ai/history')
        .set(authHeader(authToken));

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.ok).toBe(true);

      const historyRes = await request(app)
        .get('/api/ai/history')
        .set(authHeader(authToken));

      expect(historyRes.body.data.messages).toHaveLength(0);
    });
  });
});
