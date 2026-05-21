import { useState } from "react";
import { Link } from "wouter";
import { Leaf, Save, RefreshCw, Check, Clock, Sun, Moon, Coffee } from 'lucide-react';
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Textarea } from "@/components/ui/textarea";

const TIME_OF_DAY = [
  { id: "morning", label: "Morning", icon: Sun, practices: ["Breathwork", "Intention setting", "Gentle movement"] },
  { id: "midday", label: "Midday", icon: Coffee, practices: ["Short meditation", "Grounding exercise", "Gratitude pause"] },
  { id: "evening", label: "Evening", icon: Moon, practices: ["Reflection", "Body scan", "Digital sunset"] }
];

const CALM_TOOLS = [
  { id: "breathwork", name: "Breathwork", duration: "3 min" },
  { id: "grounding", name: "Grounding", duration: "2 min" },
  { id: "body-scan", name: "Body Scan", duration: "5 min" },
  { id: "meditation", name: "Meditation", duration: "10 min" },
  { id: "journaling", name: "Journaling", duration: "5 min" },
  { id: "gratitude", name: "Gratitude", duration: "2 min" }
];

export default function CalmPlan() {
  const [selections, setSelections] = useState({
    morning: [],
    midday: [],
    evening: []
  });
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const toggleTool = (timeSlot, toolId) => {
    setSelections(prev => ({
      ...prev,
      [timeSlot]: prev[timeSlot].includes(toolId)
        ? prev[timeSlot].filter(t => t !== toolId)
        : [...prev[timeSlot], toolId]
    }));
    setSaved(false);
  };

  const handleSave = () => {
    const plan = { selections, notes, savedAt: new Date().toISOString() };
    try { localStorage.setItem("glp_calm_plan", JSON.stringify(plan)); } catch (err) { console.warn("[storage-safe-write]", err); }
    setSaved(true);
  };

  const handleReset = () => {
    setSelections({ morning: [], midday: [], evening: [] });
    setNotes("");
    setSaved(false);
  };

  const totalMinutes = Object.values(selections).flat().reduce((sum, toolId) => {
    const tool = CALM_TOOLS.find(t => t.id === toolId);
    return sum + (tool ? parseInt(tool.duration) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="My Calm Plan — The Genuine Love Project"
        description="Create your personalized daily calm plan."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm mb-4">
            <Leaf className="w-4 h-4" />
            <span>Personalized Plan</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Calm Plan
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Build a gentle daily routine that supports your wellbeing. 
            Choose practices for each part of your day.
          </p>
        </header>

        <div className="grid gap-6 mb-8">
          {TIME_OF_DAY.map(time => {
            const Icon = time.icon;
            return (
              <Card key={time.id} data-testid={`card-time-${time.id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="w-5 h-5 text-primary" />
                    {time.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Suggestions: {time.practices.join(", ")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CALM_TOOLS.map(tool => {
                      const isSelected = selections[time.id].includes(tool.id);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => toggleTool(time.id, tool.id)}
                          className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                          data-testid={`tool-${time.id}-${tool.id}`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          {tool.name}
                          <span className="opacity-70">({tool.duration})</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Personal Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any reminders, intentions, or notes for yourself..."
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
              rows={3}
              data-testid="textarea-notes"
            />
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Total: <strong>{totalMinutes} min</strong>/day</span>
            </div>
            {saved && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} data-testid="button-reset">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} data-testid="button-save">
              <Save className="w-4 h-4 mr-2" />
              Save Plan
            </Button>
          </div>
        </div>
      </main>

      <SafetyFooter />
    </div>
  );
}
