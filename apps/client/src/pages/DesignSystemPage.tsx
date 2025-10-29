import { useState } from 'react';
import { Card } from '@/components/Card.tsx';
import { Button } from '@/components/Button.tsx';
import { Badge } from '@/components/Badge.tsx';
import { Alert } from '@/components/Alert.tsx';
import { LoadingSpinner } from '@/components/LoadingSpinner.tsx';
import { ProgressIndicator } from '@/components/ProgressIndicator.tsx';
import {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonStats,
} from '@/components/SkeletonLoader.tsx';
import { useToast } from '@/contexts/ToastContext';
import {
  Palette,
  Type,
  Layout,
  Zap,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-react';

/**
 * Design System Showcase
 * Comprehensive documentation and preview of all UI components
 */
export default function DesignSystemPage() {
  const [progress, setProgress] = useState(45);
  const toast = useToast();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
          Design System
        </h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive UI component library and design guidelines
        </p>
      </div>

      {/* Color Palette */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Palette className="h-6 w-6" />
          Color Palette
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-primary"></div>
            <p className="text-sm font-medium">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-secondary"></div>
            <p className="text-sm font-medium">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-accent"></div>
            <p className="text-sm font-medium">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-destructive"></div>
            <p className="text-sm font-medium">Destructive</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-muted"></div>
            <p className="text-sm font-medium">Muted</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-card border"></div>
            <p className="text-sm font-medium">Card</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Type className="h-6 w-6" />
          Typography
        </h2>
        <Card className="p-6 space-y-4">
          <h1 className="text-4xl font-bold">Heading 1 - Bold & Large</h1>
          <h2 className="text-3xl font-semibold">Heading 2 - Semibold</h2>
          <h3 className="text-2xl font-medium">Heading 3 - Medium</h3>
          <h4 className="text-xl">Heading 4 - Regular</h4>
          <p className="text-lg">Large paragraph text for emphasis</p>
          <p>Regular body text for most content</p>
          <p className="text-sm text-muted-foreground">Small muted text for secondary information</p>
          <p className="font-mono text-sm">Monospace text for code</p>
        </Card>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6" />
          Buttons
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button data-testid="button-default">Default</Button>
              <Button variant="secondary" data-testid="button-secondary">
                Secondary
              </Button>
              <Button variant="outline" data-testid="button-outline">
                Outline
              </Button>
              <Button variant="ghost" data-testid="button-ghost">
                Ghost
              </Button>
              <Button variant="destructive" data-testid="button-destructive">
                Destructive
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" data-testid="button-small">
                Small
              </Button>
              <Button size="default" data-testid="button-medium">
                Medium
              </Button>
              <Button size="lg" data-testid="button-large">
                Large
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled data-testid="button-disabled">
                Disabled
              </Button>
              <Button data-testid="button-icon">
                <Check className="h-4 w-4 mr-2" />
                With Icon
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Badges</h2>
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Badge data-testid="badge-default">Default</Badge>
            <Badge variant="secondary" data-testid="badge-secondary">
              Secondary
            </Badge>
            <Badge variant="outline" data-testid="badge-outline">
              Outline
            </Badge>
            <Badge variant="destructive" data-testid="badge-destructive">
              Destructive
            </Badge>
          </div>
        </Card>
      </section>

      {/* Alerts */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Alerts</h2>
        <div className="space-y-4">
          <Alert variant="success" data-testid="alert-success">
            <Check className="h-4 w-4" />
            <div>
              <strong>Success!</strong> Your action completed successfully.
            </div>
          </Alert>
          <Alert variant="info" data-testid="alert-info">
            <Info className="h-4 w-4" />
            <div>
              <strong>Info:</strong> Here's some helpful information.
            </div>
          </Alert>
          <Alert variant="warning" data-testid="alert-warning">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <strong>Warning:</strong> Please review this carefully.
            </div>
          </Alert>
          <Alert variant="error" data-testid="alert-error">
            <AlertCircle className="h-4 w-4" />
            <div>
              <strong>Error:</strong> Something went wrong.
            </div>
          </Alert>
        </div>
      </section>

      {/* Loading States */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Loading States</h2>
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Spinners</h3>
            <div className="flex gap-6 items-center">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Skeletons</h3>
            <div className="space-y-4">
              <Skeleton width="100%" height="24px" />
              <Skeleton width="80%" height="24px" />
              <Skeleton width="60%" height="24px" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Progress Indicators</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Linear Progress</p>
                <ProgressIndicator variant="linear" value={progress} max={100} />
              </div>
              <div className="flex gap-4">
                <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                  Decrease
                </Button>
                <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                  Increase
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Skeleton Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Skeleton Variants</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Stats Dashboard</h3>
            <SkeletonStats count={4} />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Card Skeleton</h3>
            <SkeletonCard count={2} />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">List Skeleton</h3>
            <SkeletonList count={3} />
          </div>
        </div>
      </section>

      {/* Toast Notifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Toast Notifications</h2>
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => toast.success('Success!', 'Your action completed successfully')}
              data-testid="button-toast-success"
            >
              Success Toast
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast.info('Information', 'Here is some helpful info')}
              data-testid="button-toast-info"
            >
              Info Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.warning('Warning', 'Please review this carefully')}
              data-testid="button-toast-warning"
            >
              Warning Toast
            </Button>
            <Button
              variant="destructive"
              onClick={() => toast.error('Error', 'Something went wrong')}
              data-testid="button-toast-error"
            >
              Error Toast
            </Button>
          </div>
        </Card>
      </section>

      {/* Layout Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Layout className="h-6 w-6" />
          Layout Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Card 1</h3>
            <p className="text-sm text-muted-foreground">
              Example card with consistent padding and styling
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Card 2</h3>
            <p className="text-sm text-muted-foreground">
              Cards maintain consistency across the design system
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Card 3</h3>
            <p className="text-sm text-muted-foreground">
              Perfect for grouping related content
            </p>
          </Card>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Best Practices</h2>
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Use semantic color tokens (primary, secondary) instead of hard-coded colors</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Maintain consistent spacing using the Tailwind spacing scale</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Always provide loading states for better UX</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Include data-testid attributes for all interactive elements</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Use appropriate variants based on semantic meaning</span>
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
