import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { trackSignalEvent } from "../../utils/trackSignalEvent";

export default function NewsletterInvite({ variant = "default" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    trackSignalEvent("newsletter_signup_submit", { surface: "blog" });
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        trackSignalEvent("newsletter_signup_success", { surface: "blog" });
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Unable to connect. Please try again later.");
    }
  };

  if (variant === "compact") {
    return (
      <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50" data-testid="newsletter-invite-compact">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Get one thoughtful note weekly — if you'd like.
        </p>
        {status === "success" ? (
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
            <Check className="w-4 h-4" /> {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              aria-label="Email for newsletter"
              data-testid="input-newsletter-email"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-3 py-1.5 text-sm rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              data-testid="button-newsletter-subscribe"
            >
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && <p className="text-xs text-red-500 mt-1">{message}</p>}
      </div>
    );
  }

  return (
    <div className="my-8 p-6 rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/30" data-testid="newsletter-invite">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
          <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Get one thoughtful note weekly
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            A gentle reflection, a small practice, and a reminder that you're not alone.
            No spam, no pressure. Unsubscribe anytime.
          </p>

          {status === "success" ? (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> {message}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                aria-label="Email for newsletter"
                data-testid="input-newsletter-email"
                required
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                data-testid="button-newsletter-subscribe"
              >
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && <p className="text-xs text-red-500 mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
}
