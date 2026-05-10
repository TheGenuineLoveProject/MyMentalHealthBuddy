/**
 * CheckIn — /checkin
 *
 * Lightweight 5-step emotional check-in. Lumi reflects the chosen
 * mood through dynamic colorMode + state via the buddyEmotion
 * single-source-of-truth mapping.
 *
 * Replaces the prior `<Redirect to="/mood" />` stub. Storage is
 * intentionally in-memory + localStorage (no server write) — the
 * point is presence, not data collection.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";
import {
  emotionToAvatar,
  type BuddyEmotion,
} from "@/lib/buddyEmotion";

const PROMPTS = [
  {
    id: "feeling",
    question: "What's most present right now?",
    options: [
      { label: "Calm",       emotion: "calm"       },
      { label: "Anxious",    emotion: "anxiety"    },
      { label: "Sad",        emotion: "sadness"    },
      { label: "Tired",      emotion: "tiredness"  },
      { label: "Frustrated", emotion: "frustration"},
      { label: "Grateful",   emotion: "gratitude"  },
      { label: "Hopeful",    emotion: "hope"       },
      { label: "Joyful",     emotion: "joy"        },
    ],
  },
  {
    id: "body",
    question: "How does your body feel?",
    options: [
      { label: "Settled",     emotion: "calm"      },
      { label: "Buzzing",     emotion: "anxiety"   },
      { label: "Heavy",       emotion: "sadness"   },
      { label: "Drained",     emotion: "tiredness" },
    ],
  },
  {
    id: "need",
    question: "What might help most?",
    options: [
      { label: "Some quiet",     emotion: "calm"      },
      { label: "To breathe",     emotion: "calm"      },
      { label: "To be heard",    emotion: "loneliness"},
      { label: "To celebrate",   emotion: "joy"       },
    ],
  },
];

export default function CheckIn() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const current = PROMPTS[step];
  const lastEmotion = useMemo(() => {
    const vals = Object.values(answers);
    return (vals[vals.length - 1] || "calm");
  }, [answers]);

  const hint = emotionToAvatar(lastEmotion);

  function pick(emotion) {
    const nextAnswers = { ...answers, [current.id]: emotion };
    setAnswers(nextAnswers);
    if (step + 1 >= PROMPTS.length) {
      try {
        window.localStorage.setItem(
          "mmhb-last-checkin",
          JSON.stringify({ at: Date.now(), answers: nextAnswers }),
        );
      } catch { /* private mode etc */ }
      setDone(true);
    } else {
      setStep(step + 1);
    }
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      <SEO
        title="Check In — A Quick Emotional Pulse"
        description="A 30-second guided emotional check-in with Lumi. Private, free, no signup."
      />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <nav className="mb-6 flex items-center gap-3 text-sm" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-emerald-800 hover:underline" data-testid="link-back-dashboard">
            ← Back to Dashboard
          </Link>
          <span className="text-gray-300" aria-hidden="true">·</span>
          <Link href="/mood" className="text-gray-600 hover:underline" data-testid="link-mood">Mood log</Link>
          <Link
            href="/crisis"
            className="ml-auto rounded-md bg-rose-50 px-3 py-1 font-semibold text-rose-700 hover:bg-rose-100"
            data-testid="link-crisis"
          >
            Crisis Support
          </Link>
        </nav>

        <header className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-900" data-testid="text-title">
            A gentle check-in
          </h1>
          <p className="mt-2 text-slate-600">
            No right answers. Lumi reflects what you bring.
          </p>
        </header>

        <div
          className="mx-auto mb-6 flex justify-center"
          aria-live="polite"
          data-testid="container-buddy"
        >
          <BuddyAvatar
            state={hint.state}
            colorMode={hint.colorMode}
            pose={hint.pose}
            size="lg"
            data-testid="img-checkin-buddy"
          />
        </div>

        {!done && (
          <section
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100"
            data-testid={`section-step-${step}`}
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-emerald-700">
              Step {step + 1} of {PROMPTS.length}
            </p>
            <h2 className="mb-5 text-xl font-medium text-slate-900" data-testid="text-question">
              {current.question}
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label={current.question}>
              {current.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => pick(opt.emotion)}
                  className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-900 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  data-testid={`button-option-${opt.emotion}`}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {done && (
          <section
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100 text-center"
            data-testid="section-done"
          >
            <h2 className="mb-2 text-xl font-medium text-slate-900">Thank you for checking in.</h2>
            <p className="text-slate-600">
              Whatever you brought today, it belongs here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/tools/breathing"
                className="rounded-xl bg-sky-600 px-5 py-2 text-white hover:bg-sky-700"
                data-testid="link-breathing"
              >
                Breathe with Lumi
              </Link>
              <Link
                href="/journal"
                className="rounded-xl border border-emerald-300 bg-white px-5 py-2 text-emerald-800 hover:bg-emerald-50"
                data-testid="link-journal"
              >
                Open journal
              </Link>
              <button
                onClick={reset}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-slate-700 hover:bg-slate-50"
                data-testid="button-restart"
                type="button"
              >
                Check in again
              </button>
            </div>
          </section>
        )}

        <SafetyFooter />
      </div>
    </div>
  );
}
