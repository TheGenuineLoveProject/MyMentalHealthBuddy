import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, TrendingUp, Target, Compass, Star, Heart, Brain, Sparkles,
  ChevronRight, BookOpen, Zap, Award, Flame, Map, Lock, Unlock, MessageCircle,
  Eye, Infinity as InfinityIcon, Lightbulb,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { useSEO } from "../hooks/useSEO";
import SafetyFooter from "../components/ui/ReflectionFooter";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Static wisdom — paths and pillars that are NOT user-specific.            */
/*  Kept as gentle navigation companions to the dynamic mirror above.        */
/* ────────────────────────────────────────────────────────────────────────── */

const GROWTH_PILLARS = [
  { id: "self-awareness",  name: "Self-Awareness",   icon: Compass, color: "indigo",
    description: "Understanding your thoughts, emotions, and patterns",
    tools: [
      { name: "Emotional Check-In", href: "/mood" },
      { name: "Journaling",         href: "/journal" },
      { name: "Values Exploration", href: "/purpose-compass" },
    ]},
  { id: "emotional-health", name: "Emotional Health", icon: Heart,   color: "rose",
    description: "Processing feelings and building resilience",
    tools: [
      { name: "Breathing Exercises", href: "/breathing" },
      { name: "Grounding Practices", href: "/grounding" },
      { name: "Self-Compassion",     href: "/self-care" },
    ]},
  { id: "mental-clarity",   name: "Mental Clarity",   icon: Brain,   color: "sage",
    description: "Cultivating focus, peace, and clear thinking",
    tools: [
      { name: "Meditation",      href: "/meditation" },
      { name: "Mindfulness",     href: "/meditation" },
      { name: "Cognitive Tools", href: "/cognitive-tools" },
    ]},
  { id: "purpose-meaning",  name: "Purpose & Meaning",icon: Star,    color: "amber",
    description: "Connecting with what matters most to you",
    tools: [
      { name: "Purpose Compass", href: "/purpose-compass" },
      { name: "Values Work",     href: "/journal" },
      { name: "Vision Setting",  href: "/journal" },
    ]},
];

