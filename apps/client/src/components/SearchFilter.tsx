import { useState } from 'react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: FilterState) => void;
  availableFilters?: {
    types?: string[];
    statuses?: string[];
    tags?: string[];
  };
}

interface FilterState {
  types: string[];
  statuses: string[];
  tags: string[];
}

/**
 * Advanced Search and Filter Component
 * Multi-faceted filtering with search
 */
export function SearchFilter({ onSearch, onFilter, availableFilters }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    statuses: [],
    tags: [],
  });

  const defaultFilters = {
    types: ['blog', 'video', 'podcast', 'infographic'],
    statuses: ['draft', 'in_review', 'approved', 'scheduled', 'published'],
    tags: ['mindfulness', 'anxiety', 'stress', 'wellness', 'mental-health'],
  };

  const activeFilters = availableFilters || defaultFilters;

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const newFilters = { ...prev, [category]: updated };
      onFilter?.(newFilters);
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const emptyFilters = { types: [], statuses: [], tags: [] };
    setFilters(emptyFilters);
    onFilter?.(emptyFilters);
  };

  const activeFilterCount =
    filters.types.length + filters.statuses.length + filters.tags.length;

  return (
    <div className="space-y-4" data-testid="search-filter">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search content..."
            data-testid="input-search"
          />
        </div>
        <Button onClick={handleSearch} data-testid="button-search">
          Search
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          data-testid="button-toggle-filters"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-2" data-testid="badge-filter-count">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-muted/50" data-testid="panel-filters">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                data-testid="button-clear-filters"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Type Filters */}
            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {activeFilters.types?.map((type) => (
                  <Badge
                    key={type}
                    variant={filters.types.includes(type) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleFilter('types', type)}
                    data-testid={`filter-type-${type}`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {activeFilters.statuses?.map((status) => (
                  <Badge
                    key={status}
                    variant={filters.statuses.includes(status) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleFilter('statuses', status)}
                    data-testid={`filter-status-${status}`}
                  >
                    {status.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tag Filters */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {activeFilters.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleFilter('tags', tag)}
                    data-testid={`filter-tag-${tag}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="flex gap-2 flex-wrap" data-testid="active-filters">
          {[...filters.types, ...filters.statuses, ...filters.tags].map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1"
              data-testid={`active-filter-${filter}`}
            >
              {filter}
              <button
                onClick={() => {
                  if (filters.types.includes(filter)) toggleFilter('types', filter);
                  if (filters.statuses.includes(filter)) toggleFilter('statuses', filter);
                  if (filters.tags.includes(filter)) toggleFilter('tags', filter);
                }}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
