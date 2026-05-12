import React, { useState, useMemo } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  BookOpen, ArrowLeft, Plus, Search, Calendar, 
  Sparkles, Heart, Clock, ChevronRight, PenLine, X, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSEO } from "@/hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { apiRequest } from "@/lib/queryClient";

const PROMPTS = [
  "What are you grateful for today?",
  "What's weighing on your heart?",
  "Describe a moment of peace you experienced",
  "What would you tell your younger self?"
];

function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function JournalSkeleton() {
  return (
    <div className="space-y-4" data-testid="journal-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card-bordered animate-pulse motion-reduce:animate-none">
          <div className="h-5 w-2/3 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-full bg-gray-100 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-100 rounded mb-4" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-100 rounded-full" />
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyJournalState({ onNewEntry }) {
  return (
    <div className="card-bordered text-center py-12" data-testid="journal-empty">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--sage-100)] flex items-center justify-center">
        <BookOpen className="w-8 h-8 text-[var(--sage-500)]" />
      </div>
      <h3 className="text-heading-sm text-teal mb-2">Your journal awaits</h3>
      <p className="text-body-sm text-[var(--sage-600)] mb-6 max-w-sm mx-auto">
        Start capturing your thoughts, reflections, and moments of growth. 
        Every entry is a step on your wellness journey.
      </p>
      <Button className="btn-premium" onClick={onNewEntry} data-testid="button-first-entry">
        <Plus className="h-4 w-4 mr-2" />
        Write Your First Entry
      </Button>
    </div>
  );
}

function NewEntryModal({ isOpen, onClose, selectedPrompt }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  // Sync content when modal opens with a new prompt
  React.useEffect(() => {
    if (isOpen && selectedPrompt) {
      setContent(selectedPrompt);
    }
  }, [isOpen, selectedPrompt]);

  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/journal", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      onClose();
      setTitle("");
      setContent("");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      createMutation.mutate({ title: title.trim(), content: content.trim() });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="modal-new-entry" role="dialog" aria-modal="true" aria-labelledby="new-entry-title">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-[var(--sage-200)] flex items-center justify-between">
          <h2 id="new-entry-title" className="text-heading-md text-teal">New Journal Entry</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--sage-100)] rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" data-testid="button-close-modal" aria-label="Close modal">
            <X className="h-5 w-5 text-[var(--sage-500)]" aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-body-sm font-medium text-[var(--sage-700)] mb-2 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="input-premium"
              data-testid="input-entry-title"
              required
            />
          </div>
          <div>
            <label className="text-body-sm font-medium text-[var(--sage-700)] mb-2 block">Your thoughts</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely... this is your safe space."
              className="w-full min-h-[200px] p-4 rounded-xl border border-[var(--sage-200)] focus:border-[var(--teal-400)] focus:ring-2 focus:ring-[var(--teal-100)] outline-none resize-y text-body"
              data-testid="input-entry-content"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="btn-secondary-premium" data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" className="btn-premium" disabled={createMutation.isPending} data-testid="button-save-entry">
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin motion-reduce:animate-none" />
                  Saving...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Save Entry
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Journal() {
  useSEO({
    title: "Journal",
    description: "Your private wellness journal for reflections, gratitude, and emotional processing with guided prompts.",
    noIndex: true
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activePrompt, setActivePrompt] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/journal"],
    staleTime: 30000,
  });

  const entries = data?.data || [];

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter(
      (e) => e.title?.toLowerCase().includes(query) || e.content?.toLowerCase().includes(query)
    );
  }, [entries, searchQuery]);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = entries.filter((e) => new Date(e.createdAt) >= monthStart);
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasEntry = entries.some((e) => {
        const entryDate = new Date(e.createdAt);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });
      if (hasEntry) streak++;
      else if (i > 0) break;
    }
    
    return { total: entries.length, thisMonth: thisMonth.length, streak };
  }, [entries]);

  const openNewEntry = (prompt = "") => {
    setIsModalOpen(true);
  };

  return (
  <WellnessPageShell
    title="Journal"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div className="min-h-screen v28-paper-bg">
      <div className="content-wrapper py-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-container icon-xl icon-gradient-sage">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-display-lg text-teal" data-testid="text-page-title">Your Journal</h1>
                  <p className="text-lead">A safe space for your thoughts and reflections</p>
                </div>
              </div>
              <Button className="btn-premium" onClick={() => setIsModalOpen(true)} data-testid="button-new-entry">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card-bordered">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--sage-400)]" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your entries..."
                    className="input-premium pl-10"
                    data-testid="input-search"
                  />
                </div>
              </div>

              {isLoading ? (
                <JournalSkeleton />
              ) : filteredEntries.length === 0 && entries.length === 0 ? (
                <EmptyJournalState onNewEntry={() => setIsModalOpen(true)} />
              ) : filteredEntries.length === 0 ? (
                <div className="card-bordered text-center py-8">
                  <p className="text-body-sm text-[var(--sage-600)]">No entries match your search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEntries.map((entry) => (
                    <article 
                      key={entry.id} 
                      className="card-bordered hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0" 
                      data-testid={`entry-${entry.id}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-heading-sm text-teal group-hover:text-[var(--teal-600)] transition">{entry.title}</h3>
                        <div className="flex items-center gap-2 text-caption text-[var(--sage-500)]">
                          <Clock className="h-4 w-4" />
                          {formatRelativeDate(entry.createdAt)}
                        </div>
                      </div>
                      <p className="text-body-sm text-[var(--sage-600)] mb-4 line-clamp-2">{entry.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-[var(--sage-100)] text-[var(--sage-700)] text-caption">
                          Journal Entry
                        </span>
                        <ChevronRight className="h-5 w-5 text-[var(--sage-400)] group-hover:text-[var(--teal-500)] transition" />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="card-bordered">
                <h3 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[var(--gold-500)]" />
                  Writing Prompts
                </h3>
                <div className="space-y-3">
                  {PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePrompt(i)}
                      className={`w-full text-left p-3 rounded-xl text-body-sm transition ${
                        activePrompt === i
                          ? 'bg-[var(--sage-100)] border border-[var(--sage-400)]'
                          : 'bg-[var(--sage-50)] hover:bg-[var(--sage-100)]'
                      }`}
                      data-testid={`prompt-${i}`}
                    >
                      <PenLine className="h-4 w-4 inline mr-2 text-[var(--sage-500)]" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-bordered">
                <h3 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--teal-500)]" />
                  Journal Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--sage-50)]">
                    <span className="text-body-sm">Total Entries</span>
                    <span className="text-heading-sm text-teal" data-testid="stat-total">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--sage-50)]">
                    <span className="text-body-sm">This Month</span>
                    <span className="text-heading-sm text-teal" data-testid="stat-month">{stats.thisMonth}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--sage-50)]">
                    <span className="text-body-sm">Current Streak</span>
                    <span className="text-heading-sm text-teal" data-testid="stat-streak">{stats.streak} {stats.streak === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>
              </div>

              <div className="card-bordered bg-[var(--gold-50)] border-[var(--gold-200)]">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-[var(--blush-500)]" />
                  <h3 className="text-heading-sm text-teal">Daily Tip</h3>
                </div>
                <p className="text-body-sm text-[var(--sage-600)]">
                  Writing for just 10 minutes a day can significantly improve emotional clarity and reduce stress.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
      <NewEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedPrompt={PROMPTS[activePrompt]}
      />
  </WellnessPageShell>
  );
}
