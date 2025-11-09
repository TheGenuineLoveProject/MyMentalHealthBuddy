import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { ContentEditor } from "@/components/ContentEditor";
import { ContentTemplates } from "@/components/ContentTemplates";
import { SearchFilter } from "@/components/SearchFilter";
import { SEOOptimizer } from "@/components/SEOOptimizer";
import { useToast } from "@/hooks";
import { FileEdit, Calendar, CheckCircle2, Clock, Send, Library, TrendingUp } from "lucide-react";
/**
 * Content Studio - Content creation and management workflow
 * Draft → QA → Approve → Schedule → Publish
 */
export default function StudioPage() {
    const [showEditor, setShowEditor] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showSEO, setShowSEO] = useState(false);
    const toast = useToast();
    const contentItems = [
        {
            id: 1,
            title: "Understanding Anxiety: A Beginner's Guide",
            type: "blog",
            status: "draft",
            author: "Dr. Sarah Johnson",
            lastUpdated: "2 hours ago"
        },
        {
            id: 2,
            title: "5 Breathing Techniques for Stress Relief",
            type: "video",
            status: "in_review",
            author: "Michael Chen",
            lastUpdated: "1 day ago"
        },
        {
            id: 3,
            title: "Weekly Mental Health Tips - Episode 12",
            type: "podcast",
            status: "approved",
            author: "Emily Rodriguez",
            lastUpdated: "3 days ago"
        }
    ];
    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { variant: "gray", icon: FileEdit },
            in_review: { variant: "warning", icon: Clock },
            approved: { variant: "success", icon: CheckCircle2 },
            scheduled: { variant: "primary", icon: Calendar },
            published: { variant: "success", icon: Send }
        };
        const config = statusConfig[status] || statusConfig.draft;
        const Icon = config.icon;
        return (_jsxs(Badge, { variant: config.variant, className: "flex items-center gap-1", "data-testid": `badge-status-${status}`, children: [_jsx(Icon, { className: "h-3 w-3" }), status.replace('_', ' ').toUpperCase()] }));
    };
    return (_jsxs("div", { className: "container mx-auto p-6 max-w-7xl", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", "data-testid": "text-page-title", children: "Content Studio" }), _jsx("p", { className: "text-muted-foreground text-lg", children: "Manage your content creation workflow: Draft \u2192 QA \u2192 Approve \u2192 Schedule \u2192 Publish" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Drafts" }), _jsx("div", { className: "text-3xl font-bold", "data-testid": "text-stats-drafts", children: "8" })] }), _jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "In Review" }), _jsx("div", { className: "text-3xl font-bold", "data-testid": "text-stats-review", children: "3" })] }), _jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Scheduled" }), _jsx("div", { className: "text-3xl font-bold", "data-testid": "text-stats-scheduled", children: "5" })] }), _jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Published" }), _jsx("div", { className: "text-3xl font-bold", "data-testid": "text-stats-published", children: "42" })] })] }), _jsx(SearchFilter, { onSearch: (query) => toast.info("Searching", `Searching for: ${query}`), onFilter: (filters) => console.log('Filters:', filters) }), _jsxs("div", { className: "flex gap-3 mb-6 mt-6", children: [_jsxs(Button, { onClick: () => setShowEditor(true), "data-testid": "button-new-article", children: [_jsx(FileEdit, { className: "h-4 w-4 mr-2" }), "New Article"] }), _jsxs(Button, { variant: "secondary", onClick: () => setShowTemplates(true), "data-testid": "button-templates", children: [_jsx(Library, { className: "h-4 w-4 mr-2" }), "Templates"] }), _jsxs(Button, { variant: "secondary", "data-testid": "button-new-video", children: [_jsx(Calendar, { className: "h-4 w-4 mr-2" }), "Schedule Content"] }), _jsxs(Button, { variant: "secondary", onClick: () => setShowSEO(!showSEO), "data-testid": "button-seo", children: [_jsx(TrendingUp, { className: "h-4 w-4 mr-2" }), "SEO Tools"] })] }), showSEO && (_jsx("div", { className: "mb-6", children: _jsx(SEOOptimizer, { content: "Sample content for SEO analysis. This is a comprehensive guide to mental health practices and wellness techniques.", title: "Understanding Anxiety: A Beginner's Guide", description: "Learn proven techniques to manage anxiety and improve your mental wellbeing with our comprehensive guide." }) })), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Recent Content" }), contentItems.map((item) => (_jsx(Card, { className: "p-6 hover:shadow-lg transition-shadow", "data-testid": `card-content-${item.id}`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold", "data-testid": `text-title-${item.id}`, children: item.title }), getStatusBadge(item.status), _jsx(Badge, { variant: "gray", "data-testid": `badge-type-${item.id}`, children: item.type })] }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["By ", item.author, " \u2022 Updated ", item.lastUpdated] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "secondary", size: "sm", "data-testid": `button-edit-${item.id}`, children: "Edit" }), _jsx(Button, { variant: "secondary", size: "sm", "data-testid": `button-preview-${item.id}`, children: "Preview" })] })] }) }, item.id)))] }), _jsxs(Card, { className: "mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Content Workflow" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx(FileEdit, { className: "h-8 w-8 mx-auto mb-2 text-blue-600" }), _jsx("div", { className: "font-medium", children: "1. Draft" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Create content" })] }), _jsxs("div", { className: "text-center", children: [_jsx(Clock, { className: "h-8 w-8 mx-auto mb-2 text-yellow-600" }), _jsx("div", { className: "font-medium", children: "2. QA Review" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Quality check" })] }), _jsxs("div", { className: "text-center", children: [_jsx(CheckCircle2, { className: "h-8 w-8 mx-auto mb-2 text-green-600" }), _jsx("div", { className: "font-medium", children: "3. Approve" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Final approval" })] }), _jsxs("div", { className: "text-center", children: [_jsx(Calendar, { className: "h-8 w-8 mx-auto mb-2 text-purple-600" }), _jsx("div", { className: "font-medium", children: "4. Schedule" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Set publish time" })] }), _jsxs("div", { className: "text-center", children: [_jsx(Send, { className: "h-8 w-8 mx-auto mb-2 text-indigo-600" }), _jsx("div", { className: "font-medium", children: "5. Publish" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Go live" })] })] })] }), _jsx(ContentEditor, { isOpen: showEditor, onClose: () => setShowEditor(false), onSave: (content) => {
                    toast.success("Content Saved", "Your draft has been saved successfully");
                    setShowEditor(false);
                } }), showTemplates && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg p-6", children: [_jsx(ContentTemplates, { onSelectTemplate: (template) => {
                                toast.info("Template Selected", `Using ${template.name} template`);
                                setShowTemplates(false);
                                setShowEditor(true);
                            } }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx(Button, { variant: "secondary", onClick: () => setShowTemplates(false), children: "Close" }) })] }) }))] }));
}
