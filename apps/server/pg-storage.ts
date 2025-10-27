import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import pg from "pg";
import {
  users,
  healingMessages,
  journals,
  moodEntries,
  crisisResources,
  type User,
  type InsertUser,
  type HealingMessage,
  type InsertHealingMessage,
  type SelectJournal,
  type InsertJournal,
  type SelectMoodEntry,
  type InsertMoodEntry,
  type SelectCrisisResource,
  type InsertCrisisResource,
} from "../shared/db-schema.js";
import type { IStorage } from "./storage.js";

const { Pool } = pg;

export class PgStorage implements IStorage {
  private pool: pg.Pool;
  private db: ReturnType<typeof drizzle>;

  constructor(connectionString?: string) {
    const dbUrl = connectionString || process.env.DATABASE_URL;
    
    if (!dbUrl) {
      throw new Error("DATABASE_URL environment variable is required for PgStorage");
    }

    this.pool = new Pool({
      connectionString: dbUrl,
    });

    this.db = drizzle(this.pool);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    
    return this.mapUserToInterface(user);
  }

  async getUserById(id: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return user ? this.mapUserToInterface(user) : null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return user ? this.mapUserToInterface(user) : null;
  }

  async createHealingMessage(insertMessage: InsertHealingMessage): Promise<HealingMessage> {
    const [message] = await this.db
      .insert(healingMessages)
      .values(insertMessage)
      .returning();
    
    return message;
  }

  async getHealingMessagesByUserId(userId: string): Promise<HealingMessage[]> {
    const messages = await this.db
      .select()
      .from(healingMessages)
      .where(eq(healingMessages.userId, userId))
      .orderBy(healingMessages.timestamp);
    
    return messages;
  }

  async getHealingMessagesBySessionId(sessionId: string): Promise<HealingMessage[]> {
    const messages = await this.db
      .select()
      .from(healingMessages)
      .where(eq(healingMessages.sessionId, sessionId))
      .orderBy(healingMessages.timestamp);
    
    return messages;
  }

  async createJournal(insertJournal: InsertJournal): Promise<SelectJournal> {
    const [journal] = await this.db
      .insert(journals)
      .values(insertJournal)
      .returning();
    
    return journal;
  }

  async getJournalsByUserId(userId: string): Promise<SelectJournal[]> {
    const journalList = await this.db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt));
    
    return journalList;
  }

  async getJournalById(id: string): Promise<SelectJournal | null> {
    const [journal] = await this.db
      .select()
      .from(journals)
      .where(eq(journals.id, id))
      .limit(1);
    
    return journal || null;
  }

  async updateJournal(id: string, update: Partial<InsertJournal>): Promise<SelectJournal | null> {
    const [journal] = await this.db
      .update(journals)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(journals.id, id))
      .returning();
    
    return journal || null;
  }

  async deleteJournal(id: string): Promise<boolean> {
    const result = await this.db
      .delete(journals)
      .where(eq(journals.id, id))
      .returning();
    
    return result.length > 0;
  }

  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<SelectMoodEntry> {
    const [entry] = await this.db
      .insert(moodEntries)
      .values(insertEntry)
      .returning();
    
    return entry;
  }

  async getMoodEntriesByUserId(userId: string): Promise<SelectMoodEntry[]> {
    const entries = await this.db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt));
    
    return entries;
  }

  async getMoodEntriesByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<SelectMoodEntry[]> {
    const entries = await this.db
      .select()
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, userId),
          gte(moodEntries.createdAt, startDate),
          lte(moodEntries.createdAt, endDate)
        )
      )
      .orderBy(desc(moodEntries.createdAt));
    
    return entries;
  }

  async getCrisisResources(): Promise<SelectCrisisResource[]> {
    const resources = await this.db
      .select()
      .from(crisisResources)
      .where(eq(crisisResources.isActive, true))
      .orderBy(desc(crisisResources.priority));
    
    return resources;
  }

  async getCrisisResourcesByCountry(country: string): Promise<SelectCrisisResource[]> {
    const resources = await this.db
      .select()
      .from(crisisResources)
      .where(
        and(
          eq(crisisResources.isActive, true),
          eq(crisisResources.country, country)
        )
      )
      .orderBy(desc(crisisResources.priority));
    
    return resources;
  }

  private mapUserToInterface(user: typeof users.$inferSelect): User {
    return {
      ...user,
      preferences: typeof user.preferences === 'string' 
        ? JSON.parse(user.preferences) 
        : (user.preferences as any || {})
    };
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
