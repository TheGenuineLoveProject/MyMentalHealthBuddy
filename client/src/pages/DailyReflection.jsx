import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import {
  ArrowLeft, Sunrise, Heart, Sparkles, Target,
  Loader2, Check, PenLine, BookOpen, Users
} from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";
import { useGamification } from "../context/GamificationContext.jsx";

const MOOD_OPTIONS = [
  { value: "peaceful", label: "Peaceful", emoji: "\u2728" },
  { value: "grateful", label: "Grateful", emoji: "\ud83d\ude4f" },
  { value: "hopeful", label: "Hopeful", emoji: "\ud83c\udf1f" },
  { value: "tender", label: "Tender", emoji: "\ud83e\ude77" },
  { value: "heavy", label: "Heavy", emoji: "\ud83c\udf27\ufe0f" },
  { value: "anxious", label: "Anxious", emoji: "\ud83c\udf00" },
  { value: "numb", label: "Numb", emoji: "\ud83e\udea8" },
  { value: "energized", label: "Energized", emoji: "\u26a1" },
  { value: "reflective", label: "Reflective", emoji: "\ud83c\udf19" },
  { value: "loved", label: "Loved", emoji: "\ud83d\udc9b" },
];

const GENTLE_PROMPTS = [
  "What is one thing you noticed about yourself today?",
  "What felt true about your experience right now?",
  "What small thing brought you comfort recently?",
  "What does your heart need to hear today?",
  "If today were a season, which would it be and why?",
  "What are you learning to accept about yourself?",
  "What boundary honored your peace today?",
  "What would your wisest self say to you right now?",
];

