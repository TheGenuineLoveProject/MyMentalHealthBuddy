import { Link } from 'wouter';
import { quickActions } from '@/lib/navigationStructure';
import { Card } from '@/components/Card.tsx';

/**
 * Quick Actions Component
 * Persona-based shortcuts for common workflows
 */

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-testid="quick-actions-grid">
      {quickActions.map((action) => {
        const Icon = action.icon;
        
        return (
          <Link key={action.id} href={action.path}>
            <Card
              className={`p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group ${action.color} bg-opacity-5 hover:bg-opacity-10 border-2 border-transparent hover:border-current`}
              data-testid={`quick-action-${action.id}`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`p-3 rounded-full ${action.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">
                    {action.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
