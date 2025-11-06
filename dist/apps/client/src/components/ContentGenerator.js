import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Sparkles, Copy, Download, RefreshCw, Wand2, FileText, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useToast } from '@/hooks';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
const contentTypeTemplates = {
    journal: {
        icon: FileText,
        label: 'Journal Entry',
        placeholder: 'Describe what you want to journal about...',
        systemPrompt: 'Generate a thoughtful, introspective journal entry that encourages self-reflection and emotional awareness.'
    },
    social: {
        icon: MessageSquare,
        label: 'Social Media Post',
        placeholder: 'What message do you want to share?',
        systemPrompt: 'Create an engaging, authentic social media post that connects with the audience.'
    },
    email: {
        icon: Calendar,
        label: 'Email',
        placeholder: 'What do you want to communicate?',
        systemPrompt: 'Write a professional, clear, and concise email.'
    },
    blog: {
        icon: FileText,
        label: 'Blog Post',
        placeholder: 'What topic would you like to write about?',
        systemPrompt: 'Create an informative, well-structured blog post with clear sections.'
    },
    general: {
        icon: Wand2,
        label: 'General Content',
        placeholder: 'Describe the content you need...',
        systemPrompt: 'Generate helpful, relevant content based on the user\'s request.'
    }
};
export function ContentGenerator({ onContentGenerated, initialPrompt = '', contentType = 'general', testId }) {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [generatedContent, setGeneratedContent] = useState('');
    const [tone, setTone] = useState('balanced');
    const [length, setLength] = useState('medium');
    const { success, error } = useToast();
    const template = contentTypeTemplates[contentType];
    const Icon = template.icon;
    const generateMutation = useMutation({
        mutationFn: async (request) => {
            const response = await apiRequest('/api/ai/generate-content', {
                method: 'POST',
                body: JSON.stringify(request)
            });
            return response;
        },
        onSuccess: (data) => {
            setGeneratedContent(data.content);
            if (onContentGenerated) {
                onContentGenerated(data.content);
            }
            success('Content Generated', 'Your AI-generated content is ready!');
        },
        onError: (err) => {
            error('Generation Failed', err.message || 'Failed to generate content. Please try again.');
        }
    });
    const handleGenerate = () => {
        if (!prompt.trim()) {
            error('Prompt Required', 'Please enter a description of the content you want to generate.');
            return;
        }
        generateMutation.mutate({
            prompt: prompt.trim(),
            contentType,
            tone,
            length
        });
    };
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedContent);
            success('Copied', 'Content copied to clipboard');
        }
        catch (err) {
            error('Copy Failed', 'Could not copy to clipboard');
        }
    };
    const handleDownload = () => {
        const blob = new Blob([generatedContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-content-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        success('Downloaded', 'Content saved to file');
    };
    const handleRegenerate = () => {
        handleGenerate();
    };
    return (_jsxs(Card, { className: "p-6 space-y-6", ...(testId && { 'data-testid': testId }), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-primary/10", children: _jsx(Icon, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg", children: "AI Content Generator" }), _jsx("p", { className: "text-sm text-muted-foreground", children: template.label })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "What would you like to create?" }), _jsx("textarea", { value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: template.placeholder, rows: 4, className: "resize-none w-full px-3 py-2 border rounded-md bg-background", "data-testid": "input-content-prompt" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Tone" }), _jsxs("select", { value: tone, onChange: (e) => setTone(e.target.value), className: "w-full px-3 py-2 border rounded-md bg-background", "data-testid": "select-tone", children: [_jsx("option", { value: "professional", children: "Professional" }), _jsx("option", { value: "casual", children: "Casual" }), _jsx("option", { value: "friendly", children: "Friendly" }), _jsx("option", { value: "balanced", children: "Balanced" }), _jsx("option", { value: "empathetic", children: "Empathetic" }), _jsx("option", { value: "inspirational", children: "Inspirational" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Length" }), _jsxs("select", { value: length, onChange: (e) => setLength(e.target.value), className: "w-full px-3 py-2 border rounded-md bg-background", "data-testid": "select-length", children: [_jsx("option", { value: "short", children: "Short (~100 words)" }), _jsx("option", { value: "medium", children: "Medium (~250 words)" }), _jsx("option", { value: "long", children: "Long (~500 words)" })] })] })] }), _jsx(Button, { onClick: handleGenerate, disabled: generateMutation.isPending || !prompt.trim(), className: "w-full", variant: "primary", "data-testid": "button-generate", children: generateMutation.isPending ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }), "Generating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "h-4 w-4 mr-2" }), "Generate Content"] })) })] }), generatedContent && (_jsxs("div", { className: "space-y-3 pt-4 border-t", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm font-medium", children: "Generated Content" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleRegenerate, variant: "ghost", size: "sm", "data-testid": "button-regenerate", children: _jsx(RefreshCw, { className: "h-4 w-4" }) }), _jsx(Button, { onClick: handleCopy, variant: "ghost", size: "sm", "data-testid": "button-copy", children: _jsx(Copy, { className: "h-4 w-4" }) }), _jsx(Button, { onClick: handleDownload, variant: "ghost", size: "sm", "data-testid": "button-download", children: _jsx(Download, { className: "h-4 w-4" }) })] })] }), _jsx("div", { className: "p-4 bg-muted rounded-lg", children: _jsx("pre", { className: "whitespace-pre-wrap text-sm font-sans", "data-testid": "text-generated-content", children: generatedContent }) })] }))] }));
}
export function QuickContentGenerator({ testId }) {
    return (_jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", ...(testId && { 'data-testid': testId }), children: [_jsx(ContentGenerator, { contentType: "journal", testId: "generator-journal" }), _jsx(ContentGenerator, { contentType: "social", testId: "generator-social" }), _jsx(ContentGenerator, { contentType: "email", testId: "generator-email" })] }));
}
