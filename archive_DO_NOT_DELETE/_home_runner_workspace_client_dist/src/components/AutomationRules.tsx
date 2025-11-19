import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { Zap, Plus, Play, Pause, Trash2, Settings } from 'lucide-react';

/**
 * Automation Rules Engine
 * Create workflows with triggers and actions
 */

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastRun?: string;
  runCount?: number;
}

interface AutomationRulesProps {
  rules?: AutomationRule[];
  onCreateRule?: (rule: Partial<AutomationRule>) => void;
  onToggleRule?: (id: string) => void;
}

export function AutomationRules({ rules = [], onCreateRule, onToggleRule }: AutomationRulesProps) {
  const [activeRules, setActiveRules] = useState<AutomationRule[]>(
    rules.length > 0 ? rules : [
      {
        id: '1',
        name: 'Auto-publish scheduled content',
        trigger: 'When scheduled time arrives',
        action: 'Publish to all platforms',
        enabled: true,
        lastRun: '2 hours ago',
        runCount: 45,
      },
      {
        id: '2',
        name: 'Tag new content',
        trigger: 'When content is created',
        action: 'Auto-tag based on keywords',
        enabled: true,
        lastRun: '1 day ago',
        runCount: 12,
      },
      {
        id: '3',
        name: 'Archive old drafts',
        trigger: 'When draft is 30 days old',
        action: 'Move to archive',
        enabled: false,
        lastRun: 'Never',
        runCount: 0,
      },
    ]
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { success, error } = useToast();

  const triggers = [
    { id: 'schedule', label: 'Scheduled Time', description: 'At specific date/time' },
    { id: 'create', label: 'Content Created', description: 'When new content is added' },
    { id: 'publish', label: 'Content Published', description: 'After publishing' },
    { id: 'engagement', label: 'Engagement Threshold', description: 'Reaches specific metrics' },
    { id: 'keyword', label: 'Keyword Match', description: 'Contains specific keywords' },
  ];

  const actions = [
    { id: 'publish', label: 'Publish Content', description: 'Publish to platforms' },
    { id: 'tag', label: 'Add Tags', description: 'Auto-tag content' },
    { id: 'notify', label: 'Send Notification', description: 'Alert team members' },
    { id: 'archive', label: 'Archive', description: 'Move to archive' },
    { id: 'duplicate', label: 'Create Duplicate', description: 'Clone content' },
  ];

  const toggleRule = (id: string) => {
    setActiveRules(prev =>
      prev.map(rule =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    if (onToggleRule) {
      onToggleRule(id);
    }
    success('Rule Updated', 'Automation rule status changed');
  };

  const deleteRule = (id: string) => {
    setActiveRules(prev => prev.filter(rule => rule.id !== id));
    success('Rule Deleted', 'Automation rule removed');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Automation Rules
          </h3>
          <p className="text-sm text-muted-foreground">
            Automate your workflow with smart triggers and actions
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          data-testid="button-create-rule"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Create Rule Form */}
      {showCreateForm && (
        <Card className="p-4 mb-6 bg-muted/30">
          <h4 className="font-medium mb-4">Create Automation Rule</h4>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rule Name</label>
              <input
                type="text"
                placeholder="e.g., Auto-publish weekly newsletter"
                className="w-full px-3 py-2 rounded border border-border"
                data-testid="input-rule-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Trigger</label>
              <select className="w-full px-3 py-2 rounded border border-border" data-testid="select-trigger">
                <option value="">Select trigger...</option>
                {triggers.map(trigger => (
                  <option key={trigger.id} value={trigger.id}>{trigger.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Action</label>
              <select className="w-full px-3 py-2 rounded border border-border" data-testid="select-action">
                <option value="">Select action...</option>
                {actions.map(action => (
                  <option key={action.id} value={action.id}>{action.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" data-testid="button-save-rule">Save Rule</Button>
              <Button variant="secondary" onClick={() => setShowCreateForm(false)} data-testid="button-cancel">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active Rules */}
      <div className="space-y-3">
        {activeRules.map((rule) => (
          <Card
            key={rule.id}
            className={`p-4 transition-all ${
              rule.enabled ? 'border-primary/30' : 'border-border opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium">{rule.name}</h4>
                  <Badge variant={rule.enabled ? 'success' : 'gray'}>
                    {rule.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Trigger:</span> {rule.trigger}
                  </div>
                  <div>
                    <span className="font-medium">Action:</span> {rule.action}
                  </div>
                  <div className="flex gap-4 mt-2">
                    <span>Last run: {rule.lastRun}</span>
                    <span>Runs: {rule.runCount}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRule(rule.id)}
                  data-testid={`toggle-rule-${rule.id}`}
                >
                  {rule.enabled ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="secondary" size="sm" data-testid={`edit-rule-${rule.id}`}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteRule(rule.id)}
                  data-testid={`delete-rule-${rule.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Automation Stats */}
      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {activeRules.filter(r => r.enabled).length}
          </div>
          <div className="text-xs text-muted-foreground">Active Rules</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {activeRules.reduce((sum, r) => sum + (r.runCount || 0), 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Runs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{activeRules.length}</div>
          <div className="text-xs text-muted-foreground">Total Rules</div>
        </div>
      </div>
    </Card>
  );
}
