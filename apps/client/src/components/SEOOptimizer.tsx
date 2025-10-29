import { useState, useEffect } from 'react';
import { Card } from '@/components/Card.tsx';
import { Button } from '@/components/Button.tsx';
import { Badge } from '@/components/Badge.tsx';
import { CheckCircle2, AlertCircle, Info, TrendingUp, Hash, FileText } from 'lucide-react';

interface SEOScore {
  title: { score: number; message: string };
  description: { score: number; message: string };
  keywords: { score: number; message: string };
  readability: { score: number; message: string };
  length: { score: number; message: string };
}

interface SEOOptimizerProps {
  content?: string;
  title?: string;
  description?: string;
  onOptimize?: (suggestions: string[]) => void;
}

/**
 * SEO Optimizer Component
 * Analyzes content and provides SEO recommendations
 */
export function SEOOptimizer({ content = '', title = '', description = '', onOptimize }: SEOOptimizerProps) {
  const [score, setScore] = useState<SEOScore | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    analyzeSEO();
  }, [content, title, description]);

  const analyzeSEO = () => {
    const newScore: SEOScore = {
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
    const newSuggestions: string[] = [];
    if (newScore.title.score < 80) newSuggestions.push(newScore.title.message);
    if (newScore.description.score < 80) newSuggestions.push(newScore.description.message);
    if (newScore.keywords.score < 80) newSuggestions.push(newScore.keywords.message);
    if (newScore.readability.score < 80) newSuggestions.push(newScore.readability.message);
    if (newScore.length.score < 80) newSuggestions.push(newScore.length.message);
    
    setSuggestions(newSuggestions);
    onOptimize?.(newSuggestions);
  };

  const analyzeTitle = (title: string): { score: number; message: string } => {
    const len = title.length;
    if (len === 0) return { score: 0, message: 'Add a title (50-60 characters recommended)' };
    if (len < 30) return { score: 50, message: 'Title is too short (aim for 50-60 characters)' };
    if (len > 70) return { score: 60, message: 'Title is too long (aim for 50-60 characters)' };
    if (len >= 50 && len <= 60) return { score: 100, message: 'Title length is perfect!' };
    return { score: 80, message: 'Title length is good' };
  };

  const analyzeDescription = (desc: string): { score: number; message: string } => {
    const len = desc.length;
    if (len === 0) return { score: 0, message: 'Add a meta description (150-160 characters recommended)' };
    if (len < 120) return { score: 50, message: 'Description is too short (aim for 150-160 characters)' };
    if (len > 200) return { score: 60, message: 'Description is too long (aim for 150-160 characters)' };
    if (len >= 150 && len <= 160) return { score: 100, message: 'Description length is perfect!' };
    return { score: 80, message: 'Description length is good' };
  };

  const analyzeKeywords = (text: string): { score: number; message: string } => {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const topKeywords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (topKeywords.length === 0) return { score: 0, message: 'Add keyword-rich content' };
    if (topKeywords.length < 3) return { score: 50, message: 'Add more diverse keywords' };
    return { score: 90, message: `Top keywords identified: ${topKeywords.map(k => k[0]).join(', ')}` };
  };

  const analyzeReadability = (text: string): { score: number; message: string } => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0) return { score: 0, message: 'Add content to analyze readability' };
    
    const avgWordsPerSentence = words.length / sentences.length;
    
    if (avgWordsPerSentence < 10) return { score: 70, message: 'Sentences are very short. Consider adding more detail' };
    if (avgWordsPerSentence > 25) return { score: 60, message: 'Sentences are too long. Break them into shorter ones' };
    return { score: 95, message: 'Readability is excellent!' };
  };

  const analyzeLength = (text: string): { score: number; message: string } => {
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    
    if (wordCount === 0) return { score: 0, message: 'Add content (aim for 300+ words)' };
    if (wordCount < 300) return { score: 40, message: `Add more content (current: ${wordCount} words, aim for 300+)` };
    if (wordCount > 2000) return { score: 70, message: 'Content is very long. Consider breaking into multiple pieces' };
    return { score: 100, message: `Word count is great (${wordCount} words)` };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <Info className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  if (!score) return null;

  return (
    <Card className="p-6" data-testid="seo-optimizer">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          SEO Score
        </h3>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`} data-testid="seo-overall-score">
            {overallScore}
          </div>
          <div className="text-sm text-muted-foreground">out of 100</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-testid="seo-title">
          <div className="flex items-center gap-3">
            {getScoreIcon(score.title.score)}
            <div>
              <div className="font-medium">Title Tag</div>
              <div className="text-sm text-muted-foreground">{score.title.message}</div>
            </div>
          </div>
          <Badge variant={score.title.score >= 80 ? 'default' : 'outline'}>
            {score.title.score}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-testid="seo-description">
          <div className="flex items-center gap-3">
            {getScoreIcon(score.description.score)}
            <div>
              <div className="font-medium">Meta Description</div>
              <div className="text-sm text-muted-foreground">{score.description.message}</div>
            </div>
          </div>
          <Badge variant={score.description.score >= 80 ? 'default' : 'outline'}>
            {score.description.score}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-testid="seo-keywords">
          <div className="flex items-center gap-3">
            {getScoreIcon(score.keywords.score)}
            <div>
              <div className="font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Keywords
              </div>
              <div className="text-sm text-muted-foreground">{score.keywords.message}</div>
            </div>
          </div>
          <Badge variant={score.keywords.score >= 80 ? 'default' : 'outline'}>
            {score.keywords.score}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-testid="seo-readability">
          <div className="flex items-center gap-3">
            {getScoreIcon(score.readability.score)}
            <div>
              <div className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Readability
              </div>
              <div className="text-sm text-muted-foreground">{score.readability.message}</div>
            </div>
          </div>
          <Badge variant={score.readability.score >= 80 ? 'default' : 'outline'}>
            {score.readability.score}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-testid="seo-length">
          <div className="flex items-center gap-3">
            {getScoreIcon(score.length.score)}
            <div>
              <div className="font-medium">Content Length</div>
              <div className="text-sm text-muted-foreground">{score.length.message}</div>
            </div>
          </div>
          <Badge variant={score.length.score >= 80 ? 'default' : 'outline'}>
            {score.length.score}
          </Badge>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Suggestions for Improvement
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
