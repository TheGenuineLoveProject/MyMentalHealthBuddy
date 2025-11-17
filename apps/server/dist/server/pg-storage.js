import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import pg from "pg";
import { users, healingMessages, journals, moodEntries, crisisResources, billingTransactions, mediaAssets, socialAccounts, socialProfiles, socialPostsHistory, aiPrompts, aiRuns, knowledgeSources, knowledgeChunks, aiUsageTracking, } from "../shared/db-schema.js";
// Import logger for structured logging (888...^ MIT-PhD Production Standard)
// Import from sibling directory (pg-storage.ts and storage.ts are peers, logger is in src/lib)
import { logger } from "./src/lib/logger.js";
const { Pool } = pg;
// 888...^ Enterprise-Grade Database Resilience
// Retry configuration with exponential backoff
const RETRY_CONFIG = {
    maxRetries: 3,
    initialDelayMs: 100,
    maxDelayMs: 2000,
    backoffMultiplier: 2,
};
/**
 * Exponential backoff retry wrapper for database operations
 * Handles transient connection errors (ECONNRESET, 57P01, etc.)
 * 888...^ Uses structured logger for production observability
 */
async function retryWithBackoff(operation, context) {
    let lastError = null;
    let delay = RETRY_CONFIG.initialDelayMs;
    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Don't retry on non-transient errors (auth, syntax, etc.)
            const isTransient = error.code === '57P01' || // admin shutdown
                error.code === 'ECONNRESET' ||
                error.code === 'ENOTFOUND' ||
                error.code === 'ETIMEDOUT' ||
                error.code === 'ECONNREFUSED';
            if (!isTransient || attempt === RETRY_CONFIG.maxRetries) {
                const errorMsg = `Database ${context} failed after ${attempt + 1} attempts`;
                const errorObj = error instanceof Error ? error : new Error(error?.message || String(error));
                logger.error(errorMsg, errorObj);
                throw error;
            }
            logger.warn(`Database ${context} attempt ${attempt + 1} failed, retrying in ${delay}ms`, {
                errorMessage: error?.message || String(error),
                errorCode: error?.code
            });
            // Wait with exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay));
            delay = Math.min(delay * RETRY_CONFIG.backoffMultiplier, RETRY_CONFIG.maxDelayMs);
        }
    }
    throw lastError || new Error('Retry loop completed without success or error');
}
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
        // 888...^ CRITICAL FIX: Handle connection pool errors gracefully
        // This prevents server crashes when PostgreSQL terminates connections
        this.pool.on('error', (err, client) => {
            logger.error('Database pool unexpected error on idle client', err instanceof Error ? err : new Error(String(err)));
            // Don't exit process - pool will handle reconnection automatically
        });
        // 888...^ CRITICAL FIX: Handle client connection errors
        this.pool.on('connect', (client) => {
            client.on('error', (err) => {
                logger.error('Database client connection error', err instanceof Error ? err : new Error(String(err)));
                // Client will be removed from pool automatically
            });
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
     * 888...^ Includes retry logic for resilient health monitoring
     */
    async healthCheck() {
        await retryWithBackoff(() => this.pool.query('SELECT 1'), 'Health Check');
    }
    async createUser(insertUser) {
        return retryWithBackoff(async () => {
            const [user] = await this.db
                .insert(users)
                .values(insertUser)
                .returning();
            return this.mapUserToInterface(user);
        }, 'createUser');
    }
    async getUserById(id) {
        return retryWithBackoff(async () => {
            const [user] = await this.db
                .select()
                .from(users)
                .where(eq(users.id, id))
                .limit(1);
            return user ? this.mapUserToInterface(user) : null;
        }, 'getUserById');
    }
    async getUserByUsername(username) {
        return retryWithBackoff(async () => {
            const [user] = await this.db
                .select()
                .from(users)
                .where(eq(users.username, username))
                .limit(1);
            return user ? this.mapUserToInterface(user) : null;
        }, 'getUserByUsername');
    }
    async updateUser(id, updates) {
        return retryWithBackoff(async () => {
            const [user] = await this.db
                .update(users)
                .set(updates)
                .where(eq(users.id, id))
                .returning();
            return user ? this.mapUserToInterface(user) : null;
        }, 'updateUser');
    }
    async createHealingMessage(insertMessage) {
        return retryWithBackoff(async () => {
            const [message] = await this.db
                .insert(healingMessages)
                .values(insertMessage)
                .returning();
            return message;
        }, 'createHealingMessage');
    }
    async getHealingMessagesByUserId(userId) {
        return retryWithBackoff(async () => {
            const messages = await this.db
                .select()
                .from(healingMessages)
                .where(eq(healingMessages.userId, userId))
                .orderBy(healingMessages.timestamp);
            return messages;
        }, 'getHealingMessagesByUserId');
    }
    async getHealingMessagesBySessionId(sessionId) {
        return retryWithBackoff(async () => {
            const messages = await this.db
                .select()
                .from(healingMessages)
                .where(eq(healingMessages.sessionId, sessionId))
                .orderBy(healingMessages.timestamp);
            return messages;
        }, 'getHealingMessagesBySessionId');
    }
    async createJournal(insertJournal) {
        return retryWithBackoff(async () => {
            const [journal] = await this.db
                .insert(journals)
                .values(insertJournal)
                .returning();
            return journal;
        }, 'createJournal');
    }
    async getJournalsByUserId(userId) {
        return retryWithBackoff(async () => {
            const journalList = await this.db
                .select()
                .from(journals)
                .where(eq(journals.userId, userId))
                .orderBy(desc(journals.createdAt));
            return journalList;
        }, 'getJournalsByUserId');
    }
    async getJournalById(id) {
        return retryWithBackoff(async () => {
            const [journal] = await this.db
                .select()
                .from(journals)
                .where(eq(journals.id, id))
                .limit(1);
            return journal || null;
        }, 'getJournalById');
    }
    async updateJournal(id, update) {
        return retryWithBackoff(async () => {
            const [journal] = await this.db
                .update(journals)
                .set({ ...update, updatedAt: new Date() })
                .where(eq(journals.id, id))
                .returning();
            return journal || null;
        }, 'updateJournal');
    }
    async deleteJournal(id) {
        return retryWithBackoff(async () => {
            const result = await this.db
                .delete(journals)
                .where(eq(journals.id, id))
                .returning();
            return result.length > 0;
        }, 'deleteJournal');
    }
    async createMoodEntry(insertEntry) {
        return retryWithBackoff(async () => {
            const [entry] = await this.db
                .insert(moodEntries)
                .values(insertEntry)
                .returning();
            return entry;
        }, 'createMoodEntry');
    }
    async getMoodEntriesByUserId(userId) {
        return retryWithBackoff(async () => {
            const entries = await this.db
                .select()
                .from(moodEntries)
                .where(eq(moodEntries.userId, userId))
                .orderBy(desc(moodEntries.createdAt));
            return entries;
        }, 'getMoodEntriesByUserId');
    }
    async getMoodEntriesByUserIdAndDateRange(userId, startDate, endDate) {
        return retryWithBackoff(async () => {
            const entries = await this.db
                .select()
                .from(moodEntries)
                .where(and(eq(moodEntries.userId, userId), gte(moodEntries.createdAt, startDate), lte(moodEntries.createdAt, endDate)))
                .orderBy(desc(moodEntries.createdAt));
            return entries;
        }, 'getMoodEntriesByUserIdAndDateRange');
    }
    async getCrisisResources() {
        return retryWithBackoff(async () => {
            const resources = await this.db
                .select()
                .from(crisisResources)
                .where(eq(crisisResources.isActive, true))
                .orderBy(desc(crisisResources.priority));
            return resources;
        }, 'getCrisisResources');
    }
    async getCrisisResourcesByCountry(country) {
        return retryWithBackoff(async () => {
            const resources = await this.db
                .select()
                .from(crisisResources)
                .where(and(eq(crisisResources.isActive, true), eq(crisisResources.country, country)))
                .orderBy(desc(crisisResources.priority));
            return resources;
        }, 'getCrisisResourcesByCountry');
    }
    async createBillingTransaction(insertTransaction) {
        return retryWithBackoff(async () => {
            const [transaction] = await this.db
                .insert(billingTransactions)
                .values(insertTransaction)
                .returning();
            return transaction;
        }, 'createBillingTransaction');
    }
    async getBillingTransactionsByUserId(userId) {
        return retryWithBackoff(async () => {
            const transactions = await this.db
                .select()
                .from(billingTransactions)
                .where(eq(billingTransactions.userId, userId))
                .orderBy(desc(billingTransactions.createdAt));
            return transactions;
        }, 'getBillingTransactionsByUserId');
    }
    async getBillingTransactionById(id) {
        return retryWithBackoff(async () => {
            const [transaction] = await this.db
                .select()
                .from(billingTransactions)
                .where(eq(billingTransactions.id, id))
                .limit(1);
            return transaction || null;
        }, 'getBillingTransactionById');
    }
    // Media Assets (AI Image Generation)
    async createMediaAsset(insertAsset) {
        return retryWithBackoff(async () => {
            const [asset] = await this.db
                .insert(mediaAssets)
                .values(insertAsset)
                .returning();
            return asset;
        }, 'createMediaAsset');
    }
    async getMediaAssetsByUserId(userId) {
        return retryWithBackoff(async () => {
            const assets = await this.db
                .select()
                .from(mediaAssets)
                .where(eq(mediaAssets.userId, userId))
                .orderBy(desc(mediaAssets.createdAt));
            return assets;
        }, 'getMediaAssetsByUserId');
    }
    async getMediaAssetById(id) {
        return retryWithBackoff(async () => {
            const [asset] = await this.db
                .select()
                .from(mediaAssets)
                .where(eq(mediaAssets.id, id))
                .limit(1);
            return asset || null;
        }, 'getMediaAssetById');
    }
    async updateMediaAsset(id, updates) {
        return retryWithBackoff(async () => {
            const [asset] = await this.db
                .update(mediaAssets)
                .set(updates)
                .where(eq(mediaAssets.id, id))
                .returning();
            return asset || null;
        }, 'updateMediaAsset');
    }
    async deleteMediaAsset(id) {
        return retryWithBackoff(async () => {
            const result = await this.db
                .delete(mediaAssets)
                .where(eq(mediaAssets.id, id))
                .returning();
            return result.length > 0;
        }, 'deleteMediaAsset');
    }
    // Social Media Accounts
    async createSocialAccount(insertAccount) {
        return retryWithBackoff(async () => {
            const [account] = await this.db
                .insert(socialAccounts)
                .values(insertAccount)
                .returning();
            return account;
        }, 'createSocialAccount');
    }
    async getSocialAccountsByUserId(userId) {
        return retryWithBackoff(async () => {
            const accounts = await this.db
                .select()
                .from(socialAccounts)
                .where(eq(socialAccounts.userId, userId))
                .orderBy(desc(socialAccounts.createdAt));
            return accounts;
        }, 'getSocialAccountsByUserId');
    }
    async getSocialAccountById(id) {
        return retryWithBackoff(async () => {
            const [account] = await this.db
                .select()
                .from(socialAccounts)
                .where(eq(socialAccounts.id, id))
                .limit(1);
            return account || null;
        }, 'getSocialAccountById');
    }
    async updateSocialAccount(id, updates) {
        return retryWithBackoff(async () => {
            const [account] = await this.db
                .update(socialAccounts)
                .set(updates)
                .where(eq(socialAccounts.id, id))
                .returning();
            return account || null;
        }, 'updateSocialAccount');
    }
    async deleteSocialAccount(id) {
        return retryWithBackoff(async () => {
            const result = await this.db
                .delete(socialAccounts)
                .where(eq(socialAccounts.id, id))
                .returning();
            return result.length > 0;
        }, 'deleteSocialAccount');
    }
    // Social Media Profiles
    async createSocialProfile(insertProfile) {
        return retryWithBackoff(async () => {
            const [profile] = await this.db
                .insert(socialProfiles)
                .values(insertProfile)
                .returning();
            return profile;
        }, 'createSocialProfile');
    }
    async getSocialProfilesByAccountId(accountId) {
        return retryWithBackoff(async () => {
            const profiles = await this.db
                .select()
                .from(socialProfiles)
                .where(eq(socialProfiles.accountId, accountId));
            return profiles;
        }, 'getSocialProfilesByAccountId');
    }
    async getSocialProfileById(id) {
        return retryWithBackoff(async () => {
            const [profile] = await this.db
                .select()
                .from(socialProfiles)
                .where(eq(socialProfiles.id, id))
                .limit(1);
            return profile || null;
        }, 'getSocialProfileById');
    }
    async updateSocialProfile(id, updates) {
        return retryWithBackoff(async () => {
            const [profile] = await this.db
                .update(socialProfiles)
                .set({ ...updates, lastUpdatedAt: new Date() })
                .where(eq(socialProfiles.id, id))
                .returning();
            return profile || null;
        }, 'updateSocialProfile');
    }
    // Social Post History
    async createSocialPost(insertPost) {
        return retryWithBackoff(async () => {
            const [post] = await this.db
                .insert(socialPostsHistory)
                .values(insertPost)
                .returning();
            return post;
        }, 'createSocialPost');
    }
    async getSocialPostsByUserId(userId) {
        return retryWithBackoff(async () => {
            const posts = await this.db
                .select()
                .from(socialPostsHistory)
                .where(eq(socialPostsHistory.userId, userId))
                .orderBy(desc(socialPostsHistory.publishedAt));
            return posts;
        }, 'getSocialPostsByUserId');
    }
    async getSocialPostsByAccountId(accountId) {
        return retryWithBackoff(async () => {
            const posts = await this.db
                .select()
                .from(socialPostsHistory)
                .where(eq(socialPostsHistory.accountId, accountId))
                .orderBy(desc(socialPostsHistory.publishedAt));
            return posts;
        }, 'getSocialPostsByAccountId');
    }
    async getSocialPostById(id) {
        return retryWithBackoff(async () => {
            const [post] = await this.db
                .select()
                .from(socialPostsHistory)
                .where(eq(socialPostsHistory.id, id))
                .limit(1);
            return post || null;
        }, 'getSocialPostById');
    }
    async updateSocialPost(id, updates) {
        return retryWithBackoff(async () => {
            const [post] = await this.db
                .update(socialPostsHistory)
                .set(updates)
                .where(eq(socialPostsHistory.id, id))
                .returning();
            return post || null;
        }, 'updateSocialPost');
    }
    // AI Prompts
    async createAiPrompt(insertPrompt) {
        return retryWithBackoff(async () => {
            const [prompt] = await this.db
                .insert(aiPrompts)
                .values(insertPrompt)
                .returning();
            return prompt;
        }, 'createAiPrompt');
    }
    async getAiPromptsByUserId(userId) {
        return retryWithBackoff(async () => {
            const prompts = await this.db
                .select()
                .from(aiPrompts)
                .where(eq(aiPrompts.userId, userId))
                .orderBy(desc(aiPrompts.createdAt));
            return prompts;
        }, 'getAiPromptsByUserId');
    }
    async getAiPromptsByCategory(category) {
        return retryWithBackoff(async () => {
            const prompts = await this.db
                .select()
                .from(aiPrompts)
                .where(eq(aiPrompts.category, category))
                .orderBy(desc(aiPrompts.usageCount));
            return prompts;
        }, 'getAiPromptsByCategory');
    }
    async getAiPromptById(id) {
        return retryWithBackoff(async () => {
            const [prompt] = await this.db
                .select()
                .from(aiPrompts)
                .where(eq(aiPrompts.id, id))
                .limit(1);
            return prompt || null;
        }, 'getAiPromptById');
    }
    async updateAiPrompt(id, updates) {
        return retryWithBackoff(async () => {
            const [prompt] = await this.db
                .update(aiPrompts)
                .set({ ...updates, updatedAt: new Date() })
                .where(eq(aiPrompts.id, id))
                .returning();
            return prompt || null;
        }, 'updateAiPrompt');
    }
    async deleteAiPrompt(id) {
        return retryWithBackoff(async () => {
            const result = await this.db
                .delete(aiPrompts)
                .where(eq(aiPrompts.id, id))
                .returning();
            return result.length > 0;
        }, 'deleteAiPrompt');
    }
    // AI Runs
    async createAiRun(insertRun) {
        return retryWithBackoff(async () => {
            const [run] = await this.db
                .insert(aiRuns)
                .values(insertRun)
                .returning();
            return run;
        }, 'createAiRun');
    }
    async getAiRunsByUserId(userId) {
        return retryWithBackoff(async () => {
            const runs = await this.db
                .select()
                .from(aiRuns)
                .where(eq(aiRuns.userId, userId))
                .orderBy(desc(aiRuns.createdAt));
            return runs;
        }, 'getAiRunsByUserId');
    }
    async getAiRunById(id) {
        return retryWithBackoff(async () => {
            const [run] = await this.db
                .select()
                .from(aiRuns)
                .where(eq(aiRuns.id, id))
                .limit(1);
            return run || null;
        }, 'getAiRunById');
    }
    async updateAiRun(id, updates) {
        return retryWithBackoff(async () => {
            const [run] = await this.db
                .update(aiRuns)
                .set(updates)
                .where(eq(aiRuns.id, id))
                .returning();
            return run || null;
        }, 'updateAiRun');
    }
    // Knowledge Sources
    async createKnowledgeSource(insertSource) {
        return retryWithBackoff(async () => {
            const [source] = await this.db
                .insert(knowledgeSources)
                .values(insertSource)
                .returning();
            return source;
        }, 'createKnowledgeSource');
    }
    async getKnowledgeSourcesByUserId(userId) {
        return retryWithBackoff(async () => {
            const sources = await this.db
                .select()
                .from(knowledgeSources)
                .where(eq(knowledgeSources.userId, userId))
                .orderBy(desc(knowledgeSources.createdAt));
            return sources;
        }, 'getKnowledgeSourcesByUserId');
    }
    async getKnowledgeSourceById(id) {
        return retryWithBackoff(async () => {
            const [source] = await this.db
                .select()
                .from(knowledgeSources)
                .where(eq(knowledgeSources.id, id))
                .limit(1);
            return source || null;
        }, 'getKnowledgeSourceById');
    }
    async updateKnowledgeSource(id, updates) {
        return retryWithBackoff(async () => {
            const [source] = await this.db
                .update(knowledgeSources)
                .set({ ...updates, updatedAt: new Date() })
                .where(eq(knowledgeSources.id, id))
                .returning();
            return source || null;
        }, 'updateKnowledgeSource');
    }
    // Knowledge Chunks
    async createKnowledgeChunk(insertChunk) {
        return retryWithBackoff(async () => {
            const [chunk] = await this.db
                .insert(knowledgeChunks)
                .values(insertChunk)
                .returning();
            return chunk;
        }, 'createKnowledgeChunk');
    }
    async getKnowledgeChunksBySourceId(sourceId) {
        return retryWithBackoff(async () => {
            const chunks = await this.db
                .select()
                .from(knowledgeChunks)
                .where(eq(knowledgeChunks.sourceId, sourceId))
                .orderBy(knowledgeChunks.chunkIndex);
            return chunks;
        }, 'getKnowledgeChunksBySourceId');
    }
    async getKnowledgeChunkById(id) {
        return retryWithBackoff(async () => {
            const [chunk] = await this.db
                .select()
                .from(knowledgeChunks)
                .where(eq(knowledgeChunks.id, id))
                .limit(1);
            return chunk || null;
        }, 'getKnowledgeChunkById');
    }
    // AI Usage Tracking
    async createAiUsageTracking(insertUsage) {
        return retryWithBackoff(async () => {
            const [usage] = await this.db
                .insert(aiUsageTracking)
                .values(insertUsage)
                .returning();
            return usage;
        }, 'createAiUsageTracking');
    }
    async getAiUsageByUserId(userId) {
        return retryWithBackoff(async () => {
            const usage = await this.db
                .select()
                .from(aiUsageTracking)
                .where(eq(aiUsageTracking.userId, userId))
                .orderBy(desc(aiUsageTracking.date));
            return usage;
        }, 'getAiUsageByUserId');
    }
    async getAiUsageByDateRange(userId, startDate, endDate) {
        return retryWithBackoff(async () => {
            const usage = await this.db
                .select()
                .from(aiUsageTracking)
                .where(and(eq(aiUsageTracking.userId, userId), gte(aiUsageTracking.date, startDate), lte(aiUsageTracking.date, endDate)))
                .orderBy(desc(aiUsageTracking.date));
            return usage;
        }, 'getAiUsageByDateRange');
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
