/**
 * Knowledge Management Service
 * Handles self-evolving intelligence using RAG (Retrieval Augmented Generation)
 * Ingests worldwide literature and provides AI-powered content generation
 * Part of the 360° self-evolving platform
 */

import type { 
  InsertKnowledgeSource,
  SelectKnowledgeSource,
  InsertKnowledgeChunk,
  SelectKnowledgeChunk 
} from '../../../shared/schema.js';
import { storage } from '../../storage.js';

export interface IngestKnowledgeParams {
  userId: string;
  title: string;
  sourceType: string; // article, research_paper, book, website, video, podcast
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

export class KnowledgeService {
  /**
   * Ingest new knowledge source and chunk it for RAG
   */
  async ingestKnowledge(params: IngestKnowledgeParams): Promise<SelectKnowledgeSource> {
    try {
      // Create knowledge source record
      const source = await storage.createKnowledgeSource({
        userId: params.userId,
        title: params.title,
        sourceType: params.sourceType,
        sourceUrl: params.url || null,
        author: params.author || null,
        publishedDate: params.publishedDate || null,
        category: params.category || null,
        tags: params.tags || [],
        language: 'en',
        credibilityScore: this.calculateCredibilityScore(params).toFixed(2),
        lastCrawledAt: null,
        status: 'active',
        metadata: {
          wordCount: params.content.split(/\s+/).length,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Chunk the content for RAG
      await this.chunkContent(source.id, params.content);

      return source;

      return source;
    } catch (error) {
      console.error('Failed to ingest knowledge:', error);
      throw new Error('Failed to ingest knowledge source');
    }
  }

  /**
   * Calculate credibility score based on source metadata
   */
  private calculateCredibilityScore(params: IngestKnowledgeParams): number {
    let score = 50; // Base score

    // Boost score for research papers and peer-reviewed sources
    if (params.sourceType === 'research_paper') {
      score += 30;
    } else if (params.sourceType === 'book') {
      score += 20;
    }

    // Boost score if author is provided
    if (params.author) {
      score += 10;
    }

    // Boost score if published date is recent
    if (params.publishedDate) {
      const yearsOld = (Date.now() - params.publishedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (yearsOld < 2) {
        score += 15;
      } else if (yearsOld < 5) {
        score += 10;
      }
    }

    // Boost score if URL is from reputable domains
    if (params.url) {
      const reputableDomains = ['edu', 'gov', 'org'];
      const domain = new URL(params.url).hostname;
      if (reputableDomains.some(d => domain.endsWith(`.${d}`))) {
        score += 15;
      }
    }

    return Math.min(100, score);
  }

  /**
   * Chunk content into smaller pieces for RAG
   */
  async chunkContent(
    sourceId: string,
    content: string,
    options: ChunkingOptions = {
      maxChunkSize: 1000,
      overlapSize: 200,
      preserveStructure: true,
    }
  ): Promise<SelectKnowledgeChunk[]> {
    try {
      const chunks: InsertKnowledgeChunk[] = [];
      
      // Split content into paragraphs or sentences
      const paragraphs = options.preserveStructure
        ? content.split(/\n\n+/)
        : [content];

      let currentChunk = '';
      let chunkIndex = 0;
      let charStart = 0;

      for (const paragraph of paragraphs) {
        const words = paragraph.split(/\s+/);
        
        for (let i = 0; i < words.length; i += options.maxChunkSize - options.overlapSize) {
          const chunkWords = words.slice(i, i + options.maxChunkSize);
          const chunkText = chunkWords.join(' ');
          
          if (chunkText.length > 0) {
            // Generate content hash for deduplication
            const crypto = await import('crypto');
            const contentHash = crypto.createHash('sha256').update(chunkText).digest('hex');
            
            chunks.push({
              sourceId,
              chunkIndex: chunkIndex++,
              content: chunkText,
              contentHash,
              tokenCount: chunkWords.length, // Approximate token count
              embeddingId: null,
              topics: [],
              sentiment: null,
              keyPhrases: [],
              metadata: {
                overlap: i > 0,
                charStart,
                charEnd: charStart + chunkText.length,
              },
            });
            
            charStart += chunkText.length;
          }
        }
      }

      // Save all chunks to database
      const savedChunks: SelectKnowledgeChunk[] = [];
      for (const chunk of chunks) {
        const savedChunk = await storage.createKnowledgeChunk(chunk);
        savedChunks.push(savedChunk);
      }

      return savedChunks;
    } catch (error) {
      console.error('Failed to chunk content:', error);
      throw new Error('Failed to chunk content');
    }
  }

  /**
   * Search knowledge base using semantic search (would use vector embeddings in production)
   */
  async searchKnowledge(params: SearchKnowledgeParams): Promise<{
    sources: SelectKnowledgeSource[];
    chunks: SelectKnowledgeChunk[];
  }> {
    try {
      // In a real implementation, this would use vector similarity search
      // For now, we'll do simple filtering

      // This is a placeholder - in production, you would:
      // 1. Convert query to embedding using OpenAI embeddings
      // 2. Perform vector similarity search in database
      // 3. Return most relevant chunks

      // For now, return empty results with proper structure
      return {
        sources: [],
        chunks: [],
      };
    } catch (error) {
      console.error('Failed to search knowledge:', error);
      throw new Error('Failed to search knowledge base');
    }
  }

  /**
   * Generate content using RAG (Retrieval Augmented Generation)
   */
  async generateWithRAG(params: RAGGenerationParams): Promise<{
    content: string;
    sources: SelectKnowledgeSource[];
    confidence: number;
  }> {
    try {
      // In a real implementation, this would:
      // 1. Search knowledge base for relevant chunks
      // 2. Construct context from chunks
      // 3. Generate content using OpenAI with context
      // 4. Return generated content with sources

      // Placeholder response
      const response = {
        content: `Generated content based on: "${params.prompt}"\n\nThis is a placeholder. In production, this would use RAG to generate content from the knowledge base.`,
        sources: [],
        confidence: 0.75,
      };

      return response;
    } catch (error) {
      console.error('Failed to generate with RAG:', error);
      throw new Error('Failed to generate content with RAG');
    }
  }

  /**
   * Get knowledge sources for a user
   */
  async getUserKnowledgeSources(userId: string): Promise<SelectKnowledgeSource[]> {
    return await storage.getKnowledgeSourcesByUserId(userId);
  }

  /**
   * Get chunks for a specific source
   */
  async getSourceChunks(sourceId: string): Promise<SelectKnowledgeChunk[]> {
    return await storage.getKnowledgeChunksBySourceId(sourceId);
  }

  /**
   * Update knowledge source
   */
  async updateKnowledgeSource(
    sourceId: string,
    updates: Partial<InsertKnowledgeSource>
  ): Promise<SelectKnowledgeSource | null> {
    return await storage.updateKnowledgeSource(sourceId, updates);
  }

  /**
   * Get knowledge statistics for a user
   */
  async getKnowledgeStats(userId: string): Promise<{
    totalSources: number;
    totalChunks: number;
    totalWordCount: number;
    sourcesByType: Record<string, number>;
    avgCredibilityScore: number;
    processingStatus: Record<string, number>;
  }> {
    try {
      const sources = await storage.getKnowledgeSourcesByUserId(userId);
      
      const stats = {
        totalSources: sources.length,
        totalChunks: 0,
        totalWordCount: 0,
        sourcesByType: {} as Record<string, number>,
        avgCredibilityScore: 0,
        processingStatus: {} as Record<string, number>,
      };

      // Calculate metrics
      for (const source of sources) {
        // Count by type
        stats.sourcesByType[source.sourceType] = (stats.sourcesByType[source.sourceType] || 0) + 1;
        
        // Count by status
        stats.processingStatus[source.status] = (stats.processingStatus[source.status] || 0) + 1;
        
        // Get chunk count and word count for this source
        const chunks = await storage.getKnowledgeChunksBySourceId(source.id);
        stats.totalChunks += chunks.length;
        
        // Get word count from metadata
        const metadata = source.metadata as any;
        if (metadata && typeof metadata.wordCount === 'number') {
          stats.totalWordCount += metadata.wordCount;
        }
      }

      // Calculate average credibility score
      if (sources.length > 0) {
        const totalScore = sources.reduce((sum, s) => {
          const score = s.credibilityScore ? parseFloat(s.credibilityScore.toString()) : 0;
          return sum + score;
        }, 0);
        stats.avgCredibilityScore = totalScore / sources.length;
      }

      return stats;
    } catch (error) {
      console.error('Failed to get knowledge stats:', error);
      throw new Error('Failed to get knowledge statistics');
    }
  }

  /**
   * Auto-ingest from URL (would use web scraping in production)
   */
  async ingestFromUrl(userId: string, url: string, category?: string): Promise<SelectKnowledgeSource> {
    try {
      // In a real implementation, this would:
      // 1. Fetch content from URL
      // 2. Extract text content
      // 3. Determine source type
      // 4. Call ingestKnowledge

      // Placeholder
      return await this.ingestKnowledge({
        userId,
        title: 'Content from ' + url,
        sourceType: 'website',
        url,
        content: 'Placeholder content. In production, this would scrape the URL.',
        category: category || 'general',
      });
    } catch (error) {
      console.error('Failed to ingest from URL:', error);
      throw new Error('Failed to ingest content from URL');
    }
  }
}

export const knowledgeService = new KnowledgeService();