const GROWTH_PATHS = [
  { id: "healing",            name: "Healing Journey",     icon: Heart,     color: "rose",   href: "/healing",        description: "For those working through past wounds and building emotional resilience" },
  { id: "self-love",          name: "Self-Love Path",      icon: Sparkles,  color: "amber",  href: "/alignment-path", description: "Cultivating a nurturing, compassionate relationship with yourself" },
  { id: "emotional-mastery",  name: "Emotional Mastery",   icon: Zap,       color: "indigo", href: "/hubs/emotions",  description: "Developing deep emotional intelligence and regulation skills" },
  { id: "mindfulness",        name: "Mindfulness Journey", icon: Brain,     color: "sage",   href: "/meditation",     description: "Building present-moment awareness and inner peace" },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  Growth Aura — page-local SVG visual (NOT a Buddy Engine surface)         */
/*  Three concentric breathing rings + a soft core that intensifies with     */
/*  the user's tenure. Pure CSS, respects prefers-reduced-motion.            */
/* ────────────────────────────────────────────────────────────────────────── */

function GrowthAura({ tenureDays = 0, journalCount = 0 }) {
  // Map tenure to a 0..1 "warmth" without ever feeling competitive.
  const warmth = Math.min(1, (tenureDays / 90) * 0.7 + (journalCount / 20) * 0.3);
  const ringOpacity = (base) => Math.max(0.18, base + warmth * 0.35).toFixed(2);

  return (
    <div className="growth-aura" aria-hidden="true" data-testid="growth-aura">
      <style>{`
        .growth-aura{position:relative;width:180px;height:180px;display:flex;align-items:center;justify-content:center}
        .growth-aura svg{width:100%;height:100%;display:block}
        .ga-ring{transform-origin:center center;animation:ga-breathe 6s ease-in-out infinite}
        .ga-ring.r2{animation-duration:8s;animation-delay:-1s}
        .ga-ring.r3{animation-duration:11s;animation-delay:-3s}
        .ga-core{transform-origin:center center;animation:ga-pulse 4.4s ease-in-out infinite}
        @keyframes ga-breathe{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.06);opacity:1}}
        @keyframes ga-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @media (prefers-reduced-motion: reduce){
          .ga-ring,.ga-core{animation:none}
        }
      `}</style>
      <svg viewBox="0 0 200 200" role="img" aria-label="Growth aura visualization">
        <defs>
          <radialGradient id="ga-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#fef3c7" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#a7f3d0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ga-ring-grad" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#84cc16" stopOpacity="0" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <circle className="ga-ring r3" cx="100" cy="100" r="92" fill="none"
                stroke="#86efac" strokeWidth="1.2" strokeOpacity={ringOpacity(0.18)} />
        <circle className="ga-ring r2" cx="100" cy="100" r="74" fill="none"
                stroke="#a3e635" strokeWidth="1.4" strokeOpacity={ringOpacity(0.28)} />
        <circle className="ga-ring"    cx="100" cy="100" r="56" fill="none"
                stroke="#fcd34d" strokeWidth="1.6" strokeOpacity={ringOpacity(0.40)} />
        <circle cx="100" cy="100" r="58" fill="url(#ga-ring-grad)" opacity="0.35" />
        <circle className="ga-core" cx="100" cy="100" r="40" fill="url(#ga-core-grad)" />
        <g opacity={0.85}>
          <circle cx="100" cy="100" r="6"  fill="#fef3c7" />
          <circle cx="100" cy="100" r="2.2" fill="#fbbf24" />
        </g>
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Data hooks — auth-aware, gracefully degrades to guest mode               */
/* ────────────────────────────────────────────────────────────────────────── */

function useAuthToken() {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("mmhb_token");
  });
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "mmhb_token") setToken(e.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return token;
}

async function fetchJourney(token) {
  const res = await fetch("/api/growth/journey", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });
  if (!res.ok) throw new Error(`growth journey ${res.status}`);
  return res.json();
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Mirror sub-components                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

function TenureStamp({ data, signedIn }) {
  const days = data?.tenure?.days ?? 0;
  const copy = data?.tenure?.copy || (signedIn ? "We're just getting started." : "Sign in to begin our journey together.");
  return (
    <div className="text-center" data-testid="tenure-stamp">
      <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-medium tracking-[0.2em] uppercase mb-2">
        <InfinityIcon className="w-3.5 h-3.5" />
        Forever companion
      </div>
      <p className="font-playfair text-2xl md:text-3xl text-slate-800 dark:text-slate-100 leading-tight">
        {copy}
      </p>
      {signedIn && days > 0 && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400" data-testid="text-tenure-days">
          Day {days} of a journey that has no finish line.
        </p>
      )}
    </div>
  );
}

function MirrorStat({ label, value, hint, icon: Icon, testid }) {
  return (
    <div
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 backdrop-blur p-5 hover:shadow-md transition-shadow"
      data-testid={testid}
    >
      <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
        <Icon className="w-4 h-4" />
        <span className="text-[11px] tracking-wider uppercase">{label}</span>
      </div>
      <div className="font-playfair text-3xl text-slate-800 dark:text-slate-100" data-testid={`${testid}-value`}>
        {value}
      </div>
      {hint && (
        <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</div>
      )}
    </div>
  );
}

