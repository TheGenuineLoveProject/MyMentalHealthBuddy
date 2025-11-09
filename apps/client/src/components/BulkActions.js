import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Bulk Actions Component
 * Provides select-all, delete, and export functionality for list pages
 */
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Download, Trash2, X } from 'lucide-react';
export function BulkActions({ items, selectedIds, onSelectionChange, onDelete, onExport, itemName = 'item', }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const allIds = items
        .map((item) => item.id?.toString())
        .filter((id) => Boolean(id));
    const isAllSelected = selectedIds.length === items.length && items.length > 0;
    const isSomeSelected = selectedIds.length > 0 && selectedIds.length < items.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            onSelectionChange([]);
        }
        else {
            onSelectionChange(allIds);
        }
    };
    const handleDelete = async () => {
        if (!onDelete || selectedIds.length === 0)
            return;
        const confirmed = window.confirm(`Are you sure you want to delete ${selectedIds.length} ${itemName}${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`);
        if (!confirmed)
            return;
        setIsDeleting(true);
        try {
            await onDelete(selectedIds);
            onSelectionChange([]);
        }
        catch (error) {
            console.error('Bulk delete failed:', error);
            alert(`Failed to delete ${itemName}s. Please try again.`);
        }
        finally {
            setIsDeleting(false);
        }
    };
    const handleExport = async (format) => {
        if (!onExport)
            return;
        setIsExporting(true);
        try {
            await onExport(selectedIds, format);
        }
        catch (error) {
            console.error('Bulk export failed:', error);
            alert(`Failed to export ${itemName}s. Please try again.`);
        }
        finally {
            setIsExporting(false);
        }
    };
    if (items.length === 0)
        return null;
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 flex flex-wrap items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Checkbox, { checked: isAllSelected, indeterminate: isSomeSelected, onChange: handleSelectAll, "aria-label": isAllSelected ? 'Deselect all' : 'Select all', "data-testid": "checkbox-select-all" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: selectedIds.length > 0
                            ? `${selectedIds.length} selected`
                            : `Select all (${items.length})` })] }), selectedIds.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-6 w-px bg-gray-300 dark:bg-gray-600" }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => onSelectionChange([]), "data-testid": "button-clear-selection", "aria-label": "Clear selection", children: [_jsx(X, { className: "h-4 w-4 mr-1" }), "Clear"] }), onDelete && (_jsxs(Button, { variant: "danger", size: "sm", onClick: handleDelete, disabled: isDeleting, "data-testid": "button-bulk-delete", "aria-label": `Delete ${selectedIds.length} ${itemName}${selectedIds.length > 1 ? 's' : ''}`, children: [_jsx(Trash2, { className: "h-4 w-4 mr-1" }), isDeleting ? 'Deleting...' : 'Delete'] })), onExport && (_jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "secondary", size: "sm", onClick: () => handleExport('csv'), disabled: isExporting, "data-testid": "button-bulk-export-csv", "aria-label": "Export as CSV", children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "CSV"] }), _jsxs(Button, { variant: "secondary", size: "sm", onClick: () => handleExport('json'), disabled: isExporting, "data-testid": "button-bulk-export-json", "aria-label": "Export as JSON", children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "JSON"] })] }))] }))] }));
}
export function ItemCheckbox({ id, checked, onChange, ariaLabel }) {
    return (_jsx(Checkbox, { checked: checked, onChange: onChange, "aria-label": ariaLabel || `Select item ${id}`, "data-testid": `checkbox-item-${id}`, onClick: (e) => e.stopPropagation() }));
}
