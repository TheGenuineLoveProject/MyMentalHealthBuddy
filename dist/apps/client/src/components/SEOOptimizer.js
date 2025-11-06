import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { CheckCircle2, AlertCircle, Info, TrendingUp, Hash, FileText } from 'lucide-react';
/**
 * SEO Optimizer Component
 * Analyzes content and provides SEO recommendations
 */
export function SEOOptimizer({ content = '', title = '', description = '', onOptimize }) {
    const [score, setScore] = useState(null);
    const [overallScore, setOverallScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    useEffect(() => {
        analyzeSEO();
    }, [content, title, description]);
    const analyzeSEO = () => {
        const newScore = {
            title: analyzeTitle(title),
            description: analyzeDescription(description),
            keywords: analyzeKeywords(content),
            readability: analyzeReadability(content),
            length: analyzeLength(content),
        };
        const avg = Object.values(newScore).reduce((sum, item) => sum + item.score, 0) / 5;
        setOverallScore(Math.round(avg));
        setScore(newScore);
        // Generate suggestions
        const newSuggestions = [];
        if (newScore.title.score < 80)
            newSuggestions.push(newScore.title.message);
        if (newScore.description.score < 80)
            newSuggestions.push(newScore.description.message);
        if (newScore.keywords.score < 80)
            newSuggestions.push(newScore.keywords.message);
        if (newScore.readability.score < 80)
            newSuggestions.push(newScore.readability.message);
        if (newScore.length.score < 80)
            newSuggestions.push(newScore.length.message);
        setSuggestions(newSuggestions);
        onOptimize?.(newSuggestions);
    };
    const analyzeTitle = (title) => {
        const len = title.length;
        if (len === 0)
            return { score: 0, message: 'Add a title (50-60 characters recommended)' };
        if (len < 30)
            return { score: 50, message: 'Title is too short (aim for 50-60 characters)' };
        if (len > 70)
            return { score: 60, message: 'Title is too long (aim for 50-60 characters)' };
        if (len >= 50 && len <= 60)
            return { score: 100, message: 'Title length is perfect!' };
        return { score: 80, message: 'Title length is good' };
    };
    const analyzeDescription = (desc) => {
        const len = desc.length;
        if (len === 0)
            return { score: 0, message: 'Add a meta description (150-160 characters recommended)' };
        if (len < 120)
            return { score: 50, message: 'Description is too short (aim for 150-160 characters)' };
        if (len > 200)
            return { score: 60, message: 'Description is too long (aim for 150-160 characters)' };
        if (len >= 150 && len <= 160)
            return { score: 100, message: 'Description length is perfect!' };
        return { score: 80, message: 'Description length is good' };
    };
    const analyzeKeywords = (text) => {
        const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const wordCount = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        const topKeywords = Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        if (topKeywords.length === 0)
            return { score: 0, message: 'Add keyword-rich content' };
        if (topKeywords.length < 3)
            return { score: 50, message: 'Add more diverse keywords' };
        return { score: 90, message: `Top keywords identified: ${topKeywords.map(k => k[0]).join(', ')}` };
    };
    const analyzeReadability = (text) => {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (sentences.length === 0)
            return { score: 0, message: 'Add content to analyze readability' };
        const avgWordsPerSentence = words.length / sentences.length;
        if (avgWordsPerSentence < 10)
            return { score: 70, message: 'Sentences are very short. Consider adding more detail' };
        if (avgWordsPerSentence > 25)
            return { score: 60, message: 'Sentences are too long. Break them into shorter ones' };
        return { score: 95, message: 'Readability is excellent!' };
    };
    const analyzeLength = (text) => {
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount === 0)
            return { score: 0, message: 'Add content (aim for 300+ words)' };
        if (wordCount < 300)
            return { score: 40, message: `Add more content (current: ${wordCount} words, aim for 300+)` };
        if (wordCount > 2000)
            return { score: 70, message: 'Content is very long. Consider breaking into multiple pieces' };
        return { score: 100, message: `Word count is great (${wordCount} words)` };
    };
    const getScoreColor = (score) => {
        if (score >= 80)
            return 'text-green-600';
        if (score >= 60)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    const getScoreIcon = (score) => {
        if (score >= 80)
            return _jsx(CheckCircle2, { className: "h-5 w-5 text-green-600" });
        if (score >= 60)
            return _jsx(Info, { className: "h-5 w-5 text-yellow-600" });
        return _jsx(AlertCircle, { className: "h-5 w-5 text-red-600" });
    };
    if (!score)
        return null;
    return (_jsxs(Card, { className: "p-6", "data-testid": "seo-optimizer", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(TrendingUp, { className: "h-5 w-5" }), "SEO Score"] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: `text-4xl font-bold ${getScoreColor(overallScore)}`, "data-testid": "seo-overall-score", children: overallScore }), _jsx("div", { className: "text-sm text-muted-foreground", children: "out of 100" })] })] }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/50 rounded-lg", "data-testid": "seo-title", children: [_jsxs("div", { className: "flex items-center gap-3", children: [getScoreIcon(score.title.score), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Title Tag" }), _jsx("div", { className: "text-sm text-muted-foreground", children: score.title.message })] })] }), _jsx(Badge, { variant: score.title.score >= 80 ? 'primary' : 'gray', children: score.title.score })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/50 rounded-lg", "data-testid": "seo-description", children: [_jsxs("div", { className: "flex items-center gap-3", children: [getScoreIcon(score.description.score), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Meta Description" }), _jsx("div", { className: "text-sm text-muted-foreground", children: score.description.message })] })] }), _jsx(Badge, { variant: score.description.score >= 80 ? 'primary' : 'gray', children: score.description.score })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/50 rounded-lg", "data-testid": "seo-keywords", children: [_jsxs("div", { className: "flex items-center gap-3", children: [getScoreIcon(score.keywords.score), _jsxs("div", { children: [_jsxs("div", { className: "font-medium flex items-center gap-2", children: [_jsx(Hash, { className: "h-4 w-4" }), "Keywords"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: score.keywords.message })] })] }), _jsx(Badge, { variant: score.keywords.score >= 80 ? 'primary' : 'gray', children: score.keywords.score })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/50 rounded-lg", "data-testid": "seo-readability", children: [_jsxs("div", { className: "flex items-center gap-3", children: [getScoreIcon(score.readability.score), _jsxs("div", { children: [_jsxs("div", { className: "font-medium flex items-center gap-2", children: [_jsx(FileText, { className: "h-4 w-4" }), "Readability"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: score.readability.message })] })] }), _jsx(Badge, { variant: score.readability.score >= 80 ? 'primary' : 'gray', children: score.readability.score })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/50 rounded-lg", "data-testid": "seo-length", children: [_jsxs("div", { className: "flex items-center gap-3", children: [getScoreIcon(score.length.score), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Content Length" }), _jsx("div", { className: "text-sm text-muted-foreground", children: score.length.message })] })] }), _jsx(Badge, { variant: score.length.score >= 80 ? 'primary' : 'gray', children: score.length.score })] })] }), suggestions.length > 0 && (_jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-950 rounded-lg", children: [_jsxs("h4", { className: "font-medium mb-2 flex items-center gap-2", children: [_jsx(Info, { className: "h-4 w-4" }), "Suggestions for Improvement"] }), _jsx("ul", { className: "space-y-1 text-sm text-muted-foreground", children: suggestions.map((suggestion, i) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-600", children: "\u2022" }), suggestion] }, i))) })] }))] }));
}
