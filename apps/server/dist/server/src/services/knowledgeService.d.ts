/**
 * Knowledge Management Service
 * Handles self-evolving intelligence using RAG (Retrieval Augmented Generation)
 * Ingests worldwide literature and provides AI-powered content generation
 * Part of the 360° self-evolving platform
 *
 * VECTOR EMBEDDING INTEGRATION REQUIRED FOR FULL RAG FUNCTIONALITY:
 *
 * Current State:
 * - Content chunking: ✅ Implemented
 * - Credibility scoring: ✅ Implemented
 * - Vector embeddings: ⚠️  Requires OpenAI integration
 * - Semantic search: ⚠️  Requires vector database (pgvector)
 *
 * To Enable Full RAG:
 * 1. Install pgvector extension in PostgreSQL
 * 2. Add vector column to knowledge_chunks table
 * 3. Integrate OpenAI embeddings API in chunkContent()
 * 4. Implement vector similarity search in searchKnowledge()
 * 5. Use vector search results in generateWithRAG()
 *
 * Example Implementation:
 * ```typescript
 * // In chunkContent():
 * const embedding = await openai.embeddings.create({
 *   model: 'text-embedding-3-small',
 *   input: chunkText
 * });
 * chunks.push({
 *   ...chunk,
 *   embedding: embedding.data[0].embedding // Store vector
 * });
 *
 * // In searchKnowledge():
 * const queryEmbedding = await openai.embeddings.create({
 *   model: 'text-embedding-3-small',
 *   input: query
 * });
 * // Use pgvector to find similar chunks
 * const results = await db.select()
 *   .from(knowledgeChunks)
 *   .orderBy(sql`embedding <=> ${queryEmbedding}`)
 *   .limit(10);
 * ```
 */
import type { InsertKnowledgeSource, SelectKnowledgeSource, SelectKnowledgeChunk } from '../../../shared/schema.js';
export interface IngestKnowledgeParams {
    userId: string;
    title: string;
    sourceType: string;
    url?: string;
    content: string;
    author?: string;
    publishedDate?: Date;
    category?: string;
    tags?: string[];
}
export interface ChunkingOptions {
    maxChunkSize: number;
    overlapSize: number;
    preserveStructure: boolean;
}
export interface SearchKnowledgeParams {
    query: string;
    category?: string;
    sourceType?: string;
    limit?: number;
    minCredibilityScore?: number;
}
export interface RAGGenerationParams {
    prompt: string;
    category?: string;
    maxChunks?: number;
    temperature?: number;
}
export declare class KnowledgeService {
    /**
     * Ingest new knowledge source and chunk it for RAG
     */
    ingestKnowledge(params: IngestKnowledgeParams): Promise<SelectKnowledgeSource>;
    /**
     * Calculate credibility score based on source metadata
     */
    private calculateCredibilityScore;
    /**
     * Chunk content into smaller pieces for RAG
     */
    chunkContent(sourceId: string, content: string, options?: ChunkingOptions): Promise<SelectKnowledgeChunk[]>;
    /**
     * Search knowledge base using semantic search (would use vector embeddings in production)
     */
    searchKnowledge(params: SearchKnowledgeParams): Promise<{
        sources: SelectKnowledgeSource[];
        chunks: SelectKnowledgeChunk[];
    }>;
    /**
     * Generate content using RAG (Retrieval Augmented Generation)
     */
    generateWithRAG(params: RAGGenerationParams): Promise<{
        content: string;
        sources: SelectKnowledgeSource[];
        confidence: number;
    }>;
    /**
     * Get knowledge sources for a user
     */
    getUserKnowledgeSources(userId: string): Promise<SelectKnowledgeSource[]>;
    /**
     * Get chunks for a specific source
     */
    getSourceChunks(sourceId: string): Promise<SelectKnowledgeChunk[]>;
    /**
     * Update knowledge source
     */
    updateKnowledgeSource(sourceId: string, updates: Partial<InsertKnowledgeSource>): Promise<SelectKnowledgeSource | null>;
    /**
     * Get knowledge statistics for a user
     */
    getKnowledgeStats(userId: string): Promise<{
        totalSources: number;
        totalChunks: number;
        totalWordCount: number;
        sourcesByType: Record<string, number>;
        avgCredibilityScore: number;
        processingStatus: Record<string, number>;
    }>;
    /**
     * Auto-ingest from URL (would use web scraping in production)
     */
    ingestFromUrl(userId: string, url: string, category?: string): Promise<SelectKnowledgeSource>;
}
export declare const knowledgeService: KnowledgeService;
