import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced Data Table Component
 * Sortable, filterable, paginated table with selection
 */
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { Checkbox } from '@/components/Checkbox';
export function DataTable({ data, columns, keyField, selectable = false, onSelectionChange, pageSize = 10, searchable = true, emptyMessage = 'No data available', 'data-testid': testId, }) {
    const [sortConfig, setSortConfig] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState(new Set());
    // Process data
    const processedData = useMemo(() => {
        let result = [...data];
        // Search
        if (searchQuery) {
            result = result.filter((row) => columns.some((col) => {
                const value = typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : row[col.accessor];
                return String(value).toLowerCase().includes(searchQuery.toLowerCase());
            }));
        }
        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = getColumnValue(a, sortConfig.key, columns);
                const bVal = getColumnValue(b, sortConfig.key, columns);
                if (aVal < bVal)
                    return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal)
                    return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [data, columns, searchQuery, sortConfig]);
    // Pagination
    const totalPages = Math.ceil(processedData.length / pageSize);
    const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const handleSort = (columnId) => {
        setSortConfig((current) => {
            if (!current || current.key !== columnId) {
                return { key: columnId, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key: columnId, direction: 'desc' };
            }
            return null;
        });
    };
    const handleSelectAll = (checked) => {
        const newSelected = new Set(selected);
        if (checked) {
            // Add all current page rows to selection
            paginatedData.forEach((row) => newSelected.add(row[keyField]));
        }
        else {
            // Remove all current page rows from selection
            paginatedData.forEach((row) => newSelected.delete(row[keyField]));
        }
        setSelected(newSelected);
        // Pass full selection set, not just current page
        onSelectionChange?.(data.filter((r) => newSelected.has(r[keyField])));
    };
    const handleSelectRow = (row, checked) => {
        const newSelected = new Set(selected);
        if (checked) {
            newSelected.add(row[keyField]);
        }
        else {
            newSelected.delete(row[keyField]);
        }
        setSelected(newSelected);
        onSelectionChange?.(data.filter((r) => newSelected.has(r[keyField])));
    };
    const allSelected = paginatedData.length > 0 && paginatedData.every((row) => selected.has(row[keyField]));
    const someSelected = paginatedData.some((row) => selected.has(row[keyField]));
    return (_jsxs("div", { className: "w-full", "data-testid": testId, children: [searchable && (_jsx("div", { className: "mb-4", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }, placeholder: "Search...", className: "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800", "data-testid": "input-table-search" })] }) })), _jsx("div", { className: "overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-900", children: _jsxs("tr", { children: [selectable && (_jsx("th", { className: "w-12 px-4 py-3", children: _jsx(Checkbox, { checked: allSelected, indeterminate: !allSelected && someSelected, onChange: handleSelectAll, "data-testid": "checkbox-select-all" }) })), columns.map((column) => (_jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold", style: { width: column.width }, children: column.sortable ? (_jsxs("button", { onClick: () => handleSort(column.id), className: "flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors", "data-testid": `button-sort-${column.id}`, children: [column.header, sortConfig?.key === column.id ? (sortConfig.direction === 'asc' ? (_jsx(ChevronUp, { className: "h-4 w-4" })) : (_jsx(ChevronDown, { className: "h-4 w-4" }))) : (_jsx(ChevronsUpDown, { className: "h-4 w-4 opacity-40" }))] })) : (column.header) }, column.id)))] }) }), _jsx("tbody", { children: paginatedData.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + (selectable ? 1 : 0), className: "px-4 py-12 text-center text-gray-500", children: emptyMessage }) })) : (paginatedData.map((row) => (_jsxs("tr", { className: "border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors", "data-testid": `table-row-${row[keyField]}`, children: [selectable && (_jsx("td", { className: "px-4 py-3", children: _jsx(Checkbox, { checked: selected.has(row[keyField]), onChange: (checked) => handleSelectRow(row, checked), "data-testid": `checkbox-row-${row[keyField]}` }) })), columns.map((column) => {
                                        const value = getColumnValue(row, column.id, columns);
                                        return (_jsx("td", { className: "px-4 py-3 text-sm", children: column.render ? column.render(value, row) : value }, column.id));
                                    })] }, String(row[keyField]))))) })] }) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between mt-4", children: [_jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Showing ", (currentPage - 1) * pageSize + 1, " to", ' ', Math.min(currentPage * pageSize, processedData.length), " of", ' ', processedData.length, " results"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800", "data-testid": "button-prev-page", children: "Previous" }), _jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `px-3 py-1 rounded ${page === currentPage
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`, "data-testid": `button-page-${page}`, children: page }, page))) }), _jsx("button", { onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800", "data-testid": "button-next-page", children: "Next" })] })] }))] }));
}
function getColumnValue(row, columnId, columns) {
    const column = columns.find((c) => c.id === columnId);
    if (!column)
        return '';
    return typeof column.accessor === 'function'
        ? column.accessor(row)
        : row[column.accessor];
}
