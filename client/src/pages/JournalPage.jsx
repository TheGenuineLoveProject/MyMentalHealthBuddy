import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Notebook, Plus, Trash2, ChevronDown, ChevronUp, PenLine, Calendar, Sparkles, X, Lightbulb, RefreshCw, Share2 } from "lucide-react";
import ReflectionCardExport from "../components/ReflectionCardExport";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import BenefitsBlock from "../components/BenefitsBlock";
import ClarityCard from "../components/content/ClarityCard";
import ExamplesAccordion from "../components/content/ExamplesAccordion";
import { miReflectivePrompts, miPrinciples } from "../content/frameworks/motivationalInterviewing";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { MIPromptCard } from "@/components/mi/MIPromptCard";

const JOURNAL_CLARITY = {
  what: "A private journaling space with gentle prompts to help you process thoughts and emotions.",
  who: "Anyone seeking a safe place to reflect, process feelings, or track their inner journey.",
  when: "Daily practice, during emotional moments, or whenever you need to 'write it out.'",
  why: "Writing helps externalize thoughts, process emotions, and notice patterns over time.",
  howSteps: [
    "Choose a prompt or write freely",
    "Write without editing or judging yourself",
    "Save your entry (or use silence mode for no-save writing)",
    "Review past entries to notice patterns and growth"
  ],
  whereLinkText: "Learn about journaling benefits",
  whereHref: "/wisdom/journaling"
};

const JOURNAL_EXAMPLES = [
  {
    level: "beginner",
    title: "Your first journal entry",
    situation: "You've never journaled before and feel unsure what to write.",
    action: "Use the random prompt button and write for just 3 minutes without stopping.",
    result: "You discover journaling feels less intimidating than expected and want to try again."
  },
  {
    level: "intermediate",
    title: "Processing a difficult emotion",
    situation: "You're feeling anxious about a work presentation and can't stop ruminating.",
    action: "Write out every worry without filtering, then ask yourself 'What's the worst that could happen?'",
    result: "The worries feel smaller on paper, and you identify one concrete action to prepare."
  },
  {
    level: "advanced",
    title: "Tracking emotional patterns",
    situation: "You notice you feel low every Sunday evening but don't know why.",
    action: "Journal specifically about Sunday evenings for several weeks, noting what you did, thought, and felt.",
    result: "You discover the pattern relates to anticipatory anxiety about Mondays and create a calming Sunday ritual."
  }
];

const JOURNAL_PROMPTS = [
  { category: "Gratitude", prompt: "What's one small thing that brought you comfort today?" },
  { category: "Reflection", prompt: "What emotion have you been sitting with lately?" },
  { category: "Self-Compassion", prompt: "If your best friend felt how you feel right now, what would you say to them?" },
  { category: "Growth", prompt: "What's something you handled better this week than you would have before?" },
  { category: "Present Moment", prompt: "What do you notice in your body right now?" },
  { category: "Boundaries", prompt: "Is there something you need to say 'no' to that you've been avoiding?" },
  { category: "Inner Child", prompt: "What would your younger self want you to know?" },
  { category: "Release", prompt: "What are you ready to let go of?" },
  { category: "Hope", prompt: "What possibility are you allowing yourself to believe in?" },
  { category: "Safety", prompt: "Where in your life do you feel most safe and settled?" },
  ...miReflectivePrompts.journaling.map((prompt, i) => ({
    category: ["Values", "Progress", "Obstacles", "Meaning", "Connection"][i % 5],
    prompt
  }))
];

