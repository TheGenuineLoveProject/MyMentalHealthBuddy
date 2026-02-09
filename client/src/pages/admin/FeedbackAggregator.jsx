import { useState, useEffect } from "react";
import { MessageSquare, Download, Loader2, Bug, Lightbulb, HelpCircle, Heart, Mail, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useToast } from "@/hooks/use-toast";
import SEO from "../../components/SEO";

const CATEGORY_META = {
  bug: { label: "Bug", icon: Bug, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30" },
  idea: { label: "Idea", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  confusion: { label: "Confusion", icon: HelpCircle, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  praise: { label: "Praise", icon: Heart, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
};

export default function FeedbackAggregator() {
  const [filter, setFilter] = useState("all");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("glp_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/feedback", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.feedback)) {
          setFeedback(data.feedback);
        }
      })
      .catch(() => {
        toast({ title: "Could not load feedback", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    setExporting(true);
    try {
      const headers = ["ID", "Category", "Message", "Email", "Date"];
      const rows = feedback.map((f) => [
        f.id,
        f.category,
        `"${f.message.replace(/"/g, '""')}"`,
        f.contactEmail || "",
        f.createdAt,
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `feedback-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Export complete", description: `${feedback.length} items exported.` });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const filtered = filter === "all" ? feedback : feedback.filter((f) => f.category === filter);
  const counts = feedback.reduce((acc, f) => { acc[f.category] = (acc[f.category] || 0) + 1; return acc; }, {});

  return (
    <>
      <SEO title="Feedback - Admin" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-feedback-title">
              <MessageSquare className="w-6 h-6" />
              Feedback ({feedback.length})
            </h1>
            <p className="text-sm text-muted-foreground mt-1">User feedback from the soft launch widget</p>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting || feedback.length === 0}
            data-testid="button-export-feedback"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Export CSV
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            data-testid="button-filter-all"
          >
            All ({feedback.length})
          </Button>
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key)}
                data-testid={`button-filter-${key}`}
              >
                <Icon className={`w-4 h-4 mr-1 ${meta.color}`} />
                {meta.label} ({counts[key] || 0})
              </Button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No feedback yet. The widget is live and collecting responses.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const meta = CATEGORY_META[item.category] || CATEGORY_META.idea;
              const Icon = meta.icon;
              return (
                <Card key={item.id} data-testid={`card-feedback-${item.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                        <Icon className={`w-5 h-5 ${meta.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">{meta.label}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{item.message}</p>
                        {item.contactEmail && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {item.contactEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
