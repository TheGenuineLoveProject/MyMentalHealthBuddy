import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/hooks';
import { Download, FileText, Database, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
export function AdvancedExport({ onExport }) {
    const [format, setFormat] = useState('csv');
    const [dataType, setDataType] = useState('analytics');
    const [includeMetadata, setIncludeMetadata] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const { success, error } = useToast();
    const exportFormats = [
        { id: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values for spreadsheets' },
        { id: 'json', label: 'JSON', icon: Database, description: 'Structured data for developers' },
        { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel workbook' },
        { id: 'pdf', label: 'PDF', icon: FileText, description: 'Printable report document' },
    ];
    const dataTypes = [
        { id: 'analytics', label: 'Analytics Data', description: 'Performance metrics and insights' },
        { id: 'content', label: 'Content Library', description: 'All published and draft content' },
        { id: 'moods', label: 'Mood Tracking', description: 'Mood history and patterns' },
        { id: 'journals', label: 'Journal Entries', description: 'Private journal entries' },
        { id: 'all', label: 'Complete Export', description: 'All data in one file' },
    ];
    const exportTemplates = [
        { id: 'standard', name: 'Standard Report', description: 'Default export format' },
        { id: 'executive', name: 'Executive Summary', description: 'High-level overview' },
        { id: 'detailed', name: 'Detailed Analysis', description: 'Comprehensive data with all fields' },
        { id: 'custom', name: 'Custom Template', description: 'Create your own export template' },
    ];
    const handleExport = async () => {
        setIsExporting(true);
        const options = {
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
            success('Export Complete', `Your ${dataType} data has been exported as ${format.toUpperCase()}`);
            // Simulate file download
            const filename = `mymentalhealthbuddy-${dataType}-${new Date().toISOString().split('T')[0]}.${format}`;
            console.log(`Downloading: ${filename}`);
        }
        catch (err) {
            error('Export Failed', 'Unable to export data. Please try again.');
        }
        finally {
            setIsExporting(false);
        }
    };
    return (_jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-1", children: "Advanced Export" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Export your data in multiple formats with custom templates" })] }), _jsxs(Badge, { variant: "primary", className: "gap-1", children: [_jsx(Download, { className: "h-3 w-3" }), "Multi-Format"] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-3 block", children: "Export Format" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: exportFormats.map((fmt) => (_jsxs("button", { onClick: () => setFormat(fmt.id), className: `p-4 rounded-lg border-2 transition-all ${format === fmt.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'}`, "data-testid": `export-format-${fmt.id}`, children: [_jsx(fmt.icon, { className: `h-6 w-6 mb-2 ${format === fmt.id ? 'text-primary' : 'text-muted-foreground'}` }), _jsx("div", { className: "font-medium text-sm", children: fmt.label }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: fmt.description })] }, fmt.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-3 block", children: "Data to Export" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: dataTypes.map((type) => (_jsxs("button", { onClick: () => setDataType(type.id), className: `p-3 rounded-lg border-2 text-left transition-all ${dataType === type.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'}`, "data-testid": `export-datatype-${type.id}`, children: [_jsx("div", { className: "font-medium text-sm", children: type.label }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: type.description })] }, type.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-3 block", children: "Export Template" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: exportTemplates.map((template) => (_jsxs("div", { className: "p-3 rounded-lg border hover:border-primary/50 transition-all cursor-pointer", "data-testid": `export-template-${template.id}`, children: [_jsx("div", { className: "font-medium text-sm", children: template.name }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: template.description })] }, template.id))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-sm font-medium block", children: "Export Options" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "metadata", checked: includeMetadata, onChange: (e) => setIncludeMetadata(e.target.checked), className: "rounded", "data-testid": "checkbox-metadata" }), _jsx("label", { htmlFor: "metadata", className: "text-sm cursor-pointer", children: "Include metadata (timestamps, user info, tags)" })] })] }), _jsxs("div", { className: "flex gap-3 pt-4 border-t", children: [_jsx(Button, { onClick: handleExport, disabled: isExporting, className: "flex-1", "data-testid": "button-export", children: isExporting ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Exporting..."] })) : (_jsxs(_Fragment, { children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export ", format.toUpperCase()] })) }), _jsxs(Button, { variant: "secondary", "data-testid": "button-schedule-export", children: [_jsx(Calendar, { className: "h-4 w-4 mr-2" }), "Schedule"] }), _jsxs(Button, { variant: "secondary", "data-testid": "button-filter-export", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), "Filters"] })] })] }), _jsxs("div", { className: "mt-6 pt-6 border-t", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-3", children: "Recent Exports" }), _jsx("div", { className: "space-y-2", children: [
                            { name: 'analytics-2025-10-29.csv', size: '2.4 MB', time: '2 hours ago' },
                            { name: 'content-library-2025-10-28.json', size: '1.8 MB', time: 'Yesterday' },
                            { name: 'mood-tracking-2025-10-27.xlsx', size: '856 KB', time: '2 days ago' },
                        ].map((file, i) => (_jsxs("div", { className: "flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors", "data-testid": `recent-export-${i}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: file.name }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [file.size, " \u2022 ", file.time] })] })] }), _jsx(Button, { variant: "ghost", size: "sm", "data-testid": `download-recent-${i}`, children: _jsx(Download, { className: "h-4 w-4" }) })] }, i))) })] })] }));
}
