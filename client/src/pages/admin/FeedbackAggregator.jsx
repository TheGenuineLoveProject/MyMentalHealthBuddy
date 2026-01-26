import { useState } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, Star, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";

export default function FeedbackAggregator() {
  const [filter, setFilter] = useState("all");

  const feedback = [
    { id: 1, type: "positive", message: "Love the breathing exercises! They help me calm down.", source: "widget", date: "2026-01-26" },
    { id: 2, type: "negative", message: "The journal autosave lost my entry", source: "support", date: "2026-01-25" },
    { id: 3, type: "positive", message: "The AI chat is so supportive and understanding", source: "widget", date: "2026-01-25" },
    { id: 4, type: "suggestion", message: "Would love a mobile app version", source: "email", date: "2026-01-24" },
    { id: 5, type: "negative", message: "Dark mode colors are too bright", source: "widget", date: "2026-01-24" },
    { id: 6, type: "positive", message: "Helped me through a tough week", source: "review", date: "2026-01-23" }
  ];

  const stats = {
    total: feedback.length,
    positive: feedback.filter(f => f.type === "positive").length,
    negative: feedback.filter(f => f.type === "negative").length,
    suggestions: feedback.filter(f => f.type === "suggestion").length
  };

  const filteredFeedback = feedback.filter(f => 
    filter === "all" || f.type === filter
  );

  const getIcon = (type) => {
    switch (type) {
      case "positive": return <ThumbsUp className="w-5 h-5 text-green-600" />;
      case "negative": return <ThumbsDown className="w-5 h-5 text-red-600" />;
      case "suggestion": return <Star className="w-5 h-5 text-amber-600" />;
      default: return <MessageSquare className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Feedback Aggregator — Admin" noIndex />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-page-title">User Feedback</h1>
                <p className="text-muted-foreground">Aggregate feedback from all sources</p>
              </div>
            </div>
            <Button variant="outline" className="min-h-[44px]" data-testid="button-export">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-4">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-4">
              <p className="text-3xl font-bold text-green-600">{stats.positive}</p>
              <p className="text-sm text-muted-foreground">Positive</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-4">
              <p className="text-3xl font-bold text-red-600">{stats.negative}</p>
              <p className="text-sm text-muted-foreground">Negative</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="pt-4">
              <p className="text-3xl font-bold text-amber-600">{stats.suggestions}</p>
              <p className="text-sm text-muted-foreground">Suggestions</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "positive", "negative", "suggestion"].map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="min-h-[40px] capitalize"
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFeedback.map(item => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {getIcon(item.type)}
                  <div className="flex-1">
                    <p className="mb-2">{item.message}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Source: {item.source}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
