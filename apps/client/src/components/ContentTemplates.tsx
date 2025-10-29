import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { FileText, Video, Mic, Image as ImageIcon } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'blog' | 'video' | 'podcast' | 'infographic';
  description: string;
  category: string;
}

interface ContentTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

/**
 * Content Templates Library
 * Pre-built templates for quick content creation
 */
export function ContentTemplates({ onSelectTemplate }: ContentTemplatesProps) {
  const templates: Template[] = [
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'podcast':
        return <Mic className="h-5 w-5" />;
      case 'infographic':
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div data-testid="content-templates">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Content Templates</h2>
        <p className="text-muted-foreground">
          Start with a proven template to create high-quality content faster
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            data-testid={`template-${template.id}`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                {getTypeIcon(template.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" data-testid={`template-name-${template.id}`}>
                  {template.name}
                </h3>
                <Badge variant="outline" data-testid={`template-category-${template.id}`}>
                  {template.category}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              data-testid={`button-use-template-${template.id}`}
            >
              Use Template
            </Button>
          </Card>
        ))}
      </div>

      {/* Custom Template CTA */}
      <Card className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Need a custom template?</h3>
            <p className="text-sm text-muted-foreground">
              Create your own template or request one from our team
            </p>
          </div>
          <Button data-testid="button-create-template">Create Custom</Button>
        </div>
      </Card>
    </div>
  );
}
