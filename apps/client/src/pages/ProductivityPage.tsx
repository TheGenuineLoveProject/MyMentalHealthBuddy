import { useState } from 'react';
import { AdvancedExport } from '@/components/AdvancedExport';
import { BulkOperations } from '@/components/BulkOperations';
import { AIContentGenerator } from '@/components/AIContentGenerator';
import { AutomationRules } from '@/components/AutomationRules';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Zap, Search, Download, CheckSquare, Sparkles, Settings } from 'lucide-react';

/**
 * Productivity Hub - Enterprise-grade productivity tools
 * Export, Bulk Operations, AI Generation, Automation, Advanced Search
 */

export function ProductivityPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'export' | 'bulk' | 'ai' | 'automation'>('search');

  const tabs = [
    { id: 'search', label: 'Advanced Search', icon: Search, color: 'text-blue-500' },
    { id: 'ai', label: 'AI Generator', icon: Sparkles, color: 'text-purple-500' },
    { id: 'automation', label: 'Automation', icon: Zap, color: 'text-yellow-500' },
    { id: 'bulk', label: 'Bulk Operations', icon: CheckSquare, color: 'text-green-500' },
    { id: 'export', label: 'Export Data', icon: Download, color: 'text-orange-500' },
  ] as const;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Productivity Hub</h1>
            <p className="text-muted-foreground">
              Enterprise-grade tools to supercharge your workflow
            </p>
          </div>
          <Badge variant="gray" className="gap-1">
            <Settings className="h-3 w-3" />
            5 Power Tools
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Searches Today', value: '127', change: '+12%', icon: Search },
            { label: 'Content Generated', value: '45', change: '+8%', icon: Sparkles },
            { label: 'Active Automations', value: '8', change: '→', icon: Zap },
            { label: 'Bulk Operations', value: '23', change: '+15%', icon: CheckSquare },
            { label: 'Data Exports', value: '12', change: '+5%', icon: Download },
          ].map((stat, i) => (
            <Card key={i} className="p-4" data-testid={`stat-${i}`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <Badge variant="gray" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <Card className="p-2">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-current' : tab.color}`} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Active Tab Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'search' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Advanced Search</h2>
              <AdvancedSearch />
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">AI Content Generator</h2>
              <AIContentGenerator />
            </div>
          )}

          {activeTab === 'automation' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Automation Rules</h2>
              <AutomationRules />
            </div>
          )}

          {activeTab === 'bulk' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Bulk Operations</h2>
              <BulkOperations />
            </div>
          )}

          {activeTab === 'export' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Advanced Export</h2>
              <AdvancedExport />
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <h3 className="font-semibold mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use <kbd className="px-2 py-1 bg-muted rounded">/ </kbd> to quickly focus the search bar</li>
            <li>• Save frequently used searches for instant access</li>
            <li>• Combine automation rules with AI generation for maximum efficiency</li>
            <li>• Schedule bulk operations during off-peak hours for better performance</li>
            <li>• Export your data regularly to maintain backups</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default ProductivityPage;
