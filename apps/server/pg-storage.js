import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import pg from "pg";
import { users, healingMessages, journals, moodEntries, crisisResources, billingTransactions, mediaAssets, socialAccounts, socialProfiles, socialPostsHistory, aiPrompts, aiRuns, knowledgeSources, knowledgeChunks, aiUsageTracking, } from "../shared/db-schema.js";
const { Pool } = pg;
export class PgStorage {
    constructor(connectionString) {
        const dbUrl = connectionString || process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error("DATABASE_URL environment variable is required for PgStorage");
        }
        // Autoscale-optimized connection pool configuration
        this.pool = new Pool({
            connectionString: dbUrl,
            max: 10, // Conservative max connections per instance
            min: 0, // CRITICAL: Allow scale-to-zero (no pre-warming)
            idleTimeoutMillis: 30000, // Close idle connections after 30s
            connectionTimeoutMillis: 5000, // Timeout for acquiring connections
            allowExitOnIdle: true, // Allow pool to exit when idle (scale-to-zero)
            statement_timeout: 30000, // Prevent runaway queries (30s limit)
            query_timeout: 30000, // Overall query timeout (30s limit)
        });
        this.db = drizzle(this.pool);
    }
    /**
     * Get connection pool statistics for monitoring
     */
    getPoolStats() {
        return {
            total: this.pool.totalCount,
            idle: this.pool.idleCount,
            waiting: this.pool.waitingCount,
        };
    }
    /**
     * Health check method for testing database connectivity
     */
    async healthCheck() {
        await this.pool.query('SELECT 1');
    }
    async createUser(insertUser) {
        const [user] = await this.db
            .insert(users)
            .values(insertUser)
            .returning();
        return this.mapUserToInterface(user);
    }
    async getUserById(id) {
        const [user] = await this.db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
        return user ? this.mapUserToInterface(user) : null;
    }
    async getUserByUsername(username) {
        const [user] = await this.db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);
        return user ? this.mapUserToInterface(user) : null;
    }
    async updateUser(id, updates) {
        const [user] = await this.db
            .update(users)
            .set(updates)
            .where(eq(users.id, id))
            .returning();
        return user ? this.mapUserToInterface(user) : null;
    }
    async createHealingMessage(insertMessage) {
        const [message] = await this.db
            .insert(healingMessages)
            .values(insertMessage)
            .returning();
        return message;
    }
    async getHealingMessagesByUserId(userId) {
        const messages = await this.db
            .select()
            .from(healingMessages)
            .where(eq(healingMessages.userId, userId))
            .orderBy(healingMessages.timestamp);
        return messages;
    }
    async getHealingMessagesBySessionId(sessionId) {
        const messages = await this.db
            .select()
            .from(healingMessages)
            .where(eq(healingMessages.sessionId, sessionId))
            .orderBy(healingMessages.timestamp);
        return messages;
    }
    async createJournal(insertJournal) {
        const [journal] = await this.db
            .insert(journals)
            .values(insertJournal)
            .returning();
        return journal;
    }
    async getJournalsByUserId(userId) {
        const journalList = await this.db
            .select()
            .from(journals)
            .where(eq(journals.userId, userId))
            .orderBy(desc(journals.createdAt));
        return journalList;
    }
    async getJournalById(id) {
        const [journal] = await this.db
            .select()
            .from(journals)
            .where(eq(journals.id, id))
            .limit(1);
        return journal || null;
    }
    async updateJournal(id, update) {
        const [journal] = await this.db
            .update(journals)
            .set({ ...update, updatedAt: new Date() })
            .where(eq(journals.id, id))
            .returning();
        return journal || null;
    }
    async deleteJournal(id) {
        const result = await this.db
            .delete(journals)
            .where(eq(journals.id, id))
            .returning();
        return result.length > 0;
    }
    async createMoodEntry(insertEntry) {
        const [entry] = await this.db
            .insert(moodEntries)
            .values(insertEntry)
            .returning();
        return entry;
    }
    async getMoodEntriesByUserId(userId) {
        const entries = await this.db
            .select()
            .from(moodEntries)
            .where(eq(moodEntries.userId, userId))
            .orderBy(desc(moodEntries.createdAt));
        return entries;
    }
    async getMoodEntriesByUserIdAndDateRange(userId, startDate, endDate) {
        const entries = await this.db
            .select()
            .from(moodEntries)
            .where(and(eq(moodEntries.userId, userId), gte(moodEntries.createdAt, startDate), lte(moodEntries.createdAt, endDate)))
            .orderBy(desc(moodEntries.createdAt));
        return entries;
    }
    async getCrisisResources() {
        const resources = await this.db
            .select()
            .from(crisisResources)
            .where(eq(crisisResources.isActive, true))
            .orderBy(desc(crisisResources.priority));
        return resources;
    }
    async getCrisisResourcesByCountry(country) {
        const resources = await this.db
            .select()
            .from(crisisResources)
            .where(and(eq(crisisResources.isActive, true), eq(crisisResources.country, country)))
            .orderBy(desc(crisisResources.priority));
        return resources;
    }
    async createBillingTransaction(insertTransaction) {
        const [transaction] = await this.db
            .insert(billingTransactions)
            .values(insertTransaction)
            .returning();
        return transaction;
    }
    async getBillingTransactionsByUserId(userId) {
        const transactions = await this.db
            .select()
            .from(billingTransactions)
            .where(eq(billingTransactions.userId, userId))
            .orderBy(desc(billingTransactions.createdAt));
        return transactions;
    }
    async getBillingTransactionById(id) {
        const [transaction] = await this.db
            .select()
            .from(billingTransactions)
            .where(eq(billingTransactions.id, id))
            .limit(1);
        return transaction || null;
    }
    // Media Assets (AI Image Generation)
    async createMediaAsset(insertAsset) {
        const [asset] = await this.db
            .insert(mediaAssets)
            .values(insertAsset)
            .returning();
        return asset;
    }
    async getMediaAssetsByUserId(userId) {
        const assets = await this.db
            .select()
            .from(mediaAssets)
            .where(eq(mediaAssets.userId, userId))
            .orderBy(desc(mediaAssets.createdAt));
        return assets;
    }
    async getMediaAssetById(id) {
        const [asset] = await this.db
            .select()
            .from(mediaAssets)
            .where(eq(mediaAssets.id, id))
            .limit(1);
        return asset || null;
    }
    async updateMediaAsset(id, updates) {
        const [asset] = await this.db
            .update(mediaAssets)
            .set(updates)
            .where(eq(mediaAssets.id, id))
            .returning();
        return asset || null;
    }
    async deleteMediaAsset(id) {
        const result = await this.db
            .delete(mediaAssets)
            .where(eq(mediaAssets.id, id))
            .returning();
        return result.length > 0;
    }
    // Social Media Accounts
    async createSocialAccount(insertAccount) {
        const [account] = await this.db
            .insert(socialAccounts)
            .values(insertAccount)
            .returning();
        return account;
    }
    async getSocialAccountsByUserId(userId) {
        const accounts = await this.db
            .select()
            .from(socialAccounts)
            .where(eq(socialAccounts.userId, userId))
            .orderBy(desc(socialAccounts.createdAt));
        return accounts;
    }
    async getSocialAccountById(id) {
        const [account] = await this.db
            .select()
            .from(socialAccounts)
            .where(eq(socialAccounts.id, id))
            .limit(1);
        return account || null;
    }
    async updateSocialAccount(id, updates) {
        const [account] = await this.db
            .update(socialAccounts)
            .set(updates)
            .where(eq(socialAccounts.id, id))
            .returning();
        return account || null;
    }
    async deleteSocialAccount(id) {
        const result = await this.db
            .delete(socialAccounts)
            .where(eq(socialAccounts.id, id))
            .returning();
        return result.length > 0;
    }
    // Social Media Profiles
    async createSocialProfile(insertProfile) {
        const [profile] = await this.db
            .insert(socialProfiles)
            .values(insertProfile)
            .returning();
        return profile;
    }
    async getSocialProfilesByAccountId(accountId) {
        const profiles = await this.db
            .select()
            .from(socialProfiles)
            .where(eq(socialProfiles.accountId, accountId));
        return profiles;
    }
    async getSocialProfileById(id) {
        const [profile] = await this.db
            .select()
            .from(socialProfiles)
            .where(eq(socialProfiles.id, id))
            .limit(1);
        return profile || null;
    }
    async updateSocialProfile(id, updates) {
        const [profile] = await this.db
            .update(socialProfiles)
            .set({ ...updates, lastUpdatedAt: new Date() })
            .where(eq(socialProfiles.id, id))
            .returning();
        return profile || null;
    }
    // Social Post History
    async createSocialPost(insertPost) {
        const [post] = await this.db
            .insert(socialPostsHistory)
            .values(insertPost)
            .returning();
        return post;
    }
    async getSocialPostsByUserId(userId) {
        const posts = await this.db
            .select()
            .from(socialPostsHistory)
            .where(eq(socialPostsHistory.userId, userId))
            .orderBy(desc(socialPostsHistory.publishedAt));
        return posts;
    }
    async getSocialPostsByAccountId(accountId) {
        const posts = await this.db
            .select()
            .from(socialPostsHistory)
            .where(eq(socialPostsHistory.accountId, accountId))
            .orderBy(desc(socialPostsHistory.publishedAt));
        return posts;
    }
    async getSocialPostById(id) {
        const [post] = await this.db
            .select()
            .from(socialPostsHistory)
            .where(eq(socialPostsHistory.id, id))
            .limit(1);
        return post || null;
    }
    async updateSocialPost(id, updates) {
        const [post] = await this.db
            .update(socialPostsHistory)
            .set(updates)
            .where(eq(socialPostsHistory.id, id))
            .returning();
        return post || null;
    }
    // AI Prompts
    async createAiPrompt(insertPrompt) {
        const [prompt] = await this.db
            .insert(aiPrompts)
            .values(insertPrompt)
            .returning();
        return prompt;
    }
    async getAiPromptsByUserId(userId) {
        const prompts = await this.db
            .select()
            .from(aiPrompts)
            .where(eq(aiPrompts.userId, userId))
            .orderBy(desc(aiPrompts.createdAt));
        return prompts;
    }
    async getAiPromptsByCategory(category) {
        const prompts = await this.db
            .select()
            .from(aiPrompts)
            .where(eq(aiPrompts.category, category))
            .orderBy(desc(aiPrompts.usageCount));
        return prompts;
    }
    async getAiPromptById(id) {
        const [prompt] = await this.db
            .select()
            .from(aiPrompts)
            .where(eq(aiPrompts.id, id))
            .limit(1);
        return prompt || null;
    }
    async updateAiPrompt(id, updates) {
        const [prompt] = await this.db
            .update(aiPrompts)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(aiPrompts.id, id))
            .returning();
        return prompt || null;
    }
    async deleteAiPrompt(id) {
        const result = await this.db
            .delete(aiPrompts)
            .where(eq(aiPrompts.id, id))
            .returning();
        return result.length > 0;
    }
    // AI Runs
    async createAiRun(insertRun) {
        const [run] = await this.db
            .insert(aiRuns)
            .values(insertRun)
            .returning();
        return run;
    }
    async getAiRunsByUserId(userId) {
        const runs = await this.db
            .select()
            .from(aiRuns)
            .where(eq(aiRuns.userId, userId))
            .orderBy(desc(aiRuns.createdAt));
        return runs;
    }
    async getAiRunById(id) {
        const [run] = await this.db
            .select()
            .from(aiRuns)
            .where(eq(aiRuns.id, id))
            .limit(1);
        return run || null;
    }
    async updateAiRun(id, updates) {
        const [run] = await this.db
            .update(aiRuns)
            .set(updates)
            .where(eq(aiRuns.id, id))
            .returning();
        return run || null;
    }
    // Knowledge Sources
    async createKnowledgeSource(insertSource) {
        const [source] = await this.db
            .insert(knowledgeSources)
            .values(insertSource)
            .returning();
        return source;
    }
    async getKnowledgeSourcesByUserId(userId) {
        const sources = await this.db
            .select()
            .from(knowledgeSources)
            .where(eq(knowledgeSources.userId, userId))
            .orderBy(desc(knowledgeSources.createdAt));
        return sources;
    }
    async getKnowledgeSourceById(id) {
        const [source] = await this.db
            .select()
            .from(knowledgeSources)
            .where(eq(knowledgeSources.id, id))
            .limit(1);
        return source || null;
    }
    async updateKnowledgeSource(id, updates) {
        const [source] = await this.db
            .update(knowledgeSources)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(knowledgeSources.id, id))
            .returning();
        return source || null;
    }
    // Knowledge Chunks
    async createKnowledgeChunk(insertChunk) {
        const [chunk] = await this.db
            .insert(knowledgeChunks)
            .values(insertChunk)
            .returning();
        return chunk;
    }
    async getKnowledgeChunksBySourceId(sourceId) {
        const chunks = await this.db
            .select()
            .from(knowledgeChunks)
            .where(eq(knowledgeChunks.sourceId, sourceId))
            .orderBy(knowledgeChunks.chunkIndex);
        return chunks;
    }
    async getKnowledgeChunkById(id) {
        const [chunk] = await this.db
            .select()
            .from(knowledgeChunks)
            .where(eq(knowledgeChunks.id, id))
            .limit(1);
        return chunk || null;
    }
    // AI Usage Tracking
    async createAiUsageTracking(insertUsage) {
        const [usage] = await this.db
            .insert(aiUsageTracking)
            .values(insertUsage)
            .returning();
        return usage;
    }
    async getAiUsageByUserId(userId) {
        const usage = await this.db
            .select()
            .from(aiUsageTracking)
            .where(eq(aiUsageTracking.userId, userId))
            .orderBy(desc(aiUsageTracking.date));
        return usage;
    }
    async getAiUsageByDateRange(userId, startDate, endDate) {
        const usage = await this.db
            .select()
            .from(aiUsageTracking)
            .where(and(eq(aiUsageTracking.userId, userId), gte(aiUsageTracking.date, startDate), lte(aiUsageTracking.date, endDate)))
            .orderBy(desc(aiUsageTracking.date));
        return usage;
    }
    mapUserToInterface(user) {
        return {
            ...user,
            preferences: typeof user.preferences === 'string'
                ? JSON.parse(user.preferences)
                : (user.preferences || {})
        };
    }
    async close() {
        await this.pool.end();
    }
}
