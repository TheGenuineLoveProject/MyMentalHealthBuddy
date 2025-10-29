import { useState } from 'react';
import { Card } from '@/components/Card.tsx';
import { Button } from '@/components/Button.tsx';
import { Badge } from '@/components/Badge.tsx';
import { useToast } from '@/hooks';
import { Sparkles, RefreshCw, Copy, Check, Wand2 } from 'lucide-react';

/**
 * AI Content Generator
 * Generate content ideas, headlines, and descriptions using AI
 */

interface GenerationOptions {
  contentType: 'headline' | 'description' | 'post' | 'ideas';
  tone: 'professional' | 'casual' | 'empathetic' | 'motivational';
  length: 'short' | 'medium' | 'long';
}

interface AIContentGeneratorProps {
  topic?: string;
  onGenerate?: (content: string, options: GenerationOptions) => void;
}

export function AIContentGenerator({ topic = '', onGenerate }: AIContentGeneratorProps) {
  const [selectedType, setSelectedType] = useState<GenerationOptions['contentType']>('headline');
  const [selectedTone, setSelectedTone] = useState<GenerationOptions['tone']>('empathetic');
  const [selectedLength, setSelectedLength] = useState<GenerationOptions['length']>('medium');
  const [inputTopic, setInputTopic] = useState(topic);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const contentTypes = [
    { id: 'headline', label: 'Headlines', description: 'Catchy titles for your content' },
    { id: 'description', label: 'Descriptions', description: 'Meta descriptions and summaries' },
    { id: 'post', label: 'Social Posts', description: 'Ready-to-publish social content' },
    { id: 'ideas', label: 'Content Ideas', description: 'Topic suggestions and outlines' },
  ] as const;

  const tones = [
    { id: 'professional', label: 'Professional', emoji: '💼' },
    { id: 'casual', label: 'Casual', emoji: '😊' },
    { id: 'empathetic', label: 'Empathetic', emoji: '❤️' },
    { id: 'motivational', label: 'Motivational', emoji: '🚀' },
  ] as const;

  const lengths = [
    { id: 'short', label: 'Short', description: '1-2 sentences' },
    { id: 'medium', label: 'Medium', description: '3-4 sentences' },
    { id: 'long', label: 'Long', description: '5+ sentences' },
  ] as const;

  const generateContent = async () => {
    if (!inputTopic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic to generate content',
        variant: 'destructive',
      });
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

      toast({
        title: 'Content Generated',
        description: `Created ${content.length} ${selectedType} variations`,
      });
      
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Unable to generate content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Content Generator
          </h3>
          <p className="text-sm text-muted-foreground">
            Generate engaging content with AI assistance
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Wand2 className="h-3 w-3" />
          Powered by AI
        </Badge>
      </div>

      {/* Topic Input */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Content Topic</label>
        <input
          type="text"
          value={inputTopic}
          onChange={(e) => setInputTopic(e.target.value)}
          placeholder="e.g., mindfulness, anxiety management, self-care..."
          className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary focus:outline-none"
          data-testid="input-topic"
        />
      </div>

      {/* Content Type Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">Content Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedType === type.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              data-testid={`content-type-${type.id}`}
            >
              <div className="font-medium text-sm">{type.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">Tone</label>
        <div className="flex flex-wrap gap-2">
          {tones.map((tone) => (
            <button
              key={tone.id}
              onClick={() => setSelectedTone(tone.id)}
              className={`px-4 py-2 rounded-full border-2 transition-all ${
                selectedTone === tone.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              data-testid={`tone-${tone.id}`}
            >
              <span className="mr-2">{tone.emoji}</span>
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      {/* Length Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">Length</label>
        <div className="flex gap-2">
          {lengths.map((length) => (
            <button
              key={length.id}
              onClick={() => setSelectedLength(length.id)}
              className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                selectedLength === length.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              data-testid={`length-${length.id}`}
            >
              <div className="font-medium text-sm">{length.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{length.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={generateContent}
        disabled={isGenerating}
        className="w-full mb-6"
        data-testid="button-generate"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Generating with AI...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Content
          </>
        )}
      </Button>

      {/* Generated Content */}
      {generatedContent.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Generated Variations</label>
            <Button
              variant="outline"
              size="sm"
              onClick={generateContent}
              data-testid="button-regenerate"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
          <div className="space-y-2">
            {generatedContent.map((content, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group"
                data-testid={`generated-content-${index}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm flex-1">{content}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(content, index)}
                    data-testid={`copy-content-${index}`}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
