import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { Search, Filter, Save, Clock, X, TrendingUp } from 'lucide-react';
export function AdvancedSearch({ onSearch }) {
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({});
    const [isSearching, setIsSearching] = useState(false);
    const { success, error } = useToast();
    const savedSearches = [
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
        }
        catch (err) {
            error('Search Failed', 'Unable to complete search');
        }
        finally {
            setIsSearching(false);
        }
    };
    const loadSavedSearch = (search) => {
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
    const toggleFilter = (category, value) => {
        setFilters(prev => {
            const current = prev[category] || [];
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
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" }), _jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSearch(), placeholder: "Search content, topics, tags...", className: "w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none", "data-testid": "input-search" }), query && (_jsx("button", { onClick: () => setQuery(''), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "data-testid": "button-clear-search", children: _jsx(X, { className: "h-4 w-4" }) }))] }), _jsx(Button, { onClick: handleSearch, disabled: isSearching, "data-testid": "button-search", children: isSearching ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" })) : (_jsx(Search, { className: "h-4 w-4" })) }), _jsxs(Button, { variant: "ghost", onClick: () => setShowFilters(!showFilters), "data-testid": "button-filters", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), "Filters", Object.values(filters).flat().length > 0 && (_jsx(Badge, { variant: "primary", className: "ml-2 px-1.5 py-0.5 text-xs", children: Object.values(filters).flat().length }))] }), _jsx(Button, { variant: "secondary", onClick: saveCurrentSearch, "data-testid": "button-save-search", children: _jsx(Save, { className: "h-4 w-4" }) })] }), showFilters && (_jsx("div", { className: "mt-4 pt-4 border-t space-y-4", children: Object.entries(filterOptions).map(([category, options]) => (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block capitalize", children: category }), _jsx("div", { className: "flex flex-wrap gap-2", children: options.map(option => (_jsx("button", { onClick: () => toggleFilter(category, option), className: `px-3 py-1.5 rounded-full text-sm transition-all ${(filters[category] || []).includes(option)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'}`, "data-testid": `filter-${category}-${option}`, children: option }, option))) })] }, category))) }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Card, { className: "p-4", children: [_jsxs("h4", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(Save, { className: "h-4 w-4 text-primary" }), "Saved Searches"] }), _jsx("div", { className: "space-y-2", children: savedSearches.map(search => (_jsxs("button", { onClick: () => loadSavedSearch(search), className: "w-full text-left p-2 rounded hover:bg-muted/50 transition-colors", "data-testid": `saved-search-${search.id}`, children: [_jsx("div", { className: "text-sm font-medium", children: search.name }), _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Used ", search.lastUsed] })] }, search.id))) })] }), _jsxs(Card, { className: "p-4", children: [_jsxs("h4", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4 text-primary" }), "Recent Searches"] }), _jsx("div", { className: "space-y-2", children: recentSearches.map((search, i) => (_jsx("button", { onClick: () => setQuery(search), className: "w-full text-left p-2 rounded hover:bg-muted/50 transition-colors text-sm", "data-testid": `recent-search-${i}`, children: search }, i))) })] }), _jsxs(Card, { className: "p-4", children: [_jsxs("h4", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-primary" }), "Trending Topics"] }), _jsx("div", { className: "space-y-2", children: trendingSearches.map((search, i) => (_jsx("button", { onClick: () => setQuery(search), className: "w-full text-left p-2 rounded hover:bg-muted/50 transition-colors text-sm", "data-testid": `trending-search-${i}`, children: search }, i))) })] })] })] }));
}
