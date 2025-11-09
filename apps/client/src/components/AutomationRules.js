import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { Zap, Plus, Play, Pause, Trash2, Settings } from 'lucide-react';
export function AutomationRules({ rules = [], onCreateRule, onToggleRule }) {
    const [activeRules, setActiveRules] = useState(rules.length > 0 ? rules : [
        {
            id: '1',
            name: 'Auto-publish scheduled content',
            trigger: 'When scheduled time arrives',
            action: 'Publish to all platforms',
            enabled: true,
            lastRun: '2 hours ago',
            runCount: 45,
        },
        {
            id: '2',
            name: 'Tag new content',
            trigger: 'When content is created',
            action: 'Auto-tag based on keywords',
            enabled: true,
            lastRun: '1 day ago',
            runCount: 12,
        },
        {
            id: '3',
            name: 'Archive old drafts',
            trigger: 'When draft is 30 days old',
            action: 'Move to archive',
            enabled: false,
            lastRun: 'Never',
            runCount: 0,
        },
    ]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { success, error } = useToast();
    const triggers = [
        { id: 'schedule', label: 'Scheduled Time', description: 'At specific date/time' },
        { id: 'create', label: 'Content Created', description: 'When new content is added' },
        { id: 'publish', label: 'Content Published', description: 'After publishing' },
        { id: 'engagement', label: 'Engagement Threshold', description: 'Reaches specific metrics' },
        { id: 'keyword', label: 'Keyword Match', description: 'Contains specific keywords' },
    ];
    const actions = [
        { id: 'publish', label: 'Publish Content', description: 'Publish to platforms' },
        { id: 'tag', label: 'Add Tags', description: 'Auto-tag content' },
        { id: 'notify', label: 'Send Notification', description: 'Alert team members' },
        { id: 'archive', label: 'Archive', description: 'Move to archive' },
        { id: 'duplicate', label: 'Create Duplicate', description: 'Clone content' },
    ];
    const toggleRule = (id) => {
        setActiveRules(prev => prev.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule));
        if (onToggleRule) {
            onToggleRule(id);
        }
        success('Rule Updated', 'Automation rule status changed');
    };
    const deleteRule = (id) => {
        setActiveRules(prev => prev.filter(rule => rule.id !== id));
        success('Rule Deleted', 'Automation rule removed');
    };
    return (_jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold mb-1 flex items-center gap-2", children: [_jsx(Zap, { className: "h-5 w-5 text-primary" }), "Automation Rules"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Automate your workflow with smart triggers and actions" })] }), _jsxs(Button, { onClick: () => setShowCreateForm(!showCreateForm), "data-testid": "button-create-rule", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "New Rule"] })] }), showCreateForm && (_jsxs(Card, { className: "p-4 mb-6 bg-muted/30", children: [_jsx("h4", { className: "font-medium mb-4", children: "Create Automation Rule" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Rule Name" }), _jsx("input", { type: "text", placeholder: "e.g., Auto-publish weekly newsletter", className: "w-full px-3 py-2 rounded border border-border", "data-testid": "input-rule-name" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Trigger" }), _jsxs("select", { className: "w-full px-3 py-2 rounded border border-border", "data-testid": "select-trigger", children: [_jsx("option", { value: "", children: "Select trigger..." }), triggers.map(trigger => (_jsx("option", { value: trigger.id, children: trigger.label }, trigger.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Action" }), _jsxs("select", { className: "w-full px-3 py-2 rounded border border-border", "data-testid": "select-action", children: [_jsx("option", { value: "", children: "Select action..." }), actions.map(action => (_jsx("option", { value: action.id, children: action.label }, action.id)))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { className: "flex-1", "data-testid": "button-save-rule", children: "Save Rule" }), _jsx(Button, { variant: "secondary", onClick: () => setShowCreateForm(false), "data-testid": "button-cancel", children: "Cancel" })] })] })] })), _jsx("div", { className: "space-y-3", children: activeRules.map((rule) => (_jsx(Card, { className: `p-4 transition-all ${rule.enabled ? 'border-primary/30' : 'border-border opacity-60'}`, children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h4", { className: "font-medium", children: rule.name }), _jsx(Badge, { variant: rule.enabled ? 'success' : 'gray', children: rule.enabled ? 'Active' : 'Inactive' })] }), _jsxs("div", { className: "space-y-1 text-sm text-muted-foreground", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Trigger:" }), " ", rule.trigger] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Action:" }), " ", rule.action] }), _jsxs("div", { className: "flex gap-4 mt-2", children: [_jsxs("span", { children: ["Last run: ", rule.lastRun] }), _jsxs("span", { children: ["Runs: ", rule.runCount] })] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => toggleRule(rule.id), "data-testid": `toggle-rule-${rule.id}`, children: rule.enabled ? (_jsx(Pause, { className: "h-4 w-4" })) : (_jsx(Play, { className: "h-4 w-4" })) }), _jsx(Button, { variant: "secondary", size: "sm", "data-testid": `edit-rule-${rule.id}`, children: _jsx(Settings, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => deleteRule(rule.id), "data-testid": `delete-rule-${rule.id}`, children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }) }, rule.id))) }), _jsxs("div", { className: "mt-6 pt-6 border-t grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-primary", children: activeRules.filter(r => r.enabled).length }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Active Rules" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: activeRules.reduce((sum, r) => sum + (r.runCount || 0), 0) }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Total Runs" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: activeRules.length }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Total Rules" })] })] })] }));
}
