import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AdvancedExport } from '@/components/AdvancedExport';
import { BulkOperations } from '@/components/BulkOperations';
import { AIContentGenerator } from '@/components/AIContentGenerator';
import { AutomationRules } from '@/components/AutomationRules';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Zap, Search, Download, CheckSquare, Sparkles, Settings } from 'lucide-react';
/**
 * Productivity Hub - Enterprise-grade productivity tools
 * Export, Bulk Operations, AI Generation, Automation, Advanced Search
 */
export function ProductivityPage() {
    const [activeTab, setActiveTab] = useState('search');
    const tabs = [
        { id: 'search', label: 'Advanced Search', icon: Search, color: 'text-blue-500' },
        { id: 'ai', label: 'AI Generator', icon: Sparkles, color: 'text-purple-500' },
        { id: 'automation', label: 'Automation', icon: Zap, color: 'text-yellow-500' },
        { id: 'bulk', label: 'Bulk Operations', icon: CheckSquare, color: 'text-green-500' },
        { id: 'export', label: 'Export Data', icon: Download, color: 'text-orange-500' },
    ];
    return (_jsx("div", { className: "min-h-screen bg-background p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "Productivity Hub" }), _jsx("p", { className: "text-muted-foreground", children: "Enterprise-grade tools to supercharge your workflow" })] }), _jsxs(Badge, { variant: "gray", className: "gap-1", children: [_jsx(Settings, { className: "h-3 w-3" }), "5 Power Tools"] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: [
                        { label: 'Searches Today', value: '127', change: '+12%', icon: Search },
                        { label: 'Content Generated', value: '45', change: '+8%', icon: Sparkles },
                        { label: 'Active Automations', value: '8', change: '→', icon: Zap },
                        { label: 'Bulk Operations', value: '23', change: '+15%', icon: CheckSquare },
                        { label: 'Data Exports', value: '12', change: '+5%', icon: Download },
                    ].map((stat, i) => (_jsxs(Card, { className: "p-4", "data-testid": `stat-${i}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx(stat.icon, { className: "h-4 w-4 text-muted-foreground" }), _jsx(Badge, { variant: "gray", className: "text-xs", children: stat.change })] }), _jsx("div", { className: "text-2xl font-bold", children: stat.value }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: stat.label })] }, i))) }), _jsx(Card, { className: "p-2", children: _jsx("div", { className: "flex gap-1 overflow-x-auto", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'}`, "data-testid": `tab-${tab.id}`, children: [_jsx(tab.icon, { className: `h-4 w-4 ${activeTab === tab.id ? 'text-current' : tab.color}` }), _jsx("span", { className: "font-medium text-sm", children: tab.label })] }, tab.id))) }) }), _jsxs("div", { className: "animate-in fade-in duration-300", children: [activeTab === 'search' && (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Advanced Search" }), _jsx(AdvancedSearch, {})] })), activeTab === 'ai' && (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "AI Content Generator" }), _jsx(AIContentGenerator, {})] })), activeTab === 'automation' && (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Automation Rules" }), _jsx(AutomationRules, {})] })), activeTab === 'bulk' && (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Bulk Operations" }), _jsx(BulkOperations, {})] })), activeTab === 'export' && (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Advanced Export" }), _jsx(AdvancedExport, {})] }))] }), _jsxs(Card, { className: "p-6 bg-gradient-to-r from-primary/5 to-purple-500/5", children: [_jsx("h3", { className: "font-semibold mb-3", children: "\uD83D\uDCA1 Pro Tips" }), _jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [_jsxs("li", { children: ["\u2022 Use ", _jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "/ " }), " to quickly focus the search bar"] }), _jsx("li", { children: "\u2022 Save frequently used searches for instant access" }), _jsx("li", { children: "\u2022 Combine automation rules with AI generation for maximum efficiency" }), _jsx("li", { children: "\u2022 Schedule bulk operations during off-peak hours for better performance" }), _jsx("li", { children: "\u2022 Export your data regularly to maintain backups" })] })] })] }) }));
}
export default ProductivityPage;
