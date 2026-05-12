import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Compass, RotateCcw, Lightbulb, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const DISTORTIONS = [
  {
    id: "all-or-nothing",
    label: "All-or-nothing thinking",
    description: "Seeing things in black and white, with no middle ground.",
    cues: [/\balways\b/i, /\bnever\b/i, /\bevery\s*time\b/i, /\bnobody\b/i, /\beveryone\b/i, /\bcompletely\b/i, /\btotally\b/i],
    reframe: "What is one example, even small, that breaks the all-or-nothing rule? What sits between the two extremes?",
  },
  {
    id: "catastrophizing",
    label: "Catastrophizing",
    description: "Expecting the worst possible outcome.",
    cues: [/\bdisaster\b/i, /\bruined\b/i, /\bworst\b/i, /\bnightmare\b/i, /\bdoomed\b/i, /\bend of the world\b/i],
    reframe: "What is the most likely outcome — not the worst? What is one tiny thing that would help if it did happen?",
  },
  {
    id: "mind-reading",
    label: "Mind reading",
    description: "Assuming you know what someone else is thinking without checking.",
    cues: [/\bthey think\b/i, /\bshe thinks\b/i, /\bhe thinks\b/i, /\beveryone thinks\b/i, /\bthey hate\b/i, /\bjudging me\b/i],
    reframe: "What evidence do I actually have? What is one other interpretation that is also possible?",
  },
  {
    id: "fortune-telling",
    label: "Fortune telling",
    description: "Predicting the future negatively without enough evidence.",
    cues: [/\bwill never\b/i, /\bwill always\b/i, /\bgoing to fail\b/i, /\bnothing will\b/i, /\bnever will\b/i],
    reframe: "Is this a fact or a forecast? What would help me notice when the prediction is wrong?",
  },
  {
    id: "should-statements",
    label: '"Should" statements',
    description: "Pressuring yourself with rigid rules about how things must be.",
    cues: [/\bshould\b/i, /\bmust\b/i, /\bhave to\b/i, /\bought to\b/i, /\bsupposed to\b/i],
    reframe: "What would change if I replaced 'should' with 'I would like to' or 'it would help if'?",
  },
  {
    id: "personalization",
    label: "Personalization",
    description: "Taking responsibility for things that are not entirely yours to carry.",
    cues: [/\bmy fault\b/i, /\bbecause of me\b/i, /\bif only I\b/i, /\bI ruined\b/i, /\bI caused\b/i],
    reframe: "What other factors were also at play? Where does my responsibility actually start and end?",
  },
  {
    id: "labeling",
    label: "Labeling",
    description: "Attaching a fixed label to yourself or others (e.g., 'I am a failure').",
    cues: [/\bI am a (failure|loser|disaster|idiot|burden)\b/i, /\bI'm worthless\b/i, /\bI'm broken\b/i, /\bI'm stupid\b/i],
    reframe: "Could I describe the behavior or moment without using a label about who I am?",
  },
  {
    id: "emotional-reasoning",
    label: "Emotional reasoning",
    description: "Believing something is true because it feels true.",
    cues: [/\bI feel like\b/i, /\bit feels like\b/i, /\bit must be true\b/i, /\bI just know\b/i],
    reframe: "Feelings are real, but they are not always facts. What is the evidence outside the feeling?",
  },
];

function detect(text) {
  if (!text || text.trim().length < 4) return [];
  return DISTORTIONS.filter((d) => d.cues.some((rx) => rx.test(text)));
}

export default function CognitiveDistortionChecker() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const findings = useMemo(() => detect(text), [text]);

  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO
        title="Cognitive Distortion Checker | MyMentalHealthBuddy"
        description="Spot common thinking patterns (all-or-nothing, catastrophizing, mind-reading) and reframe gently. Free, educational only."
      />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/wellness-tools-hub" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-back-tools">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to tools
          </Link>
          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-6">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 mb-2">
            <Compass className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Distortion checker</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Notice the thinking pattern.
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Type a thought you have been carrying. We will gently point out common cognitive distortions and offer a
            reframe prompt. Educational only.
          </p>
        </header>

        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="space-y-3"
          data-testid="form-distortion"
        >
          <label htmlFor="thought" className="text-sm font-medium text-slate-700 dark:text-slate-200">Your thought</label>
          <textarea
            id="thought"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="e.g. 'I always mess everything up. They probably hate me.'"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm text-slate-800 dark:text-slate-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            data-testid="textarea-thought"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">{text.length} / 2000</span>
            <button
              type="submit"
              disabled={text.trim().length < 4}
              className="rounded-xl px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
              data-testid="button-check-distortion"
            >
              Check thought
            </button>
          </div>
        </form>

        {submitted && (
          <section className="mt-6" aria-label="Findings" data-testid="section-distortion-findings">
            {findings.length === 0 ? (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 p-4" data-testid="status-no-distortions">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" aria-hidden /> No common distortion patterns detected.
                </p>
                <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                  This is not a verdict — just one gentle pass over the words. Trust what you know about your own mind.
                </p>
              </div>
            ) : (
              <ul className="space-y-3" data-testid="list-distortions">
                {findings.map((d) => (
                  <li
                    key={d.id}
                    className="rounded-2xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 p-4"
                    data-testid={`distortion-${d.id}`}
                  >
                    <h3 className="text-base font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" aria-hidden /> {d.label}
                    </h3>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{d.description}</p>
                    <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-300">
                      Reframe prompt: {d.reframe}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => { setText(""); setSubmitted(false); }}
              className="mt-4 inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              data-testid="button-reset-distortion"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Try another thought
            </button>
          </section>
        )}

        <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
          Educational only. This pattern detector uses simple text cues and is not a clinical tool. If you have concerns,
          please consult a licensed professional.
        </p>
        <SafetyFooter />
      </div>
    </div>
  );
}
