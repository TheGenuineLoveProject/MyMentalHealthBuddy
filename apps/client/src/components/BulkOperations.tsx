import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, Trash2, Calendar, Tag, Copy, Archive, Move } from 'lucide-react';

/**
 * Bulk Operations Manager
 * Batch editing, bulk actions across multiple items
 */

interface BulkItem {
  id: string;
  title: string;
  type: string;
  status: string;
  selected?: boolean;
}

interface BulkOperationsProps {
  items?: BulkItem[];
  onBulkAction?: (action: string, itemIds: string[]) => void;
}

export function BulkOperations({ items = [], onBulkAction }: BulkOperationsProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const defaultItems: BulkItem[] = items.length > 0 ? items : [
    { id: '1', title: 'Understanding Anxiety', type: 'blog', status: 'published' },
    { id: '2', title: 'Mindfulness Meditation Guide', type: 'video', status: 'draft' },
    { id: '3', title: 'Daily Affirmations', type: 'podcast', status: 'scheduled' },
    { id: '4', title: 'Sleep Better Tonight', type: 'blog', status: 'published' },
    { id: '5', title: 'Stress Management Tips', type: 'infographic', status: 'draft' },
  ];

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleAll = () => {
    if (selectedItems.size === defaultItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(defaultItems.map(item => item.id)));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedItems.size === 0) {
      toast({
        title: 'No Items Selected',
        description: 'Please select items to perform bulk actions',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onBulkAction) {
        onBulkAction(action, Array.from(selectedItems));
      }

      toast({
        title: 'Bulk Action Complete',
        description: `${action} applied to ${selectedItems.size} items`,
      });

      setSelectedItems(new Set());
    } catch (error) {
      toast({
        title: 'Action Failed',
        description: 'Unable to complete bulk action',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const bulkActions = [
    { id: 'publish', label: 'Publish', icon: CheckSquare, variant: 'default' as const },
    { id: 'schedule', label: 'Schedule', icon: Calendar, variant: 'outline' as const },
    { id: 'tag', label: 'Add Tags', icon: Tag, variant: 'outline' as const },
    { id: 'duplicate', label: 'Duplicate', icon: Copy, variant: 'outline' as const },
    { id: 'archive', label: 'Archive', icon: Archive, variant: 'outline' as const },
    { id: 'delete', label: 'Delete', icon: Trash2, variant: 'outline' as const },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Bulk Operations</h3>
          <p className="text-sm text-muted-foreground">
            Select and manage multiple items at once
          </p>
        </div>
        <Badge variant="outline">
          {selectedItems.size} / {defaultItems.length} selected
        </Badge>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedItems.size > 0 && (
        <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex flex-wrap gap-2">
            {bulkActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                onClick={() => handleBulkAction(action.id)}
                disabled={isProcessing}
                data-testid={`bulk-action-${action.id}`}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Select All Checkbox */}
      <div className="mb-4 pb-4 border-b flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedItems.size === defaultItems.length}
          onChange={toggleAll}
          className="rounded"
          data-testid="checkbox-select-all"
        />
        <label className="text-sm font-medium cursor-pointer" onClick={toggleAll}>
          Select All ({defaultItems.length} items)
        </label>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {defaultItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              selectedItems.has(item.id)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => toggleItem(item.id)}
            data-testid={`bulk-item-${item.id}`}
          >
            <input
              type="checkbox"
              checked={selectedItems.has(item.id)}
              onChange={() => toggleItem(item.id)}
              className="rounded"
              data-testid={`checkbox-item-${item.id}`}
            />
            <div className="flex-1">
              <div className="font-medium text-sm">{item.title}</div>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Operations Stats */}
      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{selectedItems.size}</div>
          <div className="text-xs text-muted-foreground">Selected</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{defaultItems.length - selectedItems.size}</div>
          <div className="text-xs text-muted-foreground">Remaining</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{defaultItems.length}</div>
          <div className="text-xs text-muted-foreground">Total Items</div>
        </div>
      </div>
    </Card>
  );
}
