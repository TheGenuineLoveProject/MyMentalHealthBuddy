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
      toast({ title: "Value saved", description: "Your value has been added to your collection." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest(`/api/wellness-tools/values/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/values"] });
      toast({ title: "Value removed", description: "The value has been removed from your collection." });
    },
  });

  const handleAddValue = (value, category) => {
    createMutation.mutate({
      valueName: value,
      category: category,
      reflection: reflection || null,
      priority: entries.length + 1,
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
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              What are values?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Values are the qualities and principles that matter most to you. They guide your choices and help you live authentically. 
              There are no right or wrong values — only what feels true for you. Take your time exploring below.
            </p>
          </div>

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
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
                      <h4 className="font-medium text-[var(--text-primary)] mb-2">{category.label}</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example) => (
                          <button
                            key={example}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddValue(example, category.id);
                            }}
                            className="px-3 py-1 text-sm rounded-full bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-secondary)] transition-colors"
                            data-testid={`button-add-value-${example.toLowerCase()}`}
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </CardGrid>

          {selectedCategory && (
            <div className="mt-8 p-6 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)]" data-testid="section-add-custom">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
                Add a custom value
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Type a value that resonates with you..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  data-testid="input-custom-value"
                />
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Optional: Why does this value matter to you?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  data-testid="textarea-reflection"
                />
                <Button
                  onClick={() => handleAddValue(customValue, selectedCategory)}
                  disabled={!customValue.trim() || createMutation.isPending}
                  data-testid="button-add-custom"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Value
                </Button>
              </div>
            </div>
          )}

          {entries.length > 0 && (
            <div className="mt-12" data-testid="section-my-values">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                My Values ({entries.length})
              </h3>
              <div className="grid gap-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]"
                    data-testid={`card-value-${entry.id}`}
                  >
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">{entry.valueName}</span>
                      {entry.category && (
                        <span className="ml-2 text-sm text-[var(--text-muted)]">• {entry.category}</span>
                      )}
                      {entry.reflection && (
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{entry.reflection}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate(entry.id)}
                      className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                      data-testid={`button-delete-${entry.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8" data-testid="loading-state">
              <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  );
}
