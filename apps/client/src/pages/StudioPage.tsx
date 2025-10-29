import { useState } from 'react';
import { Card } from "@/components/Card.tsx";
import { Button } from "@/components/Button.tsx";
import { Badge } from "@/components/Badge.tsx";
import { ContentEditor } from "@/components/ContentEditor.tsx";
import { ContentTemplates } from "@/components/ContentTemplates.tsx";
import { SearchFilter } from "@/components/SearchFilter.tsx";
import { SEOOptimizer } from "@/components/SEOOptimizer.tsx";
import { useToast } from "@/hooks";
import { FileEdit, Calendar, CheckCircle2, Clock, Send, Library, TrendingUp } from "lucide-react";

/**
 * Content Studio - Content creation and management workflow
 * Draft → QA → Approve → Schedule → Publish
 */
export default function StudioPage() {
  const [showEditor, setShowEditor] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const toast = useToast();
  const contentItems = [
    {
      id: 1,
      title: "Understanding Anxiety: A Beginner's Guide",
      type: "blog",
      status: "draft",
      author: "Dr. Sarah Johnson",
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      title: "5 Breathing Techniques for Stress Relief",
      type: "video",
      status: "in_review",
      author: "Michael Chen",
      lastUpdated: "1 day ago"
    },
    {
      id: 3,
      title: "Weekly Mental Health Tips - Episode 12",
      type: "podcast",
      status: "approved",
      author: "Emily Rodriguez",
      lastUpdated: "3 days ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", icon: any }> = {
      draft: { variant: "outline", icon: FileEdit },
      in_review: { variant: "secondary", icon: Clock },
      approved: { variant: "default", icon: CheckCircle2 },
      scheduled: { variant: "default", icon: Calendar },
      published: { variant: "default", icon: Send }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1" data-testid={`badge-status-${status}`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
          Content Studio
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your content creation workflow: Draft → QA → Approve → Schedule → Publish
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Drafts</div>
          <div className="text-3xl font-bold" data-testid="text-stats-drafts">8</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">In Review</div>
          <div className="text-3xl font-bold" data-testid="text-stats-review">3</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Scheduled</div>
          <div className="text-3xl font-bold" data-testid="text-stats-scheduled">5</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Published</div>
          <div className="text-3xl font-bold" data-testid="text-stats-published">42</div>
        </Card>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        onSearch={(query) => toast.info("Searching", `Searching for: ${query}`)}
        onFilter={(filters) => console.log('Filters:', filters)}
      />

      {/* Actions */}
      <div className="flex gap-3 mb-6 mt-6">
        <Button onClick={() => setShowEditor(true)} data-testid="button-new-article">
          <FileEdit className="h-4 w-4 mr-2" />
          New Article
        </Button>
        <Button variant="outline" onClick={() => setShowTemplates(true)} data-testid="button-templates">
          <Library className="h-4 w-4 mr-2" />
          Templates
        </Button>
        <Button variant="outline" data-testid="button-new-video">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Content
        </Button>
        <Button variant="outline" onClick={() => setShowSEO(!showSEO)} data-testid="button-seo">
          <TrendingUp className="h-4 w-4 mr-2" />
          SEO Tools
        </Button>
      </div>

      {/* SEO Optimizer */}
      {showSEO && (
        <div className="mb-6">
          <SEOOptimizer
            content="Sample content for SEO analysis. This is a comprehensive guide to mental health practices and wellness techniques."
            title="Understanding Anxiety: A Beginner's Guide"
            description="Learn proven techniques to manage anxiety and improve your mental wellbeing with our comprehensive guide."
          />
        </div>
      )}

      {/* Content List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Recent Content</h2>
        {contentItems.map((item) => (
          <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow" data-testid={`card-content-${item.id}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold" data-testid={`text-title-${item.id}`}>
                    {item.title}
                  </h3>
                  {getStatusBadge(item.status)}
                  <Badge variant="outline" data-testid={`badge-type-${item.id}`}>
                    {item.type}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  By {item.author} • Updated {item.lastUpdated}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid={`button-edit-${item.id}`}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" data-testid={`button-preview-${item.id}`}>
                  Preview
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Workflow Guide */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <h3 className="text-xl font-semibold mb-4">Content Workflow</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <FileEdit className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="font-medium">1. Draft</div>
            <div className="text-xs text-muted-foreground">Create content</div>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="font-medium">2. QA Review</div>
            <div className="text-xs text-muted-foreground">Quality check</div>
          </div>
          <div className="text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="font-medium">3. Approve</div>
            <div className="text-xs text-muted-foreground">Final approval</div>
          </div>
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="font-medium">4. Schedule</div>
            <div className="text-xs text-muted-foreground">Set publish time</div>
          </div>
          <div className="text-center">
            <Send className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
            <div className="font-medium">5. Publish</div>
            <div className="text-xs text-muted-foreground">Go live</div>
          </div>
        </div>
      </Card>

      {/* Content Editor Modal */}
      <ContentEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={(content) => {
          toast.success("Content Saved", "Your draft has been saved successfully");
          setShowEditor(false);
        }}
      />

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg p-6">
            <ContentTemplates
              onSelectTemplate={(template) => {
                toast.info("Template Selected", `Using ${template.name} template`);
                setShowTemplates(false);
                setShowEditor(true);
              }}
            />
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowTemplates(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
