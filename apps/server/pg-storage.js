"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgStorage = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_orm_1 = require("drizzle-orm");
const pg_1 = __importDefault(require("pg"));
const db_schema_js_1 = require("../shared/db-schema.js");
const { Pool } = pg_1.default;
class PgStorage {
    pool;
    db;
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
        this.db = (0, node_postgres_1.drizzle)(this.pool);
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
            .insert(db_schema_js_1.users)
            .values(insertUser)
            .returning();
        return this.mapUserToInterface(user);
    }
    async getUserById(id) {
        const [user] = await this.db
            .select()
            .from(db_schema_js_1.users)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.users.id, id))
            .limit(1);
        return user ? this.mapUserToInterface(user) : null;
    }
    async getUserByUsername(username) {
        const [user] = await this.db
            .select()
            .from(db_schema_js_1.users)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.users.username, username))
            .limit(1);
        return user ? this.mapUserToInterface(user) : null;
    }
    async updateUser(id, updates) {
        const [user] = await this.db
            .update(db_schema_js_1.users)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.users.id, id))
            .returning();
        return user ? this.mapUserToInterface(user) : null;
    }
    async createHealingMessage(insertMessage) {
        const [message] = await this.db
            .insert(db_schema_js_1.healingMessages)
            .values(insertMessage)
            .returning();
        return message;
    }
    async getHealingMessagesByUserId(userId) {
        const messages = await this.db
            .select()
            .from(db_schema_js_1.healingMessages)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.healingMessages.userId, userId))
            .orderBy(db_schema_js_1.healingMessages.timestamp);
        return messages;
    }
    async getHealingMessagesBySessionId(sessionId) {
        const messages = await this.db
            .select()
            .from(db_schema_js_1.healingMessages)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.healingMessages.sessionId, sessionId))
            .orderBy(db_schema_js_1.healingMessages.timestamp);
        return messages;
    }
    async createJournal(insertJournal) {
        const [journal] = await this.db
            .insert(db_schema_js_1.journals)
            .values(insertJournal)
            .returning();
        return journal;
    }
    async getJournalsByUserId(userId) {
        const journalList = await this.db
            .select()
            .from(db_schema_js_1.journals)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.journals.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.journals.createdAt));
        return journalList;
    }
    async getJournalById(id) {
        const [journal] = await this.db
            .select()
            .from(db_schema_js_1.journals)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.journals.id, id))
            .limit(1);
        return journal || null;
    }
    async updateJournal(id, update) {
        const [journal] = await this.db
            .update(db_schema_js_1.journals)
            .set({ ...update, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.journals.id, id))
            .returning();
        return journal || null;
    }
    async deleteJournal(id) {
        const result = await this.db
            .delete(db_schema_js_1.journals)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.journals.id, id))
            .returning();
        return result.length > 0;
    }
    async createMoodEntry(insertEntry) {
        const [entry] = await this.db
            .insert(db_schema_js_1.moodEntries)
            .values(insertEntry)
            .returning();
        return entry;
    }
    async getMoodEntriesByUserId(userId) {
        const entries = await this.db
            .select()
            .from(db_schema_js_1.moodEntries)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.moodEntries.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.moodEntries.createdAt));
        return entries;
    }
    async getMoodEntriesByUserIdAndDateRange(userId, startDate, endDate) {
        const entries = await this.db
            .select()
            .from(db_schema_js_1.moodEntries)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_schema_js_1.moodEntries.userId, userId), (0, drizzle_orm_1.gte)(db_schema_js_1.moodEntries.createdAt, startDate), (0, drizzle_orm_1.lte)(db_schema_js_1.moodEntries.createdAt, endDate)))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.moodEntries.createdAt));
        return entries;
    }
    async getCrisisResources() {
        const resources = await this.db
            .select()
            .from(db_schema_js_1.crisisResources)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.crisisResources.isActive, true))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.crisisResources.priority));
        return resources;
    }
    async getCrisisResourcesByCountry(country) {
        const resources = await this.db
            .select()
            .from(db_schema_js_1.crisisResources)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_schema_js_1.crisisResources.isActive, true), (0, drizzle_orm_1.eq)(db_schema_js_1.crisisResources.country, country)))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.crisisResources.priority));
        return resources;
    }
    async createBillingTransaction(insertTransaction) {
        const [transaction] = await this.db
            .insert(db_schema_js_1.billingTransactions)
            .values(insertTransaction)
            .returning();
        return transaction;
    }
    async getBillingTransactionsByUserId(userId) {
        const transactions = await this.db
            .select()
            .from(db_schema_js_1.billingTransactions)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.billingTransactions.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.billingTransactions.createdAt));
        return transactions;
    }
    async getBillingTransactionById(id) {
        const [transaction] = await this.db
            .select()
            .from(db_schema_js_1.billingTransactions)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.billingTransactions.id, id))
            .limit(1);
        return transaction || null;
    }
    // Media Assets (AI Image Generation)
    async createMediaAsset(insertAsset) {
        const [asset] = await this.db
            .insert(db_schema_js_1.mediaAssets)
            .values(insertAsset)
            .returning();
        return asset;
    }
    async getMediaAssetsByUserId(userId) {
        const assets = await this.db
            .select()
            .from(db_schema_js_1.mediaAssets)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.mediaAssets.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.mediaAssets.createdAt));
        return assets;
    }
    async getMediaAssetById(id) {
        const [asset] = await this.db
            .select()
            .from(db_schema_js_1.mediaAssets)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.mediaAssets.id, id))
            .limit(1);
        return asset || null;
    }
    async updateMediaAsset(id, updates) {
        const [asset] = await this.db
            .update(db_schema_js_1.mediaAssets)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.mediaAssets.id, id))
            .returning();
        return asset || null;
    }
    async deleteMediaAsset(id) {
        const result = await this.db
            .delete(db_schema_js_1.mediaAssets)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.mediaAssets.id, id))
            .returning();
        return result.length > 0;
    }
    // Social Media Accounts
    async createSocialAccount(insertAccount) {
        const [account] = await this.db
            .insert(db_schema_js_1.socialAccounts)
            .values(insertAccount)
            .returning();
        return account;
    }
    async getSocialAccountsByUserId(userId) {
        const accounts = await this.db
            .select()
            .from(db_schema_js_1.socialAccounts)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialAccounts.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.socialAccounts.createdAt));
        return accounts;
    }
    async getSocialAccountById(id) {
        const [account] = await this.db
            .select()
            .from(db_schema_js_1.socialAccounts)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialAccounts.id, id))
            .limit(1);
        return account || null;
    }
    async updateSocialAccount(id, updates) {
        const [account] = await this.db
            .update(db_schema_js_1.socialAccounts)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialAccounts.id, id))
            .returning();
        return account || null;
    }
    async deleteSocialAccount(id) {
        const result = await this.db
            .delete(db_schema_js_1.socialAccounts)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialAccounts.id, id))
            .returning();
        return result.length > 0;
    }
    // Social Media Profiles
    async createSocialProfile(insertProfile) {
        const [profile] = await this.db
            .insert(db_schema_js_1.socialProfiles)
            .values(insertProfile)
            .returning();
        return profile;
    }
    async getSocialProfilesByAccountId(accountId) {
        const profiles = await this.db
            .select()
            .from(db_schema_js_1.socialProfiles)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialProfiles.accountId, accountId));
        return profiles;
    }
    async getSocialProfileById(id) {
        const [profile] = await this.db
            .select()
            .from(db_schema_js_1.socialProfiles)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialProfiles.id, id))
            .limit(1);
        return profile || null;
    }
    async updateSocialProfile(id, updates) {
        const [profile] = await this.db
            .update(db_schema_js_1.socialProfiles)
            .set({ ...updates, lastUpdatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialProfiles.id, id))
            .returning();
        return profile || null;
    }
    // Social Post History
    async createSocialPost(insertPost) {
        const [post] = await this.db
            .insert(db_schema_js_1.socialPostsHistory)
            .values(insertPost)
            .returning();
        return post;
    }
    async getSocialPostsByUserId(userId) {
        const posts = await this.db
            .select()
            .from(db_schema_js_1.socialPostsHistory)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialPostsHistory.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.socialPostsHistory.publishedAt));
        return posts;
    }
    async getSocialPostsByAccountId(accountId) {
        const posts = await this.db
            .select()
            .from(db_schema_js_1.socialPostsHistory)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialPostsHistory.accountId, accountId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.socialPostsHistory.publishedAt));
        return posts;
    }
    async getSocialPostById(id) {
        const [post] = await this.db
            .select()
            .from(db_schema_js_1.socialPostsHistory)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialPostsHistory.id, id))
            .limit(1);
        return post || null;
    }
    async updateSocialPost(id, updates) {
        const [post] = await this.db
            .update(db_schema_js_1.socialPostsHistory)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.socialPostsHistory.id, id))
            .returning();
        return post || null;
    }
    // AI Prompts
    async createAiPrompt(insertPrompt) {
        const [prompt] = await this.db
            .insert(db_schema_js_1.aiPrompts)
            .values(insertPrompt)
            .returning();
        return prompt;
    }
    async getAiPromptsByUserId(userId) {
        const prompts = await this.db
            .select()
            .from(db_schema_js_1.aiPrompts)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.aiPrompts.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.aiPrompts.createdAt));
        return prompts;
    }
    async getAiPromptsByCategory(category) {
        const prompts = await this.db
            .select()
            .from(db_schema_js_1.aiPrompts)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.aiPrompts.category, category))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.aiPrompts.usageCount));
        return prompts;
    }
    async getAiPromptById(id) {
        const [prompt] = await this.db
            .select()
            .from(db_schema_js_1.aiPrompts)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.aiPrompts.id, id))
            .limit(1);
        return prompt || null;
    }
    async updateAiPrompt(id, updates) {
        const [prompt] = await this.db
            .update(db_schema_js_1.aiPrompts)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.aiPrompts.id, id))
            .returning();
        return prompt || null;
    }
    async deleteAiPrompt(id) {
        const result = await this.db
            .delete(db_schema_js_1.aiPrompts)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.aiPrompts.id, id))
            .returning();
        return result.length > 0;
    }
    // AI Runs
    async createAiRun(insertRun) {
        const [run] = await this.db
            .insert(db_schema_js_1.aiRuns)
            .values(insertRun)
            .returning();
        return run;
    }
    async getAiRunsByUserId(userId) {
        const runs = await this.db
            .select()
            .from(db_schema_js_1.aiRuns)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.aiRuns.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.aiRuns.createdAt));
        return runs;
    }
    async getAiRunById(id) {
        const [run] = await this.db
            .select()
            .from(db_schema_js_1.aiRuns)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.aiRuns.id, id))
            .limit(1);
        return run || null;
    }
    async updateAiRun(id, updates) {
        const [run] = await this.db
            .update(db_schema_js_1.aiRuns)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.aiRuns.id, id))
            .returning();
        return run || null;
    }
    // Knowledge Sources
    async createKnowledgeSource(insertSource) {
        const [source] = await this.db
            .insert(db_schema_js_1.knowledgeSources)
            .values(insertSource)
            .returning();
        return source;
    }
    async getKnowledgeSourcesByUserId(userId) {
        const sources = await this.db
            .select()
            .from(db_schema_js_1.knowledgeSources)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.knowledgeSources.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.knowledgeSources.createdAt));
        return sources;
    }
    async getKnowledgeSourceById(id) {
        const [source] = await this.db
            .select()
            .from(db_schema_js_1.knowledgeSources)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.knowledgeSources.id, id))
            .limit(1);
        return source || null;
    }
    async updateKnowledgeSource(id, updates) {
        const [source] = await this.db
            .update(db_schema_js_1.knowledgeSources)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.knowledgeSources.id, id))
            .returning();
        return source || null;
    }
    // Knowledge Chunks
    async createKnowledgeChunk(insertChunk) {
        const [chunk] = await this.db
            .insert(db_schema_js_1.knowledgeChunks)
            .values(insertChunk)
            .returning();
        return chunk;
    }
    async getKnowledgeChunksBySourceId(sourceId) {
        const chunks = await this.db
            .select()
            .from(db_schema_js_1.knowledgeChunks)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.knowledgeChunks.sourceId, sourceId))
            .orderBy(db_schema_js_1.knowledgeChunks.chunkIndex);
        return chunks;
    }
    async getKnowledgeChunkById(id) {
        const [chunk] = await this.db
            .select()
            .from(db_schema_js_1.knowledgeChunks)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.knowledgeChunks.id, id))
            .limit(1);
        return chunk || null;
    }
    // AI Usage Tracking
    async createAiUsageTracking(insertUsage) {
        const [usage] = await this.db
            .insert(db_schema_js_1.aiUsageTracking)
            .values(insertUsage)
            .returning();
        return usage;
    }
    async getAiUsageByUserId(userId) {
        const usage = await this.db
            .select()
            .from(db_schema_js_1.aiUsageTracking)
            .where((0, drizzle_orm_1.eq)(db_schema_js_1.aiUsageTracking.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.aiUsageTracking.date));
        return usage;
    }
    async getAiUsageByDateRange(userId, startDate, endDate) {
        const usage = await this.db
            .select()
            .from(db_schema_js_1.aiUsageTracking)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_schema_js_1.aiUsageTracking.userId, userId), (0, drizzle_orm_1.gte)(db_schema_js_1.aiUsageTracking.date, startDate), (0, drizzle_orm_1.lte)(db_schema_js_1.aiUsageTracking.date, endDate)))
            .orderBy((0, drizzle_orm_1.desc)(db_schema_js_1.aiUsageTracking.date));
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
exports.PgStorage = PgStorage;
