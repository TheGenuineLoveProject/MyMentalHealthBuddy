import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { Download, FileText, Database, FileSpreadsheet, Calendar, Filter } from 'lucide-react';

/**
 * Advanced Export System
 * Multi-format export with templates, scheduling, and filters
 */

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf' | 'excel';
  dataType: 'analytics' | 'content' | 'moods' | 'journals' | 'all';
  dateRange?: { start: Date; end: Date };
  includeMetadata?: boolean;
  template?: string;
}

interface AdvancedExportProps {
  onExport?: (options: ExportOptions) => void;
}

export function AdvancedExport({ onExport }: AdvancedExportProps) {
  const [format, setFormat] = useState<ExportOptions['format']>('csv');
  const [dataType, setDataType] = useState<ExportOptions['dataType']>('analytics');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { addToast } = useToast();

  const exportFormats = [
    { id: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values for spreadsheets' },
    { id: 'json', label: 'JSON', icon: Database, description: 'Structured data for developers' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel workbook' },
    { id: 'pdf', label: 'PDF', icon: FileText, description: 'Printable report document' },
  ] as const;

  const dataTypes = [
    { id: 'analytics', label: 'Analytics Data', description: 'Performance metrics and insights' },
    { id: 'content', label: 'Content Library', description: 'All published and draft content' },
    { id: 'moods', label: 'Mood Tracking', description: 'Mood history and patterns' },
    { id: 'journals', label: 'Journal Entries', description: 'Private journal entries' },
    { id: 'all', label: 'Complete Export', description: 'All data in one file' },
  ] as const;

  const exportTemplates = [
    { id: 'standard', name: 'Standard Report', description: 'Default export format' },
    { id: 'executive', name: 'Executive Summary', description: 'High-level overview' },
    { id: 'detailed', name: 'Detailed Analysis', description: 'Comprehensive data with all fields' },
    { id: 'custom', name: 'Custom Template', description: 'Create your own export template' },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    const options: ExportOptions = {
      format,
      dataType,
      includeMetadata,
    };

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onExport) {
        onExport(options);
      }

      addToast({
        type: 'success',
        message: `Your ${dataType} data has been exported as ${format.toUpperCase()}`,
      });

      // Simulate file download
      const filename = `mymentalhealthbuddy-${dataType}-${new Date().toISOString().split('T')[0]}.${format}`;
      console.log(`Downloading: ${filename}`);
      
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Unable to export data. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Advanced Export</h3>
          <p className="text-sm text-muted-foreground">
            Export your data in multiple formats with custom templates
          </p>
        </div>
        <Badge variant="primary" className="gap-1">
          <Download className="h-3 w-3" />
          Multi-Format
        </Badge>
      </div>

      {/* Export Format Selection */}
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">Export Format</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {exportFormats.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setFormat(fmt.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  format === fmt.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                data-testid={`export-format-${fmt.id}`}
              >
                <fmt.icon className={`h-6 w-6 mb-2 ${format === fmt.id ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="font-medium text-sm">{fmt.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{fmt.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Type Selection */}
        <div>
          <label className="text-sm font-medium mb-3 block">Data to Export</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setDataType(type.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  dataType === type.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                data-testid={`export-datatype-${type.id}`}
              >
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Templates */}
        <div>
          <label className="text-sm font-medium mb-3 block">Export Template</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exportTemplates.map((template) => (
              <div
                key={template.id}
                className="p-3 rounded-lg border hover:border-primary/50 transition-all cursor-pointer"
                data-testid={`export-template-${template.id}`}
              >
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium block">Export Options</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="metadata"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e.target.checked)}
              className="rounded"
              data-testid="checkbox-metadata"
            />
            <label htmlFor="metadata" className="text-sm cursor-pointer">
              Include metadata (timestamps, user info, tags)
            </label>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1"
            data-testid="button-export"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {format.toUpperCase()}
              </>
            )}
          </Button>
          <Button variant="secondary" data-testid="button-schedule-export">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button variant="secondary" data-testid="button-filter-export">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Quick Export Stats */}
      <div className="mt-6 pt-6 border-t">
        <div className="text-sm text-muted-foreground mb-3">Recent Exports</div>
        <div className="space-y-2">
          {[
            { name: 'analytics-2025-10-29.csv', size: '2.4 MB', time: '2 hours ago' },
            { name: 'content-library-2025-10-28.json', size: '1.8 MB', time: 'Yesterday' },
            { name: 'mood-tracking-2025-10-27.xlsx', size: '856 KB', time: '2 days ago' },
          ].map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
              data-testid={`recent-export-${i}`}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{file.size} • {file.time}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" data-testid={`download-recent-${i}`}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