function ReflectionMirror({ data }) {
  const dominant = data?.reflection?.dominantFeelings ?? [];
  const themes = data?.reflection?.themes ?? [];
  const observation = data?.reflection?.observation;
  const hasAny = dominant.length > 0 || themes.length > 0;

  return (
    <section
      className="rounded-2xl bg-gradient-to-br from-sage-50 via-white to-amber-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border border-sage-200/60 dark:border-slate-700 p-6 md:p-8"
      data-testid="section-reflection-mirror"
      aria-labelledby="reflection-mirror-heading"
    >
      <div className="flex items-center gap-2 text-sage-700 dark:text-sage-300 text-xs font-medium tracking-[0.2em] uppercase mb-3">
        <Eye className="w-3.5 h-3.5" />
        Mirror
      </div>
      <h2 id="reflection-mirror-heading" className="font-playfair text-2xl text-slate-800 dark:text-slate-100 mb-4">
        What I'm noticing about you
      </h2>

      {!hasAny ? (
        <div className="rounded-xl bg-white/70 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-600 p-5 text-slate-600 dark:text-slate-300" data-testid="reflection-empty">
          <p className="text-sm leading-relaxed">
            We don't have enough together yet for me to mirror anything back honestly.
            Even one sentence in your <Link href="/journal"><span className="text-sage-700 dark:text-sage-300 underline-offset-2 hover:underline cursor-pointer">journal</span></Link> is enough to begin.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5" data-testid="reflection-feelings">
            <div className="text-[11px] tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2">Feelings showing up most</div>
            {dominant.length === 0 ? (
              <p className="text-sm text-slate-500">No single feeling dominates yet — that mix is human.</p>
            ) : (
              <ul className="space-y-2">
                {dominant.map((f) => (
                  <li key={f.feeling} className="flex items-center justify-between" data-testid={`feeling-${f.feeling}`}>
                    <span className="text-sm text-slate-700 dark:text-slate-200 capitalize">{f.feeling}</span>
                    <span className="text-xs text-slate-400">noticed {f.count}×</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5" data-testid="reflection-themes">
            <div className="text-[11px] tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2">Threads in your reflections</div>
            {themes.length === 0 ? (
              <p className="text-sm text-slate-500">No clear themes yet. They'll emerge with time.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {themes.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-sage-100 dark:bg-sage-900/40 text-sage-800 dark:text-sage-200 text-xs capitalize"
                    data-testid={`theme-${t}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {observation && (
        <p
          className="mt-4 text-sm md:text-base text-slate-700 dark:text-slate-200 italic leading-relaxed"
          data-testid="text-observation"
          aria-live="polite"
        >
          “{observation}”
        </p>
      )}
      <p className="mt-3 text-[11px] text-slate-400">
        This is a reflection — not a diagnosis.
      </p>
    </section>
  );
}

function MetacognitiveInvitations({ invitations = [] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (invitations.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % invitations.length), 7000);
    return () => clearInterval(id);
  }, [invitations.length]);

  if (invitations.length === 0) return null;
  const current = invitations[idx];

  return (
    <section
      className="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 to-cream-50 dark:from-amber-900/20 dark:to-slate-800 p-6 md:p-8"
      data-testid="section-invitations"
      aria-labelledby="invitations-heading"
    >
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-medium tracking-[0.2em] uppercase mb-3">
        <Lightbulb className="w-3.5 h-3.5" />
        Invitation
      </div>
      <h2 id="invitations-heading" className="sr-only">Metacognitive invitations</h2>
      <p
        key={current}
        className="font-playfair text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-snug"
        data-testid="text-invitation"
        aria-live="polite"
      >
        {current}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-1.5" aria-hidden="true">
          {invitations.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-amber-500" : "w-1.5 bg-amber-200 dark:bg-amber-800"}`}
            />
          ))}
        </div>
        <Link href="/journal">
          <span className="inline-flex items-center gap-1.5 text-sm text-sage-700 dark:text-sage-300 hover:text-sage-800 dark:hover:text-sage-200 cursor-pointer" data-testid="link-sit-with-this">
            <MessageCircle className="w-4 h-4" />
            Sit with this in journal
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}

function MilestoneCard({ milestone }) {
  const pct = milestone.target > 0 ? Math.min(100, Math.round((milestone.progress / milestone.target) * 100)) : 0;
  const Icon = milestone.unlocked ? Unlock : Lock;
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        milestone.unlocked
          ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800"
          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
      }`}
      data-testid={`milestone-${milestone.id}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
          milestone.unlocked ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                             : "bg-slate-200 dark:bg-slate-700 text-slate-400"
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h4 className={`font-medium text-sm truncate ${milestone.unlocked ? "text-slate-800 dark:text-slate-100" : "text-slate-600 dark:text-slate-300"}`}>
            {milestone.name}
          </h4>
          <p className={`text-xs truncate ${milestone.unlocked ? "text-slate-600 dark:text-slate-400" : "text-slate-500 dark:text-slate-500"}`}>
            {milestone.description}
          </p>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden" aria-hidden="true">
        <div
          className={`h-full transition-all duration-700 ${milestone.unlocked ? "bg-amber-400" : "bg-sage-400/70"}`}
          style={{ width: `${pct}%` }}
          data-testid={`milestone-${milestone.id}-progress`}
        />
      </div>
      <div className="mt-1 text-[10px] text-slate-400 text-right">
        {milestone.progress}/{milestone.target}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Pillar / Path navigators (kept from prior version, unchanged behavior)   */
/* ────────────────────────────────────────────────────────────────────────── */

function PillarCard({ pillar }) {
  const Icon = pillar.icon;
  const colorClasses = {
    indigo: "from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-slate-800 border-indigo-200 dark:border-indigo-800",
    rose:   "from-rose-100 to-rose-50 dark:from-rose-900/30 dark:to-slate-800 border-rose-200 dark:border-rose-800",
    sage:   "from-sage-100 to-sage-50 dark:from-sage-900/30 dark:to-slate-800 border-sage-200 dark:border-sage-800",
    amber:  "from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-slate-800 border-amber-200 dark:border-amber-800",
  };
  const iconColors = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    rose:   "text-rose-600 dark:text-rose-400",
    sage:   "text-sage-600 dark:text-sage-400",
    amber:  "text-amber-600 dark:text-amber-400",
  };
  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[pillar.color]} border hover:shadow-lg transition-all`} data-testid={`pillar-${pillar.id}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${iconColors[pillar.color]}`} />
        </div>
        <h3 className="font-playfair text-lg text-slate-800 dark:text-slate-200">{pillar.name}</h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{pillar.description}</p>
      <div className="space-y-2">
        {pillar.tools.map((tool, idx) => (
          <Link key={idx} href={tool.href}>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/60 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/30 cursor-pointer transition-all">
              <span className="text-sm text-slate-700 dark:text-slate-300">{tool.name}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PathCard({ path }) {
  const Icon = path.icon;
  const hoverColor = {
    rose:   "hover:border-rose-300 dark:hover:border-rose-700",
    amber:  "hover:border-amber-300 dark:hover:border-amber-700",
    indigo: "hover:border-indigo-300 dark:hover:border-indigo-700",
    sage:   "hover:border-sage-300 dark:hover:border-sage-700",
  }[path.color];
  const iconColor = {
    rose: "text-rose-500", amber: "text-amber-500",
    indigo: "text-indigo-500", sage: "text-sage-500",
  }[path.color];
  return (
    <Link href={path.href}>
      <div
        className={`p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${hoverColor} hover:shadow-md cursor-pointer transition-all`}
        data-testid={`path-${path.id}`}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-1">{path.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{path.description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 mt-1" />
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Page                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

export default function GrowthPage() {
  useSEO({
    title: "Your Growth Journey | The Genuine Love Project",
    description:
      "A gentle mirror of your own evolution — feelings noticed, themes emerging, days walked together. Reflective, never diagnostic.",
  });

  const token = useAuthToken();
  const { data, isLoading } = useQuery({
    queryKey: ["/api/growth/journey", token ? "auth" : "guest"],
    queryFn: () => fetchJourney(token),
    staleTime: 30_000,
  });

  const signedIn = Boolean(data?.privacy?.signedIn);
  const tenureDays = data?.tenure?.days ?? 0;
  const journalCount = data?.activity?.journalCount ?? 0;
  const moodCount = data?.activity?.moodCount ?? 0;
  const distinctEmotions = data?.activity?.distinctEmotions ?? 0;
  const milestones = data?.milestones ?? [];
  const invitations = data?.invitations ?? [];

  const unlockedCount = useMemo(
    () => milestones.filter((m) => m.unlocked).length,
    [milestones]
  );

  return (
    <WellnessPageShell>
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/dashboard">
            <span className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 mb-6 cursor-pointer" data-testid="back-link">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </span>
          </Link>

          {/* HERO — metacognition mirror */}
          <header className="mb-12" data-testid="growth-hero">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 text-center md:text-left">
              <div className="shrink-0">
                <GrowthAura tenureDays={tenureDays} journalCount={journalCount} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-400 text-xs font-medium tracking-[0.2em] uppercase mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Personal Growth
                </div>
                <h1 className="font-playfair text-3xl md:text-4xl text-slate-800 dark:text-slate-100 mb-3">
                  Your Growth <span className="text-sage-600 dark:text-sage-400 italic">Journey</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mb-5">
                  Growth isn't a destination — it's a continuous unfolding. This page is your mirror, not your scoreboard.
                </p>
                <TenureStamp data={data} signedIn={signedIn} />
              </div>
            </div>
          </header>

          {/* MIRROR STATS */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10" aria-label="Activity overview">
            <MirrorStat icon={BookOpen}    label="Reflections"       value={isLoading ? "—" : journalCount}     hint="Entries you've trusted me with" testid="stat-journals" />
            <MirrorStat icon={Heart}       label="Check-ins"         value={isLoading ? "—" : moodCount}         hint="State noticed and named"        testid="stat-moods" />
            <MirrorStat icon={Sparkles}    label="Emotional palette" value={isLoading ? "—" : distinctEmotions}  hint="Distinct feelings noticed"      testid="stat-emotions" />
            <MirrorStat icon={Award}       label="Milestones"        value={isLoading ? "—" : `${unlockedCount}/${milestones.length}`} hint="Unlocked, gently"               testid="stat-milestones" />
          </section>

          {/* REFLECTION + INVITATION */}
          <div className="grid lg:grid-cols-5 gap-5 mb-12">
            <div className="lg:col-span-3">
              <ReflectionMirror data={data} />
            </div>
            <div className="lg:col-span-2">
              <MetacognitiveInvitations invitations={invitations} />
            </div>
          </div>

          {/* MILESTONES */}
          <section className="mb-12" aria-labelledby="milestones-heading">
            <h2 id="milestones-heading" className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              Growth Milestones
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(milestones.length ? milestones : Array.from({ length: 6 })).map((m, i) =>
                m ? (
                  <MilestoneCard key={m.id} milestone={m} />
                ) : (
                  <div key={i} className="h-24 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 animate-pulse" />
                )
              )}
            </div>
          </section>

          {/* PILLARS */}
          <section className="mb-12" aria-labelledby="pillars-heading">
            <h2 id="pillars-heading" className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-sage-500" />
              Four Pillars of Growth
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GROWTH_PILLARS.map((p) => (<PillarCard key={p.id} pillar={p} />))}
            </div>
          </section>

          {/* PATHS */}
          <section className="mb-12" aria-labelledby="paths-heading">
            <h2 id="paths-heading" className="font-playfair text-2xl text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Map className="w-6 h-6 text-sage-500" />
              Choose Your Path
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {GROWTH_PATHS.map((p) => (<PathCard key={p.id} path={p} />))}
            </div>
          </section>

          {/* CLOSING REASSURANCE + CONSENT */}
          <div className="bg-gradient-to-r from-sage-100 to-cream-100 dark:from-sage-900/30 dark:to-slate-800 rounded-2xl p-8 text-center mb-8">
            <Flame className="w-7 h-7 text-sage-600 dark:text-sage-400 mx-auto mb-3" />
            <h3 className="font-playfair text-xl text-slate-800 dark:text-slate-200 mb-2">
              Growth is not linear
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm md:text-base">
              Some days you'll leap forward, others you'll need to rest. Both belong to the journey. Honor wherever you are today.
            </p>
            {data?.privacy?.consent && (
              <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-500" data-testid="text-consent">
                {data.privacy.consent}
              </p>
            )}
          </div>

          <SafetyFooter />
        </div>
      </div>
    </WellnessPageShell>
  );
}
