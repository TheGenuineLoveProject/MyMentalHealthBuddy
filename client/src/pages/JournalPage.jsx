import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { deriveGovernance } from "@/governance/interactions/deriveGovernance";
import { buildGovernanceAttrs } from "@/governance/interactions/buildGovernanceAttrs";
import { HEALING_FLOW_PROTECTION_RULES } from "@/governance/interactions/HealingFlowProtectionRules";

// HX-OS Interaction Governance — passive crisis-language detection.
// Pure read-only regex; no fetch, no AI, no behavior modification.
import { CRISIS_LANGUAGE_PATTERN } from "@/governance/interactions/CrisisLanguagePattern";

// Per HealingFlowProtectionRules.protectedHealingFlows — "journaling" is one of
// the 8 protected healing flows. Pinned constant so any future split-route
// retains the contract without depending on prop-drilling.
const JOURNAL_IS_HEALING_FLOW =
  HEALING_FLOW_PROTECTION_RULES.isProtected("journaling");
import { Notebook, Plus, Trash2, ChevronDown, ChevronUp, PenLine, Calendar, Sparkles, X, Lightbulb, RefreshCw, Share2 } from "lucide-react";
import ReflectionCardExport from "../components/ReflectionCardExport";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import SEO from "../components/SEO";
import { useGamification } from "../context/GamificationContext.jsx";
import { miReflectivePrompts } from "../content/frameworks/motivationalInterviewing";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useAuth } from "../context/AuthContext";
import JournalAI from "../components/JournalAI";
import DataExportButton from "../components/DataExportButton";
import { OfficialLumi } from "@/lumi-registry";

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
    <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20" data-testid="journal-prompts">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">{currentPrompt.category}</span>
            <p className="text-sm text-foreground mt-1 break-words">{currentPrompt.prompt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={refreshPrompt}
            className="p-2 rounded-lg hover:bg-primary/10 transition text-primary"
            aria-label="Get new prompt"
            data-testid="button-refresh-prompt"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onSelectPrompt(currentPrompt)}
            className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition"
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
  const [currentMood, setCurrentMood] = useState("neutral");
  const [shareWithCommunity, setShareWithCommunity] = useState(false);
  const [shareAnonymously, setShareAnonymously] = useState(true);
  
  const { user } = useAuth();
  const { awardXp } = useGamification();

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

  const { data: moodEntries = [] } = useQuery({
    queryKey: ["/api/mood"],
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (data?.entries && Array.isArray(data.entries)) return data.entries;
      return [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/journal", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      awardXp("journal-entry", 180, { type: "journaling" }).catch(() => {});
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
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
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
    createMutation.mutate({ 
      title, 
      content,
      shareWithCommunity,
      isAnonymous: shareAnonymously,
      mood: currentMood
    });
  }

  function handleDelete(id) {
    if (!confirm("Would you like to remove this entry? This can't be undone.")) return;
    deleteMutation.mutate(id);
  }

  // HX-OS Interaction Governance — Runtime Enforcement (v5.8.122, Journal iter 4).
  // Passive observation only. No fetch, no AI, no UI mutation, no behavior change.
  // Scans the active draft (title+content) plus the last 5 saved entries for
  // crisis language and derives suspension state via CrisisOverrideEngine +
  // MonetizationBoundaryValidator. /journal is a regulated HEALING_DOMAIN route
  // per AtlasRoutingGovernance, so monetizationGate.allowed is always false here
  // (defense-in-depth even without a crisis signal).
  const crisisDetected = useMemo(() => {
    const recent = Array.isArray(entries) ? entries.slice(0, 5) : [];
    const haystack = [
      title,
      content,
      ...recent.map((e) => `${e?.title ?? ""} ${e?.content ?? ""}`),
    ].join(" ");
    return CRISIS_LANGUAGE_PATTERN.test(haystack);
  }, [title, content, entries]);

  const governance = useMemo(
    () =>
      deriveGovernance({
        route: "/journal",
        healingFlow: JOURNAL_IS_HEALING_FLOW,
        crisisDetected,
        vulnerable: crisisDetected,
        escalation: JOURNAL_IS_HEALING_FLOW,
      }),
    [crisisDetected],
  );

  const governanceAttrs = useMemo(
    () =>
      buildGovernanceAttrs({
        surface: "journal",
        healingFlow: JOURNAL_IS_HEALING_FLOW,
        crisisDetected,
        vulnerable: crisisDetected,
        overrideState: governance.overrideState,
        monetizationGate: governance.monetizationGate,
      }),
    [crisisDetected, governance],
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 rounded-lg bg-muted animate-pulse"></div>
          <div className="h-4 w-72 rounded bg-muted animate-pulse"></div>
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="hxos-vnext"
      data-testid="journal-page-root"
      {...governanceAttrs}
    >
    <WellnessPageShell
      title="Reflective Journal"
      subtitle="Write freely, at your own pace. There's no right way to do this."
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
      <SEO 
        title="Reflective Journal — The Genuine Love Project"
        description="A safe, private space to process thoughts, honor feelings, and witness your growth."
      />

      {/* v5.8.72 — canonical Lumi (LUMI_SOFT_PRESENCE) at top of journal area */}
      <div className="flex items-center gap-3 mb-4">
        <OfficialLumi variant="LUMI_SOFT_PRESENCE" scene="page-header" position="card" pageId="journal" widthPx={100} decorative />
        <p className="text-sm text-foreground/70">A quiet space to write — Lumi is here.</p>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <DataExportButton dataType="journals" />
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
          data-testid="button-new"
          aria-expanded={showForm}
          aria-controls="journal-form"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Entry
        </button>
      </div>

      {!showForm && <JournalPrompts onSelectPrompt={handleSelectPrompt} />}
          
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center justify-between" role="alert" data-testid="text-error">
          <span>{error}</span>
          <button 
            onClick={() => setError("")} 
            className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {showForm && (
        <form 
          id="journal-form" 
          onSubmit={handleSubmit} 
          className="mb-6 p-5 rounded-xl border border-border bg-card" 
          data-testid="form-journal" 
          aria-label="New journal entry form"
        >
          <div className="flex items-center gap-2 mb-5">
            <PenLine className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">New Journal Entry</h2>
          </div>
          
          <div className="mb-4">
            <label htmlFor="journal-title" className="block text-sm font-medium mb-2 text-muted-foreground">Title</label>
            <input
              id="journal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A word or phrase to remember this by..."
              className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              data-testid="input-title"
              autoComplete="off"
            />
          </div>
          
          <div className="mb-5">
            <label htmlFor="journal-content" className="block text-sm font-medium mb-2 text-muted-foreground">Content</label>
            <textarea
              id="journal-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Whatever is on your mind — no pressure, no structure needed..."
              rows={6}
              className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              data-testid="input-content"
            />
          </div>

          {content.length > 20 && (
            <div className="mb-5">
              <JournalAI 
                journalText={content}
                onAnalysisComplete={(analysis) => {
                  if (analysis?.mood) {
                    setCurrentMood(analysis.mood);
                  }
                }}
                showVoice={true}
              />
            </div>
          )}

          <div className="mb-5 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Share2 className="w-4 h-4 text-primary" aria-hidden="true" />
                <div>
                  <span className="font-medium text-foreground block text-sm">Share with Community</span>
                  <span className="text-xs text-muted-foreground">Share your reflection anonymously</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={shareWithCommunity}
                onChange={(e) => setShareWithCommunity(e.target.checked)}
                className="w-5 h-5 rounded text-primary focus:ring-primary"
                data-testid="toggle-share"
              />
            </label>
            
            {shareWithCommunity && (
              <div className="mt-3 pt-3 border-t border-primary/20">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareAnonymously}
                    onChange={(e) => setShareAnonymously(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                    data-testid="toggle-anonymous"
                  />
                  <span className="text-sm text-muted-foreground">Share anonymously (hide your name)</span>
                </label>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
              data-testid="button-save"
              aria-busy={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
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
              className="px-4 py-2.5 rounded-xl font-medium border border-border text-foreground hover:bg-muted transition-colors text-sm"
              data-testid="button-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-border bg-card" role="status">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Notebook className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Your journal is waiting</h2>
          <p className="text-sm text-muted-foreground mb-5">Whenever you're ready, this space is here for you. No rush.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors inline-flex items-center gap-2 text-sm"
            data-testid="button-first-entry"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Write Your First Entry
          </button>
        </div>
      ) : (
        <section className="space-y-3" aria-label="Journal entries">
          {entries.map((entry, index) => (
            <article
              key={entry.id}
              className="rounded-xl border border-border bg-card"
              data-testid={`entry-${entry.id}`}
            >
              <div
                className="p-4 flex items-center justify-between gap-2 cursor-pointer hover:bg-muted/50 transition"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setExpandedId(expandedId === entry.id ? null : entry.id)}
                aria-expanded={expandedId === entry.id}
                aria-controls={`entry-content-${entry.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <PenLine className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">{entry.title || "Untitled"}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <time dateTime={entry.createdAt}>
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }}
                    disabled={deleteMutation.isPending}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
                    data-testid={`button-delete-${entry.id}`}
                    aria-label={`Delete entry: ${entry.title || "Untitled"}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                  {expandedId === entry.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </div>
              </div>
              {expandedId === entry.id && (
                <div 
                  id={`entry-content-${entry.id}`} 
                  className="px-4 pb-4 border-t border-border pt-4"
                >
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words" style={{ overflowWrap: 'anywhere' }}>{entry.content}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEntryForCard(entry);
                      setReflectionCardOpen(true);
                    }}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
                    data-testid={`btn-reflection-card-${entry.id}`}
                  >
                    <Share2 className="w-3 h-3" />
                    Create Reflection Card
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      <ReflectionCardExport
        isOpen={reflectionCardOpen}
        onClose={() => {
          setReflectionCardOpen(false);
          setSelectedEntryForCard(null);
        }}
        suggestedQuotes={selectedEntryForCard?.content?.split('\n').filter(line => line.trim().length > 10).slice(0, 5) || []}
        source="journal"
      />
  </WellnessPageShell>
  </div>
  );
}
