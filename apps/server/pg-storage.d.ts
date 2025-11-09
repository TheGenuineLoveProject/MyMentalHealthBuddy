import { type User, type InsertUser, type HealingMessage, type InsertHealingMessage, type SelectJournal, type InsertJournal, type SelectMoodEntry, type InsertMoodEntry, type SelectCrisisResource, type SelectBillingTransaction, type InsertBillingTransaction, type SelectMediaAsset, type InsertMediaAsset, type SelectSocialAccount, type InsertSocialAccount, type SelectSocialProfile, type InsertSocialProfile, type SelectSocialPostHistory, type InsertSocialPostHistory, type SelectAiPrompt, type InsertAiPrompt, type SelectAiRun, type InsertAiRun, type SelectKnowledgeSource, type InsertKnowledgeSource, type SelectKnowledgeChunk, type InsertKnowledgeChunk, type SelectAiUsageTracking, type InsertAiUsageTracking } from "../shared/db-schema.js";
import type { IStorage } from "./storage.js";
export declare class PgStorage implements IStorage {
    private pool;
    private db;
    constructor(connectionString?: string);
    /**
     * Get connection pool statistics for monitoring
     */
    getPoolStats(): {
        total: number;
        idle: number;
        waiting: number;
    };
    /**
     * Health check method for testing database connectivity
     */
    healthCheck(): Promise<void>;
    createUser(insertUser: InsertUser): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;
    updateUser(id: string, updates: Partial<User>): Promise<User | null>;
    createHealingMessage(insertMessage: InsertHealingMessage): Promise<HealingMessage>;
    getHealingMessagesByUserId(userId: string): Promise<HealingMessage[]>;
    getHealingMessagesBySessionId(sessionId: string): Promise<HealingMessage[]>;
    createJournal(insertJournal: InsertJournal): Promise<SelectJournal>;
    getJournalsByUserId(userId: string): Promise<SelectJournal[]>;
    getJournalById(id: string): Promise<SelectJournal | null>;
    updateJournal(id: string, update: Partial<InsertJournal>): Promise<SelectJournal | null>;
    deleteJournal(id: string): Promise<boolean>;
    createMoodEntry(insertEntry: InsertMoodEntry): Promise<SelectMoodEntry>;
    getMoodEntriesByUserId(userId: string): Promise<SelectMoodEntry[]>;
    getMoodEntriesByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<SelectMoodEntry[]>;
    getCrisisResources(): Promise<SelectCrisisResource[]>;
    getCrisisResourcesByCountry(country: string): Promise<SelectCrisisResource[]>;
    createBillingTransaction(insertTransaction: InsertBillingTransaction): Promise<SelectBillingTransaction>;
    getBillingTransactionsByUserId(userId: string): Promise<SelectBillingTransaction[]>;
    getBillingTransactionById(id: string): Promise<SelectBillingTransaction | null>;
    createMediaAsset(insertAsset: InsertMediaAsset): Promise<SelectMediaAsset>;
    getMediaAssetsByUserId(userId: string): Promise<SelectMediaAsset[]>;
    getMediaAssetById(id: string): Promise<SelectMediaAsset | null>;
    updateMediaAsset(id: string, updates: Partial<InsertMediaAsset>): Promise<SelectMediaAsset | null>;
    deleteMediaAsset(id: string): Promise<boolean>;
    createSocialAccount(insertAccount: InsertSocialAccount): Promise<SelectSocialAccount>;
    getSocialAccountsByUserId(userId: string): Promise<SelectSocialAccount[]>;
    getSocialAccountById(id: string): Promise<SelectSocialAccount | null>;
    updateSocialAccount(id: string, updates: Partial<InsertSocialAccount>): Promise<SelectSocialAccount | null>;
    deleteSocialAccount(id: string): Promise<boolean>;
    createSocialProfile(insertProfile: InsertSocialProfile): Promise<SelectSocialProfile>;
    getSocialProfilesByAccountId(accountId: string): Promise<SelectSocialProfile[]>;
    getSocialProfileById(id: string): Promise<SelectSocialProfile | null>;
    updateSocialProfile(id: string, updates: Partial<InsertSocialProfile>): Promise<SelectSocialProfile | null>;
    createSocialPost(insertPost: InsertSocialPostHistory): Promise<SelectSocialPostHistory>;
    getSocialPostsByUserId(userId: string): Promise<SelectSocialPostHistory[]>;
    getSocialPostsByAccountId(accountId: string): Promise<SelectSocialPostHistory[]>;
    getSocialPostById(id: string): Promise<SelectSocialPostHistory | null>;
    updateSocialPost(id: string, updates: Partial<InsertSocialPostHistory>): Promise<SelectSocialPostHistory | null>;
    createAiPrompt(insertPrompt: InsertAiPrompt): Promise<SelectAiPrompt>;
    getAiPromptsByUserId(userId: string): Promise<SelectAiPrompt[]>;
    getAiPromptsByCategory(category: string): Promise<SelectAiPrompt[]>;
    getAiPromptById(id: string): Promise<SelectAiPrompt | null>;
    updateAiPrompt(id: string, updates: Partial<InsertAiPrompt>): Promise<SelectAiPrompt | null>;
    deleteAiPrompt(id: string): Promise<boolean>;
    createAiRun(insertRun: InsertAiRun): Promise<SelectAiRun>;
    getAiRunsByUserId(userId: string): Promise<SelectAiRun[]>;
    getAiRunById(id: string): Promise<SelectAiRun | null>;
    updateAiRun(id: string, updates: Partial<InsertAiRun>): Promise<SelectAiRun | null>;
    createKnowledgeSource(insertSource: InsertKnowledgeSource): Promise<SelectKnowledgeSource>;
    getKnowledgeSourcesByUserId(userId: string): Promise<SelectKnowledgeSource[]>;
    getKnowledgeSourceById(id: string): Promise<SelectKnowledgeSource | null>;
    updateKnowledgeSource(id: string, updates: Partial<InsertKnowledgeSource>): Promise<SelectKnowledgeSource | null>;
    createKnowledgeChunk(insertChunk: InsertKnowledgeChunk): Promise<SelectKnowledgeChunk>;
    getKnowledgeChunksBySourceId(sourceId: string): Promise<SelectKnowledgeChunk[]>;
    getKnowledgeChunkById(id: string): Promise<SelectKnowledgeChunk | null>;
    createAiUsageTracking(insertUsage: InsertAiUsageTracking): Promise<SelectAiUsageTracking>;
    getAiUsageByUserId(userId: string): Promise<SelectAiUsageTracking[]>;
    getAiUsageByDateRange(userId: string, startDate: Date, endDate: Date): Promise<SelectAiUsageTracking[]>;
    private mapUserToInterface;
    close(): Promise<void>;
}
