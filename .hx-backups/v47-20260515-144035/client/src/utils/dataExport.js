export function exportToCSV(data, filename = "wellness-data") {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return "";
        if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        if (value instanceof Date) {
          return value.toISOString();
        }
        return String(value);
      }).join(",")
    )
  ];

  const csvContent = csvRows.join("\n");
  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

export function exportToJSON(data, filename = "wellness-data") {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, "application/json");
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function formatMoodDataForExport(moods) {
  return moods.map(mood => ({
    date: new Date(mood.createdAt).toLocaleDateString(),
    time: new Date(mood.createdAt).toLocaleTimeString(),
    emotion: mood.emotion || "neutral",
    intensity: mood.intensity || 5,
    note: mood.content || mood.note || ""
  }));
}

export function formatJournalDataForExport(journals) {
  return journals.map(journal => ({
    date: new Date(journal.createdAt).toLocaleDateString(),
    time: new Date(journal.createdAt).toLocaleTimeString(),
    emotion: journal.emotion || "neutral",
    text: journal.text || "",
    type: journal.type || "journal"
  }));
}

export default {
  exportToCSV,
  exportToJSON,
  formatMoodDataForExport,
  formatJournalDataForExport
};
