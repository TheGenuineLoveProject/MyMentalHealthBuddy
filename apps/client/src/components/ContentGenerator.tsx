import { useState } from 'react';
import { Sparkles, Copy, Download, RefreshCw, Wand2, FileText, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

interface ContentGeneratorProps {
  onContentGenerated?: (content: string) => void;
  initialPrompt?: string;
  contentType?: 'journal' | 'social' | 'email' | 'blog' | 'general';
  testId?: string;
}

interface GenerateContentRequest {
  prompt: string;
  contentType: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
}

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

export function ContentGenerator({
  onContentGenerated,
  initialPrompt = '',
  contentType = 'general',
  testId
}: ContentGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generatedContent, setGeneratedContent] = useState('');
  const [tone, setTone] = useState<string>('balanced');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const { addToast } = useToast();

  const template = contentTypeTemplates[contentType];
  const Icon = template.icon;

  const generateMutation = useMutation({
    mutationFn: async (request: GenerateContentRequest) => {
      const response = await apiRequest('/api/ai/generate-content', {
        method: 'POST',
        body: JSON.stringify(request)
      });
      return response;
    },
    onSuccess: (data: { content: string }) => {
      setGeneratedContent(data.content);
      if (onContentGenerated) {
        onContentGenerated(data.content);
      }
      addToast({
        title: 'Content Generated',
        description: 'Your AI-generated content is ready!',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate content. Please try again.',
        variant: 'error'
      });
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      addToast({
        title: 'Prompt Required',
        description: 'Please enter a description of the content you want to generate.',
        variant: 'error'
      });
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
      addToast({
        title: 'Copied',
        description: 'Content copied to clipboard',
        variant: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Copy Failed',
        description: 'Could not copy to clipboard',
        variant: 'error'
      });
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

    addToast({
      title: 'Downloaded',
      description: 'Content saved to file',
      variant: 'success'
    });
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <Card className="p-6 space-y-6" {...(testId && { 'data-testid': testId })}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">AI Content Generator</h3>
          <p className="text-sm text-muted-foreground">{template.label}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">What would you like to create?</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={template.placeholder}
            rows={4}
            className="resize-none"
            data-testid="input-content-prompt"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              data-testid="select-tone"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
              <option value="balanced">Balanced</option>
              <option value="empathetic">Empathetic</option>
              <option value="inspirational">Inspirational</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Length</label>
            <select
              value={length}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLength(e.target.value as 'short' | 'medium' | 'long')}
              className="w-full px-3 py-2 border rounded-md bg-background"
              data-testid="select-length"
            >
              <option value="short">Short (~100 words)</option>
              <option value="medium">Medium (~250 words)</option>
              <option value="long">Long (~500 words)</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !prompt.trim()}
          className="w-full"
          variant="primary"
          data-testid="button-generate"
        >
          {generateMutation.isPending ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      </div>

      {generatedContent && (
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Generated Content</label>
            <div className="flex gap-2">
              <Button
                onClick={handleRegenerate}
                variant="ghost"
                size="sm"
                data-testid="button-regenerate"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="sm"
                data-testid="button-copy"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleDownload}
                variant="ghost"
                size="sm"
                data-testid="button-download"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-sans" data-testid="text-generated-content">
              {generatedContent}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}

export function QuickContentGenerator({ testId }: { testId?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" {...(testId && { 'data-testid': testId })}>
      <ContentGenerator contentType="journal" testId="generator-journal" />
      <ContentGenerator contentType="social" testId="generator-social" />
      <ContentGenerator contentType="email" testId="generator-email" />
    </div>
  );
}
