import { useState } from "react";

export function EmailCapture({ 
  title = "Stay connected",
  subtitle = "Get gentle reminders and new tools (optional, unsubscribe anytime).",
  buttonText = "Join",
  successMessage = "Thank you! Check your email to confirm."
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(),
          source: "email-capture",
          consent: true
        })
      });

      if (res.ok) {
        setStatus("success");
        setMessage(successMessage);
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(data.error?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <section 
        className="rounded-2xl border border-sage-200 dark:border-white/10 bg-sage-50 dark:bg-white/5 p-6 text-center"
        data-testid="section-email-capture-success"
      >
        <div className="text-green-600 dark:text-green-400 text-lg font-medium">✓ {message}</div>
        <div className="text-sm text-gray-600 dark:text-white/70 mt-2">
          You can unsubscribe at any time. No spam, ever.
        </div>
      </section>
    );
  }

  return (
    <section 
      className="rounded-2xl border border-sage-200 dark:border-white/10 bg-sage-50 dark:bg-white/5 p-6"
      data-testid="section-email-capture"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-white/80 mt-1">{subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-xl border border-sage-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-500 min-h-[44px]"
          data-testid="input-email-capture"
          aria-label="Email address"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-sage-600 dark:bg-sage-500 text-white px-6 py-3 text-sm font-medium hover:bg-sage-700 dark:hover:bg-sage-600 transition min-h-[44px] disabled:opacity-50"
          data-testid="button-email-subscribe"
        >
          {status === "loading" ? "..." : buttonText}
        </button>
      </form>

      {status === "error" && message && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {message}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 dark:text-white/60">
        We respect your privacy. Unsubscribe anytime. No spam, ever.
      </div>
    </section>
  );
}

export default EmailCapture;
