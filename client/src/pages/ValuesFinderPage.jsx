import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { Heart, Star, Compass, Target, CheckCircle2, Plus, Trash2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VALUE_CATEGORIES = [
  { id: "connection", label: "Connection", icon: Heart, examples: ["Family", "Friendship", "Community", "Belonging"] },
  { id: "growth", label: "Growth", icon: Sparkles, examples: ["Learning", "Creativity", "Achievement", "Wisdom"] },
  { id: "purpose", label: "Purpose", icon: Compass, examples: ["Meaning", "Service", "Impact", "Legacy"] },
  { id: "wellbeing", label: "Wellbeing", icon: Star, examples: ["Health", "Peace", "Joy", "Balance"] },
  { id: "authenticity", label: "Authenticity", icon: Target, examples: ["Honesty", "Integrity", "Freedom", "Expression"] },
];

export default function ValuesFinderPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customValue, setCustomValue] = useState("");
  const [reflection, setReflection] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/wellness-tools/values"],
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest("/api/wellness-tools/values", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/values"] });
      setCustomValue("");
      setReflection("");
      setSelectedCategory(null);
      setSelectedValues([]);
      toast({ title: "Values saved", description: "Your values have been saved to your collection." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not save values. Please try again.", variant: "destructive" });
    },
  });

  const handleAddToSelection = (value) => {
    if (!selectedValues.includes(value)) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleRemoveFromSelection = (value) => {
    setSelectedValues(selectedValues.filter(v => v !== value));
  };

  const handleSaveValues = () => {
    const valuesToSave = customValue.trim() 
      ? [...selectedValues, customValue.trim()] 
      : selectedValues;
    
    if (valuesToSave.length === 0) {
      toast({ title: "No values selected", description: "Please select or add at least one value.", variant: "destructive" });
      return;
    }

    createMutation.mutate({
      coreValues: valuesToSave,
      reflections: reflection || null,
      priorityRanking: valuesToSave,
    });
  };

  return (
    <LayoutWrapper>
      <Hero
        title="Values Finder"
        subtitle="Discover what matters most to you — a gentle exploration of your core values"
        variant="wellness"
        data-testid="hero-values-finder"
      />

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3" data-testid="heading-intro">
              What are values?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed" data-testid="text-intro">
              Values are the qualities and principles that matter most to you. They guide your choices and help you live authentically. 
              There are no right or wrong values — only what feels true for you. Take your time exploring below.
            </p>
          </div>

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-categories">
            Explore value categories
          </h3>

          <CardGrid columns={2}>
            {VALUE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-[var(--primary)]" : ""}`}
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  data-testid={`card-category-${category.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                      <Icon className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--text-primary)] mb-2" data-testid={`heading-category-${category.id}`}>{category.label}</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example) => {
                          const isValueSelected = selectedValues.includes(example);
                          return (
                            <button
                              key={example}
                              onClick={(e) => {
                                e.stopPropagation();
                                isValueSelected ? handleRemoveFromSelection(example) : handleAddToSelection(example);
                              }}
                              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                isValueSelected 
                                  ? "bg-[var(--primary)] text-white" 
                                  : "bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-secondary)]"
                              }`}
                              data-testid={`button-value-${example.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {example}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </CardGrid>

          {selectedValues.length > 0 && (
            <div className="mt-6 p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]" data-testid="section-selected-values">
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2" data-testid="heading-selected">Selected values ({selectedValues.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((value) => (
                  <span key={value} className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)] text-white rounded-full text-sm" data-testid={`chip-value-${value.toLowerCase().replace(/\s+/g, '-')}`}>
                    {value}
                    <button onClick={() => handleRemoveFromSelection(value)} className="ml-1 hover:opacity-80" data-testid={`button-remove-${value.toLowerCase().replace(/\s+/g, '-')}`}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-6 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)]" data-testid="section-add-custom">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-custom">
              Add a custom value or reflection
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="custom-value" data-testid="label-custom-value">
                  Custom value (optional)
                </label>
                <input
                  id="custom-value"
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Type a value that resonates with you..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  data-testid="input-custom-value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="reflection" data-testid="label-reflection">
                  Reflection (optional)
                </label>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Why do these values matter to you? What do they mean in your life?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  data-testid="textarea-reflection"
                />
              </div>
              <Button
                onClick={handleSaveValues}
                disabled={selectedValues.length === 0 && !customValue.trim() || createMutation.isPending}
                data-testid="button-save-values"
              >
                {createMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Save Values
                  </>
                )}
              </Button>
            </div>
          </div>

          {entries.length > 0 && (
            <div className="mt-12" data-testid="section-my-values">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2" data-testid="heading-my-values">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                My Values Entries ({entries.length})
              </h3>
              <div className="grid gap-3">
                {entries.map((entry) => {
                  const values = typeof entry.coreValues === 'string' 
                    ? JSON.parse(entry.coreValues || '[]') 
                    : entry.coreValues || [];
                  return (
                    <div
                      key={entry.id}
                      className="p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]"
                      data-testid={`card-entry-${entry.id}`}
                    >
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Array.isArray(values) && values.map((value, idx) => (
                          <span key={idx} className="px-2 py-1 text-sm bg-[var(--surface-secondary)] rounded-full text-[var(--text-primary)]" data-testid={`text-value-${entry.id}-${idx}`}>
                            {value}
                          </span>
                        ))}
                      </div>
                      {entry.reflections && (
                        <p className="text-sm text-[var(--text-secondary)] italic" data-testid={`text-reflection-${entry.id}`}>"{entry.reflections}"</p>
                      )}
                      <p className="text-xs text-[var(--text-muted)] mt-2" data-testid={`text-date-${entry.id}`}>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8" data-testid="loading-state">
              <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-[var(--text-muted)] mt-2">Loading your values...</p>
            </div>
          )}
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  );
}
