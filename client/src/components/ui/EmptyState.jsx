/**
 * Empty State Component (P175)
 * Standardized empty state with gentle microcopy
 */

import { Inbox, Search, FileText, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ICONS = {
  inbox: Inbox,
  search: Search,
  file: FileText,
  heart: Heart,
  sparkles: Sparkles,
};

const GENTLE_MESSAGES = [
  "Nothing here yet, and that's okay.",
  "This space is waiting for you.",
  "Ready when you are.",
  "A fresh start awaits.",
  "Your journey begins here.",
];

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  actionLabel,
  className = '',
  variant = 'default',
}) {
  const IconComponent = ICONS[icon] || Inbox;
  
  const defaultTitle = GENTLE_MESSAGES[Math.floor(Math.random() * GENTLE_MESSAGES.length)];
  
  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      role="status"
      aria-label={title || defaultTitle}
    >
      <div className={`rounded-full p-4 mb-4 ${
        variant === 'muted' 
          ? 'bg-muted' 
          : 'bg-primary/10'
      }`}>
        <IconComponent 
          className={`h-8 w-8 ${
            variant === 'muted' 
              ? 'text-muted-foreground' 
              : 'text-primary'
          }`} 
        />
      </div>
      
      <h3 className="text-lg font-medium text-foreground mb-2">
        {title || defaultTitle}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      
      {action && actionLabel && (
        <Button 
          onClick={action}
          variant="outline"
          size="sm"
          data-testid="empty-state-action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorEmptyState({
  title = "Something didn't work",
  description = "We're sorry about that. Please try again, or take a moment if you need one.",
  onRetry,
  className = '',
}) {
  return (
    <EmptyState
      icon="sparkles"
      title={title}
      description={description}
      action={onRetry}
      actionLabel={onRetry ? "Try again" : undefined}
      className={className}
      variant="muted"
    />
  );
}

export function SearchEmptyState({
  query = '',
  className = '',
}) {
  return (
    <EmptyState
      icon="search"
      title={query ? `No results for "${query}"` : "No results found"}
      description="Try adjusting your search or explore other areas."
      className={className}
      variant="muted"
    />
  );
}

export default EmptyState;
