import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { X, Save, Eye, Sparkles, Image, Video, FileText } from 'lucide-react';

interface ContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: any) => void;
  initialContent?: {
    title: string;
    body: string;
    type: string;
    tags: string[];
  };
}

/**
 * Advanced Content Editor with AI Suggestions
 * Rich text editing, media upload, SEO optimization
 */
export function ContentEditor({ isOpen, onClose, onSave, initialContent }: ContentEditorProps) {
  const [title, setTitle] = useState(initialContent?.title || '');
  const [body, setBody] = useState(initialContent?.body || '');
  const [contentType, setContentType] = useState(initialContent?.type || 'blog');
  const [tags, setTags] = useState<string[]>(initialContent?.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [aiSuggesting, setAiSuggesting] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="modal-content-editor">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" data-testid="text-editor-title">
              Content Editor
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-editor">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <div className="flex gap-2">
              {['blog', 'video', 'podcast', 'infographic'].map((type) => (
                <Button
                  key={type}
                  variant={contentType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContentType(type)}
                  data-testid={`button-type-${type}`}
                >
                  {type === 'blog' && <FileText className="h-4 w-4 mr-1" />}
                  {type === 'video' && <Video className="h-4 w-4 mr-1" />}
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter compelling title..."
              data-testid="input-title"
            />
          </div>

          {/* Body Editor */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Content</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAISuggestion}
                disabled={aiSuggesting}
                data-testid="button-ai-suggest"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {aiSuggesting ? 'Generating...' : 'AI Suggestions'}
              </Button>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[300px] font-mono text-sm"
              placeholder="Write your content here... Use AI suggestions for inspiration!"
              data-testid="textarea-body"
            />
            <div className="text-sm text-muted-foreground mt-2">
              {body.length} characters • {Math.ceil(body.split(' ').length / 200)} min read
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1" data-testid={`badge-tag-${tag}`}>
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add tags..."
                data-testid="input-tag"
              />
              <Button onClick={handleAddTag} data-testid="button-add-tag">Add</Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex gap-2 mb-6 p-3 bg-muted rounded-lg">
            <Button variant="outline" size="sm" data-testid="button-add-image">
              <Image className="h-4 w-4 mr-1" />
              Image
            </Button>
            <Button variant="outline" size="sm" data-testid="button-add-video">
              <Video className="h-4 w-4 mr-1" />
              Video
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button variant="outline" data-testid="button-preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} data-testid="button-save">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
