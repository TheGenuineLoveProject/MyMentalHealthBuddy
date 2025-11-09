import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { Search, Filter, X, TrendingUp, Sparkles } from 'lucide-react';
export function AdvancedSearchWithAPI() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const { success, error } = useToast();
    // Debounce search query for autocomplete
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);
    // Main search query
    const { data: searchData, isLoading: isSearching, refetch } = useQuery({
        queryKey: ['/api/search', debouncedQuery, selectedTypes],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set('q', debouncedQuery);
            if (selectedTypes.length > 0) {
                params.set('types', selectedTypes.join(','));
            }
            const response = await fetch(`/api/search?${params.toString()}`);
            if (!response.ok)
                throw new Error('Search failed');
            return response.json();
        },
        enabled: debouncedQuery.length >= 2,
    });
    // Autocomplete suggestions
    const { data: autocompleteData } = useQuery({
        queryKey: ['/api/search/autocomplete', query],
        queryFn: async () => {
            const params = new URLSearchParams({ q: query });
            const response = await fetch(`/api/search/autocomplete?${params.toString()}`);
            if (!response.ok)
                throw new Error('Autocomplete failed');
            return response.json();
        },
        enabled: query.length >= 2 && query !== debouncedQuery,
    });
    // Trending searches
    const { data: trendingData } = useQuery({
        queryKey: ['/api/search/trending'],
        queryFn: async () => {
            const response = await fetch('/api/search/trending');
            if (!response.ok)
                throw new Error('Trending failed');
            return response.json();
        },
    });
    const handleSearch = () => {
        if (query.trim().length < 2) {
            error('Query Too Short', 'Please enter at least 2 characters');
            return;
        }
        refetch();
    };
    const toggleType = (type) => {
        setSelectedTypes(prev => prev.includes(type)
            ? prev.filter(t => t !== type)
            : [...prev, type]);
    };
    const typeFilters = [
        { id: 'journal', label: 'Journals', icon: '📓' },
        { id: 'mood', label: 'Moods', icon: '😊' },
        { id: 'resource', label: 'Resources', icon: '🆘' },
        { id: 'message', label: 'Messages', icon: '💬' },
        { id: 'knowledge', label: 'Knowledge', icon: '📚' },
    ];
    const getTypeIcon = (type) => {
        const filter = typeFilters.find(f => f.id === type);
        return filter?.icon || '📄';
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" }), _jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSearch(), placeholder: "Search journals, moods, resources...", className: "w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none", "data-testid": "input-search-api" }), query && (_jsx("button", { onClick: () => setQuery(''), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "data-testid": "button-clear-search", children: _jsx(X, { className: "h-4 w-4" }) })), autocompleteData && autocompleteData.suggestions.length > 0 && query.length >= 2 && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10", children: autocompleteData.suggestions.map((suggestion, i) => (_jsxs("button", { onClick: () => {
                                                setQuery(suggestion);
                                                handleSearch();
                                            }, className: "w-full text-left px-4 py-2 hover:bg-muted transition-colors", "data-testid": `autocomplete-${i}`, children: [_jsx(Sparkles, { className: "h-3 w-3 inline mr-2 text-primary" }), suggestion] }, i))) }))] }), _jsx(Button, { onClick: handleSearch, disabled: isSearching, "data-testid": "button-search-api", children: isSearching ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" })) : (_jsx(Search, { className: "h-4 w-4" })) }), _jsxs(Button, { variant: "ghost", onClick: () => setShowFilters(!showFilters), "data-testid": "button-filters-api", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), "Filters", selectedTypes.length > 0 && (_jsx(Badge, { variant: "primary", className: "ml-2 px-1.5 py-0.5 text-xs", children: selectedTypes.length }))] })] }), showFilters && (_jsxs("div", { className: "mt-4 pt-4 border-t", children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Content Types" }), _jsx("div", { className: "flex flex-wrap gap-2", children: typeFilters.map(type => (_jsxs("button", { onClick: () => toggleType(type.id), className: `px-3 py-1.5 rounded-full text-sm transition-all ${selectedTypes.includes(type.id)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'}`, "data-testid": `filter-type-${type.id}`, children: [type.icon, " ", type.label] }, type.id))) })] }))] }), searchData && searchData.results.length > 0 && (_jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "font-semibold", children: [searchData.total, " Results for \"", searchData.query, "\""] }), _jsxs(Badge, { variant: "gray", className: "text-xs", children: [searchData.executionTime, "ms"] })] }), _jsx("div", { className: "space-y-3", children: searchData.results.map((result) => (_jsx("div", { className: "p-3 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors", "data-testid": `result-${result.id}`, children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-lg", children: getTypeIcon(result.type) }), _jsx("h4", { className: "font-medium", children: result.title }), _jsx(Badge, { variant: "gray", size: "sm", children: result.type }), _jsxs(Badge, { variant: "primary", size: "sm", children: [Math.round(result.relevance * 100), "% match"] })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: result.excerpt }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: new Date(result.createdAt).toLocaleDateString() })] }) }) }, result.id))) })] })), searchData && searchData.results.length === 0 && debouncedQuery.length >= 2 && (_jsxs(Card, { className: "p-8 text-center", children: [_jsx(Search, { className: "h-12 w-12 mx-auto text-muted-foreground mb-3" }), _jsx("h3", { className: "font-semibold mb-2", children: "No results found" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Try different keywords or remove some filters" })] })), !searchData && trendingData && (_jsxs(Card, { className: "p-4", children: [_jsxs("h4", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-primary" }), "Trending Topics"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: trendingData.trending.map((topic, i) => (_jsx("button", { onClick: () => {
                                setQuery(topic);
                                handleSearch();
                            }, className: "px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-primary hover:text-primary-foreground transition-colors", "data-testid": `trending-${i}`, children: topic }, i))) })] }))] }));
}
