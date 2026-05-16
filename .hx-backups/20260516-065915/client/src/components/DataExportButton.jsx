import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { 
  exportToCSV, 
  exportToJSON, 
  formatMoodDataForExport, 
  formatJournalDataForExport 
} from "../utils/dataExport";

export default function DataExportButton({ 
  dataType = "all",
  className = "" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { data: moods } = useQuery({
    queryKey: ["/api/moods"],
    enabled: dataType === "all" || dataType === "moods"
  });

  const { data: journals } = useQuery({
    queryKey: ["/api/journal"],
    enabled: dataType === "all" || dataType === "journals"
  });

  const handleExport = async (format) => {
    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().split("T")[0];
      
      if (dataType === "moods" && moods) {
        const formatted = formatMoodDataForExport(moods);
        if (format === "csv") {
          exportToCSV(formatted, `mood-data-${timestamp}`);
        } else {
          exportToJSON(formatted, `mood-data-${timestamp}`);
        }
      } else if (dataType === "journals" && journals) {
        const formatted = formatJournalDataForExport(journals);
        if (format === "csv") {
          exportToCSV(formatted, `journal-data-${timestamp}`);
        } else {
          exportToJSON(formatted, `journal-data-${timestamp}`);
        }
      } else {
        const allData = {
          moods: moods ? formatMoodDataForExport(moods) : [],
          journals: journals ? formatJournalDataForExport(journals) : [],
          exportedAt: new Date().toISOString()
        };
        
        if (format === "csv") {
          if (moods?.length) {
            exportToCSV(formatMoodDataForExport(moods), `mood-data-${timestamp}`);
          }
          if (journals?.length) {
            exportToCSV(formatJournalDataForExport(journals), `journal-data-${timestamp}`);
          }
        } else {
          exportToJSON(allData, `wellness-data-${timestamp}`);
        }
      }
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const hasData = (moods?.length > 0) || (journals?.length > 0);

  if (!hasData) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
        data-testid="button-export-data"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">Export</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            data-testid="export-menu-overlay"
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-2">
              <button
                onClick={() => handleExport("csv")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                data-testid="button-export-csv"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">CSV</p>
                  <p className="text-xs text-gray-500">Spreadsheet format</p>
                </div>
              </button>
              <button
                onClick={() => handleExport("json")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                data-testid="button-export-json"
              >
                <FileJson className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">JSON</p>
                  <p className="text-xs text-gray-500">Developer format</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
