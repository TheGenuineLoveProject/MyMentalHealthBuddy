import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { Search, Filter, Save, Clock, X, TrendingUp, Sparkles } from 'lucide-react';

/**
 * Advanced Search System with Backend API Integration
 * Full-text search with autocomplete, trending, and saved searches
 */

interface SearchResult {
  id: string;
  type: 'journal' | 'mood' | 'resource' | 'message' | 'knowledge';
  title: string;
  content: string;
  excerpt: string;
  relevance: number;
  createdAt: Date;
  metadata?: Record<string, any>;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  executionTime: number;
  suggestions?: string[];
}

export function AdvancedSearchWithAPI() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { toast } = useToast();

  // Debounce search query for autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Main search query
  const { data: searchData, isLoading: isSearching, refetch } = useQuery<SearchResponse>({
    queryKey: ['/api/search', debouncedQuery, selectedTypes],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('q', debouncedQuery);
      if (selectedTypes.length > 0) {
        params.set('types', selectedTypes.join(','));
      }
      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: debouncedQuery.length >= 2,
  });

  // Autocomplete suggestions
  const { data: autocompleteData } = useQuery<{ suggestions: string[] }>({
    queryKey: ['/api/search/autocomplete', query],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query });
      const response = await fetch(`/api/search/autocomplete?${params.toString()}`);
      if (!response.ok) throw new Error('Autocomplete failed');
      return response.json();
    },
    enabled: query.length >= 2 && query !== debouncedQuery,
  });

  // Trending searches
  const { data: trendingData } = useQuery<{ trending: string[] }>({
    queryKey: ['/api/search/trending'],
    queryFn: async () => {
      const response = await fetch('/api/search/trending');
      if (!response.ok) throw new Error('Trending failed');
      return response.json();
    },
  });

  const handleSearch = () => {
    if (query.trim().length < 2) {
      toast({
        title: 'Query Too Short',
        description: 'Please enter at least 2 characters',
        variant: 'destructive',
      });
      return;
    }
    refetch();
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const typeFilters = [
    { id: 'journal', label: 'Journals', icon: '📓' },
    { id: 'mood', label: 'Moods', icon: '😊' },
    { id: 'resource', label: 'Resources', icon: '🆘' },
    { id: 'message', label: 'Messages', icon: '💬' },
    { id: 'knowledge', label: 'Knowledge', icon: '📚' },
  ];

  const getTypeIcon = (type: string) => {
    const filter = typeFilters.find(f => f.id === type);
    return filter?.icon || '📄';
  };

  return (
    <div className="space-y-4">
      {/* Search Input with Autocomplete */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search journals, moods, resources..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none"
              data-testid="input-search-api"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                data-testid="button-clear-search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {/* Autocomplete Dropdown */}
            {autocompleteData && autocompleteData.suggestions.length > 0 && query.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10">
                {autocompleteData.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                    data-testid={`autocomplete-${i}`}
                  >
                    <Sparkles className="h-3 w-3 inline mr-2 text-primary" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button onClick={handleSearch} disabled={isSearching} data-testid="button-search-api">
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-filters-api"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {selectedTypes.length > 0 && (
              <Badge variant="primary" className="ml-2 px-1.5 py-0.5 text-xs">
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Type Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <label className="text-sm font-medium mb-2 block">Content Types</label>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map(type => (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedTypes.includes(type.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  data-testid={`filter-type-${type.id}`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Search Results */}
      {searchData && searchData.results.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {searchData.total} Results for "{searchData.query}"
            </h3>
            <Badge variant="gray" className="text-xs">
              {searchData.executionTime}ms
            </Badge>
          </div>
          
          <div className="space-y-3">
            {searchData.results.map((result) => (
              <div
                key={result.id}
                className="p-3 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors"
                data-testid={`result-${result.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getTypeIcon(result.type)}</span>
                      <h4 className="font-medium">{result.title}</h4>
                      <Badge variant="gray" size="sm">{result.type}</Badge>
                      <Badge variant="primary" size="sm">
                        {Math.round(result.relevance * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.excerpt}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {searchData && searchData.results.length === 0 && debouncedQuery.length >= 2 && (
        <Card className="p-8 text-center">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground">
            Try different keywords or remove some filters
          </p>
        </Card>
      )}

      {/* Trending Searches */}
      {!searchData && trendingData && (
        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending Topics
          </h4>
          <div className="flex flex-wrap gap-2">
            {trendingData.trending.map((topic, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(topic);
                  handleSearch();
                }}
                className="px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid={`trending-${i}`}
              >
                {topic}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
