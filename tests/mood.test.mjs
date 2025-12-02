import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createTestApp } from './app.mjs';
import { createTestUser, createAuthToken, authHeader } from './helpers.mjs';
import { db } from '../server/db/connection.mjs';
import { moods } from '../shared/schema.mjs';
import { eq } from 'drizzle-orm';

describe('Mood Routes', () => {
  let app;
  let testUser;
  let authToken;
  let createdMoodId;

  beforeAll(() => {
    app = createTestApp();
    testUser = createTestUser();
    authToken = createAuthToken(testUser);
  });

  afterAll(async () => {
    await db.delete(moods).where(eq(moods.userId, testUser.id));
  });

  describe('GET /api/mood/ping', () => {
    it('should return health status without auth', async () => {
      const res = await request(app).get('/api/mood/ping');
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.route).toBe('mood');
    });
  });

  describe('POST /api/mood', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/mood')
        .send({ rating: 7 });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid rating', async () => {
      const res = await request(app)
        .post('/api/mood')
        .set(authHeader(authToken))
        .send({ rating: 15 }); // Out of range

      expect(res.status).toBe(400);
    });

    it('should create mood entry with valid data', async () => {
      const res = await request(app)
        .post('/api/mood')
        .set(authHeader(authToken))
        .send({
          rating: 7,
          emotion: 'happy',
          content: 'Feeling good today!',
          energyLevel: 8,
          sleepQuality: 7,
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(String(res.body.data.rating)).toBe('7');
      expect(res.body.data.emotion).toBe('happy');
      
      createdMoodId = res.body.data.id;
    });
  });

  describe('GET /api/mood', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/mood');
      expect(res.status).toBe(401);
    });

    it('should return mood entries for authenticated user', async () => {
      const res = await request(app)
        .get('/api/mood')
        .set(authHeader(authToken));

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/mood/stats', () => {
    it('should return mood statistics', async () => {
      const res = await request(app)
        .get('/api/mood/stats')
        .set(authHeader(authToken));

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.totalEntries).toBeGreaterThan(0);
      expect(res.body.data.averageRating).toBeDefined();
    });

    it('should calculate correct average from multiple entries', async () => {
      await request(app)
        .post('/api/mood')
        .set(authHeader(authToken))
        .send({ rating: 5, emotion: 'neutral' });

      const res = await request(app)
        .get('/api/mood/stats')
        .set(authHeader(authToken));

      expect(res.status).toBe(200);
      expect(res.body.data.totalEntries).toBeGreaterThanOrEqual(2);
      expect(typeof res.body.data.averageRating).toBe('number');
      expect(res.body.data.averageRating).toBeGreaterThan(0);
      expect(res.body.data.averageRating).toBeLessThanOrEqual(10);
    });
  });

  describe('PUT /api/mood/:id', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .put(`/api/mood/${createdMoodId}`)
        .send({ rating: 8 });

      expect(res.status).toBe(401);
    });

    it('should update mood entry', async () => {
      const res = await request(app)
        .put(`/api/mood/${createdMoodId}`)
        .set(authHeader(authToken))
        .send({
          rating: 9,
          emotion: 'excited',
          content: 'Updated - feeling even better!',
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(String(res.body.data.rating)).toBe('9');
      expect(res.body.data.emotion).toBe('excited');
    });

    it('should return 400 for non-existent mood', async () => {
      const res = await request(app)
        .put('/api/mood/00000000-0000-0000-0000-000000000000')
        .set(authHeader(authToken))
        .send({ rating: 5 });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/mood/:id', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .delete(`/api/mood/${createdMoodId}`);

      expect(res.status).toBe(401);
    });

    it('should delete mood entry', async () => {
      const res = await request(app)
        .delete(`/api/mood/${createdMoodId}`)
        .set(authHeader(authToken));

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      
      const getRes = await request(app)
        .get('/api/mood')
        .set(authHeader(authToken));

      const deleted = getRes.body.data.find(m => m.id === createdMoodId);
      expect(deleted).toBeUndefined();
    });
  });
});