function JournalPrompts({ onSelectPrompt }) {
  const [currentPrompt, setCurrentPrompt] = useState(() => 
    JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]
  );
  
  const refreshPrompt = () => {
    const newPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
    setCurrentPrompt(newPrompt);
  };
  
  return (
    <div className="mb-6 p-4 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary)]/20" data-testid="journal-prompts">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-medium text-[var(--primary)] uppercase tracking-wide">{currentPrompt.category}</span>
            <p className="text-sm text-[var(--text-primary)] mt-1">{currentPrompt.prompt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={refreshPrompt}
            className="p-2 rounded-lg hover:bg-[var(--primary)]/20 transition text-[var(--primary)]"
            aria-label="Get new prompt"
            data-testid="button-refresh-prompt"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onSelectPrompt(currentPrompt)}
            className="px-3 py-1.5 text-xs font-medium bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition"
            data-testid="button-use-prompt"
          >
            Use This
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JournalPage() {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [reflectionCardOpen, setReflectionCardOpen] = useState(false);
  const [selectedEntryForCard, setSelectedEntryForCard] = useState(null);
  
  const handleSelectPrompt = (prompt) => {
    setTitle(prompt.category + " Reflection");
    setContent(prompt.prompt + "\n\n");
    setShowForm(true);
  };

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/journal"],
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (data?.journals && Array.isArray(data.journals)) return data.journals;
      if (data?.data && Array.isArray(data.data)) return data.data;
      return [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/journal", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setTitle("");
      setContent("");
      setShowForm(false);
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Failed to save entry");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/journal/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (err) => {
      setError(err.message || "Failed to delete entry");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    setError("");
    createMutation.mutate({ title, content });
  }

  function handleDelete(id) {
    if (!confirm("Delete this journal entry?")) return;
    deleteMutation.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-mesh">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="skeleton h-10 w-1/3 rounded-xl"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <WellnessPageShell
      title="Reflective Journal"
      subtitle="A safe space for self-expression"
      benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
      clarity={{
        what: "A private journaling space with gentle prompts.",
        why: "To process thoughts, honor feelings, and witness growth.",
        who: "Anyone seeking a safe place to reflect.",
        when: "Daily practice or whenever you need to write it out.",
        where: "Right here, in complete privacy.",
        how: "Choose a prompt or write freely, then save."
      }}
      examples={[
        { label: "Beginner", examples: ["Write one honest sentence about today.", "Name one emotion you're feeling."] },
        { label: "Intermediate", examples: ["Explore a challenging situation.", "Write a letter to yourself."] },
        { label: "Advanced", examples: ["Track patterns over time.", "Practice deep self-reflection."] }
      ]}
    >
    <>
      <SEO 
        title="Reflective Journal - The Genuine Love Project"
        description="A safe, private space to process thoughts, honor feelings, and witness your growth. Express yourself freely with compassionate journaling."
      />
      <div className="min-h-screen safe-padding hero-gradient">
        <div className="container-sm px-responsive">
          <header className="flex-between mb-8">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 text-body-sm text-secondary hover:text-brand transition focus-ring rounded-lg px-2 py-1" 
                data-testid="link-back" 
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="icon-sm" aria-hidden="true" />
                Back
              </Link>
              <div className="flex items-center gap-3">
                <div className="icon-badge icon-badge-sage icon-circle-lg">
                  <Notebook className="icon-md" aria-hidden="true" />
                </div>
                <div className="stack-xs">
                  <h1 className="text-display-sm text-brand" data-testid="text-title">Reflective Journal</h1>
                  <p className="text-body-sm text-secondary">A safe space to process thoughts, honor feelings, and witness your own growth</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-gradient"
              data-testid="button-new"
              aria-expanded={showForm}
              aria-controls="journal-form"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </header>

          <BenefitsBlock 
            benefit="A private space to process thoughts and track your emotional growth"
            duration="5-15 minutes"
            control="Write as much or little as feels right"
            disclaimer="Educational wellness support only"
            className="mb-6"
          />

          <ClarityCard {...JOURNAL_CLARITY} variant="compact" className="mb-6" />

          <ExamplesAccordion 
            examples={JOURNAL_EXAMPLES} 
            title="See how others use journaling"
            className="mb-8"
          />

          {/* Journal Prompts */}
          {!showForm && <JournalPrompts onSelectPrompt={handleSelectPrompt} />}
          
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--accent-rose-soft)] border border-[var(--accent-rose)]/30 text-[var(--accent-rose)] flex items-center justify-between" role="alert" data-testid="text-error">
              <span>{error}</span>
              <button 
                onClick={() => setError("")} 
                className="p-1 hover:bg-[var(--accent-rose)]/20 rounded-lg transition"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* New Entry Form */}
          {showForm && (
            <form 
              id="journal-form" 
              onSubmit={handleSubmit} 
              className="mb-8 card-elevated p-6 animate-scale-in" 
              data-testid="form-journal" 
              aria-label="New journal entry form"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold">New Journal Entry</h2>
              </div>
              
              <div className="mb-4">
                <label htmlFor="journal-title" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Title</label>
                <input
                  id="journal-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="input"
                  data-testid="input-title"
                  autoComplete="off"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="journal-content" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Content</label>
                <textarea
                  id="journal-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts..."
                  rows={6}
                  className="input resize-none"
                  data-testid="input-content"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="btn btn-gradient flex-1"
                  data-testid="button-save"
                  aria-busy={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      Save Entry
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                  data-testid="button-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Empty State */}
          {entries.length === 0 ? (
            <div className="text-center py-16 card-elevated" role="status">
              <div className="w-20 h-20 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center mx-auto mb-6">
                <Notebook className="w-10 h-10 text-[var(--primary)]" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No journal entries yet</h2>
              <p className="text-[var(--text-secondary)] mb-6">Start writing to track your thoughts and feelings</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-gradient"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
                Write Your First Entry
              </button>
            </div>
          ) : (
            <section className="space-y-4" aria-label="Journal entries">
              {entries.map((entry, index) => (
                <article
                  key={entry.id}
                  className="card-elevated overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  data-testid={`entry-${entry.id}`}
                >
                  <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-[var(--card-hover)] transition"
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setExpandedId(expandedId === entry.id ? null : entry.id)}
                    aria-expanded={expandedId === entry.id}
                    aria-controls={`entry-content-${entry.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
                        <PenLine className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{entry.title || "Untitled"}</h3>
                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5 mt-1">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <time dateTime={entry.createdAt}>
                            {new Date(entry.createdAt).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-rose)] hover:bg-[var(--accent-rose-soft)] transition disabled:opacity-50"
                        data-testid={`button-delete-${entry.id}`}
                        aria-label={`Delete entry: ${entry.title || "Untitled"}`}
                      >
                        <Trash2 className="w-5 h-5" aria-hidden="true" />
                      </button>
                      <div className="p-2 text-[var(--text-muted)]">
                        {expandedId === entry.id ? (
                          <ChevronUp className="w-5 h-5" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-5 h-5" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedId === entry.id && (
                    <div 
                      id={`entry-content-${entry.id}`} 
                      className="px-5 pb-5 border-t border-[var(--border)] pt-5 ml-16"
                    >
                      <p className="text-[var(--text)] leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEntryForCard(entry);
                          setReflectionCardOpen(true);
                        }}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)]/20 transition"
                        data-testid={`btn-reflection-card-${entry.id}`}
                      >
                        <Share2 className="w-4 h-4" />
                        Create Reflection Card
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}

          <MIPromptCard context="journal" className="mb-6" />

          <SafetyFooter variant="prominent" />
        </div>
      </div>

      <ReflectionCardExport
        isOpen={reflectionCardOpen}
        onClose={() => {
          setReflectionCardOpen(false);
          setSelectedEntryForCard(null);
        }}
        suggestedQuotes={selectedEntryForCard?.content?.split('\n').filter(line => line.trim().length > 10).slice(0, 5) || []}
        source="journal"
      />
    </>
  </WellnessPageShell>
  );
}
