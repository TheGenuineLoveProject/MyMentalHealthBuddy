import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { Search, Filter, Save, Clock, X, TrendingUp } from 'lucide-react';

/**
 * Advanced Search System
 * Full-text search with filters, saved searches, and history
 */

interface SearchFilter {
  type?: string[];
  status?: string[];
  dateRange?: { start: Date; end: Date };
  tags?: string[];
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilter;
  lastUsed?: string;
}

interface AdvancedSearchProps {
  onSearch?: (query: string, filters: SearchFilter) => void;
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({});
  const [isSearching, setIsSearching] = useState(false);
  const { success, error } = useToast();

  const savedSearches: SavedSearch[] = [
    {
      id: '1',
      name: 'Published Blog Posts',
      query: '',
      filters: { type: ['blog'], status: ['published'] },
      lastUsed: '2 days ago',
    },
    {
      id: '2',
      name: 'Scheduled Content',
      query: '',
      filters: { status: ['scheduled'] },
      lastUsed: '1 week ago',
    },
    {
      id: '3',
      name: 'Mental Health Topics',
      query: 'mental health',
      filters: { tags: ['wellness', 'therapy'] },
      lastUsed: '3 days ago',
    },
  ];

  const recentSearches = [
    'anxiety management techniques',
    'mindfulness meditation',
    'stress relief exercises',
    'sleep improvement tips',
  ];

  const trendingSearches = [
    'burnout prevention',
    'emotional wellness',
    'self-care routine',
    'mental health awareness',
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (onSearch) {
        onSearch(query, filters);
      }

      success('Search Complete', `Found results for "${query}"`);
    } catch (err) {
      error('Search Failed', 'Unable to complete search');
    } finally {
      setIsSearching(false);
    }
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setQuery(search.query);
    setFilters(search.filters);
    success('Search Loaded', `Applied "${search.name}"`);
  };

  const saveCurrentSearch = () => {
    if (!query && Object.keys(filters).length === 0) {
      error('Nothing to Save', 'Enter a search query or add filters first');
      return;
    }

    success('Search Saved', 'Search has been saved to your library');
  };

  const toggleFilter = (category: keyof SearchFilter, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const filterOptions = {
    type: ['blog', 'video', 'podcast', 'infographic', 'social'],
    status: ['draft', 'published', 'scheduled', 'archived'],
    tags: ['wellness', 'therapy', 'mindfulness', 'anxiety', 'depression'],
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search content, topics, tags..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none"
              data-testid="input-search"
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
          </div>
          <Button onClick={handleSearch} disabled={isSearching} data-testid="button-search">
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-filters"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {Object.values(filters).flat().length > 0 && (
              <Badge variant="primary" className="ml-2 px-1.5 py-0.5 text-xs">
                {Object.values(filters).flat().length}
              </Badge>
            )}
          </Button>
          <Button variant="secondary" onClick={saveCurrentSearch} data-testid="button-save-search">
            <Save className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category}>
                <label className="text-sm font-medium mb-2 block capitalize">{category}</label>
                <div className="flex flex-wrap gap-2">
                  {options.map(option => (
                    <button
                      key={option}
                      onClick={() => toggleFilter(category as keyof SearchFilter, option)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        (filters[category as keyof SearchFilter] as string[] || []).includes(option)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      data-testid={`filter-${category}-${option}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Saved Searches */}
        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Save className="h-4 w-4 text-primary" />
            Saved Searches
          </h4>
          <div className="space-y-2">
            {savedSearches.map(search => (
              <button
                key={search.id}
                onClick={() => loadSavedSearch(search)}
                className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors"
                data-testid={`saved-search-${search.id}`}
              >
                <div className="text-sm font-medium">{search.name}</div>
                <div className="text-xs text-muted-foreground">Used {search.lastUsed}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Searches */}
        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent Searches
          </h4>
          <div className="space-y-2">
            {recentSearches.map((search, i) => (
              <button
                key={i}
                onClick={() => setQuery(search)}
                className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors text-sm"
                data-testid={`recent-search-${i}`}
              >
                {search}
              </button>
            ))}
          </div>
        </Card>

        {/* Trending Searches */}
        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending Topics
          </h4>
          <div className="space-y-2">
            {trendingSearches.map((search, i) => (
              <button
                key={i}
                onClick={() => setQuery(search)}
                className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors text-sm"
                data-testid={`trending-search-${i}`}
              >
                {search}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
