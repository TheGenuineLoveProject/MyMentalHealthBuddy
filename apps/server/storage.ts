import type {
  User,
  InsertUser,
  HealingMessage,
  InsertHealingMessage,
  SelectJournal,
  InsertJournal,
  SelectMoodEntry,
  InsertMoodEntry,
  SelectCrisisResource,
  InsertCrisisResource,
  SelectBillingTransaction,
  InsertBillingTransaction,
  SelectMediaAsset,
  InsertMediaAsset,
  SelectSocialAccount,
  InsertSocialAccount,
  SelectSocialProfile,
  InsertSocialProfile,
  SelectSocialPostHistory,
  InsertSocialPostHistory,
  SelectAiPrompt,
  InsertAiPrompt,
  SelectAiRun,
  InsertAiRun,
  SelectKnowledgeSource,
  InsertKnowledgeSource,
  SelectKnowledgeChunk,
  InsertKnowledgeChunk,
  SelectAiUsageTracking,
  InsertAiUsageTracking
} from "../shared/schema.js";
import { PgStorage } from "./pg-storage.js";

export interface IStorage {
  // User Management
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User | null>;
  
  // AI Chat
  createHealingMessage(message: InsertHealingMessage): Promise<HealingMessage>;
  getHealingMessagesByUserId(userId: string): Promise<HealingMessage[]>;
  getHealingMessagesBySessionId(sessionId: string): Promise<HealingMessage[]>;
  
  // Journals
  createJournal(journal: InsertJournal): Promise<SelectJournal>;
  getJournalsByUserId(userId: string): Promise<SelectJournal[]>;
  getJournalById(id: string): Promise<SelectJournal | null>;
  updateJournal(id: string, journal: Partial<InsertJournal>): Promise<SelectJournal | null>;
  deleteJournal(id: string): Promise<boolean>;
  
  // Mood Tracking
  createMoodEntry(entry: InsertMoodEntry): Promise<SelectMoodEntry>;
  getMoodEntriesByUserId(userId: string): Promise<SelectMoodEntry[]>;
  getMoodEntriesByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<SelectMoodEntry[]>;
  
  // Crisis Resources
  getCrisisResources(): Promise<SelectCrisisResource[]>;
  getCrisisResourcesByCountry(country: string): Promise<SelectCrisisResource[]>;
  
  // Billing
  createBillingTransaction(transaction: InsertBillingTransaction): Promise<SelectBillingTransaction>;
  getBillingTransactionsByUserId(userId: string): Promise<SelectBillingTransaction[]>;
  getBillingTransactionById(id: string): Promise<SelectBillingTransaction | null>;
  
  // Media Assets (AI Image Generation)
  createMediaAsset(asset: InsertMediaAsset): Promise<SelectMediaAsset>;
  getMediaAssetsByUserId(userId: string): Promise<SelectMediaAsset[]>;
  getMediaAssetById(id: string): Promise<SelectMediaAsset | null>;
  updateMediaAsset(id: string, updates: Partial<InsertMediaAsset>): Promise<SelectMediaAsset | null>;
  deleteMediaAsset(id: string): Promise<boolean>;
  
  // Social Media Accounts
  createSocialAccount(account: InsertSocialAccount): Promise<SelectSocialAccount>;
  getSocialAccountsByUserId(userId: string): Promise<SelectSocialAccount[]>;
  getSocialAccountById(id: string): Promise<SelectSocialAccount | null>;
  updateSocialAccount(id: string, updates: Partial<InsertSocialAccount>): Promise<SelectSocialAccount | null>;
  deleteSocialAccount(id: string): Promise<boolean>;
  
  // Social Media Profiles
  createSocialProfile(profile: InsertSocialProfile): Promise<SelectSocialProfile>;
  getSocialProfilesByAccountId(accountId: string): Promise<SelectSocialProfile[]>;
  getSocialProfileById(id: string): Promise<SelectSocialProfile | null>;
  updateSocialProfile(id: string, updates: Partial<InsertSocialProfile>): Promise<SelectSocialProfile | null>;
  
  // Social Post History
  createSocialPost(post: InsertSocialPostHistory): Promise<SelectSocialPostHistory>;
  getSocialPostsByUserId(userId: string): Promise<SelectSocialPostHistory[]>;
  getSocialPostsByAccountId(accountId: string): Promise<SelectSocialPostHistory[]>;
  getSocialPostById(id: string): Promise<SelectSocialPostHistory | null>;
  updateSocialPost(id: string, updates: Partial<InsertSocialPostHistory>): Promise<SelectSocialPostHistory | null>;
  
  // AI Prompts
  createAiPrompt(prompt: InsertAiPrompt): Promise<SelectAiPrompt>;
  getAiPromptsByUserId(userId: string): Promise<SelectAiPrompt[]>;
  getAiPromptsByCategory(category: string): Promise<SelectAiPrompt[]>;
  getAiPromptById(id: string): Promise<SelectAiPrompt | null>;
  updateAiPrompt(id: string, updates: Partial<InsertAiPrompt>): Promise<SelectAiPrompt | null>;
  deleteAiPrompt(id: string): Promise<boolean>;
  
  // AI Runs
  createAiRun(run: InsertAiRun): Promise<SelectAiRun>;
  getAiRunsByUserId(userId: string): Promise<SelectAiRun[]>;
  getAiRunById(id: string): Promise<SelectAiRun | null>;
  updateAiRun(id: string, updates: Partial<InsertAiRun>): Promise<SelectAiRun | null>;
  
  // Knowledge Sources
  createKnowledgeSource(source: InsertKnowledgeSource): Promise<SelectKnowledgeSource>;
  getKnowledgeSourcesByUserId(userId: string): Promise<SelectKnowledgeSource[]>;
  getKnowledgeSourceById(id: string): Promise<SelectKnowledgeSource | null>;
  updateKnowledgeSource(id: string, updates: Partial<InsertKnowledgeSource>): Promise<SelectKnowledgeSource | null>;
  
  // Knowledge Chunks
  createKnowledgeChunk(chunk: InsertKnowledgeChunk): Promise<SelectKnowledgeChunk>;
  getKnowledgeChunksBySourceId(sourceId: string): Promise<SelectKnowledgeChunk[]>;
  getKnowledgeChunkById(id: string): Promise<SelectKnowledgeChunk | null>;
  
  // AI Usage Tracking
  createAiUsageTracking(usage: InsertAiUsageTracking): Promise<SelectAiUsageTracking>;
  getAiUsageByUserId(userId: string): Promise<SelectAiUsageTracking[]>;
  getAiUsageByDateRange(userId: string, startDate: Date, endDate: Date): Promise<SelectAiUsageTracking[]>;
}

// MemStorage removed - now using PgStorage for production persistence
// See apps/server/pg-storage.ts for full implementation

// Switch to PostgreSQL for production persistence
export const storage: IStorage = new PgStorage();
