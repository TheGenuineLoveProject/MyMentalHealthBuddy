/**
 * EmptyState Component
 * User-friendly empty state messages
 */

import { ReactNode } from 'react';
import { Button } from '@/components/Button';
import { FileQuestion, Inbox, Search, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  variant?: 'default' | 'search' | 'error' | 'inbox';
  'data-testid'?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  'data-testid': testId,
}: EmptyStateProps) {
  const variantIcons = {
    default: <FileQuestion className="h-16 w-16 text-gray-400" />,
    search: <Search className="h-16 w-16 text-gray-400" />,
    error: <AlertCircle className="h-16 w-16 text-gray-400" />,
    inbox: <Inbox className="h-16 w-16 text-gray-400" />,
  };

  const displayIcon = icon || variantIcons[variant];

  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      data-testid={testId}
    >
      <div className="mb-4">{displayIcon}</div>
      <h3 className="text-lg font-semibold mb-2" data-testid={`${testId}-title`}>
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md" data-testid={`${testId}-description`}>
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} icon={action.icon} data-testid={`${testId}-action`}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Pre-built empty state variants
 */
export const EmptyStates = {
  NoResults: ({ onReset }: { onReset?: () => void }) => (
    <EmptyState
      variant="search"
      title="No results found"
      description="We couldn't find anything matching your search. Try adjusting your filters or search terms."
      action={onReset ? { label: 'Clear filters', onClick: onReset } : undefined}
      data-testid="empty-no-results"
    />
  ),

  NoData: ({ actionLabel, onAction }: { actionLabel: string; onAction: () => void }) => (
    <EmptyState
      variant="inbox"
      title="No data yet"
      description="Get started by creating your first item."
      action={{ label: actionLabel, onClick: onAction }}
      data-testid="empty-no-data"
    />
  ),

  Error: ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
    <EmptyState
      variant="error"
      title="Something went wrong"
      description={message || 'An error occurred while loading the data. Please try again.'}
      action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
      data-testid="empty-error"
    />
  ),

  NoJournals: ({ onCreate }: { onCreate: () => void }) => (
    <EmptyState
      variant="default"
      title="No journal entries yet"
      description="Start documenting your thoughts and feelings. Journaling helps track your mental health journey."
      action={{ label: 'Create journal entry', onClick: onCreate }}
      data-testid="empty-no-journals"
    />
  ),

  NoMoods: ({ onCreate }: { onCreate: () => void }) => (
    <EmptyState
      variant="default"
      title="No mood entries yet"
      description="Track how you're feeling to identify patterns and improve your wellbeing."
      action={{ label: 'Log your mood', onClick: onCreate }}
      data-testid="empty-no-moods"
    />
  ),
};
