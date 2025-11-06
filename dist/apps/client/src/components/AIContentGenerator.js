import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { Sparkles, RefreshCw, Copy, Check, Wand2 } from 'lucide-react';
export function AIContentGenerator({ topic = '', onGenerate }) {
    const [selectedType, setSelectedType] = useState('headline');
    const [selectedTone, setSelectedTone] = useState('empathetic');
    const [selectedLength, setSelectedLength] = useState('medium');
    const [inputTopic, setInputTopic] = useState(topic);
    const [generatedContent, setGeneratedContent] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const { success, error } = useToast();
    const contentTypes = [
        { id: 'headline', label: 'Headlines', description: 'Catchy titles for your content' },
        { id: 'description', label: 'Descriptions', description: 'Meta descriptions and summaries' },
        { id: 'post', label: 'Social Posts', description: 'Ready-to-publish social content' },
        { id: 'ideas', label: 'Content Ideas', description: 'Topic suggestions and outlines' },
    ];
    const tones = [
        { id: 'professional', label: 'Professional', emoji: '💼' },
        { id: 'casual', label: 'Casual', emoji: '😊' },
        { id: 'empathetic', label: 'Empathetic', emoji: '❤️' },
        { id: 'motivational', label: 'Motivational', emoji: '🚀' },
    ];
    const lengths = [
        { id: 'short', label: 'Short', description: '1-2 sentences' },
        { id: 'medium', label: 'Medium', description: '3-4 sentences' },
        { id: 'long', label: 'Long', description: '5+ sentences' },
    ];
    const generateContent = async () => {
        if (!inputTopic.trim()) {
            error('Topic Required', 'Please enter a topic to generate content');
            return;
        }
        setIsGenerating(true);
        try {
            // Simulate AI generation with realistic mental health content
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockContent = {
                headline: [
                    `Understanding ${inputTopic}: A Comprehensive Guide`,
                    `5 Ways ${inputTopic} Can Transform Your Mental Health`,
                    `The Science Behind ${inputTopic} and Wellbeing`,
                    `${inputTopic}: Everything You Need to Know`,
                ],
                description: [
                    `Discover how ${inputTopic} can improve your mental health and overall wellbeing. Learn evidence-based techniques and practical strategies that you can start using today.`,
                    `Explore the transformative power of ${inputTopic} with our comprehensive guide. From beginner tips to advanced techniques, we cover everything you need to know.`,
                    `${inputTopic} is more than just a concept—it's a pathway to better mental health. Learn how to incorporate these practices into your daily routine for lasting results.`,
                ],
                post: [
                    `🌟 Just learned about ${inputTopic} and it's been life-changing! Here's what I discovered... #MentalHealth #Wellness`,
                    `💙 ${inputTopic} has helped me so much on my mental health journey. If you're struggling, this might help you too. Let me know your thoughts! 💬`,
                    `✨ Quick reminder: ${inputTopic} is a powerful tool for mental wellness. Taking small steps every day can make a big difference. You've got this! 💪`,
                ],
                ideas: [
                    `"Getting Started with ${inputTopic}" - A beginner's guide covering basics, benefits, and first steps`,
                    `"Common Myths About ${inputTopic} Debunked" - Addressing misconceptions and sharing facts`,
                    `"My 30-Day ${inputTopic} Challenge" - Personal journey and results`,
                    `"${inputTopic} for Different Life Situations" - Tailored advice for various scenarios`,
                ],
            };
            const content = mockContent[selectedType] || [];
            setGeneratedContent(content);
            if (onGenerate && content.length > 0) {
                onGenerate(content[0], { contentType: selectedType, tone: selectedTone, length: selectedLength });
            }
            success('Content Generated', `Created ${content.length} ${selectedType} variations`);
        }
        catch (err) {
            error('Generation Failed', 'Unable to generate content. Please try again.');
        }
        finally {
            setIsGenerating(false);
        }
    };
    const copyToClipboard = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
            success('Copied', 'Content copied to clipboard');
        }
        catch (err) {
            error('Copy Failed', 'Unable to copy to clipboard');
        }
    };
    return (_jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold mb-1 flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-5 w-5 text-primary" }), "AI Content Generator"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Generate engaging content with AI assistance" })] }), _jsxs(Badge, { variant: "primary", className: "gap-1", children: [_jsx(Wand2, { className: "h-3 w-3" }), "Powered by AI"] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Content Topic" }), _jsx("input", { type: "text", value: inputTopic, onChange: (e) => setInputTopic(e.target.value), placeholder: "e.g., mindfulness, anxiety management, self-care...", className: "w-full px-4 py-2 rounded-lg border border-border focus:border-primary focus:outline-none", "data-testid": "input-topic" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "text-sm font-medium mb-3 block", children: "Content Type" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: contentTypes.map((type) => (_jsxs("button", { onClick: () => setSelectedType(type.id), className: `p-3 rounded-lg border-2 text-left transition-all ${selectedType === type.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'}`, "data-testid": `content-type-${type.id}`, children: [_jsx("div", { className: "font-medium text-sm", children: type.label }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: type.description })] }, type.id))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "text-sm font-medium mb-3 block", children: "Tone" }), _jsx("div", { className: "flex flex-wrap gap-2", children: tones.map((tone) => (_jsxs("button", { onClick: () => setSelectedTone(tone.id), className: `px-4 py-2 rounded-full border-2 transition-all ${selectedTone === tone.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'}`, "data-testid": `tone-${tone.id}`, children: [_jsx("span", { className: "mr-2", children: tone.emoji }), tone.label] }, tone.id))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "text-sm font-medium mb-3 block", children: "Length" }), _jsx("div", { className: "flex gap-2", children: lengths.map((length) => (_jsxs("button", { onClick: () => setSelectedLength(length.id), className: `flex-1 p-3 rounded-lg border-2 text-center transition-all ${selectedLength === length.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'}`, "data-testid": `length-${length.id}`, children: [_jsx("div", { className: "font-medium text-sm", children: length.label }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: length.description })] }, length.id))) })] }), _jsx(Button, { onClick: generateContent, disabled: isGenerating, className: "w-full mb-6", "data-testid": "button-generate", children: isGenerating ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Generating with AI..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "h-4 w-4 mr-2" }), "Generate Content"] })) }), generatedContent.length > 0 && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm font-medium", children: "Generated Variations" }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: generateContent, "data-testid": "button-regenerate", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Regenerate"] })] }), _jsx("div", { className: "space-y-2", children: generatedContent.map((content, index) => (_jsx("div", { className: "p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group", "data-testid": `generated-content-${index}`, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("p", { className: "text-sm flex-1", children: content }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => copyToClipboard(content, index), "data-testid": `copy-content-${index}`, children: copiedIndex === index ? (_jsx(Check, { className: "h-4 w-4 text-green-500" })) : (_jsx(Copy, { className: "h-4 w-4" })) })] }) }, index))) })] }))] }));
}
