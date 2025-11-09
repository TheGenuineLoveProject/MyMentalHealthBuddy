import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/Button';
import { FileQuestion, Inbox, Search, AlertCircle } from 'lucide-react';
export function EmptyState({ icon, title, description, action, variant = 'default', 'data-testid': testId, }) {
    const variantIcons = {
        default: _jsx(FileQuestion, { className: "h-16 w-16 text-gray-400" }),
        search: _jsx(Search, { className: "h-16 w-16 text-gray-400" }),
        error: _jsx(AlertCircle, { className: "h-16 w-16 text-gray-400" }),
        inbox: _jsx(Inbox, { className: "h-16 w-16 text-gray-400" }),
    };
    const displayIcon = icon || variantIcons[variant];
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", "data-testid": testId, children: [_jsx("div", { className: "mb-4", children: displayIcon }), _jsx("h3", { className: "text-lg font-semibold mb-2", "data-testid": `${testId}-title`, children: title }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6 max-w-md", "data-testid": `${testId}-description`, children: description }), action && (_jsx(Button, { onClick: action.onClick, icon: action.icon, "data-testid": `${testId}-action`, children: action.label }))] }));
}
/**
 * Pre-built empty state variants
 */
export const EmptyStates = {
    NoResults: ({ onReset }) => (_jsx(EmptyState, { variant: "search", title: "No results found", description: "We couldn't find anything matching your search. Try adjusting your filters or search terms.", action: onReset ? { label: 'Clear filters', onClick: onReset } : undefined, "data-testid": "empty-no-results" })),
    NoData: ({ actionLabel, onAction }) => (_jsx(EmptyState, { variant: "inbox", title: "No data yet", description: "Get started by creating your first item.", action: { label: actionLabel, onClick: onAction }, "data-testid": "empty-no-data" })),
    Error: ({ message, onRetry }) => (_jsx(EmptyState, { variant: "error", title: "Something went wrong", description: message || 'An error occurred while loading the data. Please try again.', action: onRetry ? { label: 'Try again', onClick: onRetry } : undefined, "data-testid": "empty-error" })),
    NoJournals: ({ onCreate }) => (_jsx(EmptyState, { variant: "default", title: "No journal entries yet", description: "Start documenting your thoughts and feelings. Journaling helps track your mental health journey.", action: { label: 'Create journal entry', onClick: onCreate }, "data-testid": "empty-no-journals" })),
    NoMoods: ({ onCreate }) => (_jsx(EmptyState, { variant: "default", title: "No mood entries yet", description: "Track how you're feeling to identify patterns and improve your wellbeing.", action: { label: 'Log your mood', onClick: onCreate }, "data-testid": "empty-no-moods" })),
};
