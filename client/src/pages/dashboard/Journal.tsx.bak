import { useState } from "react";
import { Link } from "wouter";
import { 
  BookOpen, ArrowLeft, Plus, Search, Calendar, Tag, 
  Sparkles, Heart, Clock, ChevronRight, PenLine
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSEO } from "@/hooks/useSEO";

const SAMPLE_ENTRIES = [
  {
    id: 1,
    title: "Reflecting on today's growth",
    preview: "Today I noticed a shift in how I respond to stress. Instead of reacting immediately, I took a breath and...",
    date: "Today",
    mood: "Hopeful",
    tags: ["growth", "mindfulness"]
  },
  {
    id: 2,
    title: "Gratitude for small moments",
    preview: "The morning light through my window, a warm cup of tea, the quiet before the day begins...",
    date: "Yesterday",
    mood: "Grateful",
    tags: ["gratitude", "peace"]
  },
  {
    id: 3,
    title: "Processing difficult emotions",
    preview: "It's okay to feel overwhelmed sometimes. I'm learning to sit with discomfort without judgment...",
    date: "3 days ago",
    mood: "Reflective",
    tags: ["emotions", "self-compassion"]
  }
];

const PROMPTS = [
  "What are you grateful for today?",
  "What's weighing on your heart?",
  "Describe a moment of peace you experienced",
  "What would you tell your younger self?"
];

export default function Journal() {
  useSEO({
    title: "Journal",
    description: "Your private wellness journal for reflections, gratitude, and emotional processing with guided prompts.",
    noIndex: true
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activePrompt, setActivePrompt] = useState(0);

  return (
    <div className="min-h-screen hero-gradient">
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
              <Button className="btn-premium" data-testid="button-new-entry">
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

              <div className="space-y-4">
                {SAMPLE_ENTRIES.map(entry => (
                  <article key={entry.id} className="card-bordered hover:shadow-md transition-shadow cursor-pointer group" data-testid={`entry-${entry.id}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-heading-sm text-teal group-hover:text-[var(--teal-600)] transition">{entry.title}</h3>
                      <div className="flex items-center gap-2 text-caption">
                        <Clock className="h-4 w-4" />
                        {entry.date}
                      </div>
                    </div>
                    <p className="text-body-sm text-[var(--sage-600)] mb-4 line-clamp-2">{entry.preview}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[var(--blush-100)] text-[var(--blush-700)] text-caption font-medium">
                          {entry.mood}
                        </span>
                        {entry.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-[var(--sage-100)] text-[var(--sage-700)] text-caption">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <ChevronRight className="h-5 w-5 text-[var(--sage-400)] group-hover:text-[var(--teal-500)] transition" />
                    </div>
                  </article>
                ))}
              </div>

              <div className="text-center py-4">
                <Button variant="outline" className="btn-secondary-premium" data-testid="button-load-more">
                  Load More Entries
                </Button>
              </div>
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
                    <span className="text-heading-sm text-teal">48</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--sage-50)]">
                    <span className="text-body-sm">This Month</span>
                    <span className="text-heading-sm text-teal">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--sage-50)]">
                    <span className="text-body-sm">Current Streak</span>
                    <span className="text-heading-sm text-teal">7 days</span>
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
  );
}
