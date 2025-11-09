import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { FileText, Video, Mic, Image as ImageIcon } from 'lucide-react';
/**
 * Content Templates Library
 * Pre-built templates for quick content creation
 */
export function ContentTemplates({ onSelectTemplate }) {
    const templates = [
        {
            id: '1',
            name: 'How-To Guide',
            type: 'blog',
            description: 'Step-by-step tutorial format with actionable tips',
            category: 'Educational',
        },
        {
            id: '2',
            name: 'Mental Health Tips',
            type: 'blog',
            description: 'Quick tips format perfect for social sharing',
            category: 'Tips',
        },
        {
            id: '3',
            name: 'Personal Story',
            type: 'blog',
            description: 'Share authentic experiences and insights',
            category: 'Personal',
        },
        {
            id: '4',
            name: 'Expert Interview',
            type: 'video',
            description: 'Q&A format with industry experts',
            category: 'Interview',
        },
        {
            id: '5',
            name: 'Meditation Guide',
            type: 'podcast',
            description: 'Guided meditation or mindfulness session',
            category: 'Wellness',
        },
        {
            id: '6',
            name: 'Statistics Infographic',
            type: 'infographic',
            description: 'Visual data presentation for social media',
            category: 'Data',
        },
    ];
    const getTypeIcon = (type) => {
        switch (type) {
            case 'blog':
                return _jsx(FileText, { className: "h-5 w-5" });
            case 'video':
                return _jsx(Video, { className: "h-5 w-5" });
            case 'podcast':
                return _jsx(Mic, { className: "h-5 w-5" });
            case 'infographic':
                return _jsx(ImageIcon, { className: "h-5 w-5" });
            default:
                return _jsx(FileText, { className: "h-5 w-5" });
        }
    };
    return (_jsxs("div", { "data-testid": "content-templates", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Content Templates" }), _jsx("p", { className: "text-muted-foreground", children: "Start with a proven template to create high-quality content faster" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: templates.map((template) => (_jsxs(Card, { className: "p-6 hover:shadow-lg transition-shadow cursor-pointer", "data-testid": `template-${template.id}`, onClick: () => onSelectTemplate(template), children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx("div", { className: "p-3 bg-primary/10 rounded-lg text-primary", children: getTypeIcon(template.type) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold mb-1", "data-testid": `template-name-${template.id}`, children: template.name }), _jsx(Badge, { variant: "gray", "data-testid": `template-category-${template.id}`, children: template.category })] })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: template.description }), _jsx(Button, { variant: "secondary", size: "sm", className: "w-full", "data-testid": `button-use-template-${template.id}`, children: "Use Template" })] }, template.id))) }), _jsx(Card, { className: "mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-1", children: "Need a custom template?" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Create your own template or request one from our team" })] }), _jsx(Button, { "data-testid": "button-create-template", children: "Create Custom" })] }) })] }));
}
