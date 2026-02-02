import { useState } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Calendar, Search, Filter, Eye, ChevronDown, ArrowRight } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/use-toast";

const MOCK_REFLECTIONS = [
  { id: "1", date: "2026-01-26", type: "journal", preview: "Felt grateful for...", mood: "peaceful" },
  { id: "2", date: "2026-01-25", type: "mood", preview: "Mood check-in", mood: "happy" },
  { id: "3", date: "2026-01-24", type: "gratitude", preview: "Three things I appreciate...", mood: "content" },
  { id: "4", date: "2026-01-23", type: "journal", preview: "Today I noticed...", mood: "reflective" },
  { id: "5", date: "2026-01-22", type: "mood", preview: "Mood check-in", mood: "calm" },
  { id: "6", date: "2026-01-21", type: "gratitude", preview: "Grateful for support from...", mood: "hopeful" },
  { id: "7", date: "2026-01-20", type: "journal", preview: "Working through...", mood: "processing" },
  { id: "8", date: "2026-01-19", type: "mood", preview: "Mood check-in", mood: "neutral" }
];

const TYPE_COLORS = {
  journal: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  mood: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  gratitude: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
};

export default function ReflectionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleViewReflection = (reflection) => {
    if (reflection.type === "journal") {
      navigate("/journal");
    } else if (reflection.type === "mood") {
      navigate("/mood");
    } else if (reflection.type === "gratitude") {
      navigate("/gratitude");
    }
    toast({ title: "Opening Reflection", description: `Viewing ${reflection.type} from ${reflection.date}` });
  };

  const filteredReflections = MOCK_REFLECTIONS.filter(r => {
    const matchesSearch = r.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.mood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || r.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Reflection History — The Genuine Love Project"
        description="Review your past reflections and insights."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Your Journey</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reflection History
          </h1>
          <p className="text-muted-foreground">
            Look back on your journey with compassion. Each entry is a step forward.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reflections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-2">
            {["all", "journal", "mood", "gratitude"].map(type => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className="capitalize"
                data-testid={`filter-${type}`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredReflections.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">No reflections found</h2>
              <p className="text-muted-foreground mb-4">
                Start your reflection practice today.
              </p>
              <Link href="/journal">
                <Button data-testid="button-start-journal">
                  Start Journaling
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
          ) : (
            filteredReflections.map(reflection => (
              <Card 
                key={reflection.id}
                className="hover:shadow-md transition-all group"
                data-testid={`card-reflection-${reflection.id}`}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(reflection.date)}
                      </div>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[reflection.type]}`}>
                        {reflection.type}
                      </span>
                      <p className="mt-1 text-sm text-foreground">{reflection.preview}</p>
                      <span className="text-xs text-muted-foreground">Mood: {reflection.mood}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleViewReflection(reflection)}
                    data-testid={`button-view-${reflection.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Your reflections are stored securely. Only metadata is shown here for privacy.
        </p>
      </main>

      <SafetyFooter />
    </div>
  );
}
