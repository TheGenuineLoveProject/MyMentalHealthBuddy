type SavedReflection = {
  createdAt: string;
  reflection: string;
  cards?: { title: string; body: string }[];
  tags?: string[];
};

const STORAGE_KEY = "glp_saved_reflections";

function loadReflections(): SavedReflection[] {
  try {
    return ((()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  } catch {
    return [];
  }
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function exportToMarkdown(): string {
  const reflections = loadReflections();

  if (reflections.length === 0) {
    return "# My Reflections\n\nNo reflections saved yet.";
  }

  let md = `# My Reflections - MyMentalHealthBuddy\n\n`;
  md += `*Exported on ${formatDate(new Date().toISOString())}*\n\n`;
  md += `---\n\n`;

  for (const r of reflections) {
    md += `## ${formatDate(r.createdAt)}\n\n`;

    if (r.tags && r.tags.length > 0) {
      md += `**Tags:** ${r.tags.join(", ")}\n\n`;
    }

    md += `${r.reflection}\n\n`;

    if (r.cards && r.cards.length > 0) {
      md += `### Insights\n\n`;
      for (const card of r.cards) {
        md += `- **${card.title}:** ${card.body}\n`;
      }
      md += `\n`;
    }

    md += `---\n\n`;
  }

  md += `\n*You know yourself best.*\n`;

  return md;
}

export function downloadMarkdown(): void {
  const content = exportToMarkdown();
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `reflections-${new Date().toISOString().split("T")[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToJSON(): string {
  const reflections = loadReflections();
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      platform: "MyMentalHealthBuddy by The Genuine Love Project",
      reflectionCount: reflections.length,
      reflections,
    },
    null,
    2
  );
}

export function downloadJSON(): void {
  const content = exportToJSON();
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `reflections-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getReflectionCount(): number {
  return loadReflections().length;
}

export function clearAllReflections(): void {
  if (confirm("This will permanently delete all saved reflections. Continue?")) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) { console.warn("[storage-safe-write]", err); }
  }
}
