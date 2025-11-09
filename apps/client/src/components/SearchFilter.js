import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Search, Filter, X } from 'lucide-react';
/**
 * Advanced Search and Filter Component
 * Multi-faceted filtering with search
 */
export function SearchFilter({ onSearch, onFilter, availableFilters }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
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
    const toggleFilter = (category, value) => {
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
    const activeFilterCount = filters.types.length + filters.statuses.length + filters.tags.length;
    return (_jsxs("div", { className: "space-y-4", "data-testid": "search-filter", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSearch(), className: "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "Search content...", "data-testid": "input-search" })] }), _jsx(Button, { onClick: handleSearch, "data-testid": "button-search", children: "Search" }), _jsxs(Button, { variant: "ghost", onClick: () => setShowFilters(!showFilters), "data-testid": "button-toggle-filters", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), "Filters", activeFilterCount > 0 && (_jsx(Badge, { variant: "primary", className: "ml-2", "data-testid": "badge-filter-count", children: activeFilterCount }))] })] }), showFilters && (_jsxs("div", { className: "p-4 border rounded-lg bg-muted/50", "data-testid": "panel-filters", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold", children: "Filters" }), activeFilterCount > 0 && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: clearAllFilters, "data-testid": "button-clear-filters", children: [_jsx(X, { className: "h-4 w-4 mr-1" }), "Clear All"] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Content Type" }), _jsx("div", { className: "flex flex-wrap gap-2", children: activeFilters.types?.map((type) => (_jsx("button", { className: `px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${filters.types.includes(type)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'}`, onClick: () => toggleFilter('types', type), "data-testid": `filter-type-${type}`, children: type }, type))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Status" }), _jsx("div", { className: "flex flex-wrap gap-2", children: activeFilters.statuses?.map((status) => (_jsx("button", { className: `px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${filters.statuses.includes(status)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'}`, onClick: () => toggleFilter('statuses', status), "data-testid": `filter-status-${status}`, children: status.replace('_', ' ') }, status))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Tags" }), _jsx("div", { className: "flex flex-wrap gap-2", children: activeFilters.tags?.map((tag) => (_jsx("button", { className: `px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${filters.tags.includes(tag)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'}`, onClick: () => toggleFilter('tags', tag), "data-testid": `filter-tag-${tag}`, children: tag }, tag))) })] })] })] })), activeFilterCount > 0 && !showFilters && (_jsx("div", { className: "flex gap-2 flex-wrap", "data-testid": "active-filters", children: [...filters.types, ...filters.statuses, ...filters.tags].map((filter) => (_jsxs(Badge, { variant: "primary", className: "flex items-center gap-1", "data-testid": `active-filter-${filter}`, children: [filter, _jsx("button", { onClick: () => {
                                if (filters.types.includes(filter))
                                    toggleFilter('types', filter);
                                if (filters.statuses.includes(filter))
                                    toggleFilter('statuses', filter);
                                if (filters.tags.includes(filter))
                                    toggleFilter('tags', filter);
                            }, className: "hover:text-destructive", children: _jsx(X, { className: "h-3 w-3" }) })] }, filter))) }))] }));
}
