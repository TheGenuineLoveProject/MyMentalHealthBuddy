import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, ShieldAlert, RotateCcw, Lightbulb, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const TACTICS = [
  {
    id: "gaslighting",
    label: "Gaslighting",
    description: "Denying your perception of reality so you doubt your own memory or sanity.",
    cues: [
      /\bthat (never|didn't) happen(ed)?\b/i,
      /\byou'?re (imagining|making (it|that) up|crazy|paranoid|too sensitive)\b/i,
      /\byou'?re overreacting\b/i,
      /\bi never said that\b/i,
      /\byou'?re remembering (it|that) wrong\b/i,
      /\bthat'?s not what (i said|happened)\b/i,
    ],
    reframe:
      "Your memory and feelings are valid data. Write down the moment in your own words; you can re-read it later.",
  },
  {
    id: "love-bombing",
    label: "Love-bombing",
    description: "Overwhelming intensity, flattery, or 'soulmate' framing very early to fast-track trust.",
    cues: [
      /\bsoul ?mate\b/i,
      /\bi'?ve never felt this (way )?before\b/i,
      /\byou'?re (the one|perfect|everything)\b/i,
      /\b(meant|made) for each other\b/i,
      /\bnobody (else )?(gets|understands) me like you\b/i,
    ],
    reframe:
      "Real love unfolds at the speed of safety. Notice intensity that asks for premature commitment.",
  },
  {
    id: "darvo",
    label: "DARVO (Deny, Attack, Reverse Victim & Offender)",
    description: "When confronted, the person denies wrongdoing, attacks you, and casts themselves as the real victim.",
    cues: [
      /\bafter everything i'?ve done for you\b/i,
      /\bi'?m the (real )?victim here\b/i,
      /\byou'?re attacking me\b/i,
      /\byou always (twist|turn) (everything|things)\b/i,
      /\bhow dare you accuse me\b/i,
    ],
    reframe:
      "Notice the pivot from your concern to their defense. You can name one specific behavior and stay there.",
  },
  {
    id: "guilt-tripping",
    label: "Guilt-tripping",
    description: "Using your sense of obligation, history, or sacrifice to coerce a decision.",
    cues: [
      /\bafter (all|everything) (i'?ve done|i did)\b/i,
      /\bif you (really|truly) (loved|cared)\b/i,
      /\byou'?re (going to|gonna) make me (sad|cry|sick|leave)\b/i,
      /\bi guess i'?ll just\b/i,
      /\bi (sacrificed|gave up) (so much|everything) for you\b/i,
    ],
    reframe:
      "Guilt that arrives without a request you actually broke is often someone else's tool. You can pause before answering.",
  },
  {
    id: "silent-treatment",
    label: "Silent treatment / stonewalling",
    description: "Withholding response, contact, or presence to punish or control.",
    cues: [
      /\bi'?m not (going to )?(talk|speak) to you\b/i,
      /\b(don'?t|won'?t) (talk|speak) to me\b/i,
      /\bgiving (me|you) the silent treatment\b/i,
      /\b(stopped|won'?t) respond(ing)?\b/i,
      /\bfreezing (me|you) out\b/i,
    ],
    reframe:
      "A short, named pause is healthy ('I need an hour'). Indefinite silence used to punish is a control tactic.",
  },
  {
    id: "moving-goalposts",
    label: "Moving the goalposts",
    description: "Whenever you meet a demand, the standard shifts so you can never quite arrive.",
    cues: [
      /\bthat'?s not (good )?enough\b/i,
      /\bnow you (have to|need to|should)\b/i,
      /\bif you really (cared|loved|tried)\b/i,
      /\byou (still|always) haven'?t\b/i,
    ],
    reframe:
      "Write down the original ask. If the target keeps moving, the issue is the moving — not your effort.",
  },
  {
    id: "isolation",
    label: "Isolation pressure",
    description: "Subtle or overt pressure to cut off friends, family, or outside support.",
    cues: [
      /\b(your|those) friends are (toxic|bad for you|jealous)\b/i,
      /\byour family (doesn'?t|don'?t) (understand|like|get) (you|us)\b/i,
      /\bnobody (gets|understands) us like\b/i,
      /\b(stop|don'?t) (talking|seeing|hanging out with) (them|him|her)\b/i,
      /\byou don'?t need anyone (else )?but me\b/i,
    ],
    reframe:
      "Healthy love expands your world. Notice when it asks you to shrink it.",
  },
  {
    id: "future-faking",
    label: "Future-faking",
    description: "Vivid promises about the future used to manage you in the present, with no real follow-through.",
    cues: [
      /\bone day we'?ll\b/i,
      /\bi promise (i'?ll|we'?ll)\b/i,
      /\bjust wait (until|till)\b/i,
      /\bsoon we'?ll\b/i,
      /\bnext (year|month|week) (i'?ll|we'?ll)\b/i,
    ],
    reframe:
      "Patterns over time tell the truth. Has this promise been made — and broken — before?",
  },
];

function detect(text) {
  if (!text || text.trim().length < 4) return [];
  return TACTICS.filter((t) => t.cues.some((rx) => rx.test(text)));
}

export default function ManipulationDetector() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const findings = useMemo(() => detect(text), [text]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <SEO
        title="Manipulation Detector | MyMentalHealthBuddy"
        description="Paste a message or conversation. Spot common manipulation tactics (gaslighting, love-bombing, DARVO) with gentle reframes. Educational only."
      />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/wellness-tools-hub"
            className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            data-testid="link-back-tools"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to tools
          </Link>
          <Link
            href="/crisis"
            className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline"
            data-testid="link-crisis-header"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-6">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 mb-2">
            <ShieldAlert className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Manipulation detector</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            You are not crazy. Let&rsquo;s name the pattern together.
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Paste a message, voice-note transcript, or short exchange. We&rsquo;ll gently flag common manipulation
            tactics and offer one reframe per pattern. Nothing leaves your browser. Educational only.
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-3"
          data-testid="form-manipulation"
        >
          <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-200">
            The message or exchange
          </label>
          <textarea
            id="message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            maxLength={4000}
            placeholder="e.g. 'After everything I've done for you, you're going to leave? You're imagining things — that never happened.'"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm text-slate-800 dark:text-slate-100 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            data-testid="textarea-message"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">{text.length} / 4000</span>
            <button
              type="submit"
              disabled={text.trim().length < 4}
              className="rounded-xl px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
              data-testid="button-scan-message"
            >
              Scan message
            </button>
          </div>
        </form>

        {submitted && (
          <section className="mt-6" aria-label="Findings" data-testid="section-manipulation-findings">
            {findings.length === 0 ? (
              <div
                className="rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 p-4"
                data-testid="status-no-tactics"
              >
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" aria-hidden /> No common tactic phrases matched.
                </p>
                <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                  This is one gentle pass over the words. If your gut still says something is off, trust that — the
                  absence of a regex match is not the absence of harm.
                </p>
              </div>
            ) : (
              <ul className="space-y-3" data-testid="list-tactics">
                {findings.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-2xl border border-rose-200 dark:border-rose-700 bg-white dark:bg-slate-900 p-4"
                    data-testid={`tactic-${t.id}`}
                  >
                    <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" aria-hidden /> {t.label}
                    </h3>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{t.description}</p>
                    <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-300">
                      Try this: {t.reframe}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => {
                setText("");
                setSubmitted(false);
              }}
              className="mt-4 inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              data-testid="button-reset-manipulation"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Scan another message
            </button>
          </section>
        )}

        <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
          Educational only. This detector matches simple text cues and is not a clinical tool. If you are in immediate
          danger, please use{" "}
          <Link href="/crisis" className="underline" data-testid="link-crisis-inline">
            crisis support
          </Link>{" "}
          or contact a trusted local resource.
        </p>
        <SafetyFooter />
      </div>
    </div>
  );
}
