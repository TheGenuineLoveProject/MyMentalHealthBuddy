import type { IStorage } from "../../storage.js";
/**
 * Advanced Search Service with Full-Text Search & Relevance Scoring
 * Implements PostgreSQL full-text search with ranking, fuzzy matching, and autocomplete
 */
export interface SearchOptions {
    query: string;
    types?: string[];
    limit?: number;
    offset?: number;
    userId?: string | null;
}
export interface SearchResult {
    id: string;
    type: 'journal' | 'mood' | 'resource' | 'message' | 'knowledge';
    title: string;
    content: string;
    excerpt: string;
    relevance: number;
    createdAt: Date;
    metadata?: Record<string, any>;
}
export interface SearchResponse {
    results: SearchResult[];
    total: number;
    query: string;
    executionTime: number;
    suggestions?: string[];
}
export declare class SearchService {
    private storage;
    constructor(storage: IStorage);
    /**
     * Comprehensive search across all content types
     */
    search(options: SearchOptions): Promise<SearchResponse>;
    /**
     * Get autocomplete suggestions based on partial query
     */
    autocomplete(partialQuery: string, limit?: number): Promise<string[]>;
    /**
     * Get trending search queries
     */
    getTrending(limit?: number): Promise<string[]>;
    /**
     * Search journals with full-text search
     */
    private searchJournals;
    /**
     * Search mood entries
     */
    private searchMoods;
    /**
     * Search crisis resources
     */
    private searchResources;
    /**
     * Search healing messages
     */
    private searchMessages;
    /**
     * Search knowledge base
     */
    private searchKnowledge;
    /**
     * Normalize search query (lowercase, trim, remove special chars)
     */
    private normalizeQuery;
    /**
     * Calculate relevance score using TF-IDF-like algorithm
     */
    private calculateRelevance;
    /**
     * Generate excerpt with highlighted query terms
     */
    private generateExcerpt;
    /**
     * Score all results based on relevance
     */
    private scoreResults;
    /**
     * Generate autocomplete suggestions
     */
    private generateSuggestions;
}
