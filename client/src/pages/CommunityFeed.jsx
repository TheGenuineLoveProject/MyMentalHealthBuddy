import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Users, Sparkles, ArrowLeft, Heart, RefreshCw } from "lucide-react";
import SharedEntryCard from "../components/SharedEntryCard";
import { LotusGuide } from "../components/sacred";
import { LotusDivider } from "../components/EmotionAdaptiveBackground";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";

export default function CommunityFeed() {
  const [filter, setFilter] = useState("all");

  const { data: entries = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["/api/community/reflections"],
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (data?.reflections && Array.isArray(data.reflections)) return data.reflections;
      if (data?.entries && Array.isArray(data.entries)) return data.entries;
      return [];
    },
    staleTime: 30000,
  });

  const filteredEntries = filter === "all" 
    ? entries 
    : entries.filter(e => (e.mood || e.emotion)?.toLowerCase() === filter);

  const moodFilters = [
    { id: "all", label: "All", icon: "✨" },
    { id: "happy", label: "Happy", icon: "😊" },
    { id: "grateful", label: "Grateful", icon: "🙏" },
    { id: "calm", label: "Calm", icon: "🌿" },
    { id: "hopeful", label: "Hopeful", icon: "🌅" },
    { id: "sad", label: "Healing", icon: "💙" },
  ];

  return (
    <>
      <SEO
        title="Community Feed | The Genuine Love Project"
        description="Connect with others on their healing journey. Share and receive compassion in our supportive community."
      />

      <div className="min-h-screen bg-gradient-to-b from-[var(--glp-paper)] via-white to-[var(--glp-paper)] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <header className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--glp-teal)] transition mb-4"
              data-testid="link-back"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Dashboard
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--glp-sage) 0%, var(--glp-teal) 100%)",
                      boxShadow: "0 0 20px rgba(143, 191, 159, 0.3)"
                    }}
                  >
                    <Users className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-[var(--glp-sage-deep)] dark:text-white">
                    Community Feed
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-lg">
                  A sacred space where souls share their journey. Every story here is a gift of vulnerability and courage.
                </p>
              </div>

              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                aria-label="Refresh feed"
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-5 h-5 text-gray-500 ${isFetching ? "animate-spin" : ""}`} />
              </button>
            </div>
          </header>

          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {moodFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.id
                    ? "bg-[var(--glp-sage)] text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
                data-testid={`filter-${f.id}`}
              >
                <span aria-hidden="true">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <LotusGuide mood="calm" size={100} showMessage={false} />
              </div>
              <h2 className="font-serif text-xl text-gray-700 dark:text-gray-300 mb-2">
                {filter === "all" 
                  ? "No shared entries yet"
                  : `No ${filter} entries shared yet`
                }
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Be the first to share your journey. Your story could inspire someone who needs it most.
              </p>
              <Link 
                href="/journal"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--glp-sage) 0%, var(--glp-teal) 100%)"
                }}
                data-testid="link-share-first"
              >
                <Heart className="w-4 h-4" />
                Share Your First Entry
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEntries.map((entry, idx) => (
                <SharedEntryCard 
                  key={entry.id || idx} 
                  entry={entry}
                  style={{ animationDelay: `${idx * 100}ms` }}
                />
              ))}

              {filteredEntries.length > 0 && (
                <>
                  <LotusDivider className="my-8" />
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
                      <Sparkles className="w-4 h-4 text-[var(--glp-gold)]" aria-hidden="true" />
                      <span className="text-sm">You've reached the end. Every story matters.</span>
                      <Sparkles className="w-4 h-4 text-[var(--glp-gold)]" aria-hidden="true" />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <SafetyFooter />
      </div>
    </>
  );
}
