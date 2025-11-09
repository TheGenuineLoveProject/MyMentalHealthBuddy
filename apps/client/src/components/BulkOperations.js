import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { CheckSquare, Trash2, Calendar, Tag, Copy, Archive } from 'lucide-react';
export function BulkOperations({ items = [], onBulkAction }) {
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    const { success, error } = useToast();
    const defaultItems = items.length > 0 ? items : [
        { id: '1', title: 'Understanding Anxiety', type: 'blog', status: 'published' },
        { id: '2', title: 'Mindfulness Meditation Guide', type: 'video', status: 'draft' },
        { id: '3', title: 'Daily Affirmations', type: 'podcast', status: 'scheduled' },
        { id: '4', title: 'Sleep Better Tonight', type: 'blog', status: 'published' },
        { id: '5', title: 'Stress Management Tips', type: 'infographic', status: 'draft' },
    ];
    const toggleItem = (id) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        }
        else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };
    const toggleAll = () => {
        if (selectedItems.size === defaultItems.length) {
            setSelectedItems(new Set());
        }
        else {
            setSelectedItems(new Set(defaultItems.map(item => item.id)));
        }
    };
    const handleBulkAction = async (action) => {
        if (selectedItems.size === 0) {
            error('No Items Selected', 'Please select items to perform bulk actions');
            return;
        }
        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (onBulkAction) {
                onBulkAction(action, Array.from(selectedItems));
            }
            success('Bulk Action Complete', `${action} applied to ${selectedItems.size} items`);
            setSelectedItems(new Set());
        }
        catch (err) {
            error('Action Failed', 'Unable to complete bulk action');
        }
        finally {
            setIsProcessing(false);
        }
    };
    const bulkActions = [
        { id: 'publish', label: 'Publish', icon: CheckSquare, variant: 'primary' },
        { id: 'schedule', label: 'Schedule', icon: Calendar, variant: 'secondary' },
        { id: 'tag', label: 'Add Tags', icon: Tag, variant: 'secondary' },
        { id: 'duplicate', label: 'Duplicate', icon: Copy, variant: 'secondary' },
        { id: 'archive', label: 'Archive', icon: Archive, variant: 'secondary' },
        { id: 'delete', label: 'Delete', icon: Trash2, variant: 'secondary' },
    ];
    return (_jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-1", children: "Bulk Operations" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Select and manage multiple items at once" })] }), _jsxs(Badge, { variant: "gray", children: [selectedItems.size, " / ", defaultItems.length, " selected"] })] }), selectedItems.size > 0 && (_jsx("div", { className: "mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20", children: _jsx("div", { className: "flex flex-wrap gap-2", children: bulkActions.map((action) => (_jsxs(Button, { variant: action.variant, size: "sm", onClick: () => handleBulkAction(action.id), disabled: isProcessing, "data-testid": `bulk-action-${action.id}`, children: [_jsx(action.icon, { className: "h-4 w-4 mr-2" }), action.label] }, action.id))) }) })), _jsxs("div", { className: "mb-4 pb-4 border-b flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: selectedItems.size === defaultItems.length, onChange: toggleAll, className: "rounded", "data-testid": "checkbox-select-all" }), _jsxs("label", { className: "text-sm font-medium cursor-pointer", onClick: toggleAll, children: ["Select All (", defaultItems.length, " items)"] })] }), _jsx("div", { className: "space-y-2", children: defaultItems.map((item) => (_jsxs("div", { className: `flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedItems.has(item.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'}`, onClick: () => toggleItem(item.id), "data-testid": `bulk-item-${item.id}`, children: [_jsx("input", { type: "checkbox", checked: selectedItems.has(item.id), onChange: () => toggleItem(item.id), className: "rounded", "data-testid": `checkbox-item-${item.id}` }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-sm", children: item.title }), _jsxs("div", { className: "flex gap-2 mt-1", children: [_jsx(Badge, { variant: "gray", className: "text-xs", children: item.type }), _jsx(Badge, { variant: "gray", className: "text-xs", children: item.status })] })] })] }, item.id))) }), _jsxs("div", { className: "mt-6 pt-6 border-t grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-primary", children: selectedItems.size }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Selected" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: defaultItems.length - selectedItems.size }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Remaining" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: defaultItems.length }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Total Items" })] })] })] }));
}
