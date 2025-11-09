import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { X, Save, Eye, Sparkles, Image, Video, FileText } from 'lucide-react';
/**
 * Advanced Content Editor with AI Suggestions
 * Rich text editing, media upload, SEO optimization
 */
export function ContentEditor({ isOpen, onClose, onSave, initialContent }) {
    const [title, setTitle] = useState(initialContent?.title || '');
    const [body, setBody] = useState(initialContent?.body || '');
    const [contentType, setContentType] = useState(initialContent?.type || 'blog');
    const [tags, setTags] = useState(initialContent?.tags || []);
    const [currentTag, setCurrentTag] = useState('');
    const [aiSuggesting, setAiSuggesting] = useState(false);
    if (!isOpen)
        return null;
    const handleAddTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag('');
        }
    };
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };
    const handleAISuggestion = async () => {
        setAiSuggesting(true);
        // Simulate AI processing
        setTimeout(() => {
            setBody(prev => prev + "\n\n[AI Suggestion: Consider adding a personal story to make this more relatable...]");
            setAiSuggesting(false);
        }, 1500);
    };
    const handleSave = () => {
        onSave({ title, body, type: contentType, tags });
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", "data-testid": "modal-content-editor", children: _jsx(Card, { className: "w-full max-w-5xl max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold", "data-testid": "text-editor-title", children: "Content Editor" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, "data-testid": "button-close-editor", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Content Type" }), _jsx("div", { className: "flex gap-2", children: ['blog', 'video', 'podcast', 'infographic'].map((type) => (_jsxs(Button, { variant: contentType === type ? 'primary' : 'secondary', size: "sm", onClick: () => setContentType(type), "data-testid": `button-type-${type}`, children: [type === 'blog' && _jsx(FileText, { className: "h-4 w-4 mr-1" }), type === 'video' && _jsx(Video, { className: "h-4 w-4 mr-1" }), type] }, type))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Title" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "Enter compelling title...", "data-testid": "input-title" })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Content" }), _jsxs(Button, { variant: "secondary", size: "sm", onClick: handleAISuggestion, disabled: aiSuggesting, "data-testid": "button-ai-suggest", children: [_jsx(Sparkles, { className: "h-4 w-4 mr-1" }), aiSuggesting ? 'Generating...' : 'AI Suggestions'] })] }), _jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), className: "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[300px] font-mono text-sm", placeholder: "Write your content here... Use AI suggestions for inspiration!", "data-testid": "textarea-body" }), _jsxs("div", { className: "text-sm text-muted-foreground mt-2", children: [body.length, " characters \u2022 ", Math.ceil(body.split(' ').length / 200), " min read"] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Tags" }), _jsx("div", { className: "flex gap-2 mb-3 flex-wrap", children: tags.map((tag) => (_jsxs(Badge, { variant: "gray", className: "flex items-center gap-1", "data-testid": `badge-tag-${tag}`, children: [tag, _jsx("button", { onClick: () => handleRemoveTag(tag), className: "hover:text-destructive", children: _jsx(X, { className: "h-3 w-3" }) })] }, tag))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: currentTag, onChange: (e) => setCurrentTag(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleAddTag(), className: "flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "Add tags...", "data-testid": "input-tag" }), _jsx(Button, { onClick: handleAddTag, "data-testid": "button-add-tag", children: "Add" })] })] }), _jsxs("div", { className: "flex gap-2 mb-6 p-3 bg-muted rounded-lg", children: [_jsxs(Button, { variant: "secondary", size: "sm", "data-testid": "button-add-image", children: [_jsx(Image, { className: "h-4 w-4 mr-1" }), "Image"] }), _jsxs(Button, { variant: "secondary", size: "sm", "data-testid": "button-add-video", children: [_jsx(Video, { className: "h-4 w-4 mr-1" }), "Video"] })] }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx(Button, { variant: "secondary", onClick: onClose, "data-testid": "button-cancel", children: "Cancel" }), _jsxs(Button, { variant: "secondary", "data-testid": "button-preview", children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Preview"] }), _jsxs(Button, { onClick: handleSave, "data-testid": "button-save", children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "Save Draft"] })] })] }) }) }));
}
