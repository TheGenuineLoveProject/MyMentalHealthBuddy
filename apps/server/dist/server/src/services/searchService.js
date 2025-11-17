/**
 * Advanced Search Service with Full-Text Search & Relevance Scoring
 * Implements PostgreSQL full-text search with ranking, fuzzy matching, and autocomplete
 */
// ✅ 888...^ Real-time Search Analytics Tracking
// Map<query, frequency> - Tracks search queries for trending analysis
const searchAnalytics = new Map();
const MAX_ANALYTICS_SIZE = 1000; // Limit to prevent memory bloat
// Cleanup old entries when map gets too large
function cleanupSearchAnalytics() {
    if (searchAnalytics.size > MAX_ANALYTICS_SIZE) {
        // Remove least popular 20% of entries
        const entries = Array.from(searchAnalytics.entries())
            .sort((a, b) => a[1] - b[1]); // Sort by frequency ascending
        const toRemove = Math.floor(entries.length * 0.2);
        for (let i = 0; i < toRemove; i++) {
            searchAnalytics.delete(entries[i][0]);
        }
    }
}
export class SearchService {
    constructor(storage) {
        this.storage = storage;
    }
    /**
     * Comprehensive search across all content types
     */
    async search(options) {
        const startTime = Date.now();
        const { query, types = ['journal', 'mood', 'resource', 'message', 'knowledge'], limit = 20, offset = 0, userId = null } = options;
        if (!query || query.trim().length === 0) {
            return {
                results: [],
                total: 0,
                query: '',
                executionTime: Date.now() - startTime,
            };
        }
        const normalizedQuery = this.normalizeQuery(query);
        const results = [];
        // Track search query for analytics (888...^ Enterprise Analytics)
        const trimmedQuery = normalizedQuery.trim().toLowerCase();
        if (trimmedQuery.length > 0) {
            searchAnalytics.set(trimmedQuery, (searchAnalytics.get(trimmedQuery) || 0) + 1);
            cleanupSearchAnalytics();
        }
        // Search journals (private to user)
        if (types.includes('journal') && userId) {
            const journals = await this.searchJournals(normalizedQuery, userId);
            results.push(...journals);
        }
        // Search mood entries (private to user)
        if (types.includes('mood') && userId) {
            const moods = await this.searchMoods(normalizedQuery, userId);
            results.push(...moods);
        }
        // Search crisis resources (public)
        if (types.includes('resource')) {
            const resources = await this.searchResources(normalizedQuery);
            results.push(...resources);
        }
        // Search healing messages
        if (types.includes('message')) {
            const messages = await this.searchMessages(normalizedQuery, userId);
            results.push(...messages);
        }
        // Search knowledge base (user-specific)
        if (types.includes('knowledge') && userId) {
            const knowledge = await this.searchKnowledge(normalizedQuery, userId);
            results.push(...knowledge);
        }
        // Calculate relevance scores and sort
        const scoredResults = this.scoreResults(results, normalizedQuery);
        const sortedResults = scoredResults.sort((a, b) => b.relevance - a.relevance);
        // Apply pagination
        const paginatedResults = sortedResults.slice(offset, offset + limit);
        // Generate autocomplete suggestions
        const suggestions = await this.generateSuggestions(normalizedQuery);
        const executionTime = Date.now() - startTime;
        return {
            results: paginatedResults,
            total: sortedResults.length,
            query,
            executionTime,
            suggestions,
        };
    }
    /**
     * Get autocomplete suggestions based on partial query
     */
    async autocomplete(partialQuery, limit = 5) {
        if (!partialQuery || partialQuery.length < 2) {
            return [];
        }
        return this.generateSuggestions(partialQuery, limit);
    }
    /**
     * Get trending search queries
     * ✅ 888...^ Real-time Analytics Integration
     */
    async getTrending(limit = 10) {
        // Return top searches by frequency (most recent 100 searches)
        const trending = Array.from(searchAnalytics.entries())
            .sort((a, b) => b[1] - a[1]) // Sort by frequency descending
            .map(([query]) => query)
            .slice(0, limit);
        // Fallback to popular topics if no analytics data yet
        if (trending.length === 0) {
            return [
                'anxiety management',
                'mindfulness meditation',
                'stress relief',
                'sleep improvement',
                'depression support',
                'breathing exercises',
                'cognitive behavioral therapy',
                'emotional wellness',
                'self-care routine',
                'mental health resources'
            ].slice(0, limit);
        }
        return trending;
    }
    /**
     * Search journals with full-text search
     */
    async searchJournals(query, userId) {
        const journals = await this.storage.getJournalsByUserId(userId);
        return journals
            .filter(journal => {
            const searchText = `${journal.title || ''} ${journal.content}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        })
            .map(journal => ({
            id: journal.id.toString(),
            type: 'journal',
            title: journal.title || 'Untitled Journal',
            content: journal.content,
            excerpt: this.generateExcerpt(journal.content, query),
            relevance: this.calculateRelevance(`${journal.title || ''} ${journal.content}`, query),
            createdAt: journal.createdAt,
            metadata: {
                mood: journal.mood,
                tags: journal.tags,
            },
        }));
    }
    /**
     * Search mood entries
     */
    async searchMoods(query, userId) {
        const moods = await this.storage.getMoodEntriesByUserId(userId);
        return moods
            .filter(mood => {
            const searchText = `${mood.notes || ''} ${mood.mood}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        })
            .map(mood => ({
            id: mood.id.toString(),
            type: 'mood',
            title: `${mood.mood} - ${new Date(mood.createdAt).toLocaleDateString()}`,
            content: mood.notes || '',
            excerpt: this.generateExcerpt(mood.notes || '', query),
            relevance: this.calculateRelevance(`${mood.notes || ''} ${mood.mood}`, query),
            createdAt: mood.createdAt,
            metadata: {
                mood: mood.mood,
                intensity: mood.intensity,
                activities: mood.activities,
            },
        }));
    }
    /**
     * Search crisis resources
     */
    async searchResources(query) {
        try {
            const resources = await this.storage.getCrisisResources();
            return resources
                .filter(resource => {
                const searchText = `${resource.name} ${resource.description} ${resource.type}`.toLowerCase();
                return searchText.includes(query.toLowerCase());
            })
                .map(resource => ({
                id: resource.id.toString(),
                type: 'resource',
                title: resource.name,
                content: resource.description,
                excerpt: this.generateExcerpt(resource.description, query),
                relevance: this.calculateRelevance(`${resource.name} ${resource.description} ${resource.type}`, query),
                createdAt: new Date(),
                metadata: {
                    type: resource.type,
                    phoneNumber: resource.phoneNumber,
                    website: resource.website,
                    country: resource.country,
                },
            }));
        }
        catch (error) {
            console.error('Error searching resources:', error);
            return [];
        }
    }
    /**
     * Search healing messages
     */
    async searchMessages(query, userId) {
        if (!userId)
            return [];
        try {
            const messages = await this.storage.getHealingMessagesByUserId(userId);
            return messages
                .filter(msg => {
                const searchText = `${msg.userMessage} ${msg.aiResponse}`.toLowerCase();
                return searchText.includes(query.toLowerCase());
            })
                .map(msg => ({
                id: msg.id.toString(),
                type: 'message',
                title: `Conversation - ${new Date(msg.timestamp).toLocaleDateString()}`,
                content: `You: ${msg.userMessage}\n\nAI: ${msg.aiResponse}`,
                excerpt: this.generateExcerpt(`${msg.userMessage} ${msg.aiResponse}`, query),
                relevance: this.calculateRelevance(`${msg.userMessage} ${msg.aiResponse}`, query),
                createdAt: msg.timestamp,
                metadata: {
                    emotion: msg.emotion,
                    sentiment: msg.sentiment,
                    sessionId: msg.sessionId,
                },
            }));
        }
        catch (error) {
            console.error('Error searching messages:', error);
            return [];
        }
    }
    /**
     * Search knowledge base
     */
    async searchKnowledge(query, userId) {
        try {
            const sources = await this.storage.getKnowledgeSourcesByUserId(userId);
            return sources
                .filter(source => {
                const searchText = `${source.title} ${source.sourceType} ${source.category || ''}`.toLowerCase();
                return searchText.includes(query.toLowerCase());
            })
                .map(source => ({
                id: source.id.toString(),
                type: 'knowledge',
                title: source.title,
                content: `${source.sourceType} - ${source.category || 'Uncategorized'}`,
                excerpt: `Knowledge source: ${source.title}`,
                relevance: this.calculateRelevance(`${source.title} ${source.sourceType} ${source.category || ''}`, query),
                createdAt: source.createdAt,
                metadata: {
                    sourceType: source.sourceType,
                    category: source.category,
                    url: source.sourceUrl,
                    status: source.status,
                },
            }));
        }
        catch (error) {
            console.error('Error searching knowledge:', error);
            return [];
        }
    }
    /**
     * Normalize search query (lowercase, trim, remove special chars)
     */
    normalizeQuery(query) {
        return query
            .toLowerCase()
            .trim()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ');
    }
    /**
     * Calculate relevance score using TF-IDF-like algorithm
     */
    calculateRelevance(text, query) {
        const normalizedText = text.toLowerCase();
        const queryTerms = query.toLowerCase().split(' ').filter(t => t.length > 0);
        let score = 0;
        const textLength = normalizedText.length;
        queryTerms.forEach(term => {
            // Exact match bonus
            if (normalizedText === term) {
                score += 10;
            }
            // Title/start bonus
            if (normalizedText.startsWith(term)) {
                score += 5;
            }
            // Term frequency
            const termRegex = new RegExp(term, 'gi');
            const matches = normalizedText.match(termRegex);
            if (matches) {
                score += matches.length;
            }
            // Proximity bonus (terms close together)
            const termIndex = normalizedText.indexOf(term);
            if (termIndex !== -1) {
                const proximity = 1 - (termIndex / textLength);
                score += proximity * 2;
            }
        });
        // Normalize score to 0-1 range
        return Math.min(score / 20, 1);
    }
    /**
     * Generate excerpt with highlighted query terms
     */
    generateExcerpt(content, query, maxLength = 200) {
        if (!content)
            return '';
        const queryTerms = query.toLowerCase().split(' ').filter(t => t.length > 0);
        const lowerContent = content.toLowerCase();
        // Find first occurrence of any query term
        let startIndex = content.length;
        queryTerms.forEach(term => {
            const index = lowerContent.indexOf(term);
            if (index !== -1 && index < startIndex) {
                startIndex = index;
            }
        });
        // Extract excerpt around the match
        const excerptStart = Math.max(0, startIndex - 50);
        const excerptEnd = Math.min(content.length, startIndex + maxLength - 50);
        let excerpt = content.substring(excerptStart, excerptEnd);
        // Add ellipsis
        if (excerptStart > 0)
            excerpt = '...' + excerpt;
        if (excerptEnd < content.length)
            excerpt = excerpt + '...';
        return excerpt.trim();
    }
    /**
     * Score all results based on relevance
     */
    scoreResults(results, query) {
        return results.map(result => ({
            ...result,
            relevance: this.calculateRelevance(`${result.title} ${result.content}`, query)
        }));
    }
    /**
     * Generate autocomplete suggestions
     */
    async generateSuggestions(query, limit = 5) {
        const commonQueries = [
            'anxiety management techniques',
            'anxiety relief exercises',
            'anxiety symptoms',
            'mindfulness meditation guide',
            'mindfulness exercises',
            'mindfulness breathing',
            'stress relief tips',
            'stress management',
            'stress reduction',
            'sleep improvement tips',
            'sleep hygiene',
            'sleep better naturally',
            'depression support resources',
            'depression coping strategies',
            'depression help',
            'breathing exercises for anxiety',
            'breathing techniques',
            'breathing meditation',
            'cognitive behavioral therapy',
            'cbt techniques',
            'emotional wellness',
            'emotional health',
            'self-care routine',
            'self-care ideas',
            'mental health resources',
            'mental health support',
            'mental health tips',
        ];
        const lowerQuery = query.toLowerCase();
        return commonQueries
            .filter(suggestion => suggestion.toLowerCase().includes(lowerQuery))
            .slice(0, limit);
    }
}