function getDailyPrompt() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return GENTLE_PROMPTS[dayOfYear % GENTLE_PROMPTS.length];
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function DailyReflection() {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [intention, setIntention] = useState("");
  const [sharedToCommunity, setSharedToCommunity] = useState(false);
  const [saved, setSaved] = useState(false);
  const { awardXp } = useGamification();

  const { data: todayReflection, isLoading } = useQuery({
    queryKey: ["/api/user/reflection/today"],
    retry: false,
  });

  useEffect(() => {
    if (todayReflection && todayReflection.id) {
      setContent(todayReflection.content || "");
      setMood(todayReflection.mood || "");
      setGratitude(todayReflection.gratitude || "");
      setIntention(todayReflection.intention || "");
      setSharedToCommunity(todayReflection.sharedToCommunity || false);
      setSaved(true);
    }
  }, [todayReflection]);

  const isExisting = todayReflection && todayReflection.id;
  const hasContent = content.trim() || mood || gratitude.trim() || intention.trim();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/user/reflection", {
        content,
        mood,
        gratitude,
        intention,
        sharedToCommunity,
      });
      return res.json();
    },
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["/api/user/reflection/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/reflections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      if (sharedToCommunity) {
        queryClient.invalidateQueries({ queryKey: ["/api/community/affirmations"] });
      }
      if (!isExisting) {
        awardXp("daily-reflection", 120, { type: "daily_reflection" }).catch(() => {});
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--glp-paper)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--glp-sage-deep)] mx-auto" />
          <p className="text-sm text-[var(--glp-ink)]/75">Preparing your reflection space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--glp-paper)]">
      <SEO
        title="Daily Reflection - The Genuine Love Project"
        description="A gentle daily practice to notice, honor, and nurture your inner world."
      />

      <div className="mx-auto max-w-xl px-6 py-8">
        <nav className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--glp-ink)]/70 hover:text-[var(--glp-ink)] transition-colors"
            data-testid="link-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </nav>

        <header className="mb-8 space-y-3">
          <div className="flex items-center gap-2 text-[var(--glp-sage-deep)]">
            <Sunrise className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-medium">Daily Reflection</span>
          </div>
          <h1
            className="text-2xl font-normal text-[var(--glp-ink)]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {todayLabel()}
          </h1>
          <p className="text-sm text-[var(--glp-ink)]/75 leading-relaxed">
            A quiet moment to check in with yourself. No right answers — just honest noticing.
          </p>
        </header>

        {saved && !saveMutation.isPending && (
          <div
            className="mb-6 flex items-center gap-2 p-3 rounded-xl bg-[var(--glp-sage)]/10 border border-[var(--glp-sage)]/20"
            data-testid="status-saved"
          >
            <Check className="w-4 h-4 text-[var(--glp-sage-deep)]" />
            <span className="text-sm text-[var(--glp-sage-deep)]">
              {isExisting
                ? "Today's reflection is saved. You can update it anytime."
                : "Reflection saved. +20 XP earned."}
            </span>
          </div>
        )}

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-[var(--glp-ink)]/5 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[var(--glp-ink)]/70">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">How are you feeling?</span>
            </div>
            <div className="flex flex-wrap gap-2" data-testid="mood-options">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMood(mood === opt.value ? "" : opt.value)}
                  className={`px-3 py-2 rounded-full text-sm border transition-all ${
                    mood === opt.value
                      ? "bg-[var(--glp-sage-deep)] text-white border-[var(--glp-sage-deep)]"
                      : "bg-white text-[var(--glp-ink)]/70 border-[var(--glp-ink)]/10 hover:border-[var(--glp-sage)]/30"
                  }`}
                  data-testid={`mood-${opt.value}`}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-[var(--glp-ink)]/5 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[var(--glp-ink)]/70">
              <PenLine className="w-4 h-4" />
              <span className="text-sm font-medium">Your reflection</span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--glp-gold)]/10 border border-[var(--glp-gold)]/20">
              <p className="text-sm text-[var(--glp-ink)]/80 italic" data-testid="text-daily-prompt">
                {getDailyPrompt()}
              </p>
            </div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setSaved(false);
              }}
              placeholder="Write here if it feels right..."
              className="w-full p-4 rounded-lg border border-[var(--glp-ink)]/15 bg-[var(--glp-paper)]/50 text-[var(--glp-ink)] text-sm resize-none focus:outline-none focus:border-[var(--glp-sage-deep)]/30 placeholder:text-[var(--glp-ink)]/55"
              rows={5}
              data-testid="textarea-reflection"
            />
          </section>

          <section className="bg-white rounded-2xl border border-[var(--glp-ink)]/5 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[var(--glp-ink)]/70">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">A gentle intention for today</span>
            </div>
            <input
              type="text"
              value={intention}
              onChange={(e) => {
                setIntention(e.target.value);
                setSaved(false);
              }}
              placeholder="I intend to..."
              className="w-full p-4 rounded-lg border border-[var(--glp-ink)]/15 bg-[var(--glp-paper)]/50 text-[var(--glp-ink)] text-sm focus:outline-none focus:border-[var(--glp-sage-deep)]/30 placeholder:text-[var(--glp-ink)]/55"
              data-testid="input-intention"
            />
          </section>

          <section className="rounded-2xl border border-[var(--glp-ink)]/5 p-5 shadow-sm space-y-3"
            style={{ background: sharedToCommunity ? 'var(--glp-sage-10)' : 'white' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--glp-ink)]/70">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Share anonymously with the community</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={sharedToCommunity}
                onClick={() => {
                  setSharedToCommunity(!sharedToCommunity);
                  setSaved(false);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sharedToCommunity ? 'bg-[var(--glp-sage-deep)]' : 'bg-[var(--glp-ink)]/15'
                }`}
                data-testid="toggle-share-community"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    sharedToCommunity ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-[var(--glp-ink)]/65 leading-relaxed">
              {sharedToCommunity
                ? "Your reflection will appear anonymously on the Community Affirmation Wall. Only the content is shared — your name and details stay private."
                : "This reflection is completely private. You can choose to share it anonymously anytime."}
            </p>
          </section>

          <div className="flex gap-3">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={!hasContent || saveMutation.isPending}
              className="flex-1 py-3 rounded-xl bg-[var(--glp-sage-deep)] text-white text-sm font-medium hover:bg-[var(--glp-sage-deep)]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="button-save-reflection"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Update Reflection
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save Reflection
                </>
              )}
            </button>
          </div>

          {saveMutation.isError && (
            <p className="text-sm text-red-500 text-center" data-testid="error-save">
              Something went wrong. Please try again.
            </p>
          )}

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/reflections"
              className="inline-flex items-center gap-2 text-sm text-[var(--glp-sage-deep)] hover:underline"
              data-testid="link-reflection-history"
            >
              <BookOpen className="w-4 h-4" />
              View past reflections
            </Link>
          </div>

          <p className="text-xs text-center text-[var(--glp-ink)]/55 pt-2">
            Reflection is a practice, not a performance. Every word is valid.
          </p>
        </div>
      </div>

      <SafetyFooter />
    </div>
  );
}
