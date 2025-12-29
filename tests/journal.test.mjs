import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createTestApp } from './app.mjs';
import { createTestUser, createAuthToken, authHeader, seedTestUser, cleanupTestUser } from './helpers.mjs';
import { db } from '../server/db/connection.mjs';
import { journals } from '../shared/schema.mjs';
import { eq } from 'drizzle-orm';

describe('Journal Routes', () => {
  let app;
  let testUser;
  let authToken;
  let createdJournalId;

  beforeAll(async () => {
    app = createTestApp();
    testUser = createTestUser();
    await seedTestUser(testUser);
    authToken = createAuthToken(testUser);
  });

  afterAll(async () => {
    await db.delete(journals).where(eq(journals.userId, testUser.id));
    await cleanupTestUser(testUser.id);
  });

  describe('POST /api/journal', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/journal')
        .send({ title: 'My Journal', content: 'Test content' });

      expect(res.status).toBe(401);
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/journal')
        .set(authHeader(authToken))
        .send({ title: 'Only Title' }); // Missing content

      expect(res.status).toBe(400);
    });

    it('should create journal entry with valid data', async () => {
      const res = await request(app)
        .post('/api/journal')
        .set(authHeader(authToken))
        .send({
          title: 'My First Journal Entry',
          content: 'Today was a great day. I accomplished several things...',
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('My First Journal Entry');
      expect(res.body.data.content).toBeDefined();
      
      createdJournalId = res.body.data.id;
    });
  });

  describe('GET /api/journal', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/journal');
      expect(res.status).toBe(401);
    });

    it('should return journal entries for authenticated user', async () => {
      const res = await request(app)
        .get('/api/journal')
        .set(authHeader(authToken));

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/journal/:id', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).get(`/api/journal/${createdJournalId}`);
      expect(res.status).toBe(401);
    });

    it('should return single journal entry', async () => {
      const res = await request(app)
        .get(`/api/journal/${createdJournalId}`)
        .set(authHeader(authToken));

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.id).toBe(createdJournalId);
      expect(res.body.data.title).toBe('My First Journal Entry');
    });

    it('should return 400 for non-existent journal', async () => {
      const res = await request(app)
        .get('/api/journal/00000000-0000-0000-0000-000000000000')
        .set(authHeader(authToken));

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/journal/:id', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .put(`/api/journal/${createdJournalId}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(401);
    });

    it('should update journal entry', async () => {
      const res = await request(app)
        .put(`/api/journal/${createdJournalId}`)
        .set(authHeader(authToken))
        .send({
          title: 'Updated Journal Title',
          content: 'This content has been updated with new thoughts.',
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.title).toBe('Updated Journal Title');
      expect(res.body.data.content).toBe('This content has been updated with new thoughts.');
    });

    it('should return 400 for non-existent journal', async () => {
      const res = await request(app)
        .put('/api/journal/00000000-0000-0000-0000-000000000000')
        .set(authHeader(authToken))
        .send({ title: 'Test' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/journal/:id', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .delete(`/api/journal/${createdJournalId}`);

      expect(res.status).toBe(401);
    });

    it('should delete journal entry', async () => {
      const res = await request(app)
        .delete(`/api/journal/${createdJournalId}`)
        .set(authHeader(authToken));

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      
      const getRes = await request(app)
        .get('/api/journal')
        .set(authHeader(authToken));

      const deleted = getRes.body.data.find(j => j.id === createdJournalId);
      expect(deleted).toBeUndefined();
    });

    it('should return 400 for non-existent journal', async () => {
      const res = await request(app)
        .delete('/api/journal/00000000-0000-0000-0000-000000000000')
        .set(authHeader(authToken));

      expect(res.status).toBe(400);
    });
  });
});
