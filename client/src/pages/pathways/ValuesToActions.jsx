import { useState } from "react";
import { Compass, Plus, X, Check, Save, Calendar } from 'lucide-react';
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";

const EXAMPLE_VALUES = [
  "Compassion", "Growth", "Connection", "Authenticity", "Creativity",
  "Health", "Peace", "Family", "Learning", "Service", "Joy", "Balance"
];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ValuesToActions() {
  const [selectedValues, setSelectedValues] = useState([]);
  const [customValue, setCustomValue] = useState("");
  const [weeklyActions, setWeeklyActions] = useState({});
  const [saved, setSaved] = useState(false);

  const addValue = (value) => {
    if (selectedValues.length < 5 && !selectedValues.includes(value)) {
      setSelectedValues([...selectedValues, value]);
      setSaved(false);
    }
  };

  const removeValue = (value) => {
    setSelectedValues(selectedValues.filter(v => v !== value));
    const newActions = { ...weeklyActions };
    delete newActions[value];
    setWeeklyActions(newActions);
    setSaved(false);
  };

  const addCustomValue = () => {
    if (customValue.trim() && selectedValues.length < 5) {
      addValue(customValue.trim());
      setCustomValue("");
    }
  };

  const setAction = (value, day, action) => {
    setWeeklyActions(prev => ({
      ...prev,
      [value]: {
        ...prev[value],
        [day]: action
      }
    }));
    setSaved(false);
  };

  const handleSave = () => {
    const plan = { selectedValues, weeklyActions, savedAt: new Date().toISOString() };
    try { localStorage.setItem("glp_values_plan", JSON.stringify(plan)); } catch (err) { console.warn("[storage-safe-write]", err); }
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Values to Actions — The Genuine Love Project"
        description="Turn your values into a weekly action plan."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm mb-4">
            <Compass className="w-4 h-4" />
            <span>Weekly Planner</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Values to Actions
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose up to 5 values that matter most to you, then plan small actions 
            for each day that align with what you value.
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Step 1: Choose Your Values (up to 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {EXAMPLE_VALUES.map(value => {
                const isSelected = selectedValues.includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => isSelected ? removeValue(value) : addValue(value)}
                    disabled={selectedValues.length >= 5 && !isSelected}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80 disabled:opacity-50"
                    }`}
                    data-testid={`value-${value.toLowerCase()}`}
                  >
                    {value}
                    {isSelected && <X className="w-3 h-3 ml-1 inline" />}
                  </button>
                );
              })}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add your own value..."
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomValue()}
                disabled={selectedValues.length >= 5}
                data-testid="input-custom-value"
              />
              <Button 
                variant="outline" 
                onClick={addCustomValue}
                disabled={selectedValues.length >= 5 || !customValue.trim()}
                data-testid="button-add-value"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedValues.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Step 2: Plan Weekly Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedValues.map(value => (
                  <div key={value} className="space-y-3">
                    <h3 className="font-medium text-primary">{value}</h3>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {WEEKDAYS.slice(0, 4).map(day => (
                        <div key={day}>
                          <label className="text-xs text-muted-foreground">{day}</label>
                          <Input
                            placeholder="Small action..."
                            value={weeklyActions[value]?.[day] || ""}
                            onChange={(e) => setAction(value, day, e.target.value)}
                            className="mt-1"
                            data-testid={`action-${value.toLowerCase()}-${day.toLowerCase()}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
          <div className="text-sm text-muted-foreground">
            {selectedValues.length}/5 values selected
            {saved && (
              <span className="ml-4 text-green-600 dark:text-green-400 flex items-center gap-1 inline-flex">
                <Check className="w-4 h-4" />
                Saved
              </span>
            )}
          </div>
          <Button 
            onClick={handleSave}
            disabled={selectedValues.length === 0}
            data-testid="button-save-plan"
          >
            <Save className="w-4 h-4 mr-2" />
            Save My Plan
          </Button>
        </div>
      </main>

      <SafetyFooter />
    </div>
  );
}
