import React, { useMemo, useState } from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

  export default function JournalingMirror() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [reflection, setReflection] = useState("");
    const [error, setError] = useState("");
    const [enableAI, setEnableAI] = useState(false);

    const canSubmit = useMemo(() => text.trim().length >= 3 && !loading, [text, loading]);

    async function onSubmit(e) {
      e?.preventDefault?.();
      setError("");
      setReflection("");
      setLoading(true);

      try {
        const res = await fetch("/api/mirror", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.trim(), enableAI }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || "Mirror request failed.");
        }

        setReflection(String(data?.reflection || ""));
      } catch (err) {
        setError(err?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="text-2xl font-semibold">Journaling Mirror</h1>
        <p className="mt-2 opacity-80">
          A gentle mirror for your words — not medical advice, not diagnosis. You know yourself best.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write what you’re carrying right now…"
            className="w-full min-h-[160px] rounded-md border p-3 bg-transparent"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-md border px-4 py-2 disabled:opacity-50"
            >
              {loading ? "Reflecting…" : "Reflect"}
            </button>

            <label className="flex items-center gap-2 text-sm opacity-80">
              <input
                type="checkbox"
                checked={enableAI}
                onChange={(e) => setEnableAI(e.target.checked)}
              />
              Enable AI reflection (optional)
            </label>
          </div>

          {error ? (
            <div className="rounded-md border p-3 text-sm">
              <b>Oops:</b> {error}
            </div>
          ) : null}

          {reflection ? (
            <div className="rounded-md border p-3 whitespace-pre-wrap">
              {reflection}
            </div>
          ) : null}
        </form>
      </div>
    );
  }
  const [askingPermission, setAskingPermission] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState("");

  const mirrorMutation = useMutation({
    mutationFn: async (data: { text: string; permission: boolean }) => {
      const res = await apiRequest("POST", "/api/mirror/reflect", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.askingPermission) {
        setAskingPermission(true);
        setPermissionMessage(data.message);
      } else if (data.reflection) {
        setReflection(data.reflection);
        setAskingPermission(false);
      }
    },
  });

  const handleRequestReflection = () => {
    if (!text.trim()) return;
    mirrorMutation.mutate({ text, permission: false });
  };

  const handleConfirmPermission = () => {
    mirrorMutation.mutate({ text, permission: true });
  };

  const handleClear = () => {
    setReflection(null);
    setAskingPermission(false);
    setPermissionMessage("");
  };

  return (
    <Card className="border-sage-200/50 dark:border-sage-700/50 bg-white/80 dark:bg-sage-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-sage-800 dark:text-sage-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" />
          Gentle Mirror
        </CardTitle>
        <CardDescription className="text-sage-600 dark:text-sage-400">
          A space to reflect on your own words. The mirror does not interpret or advise — it simply offers back what you've written.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!reflection && !askingPermission && (
          <>
            <Textarea
              data-testid="input-mirror-text"
              placeholder="Write freely here. When you're ready, you may request a gentle reflection — or simply let the writing be enough."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[150px] resize-none border-sage-200 dark:border-sage-700 focus:ring-sage-400"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-sage-500 dark:text-sage-400 italic">
                You know yourself best.
              </p>
              <Button
                data-testid="button-request-reflection"
                variant="outline"
                onClick={handleRequestReflection}
                disabled={!text.trim() || mirrorMutation.isPending}
                className="border-sage-300 hover:bg-sage-100 dark:border-sage-600 dark:hover:bg-sage-800"
              >
                {mirrorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Request Reflection
              </Button>
            </div>
          </>
        )}

        {askingPermission && (
          <div className="space-y-4 p-4 bg-sage-50 dark:bg-sage-800/50 rounded-lg border border-sage-200 dark:border-sage-700">
            <p className="text-sage-700 dark:text-sage-300">{permissionMessage}</p>
            <div className="flex gap-3">
              <Button
                data-testid="button-confirm-reflection"
                onClick={handleConfirmPermission}
                disabled={mirrorMutation.isPending}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                {mirrorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Yes, please
              </Button>
              <Button
                data-testid="button-decline-reflection"
                variant="ghost"
                onClick={handleClear}
                className="text-sage-600 dark:text-sage-400"
              >
                No, thank you
              </Button>
            </div>
          </div>
        )}

        {reflection && (
          <div className="space-y-4">
            <div className="p-4 bg-sage-50 dark:bg-sage-800/50 rounded-lg border border-sage-200 dark:border-sage-700">
              <p className="text-sage-700 dark:text-sage-300 whitespace-pre-wrap leading-relaxed">
                {reflection}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-sage-500 dark:text-sage-400 italic">
                Take what serves you.
              </p>
              <Button
                data-testid="button-new-reflection"
                variant="ghost"
                onClick={() => {
                  handleClear();
                  setText("");
                }}
                className="text-sage-600 dark:text-sage-400"
              >
                <X className="w-4 h-4 mr-2" />
                Start Fresh
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
cat > client/src/features/mirror/JournalingMirrorPage.jsx <<'EOF'
import React, { useState } from "react";

export default function JournalingMirrorPage() {
  const [text, setText] = useState("");
  const [mirror, setMirror] = useState("");
  const [enabled, setEnabled] = useState(false);

  function mirrorText() {
    if (!enabled || !text.trim()) return;

    // SAFE LOCAL MIRROR (no AI yet)
    setMirror(
      "Here is what I hear in your words:\n\n" +
      text
        .split(".")
        .slice(0, 3)
        .join(".")
        .trim() +
      ".\n\nWould you like to reflect on what matters most in this?"
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Journaling Mirror
        </h1>

        <p className="mt-3 text-neutral-700">
          This space reflects your words back to you.
          It does not analyze, diagnose, or advise.
        </p>

        <label className="mt-4 flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Enable reflection (optional)
        </label>

        <textarea
          className="mt-4 w-full rounded-xl border p-3 text-sm"
          rows={8}
          placeholder="Write freely. Nothing is interpreted or judged."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="mt-4 rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-40"
          onClick={mirrorText}
          disabled={!enabled}
        >
          Reflect my words
        </button>

        {mirror && (
          <div className="mt-6 rounded-xl border bg-neutral-50 p-4 whitespace-pre-wrap">
            {mirror}
          </div>
        )}

        <p className="mt-4 text-xs text-neutral-500">
          This feature is not a mental health service. If you feel unsafe, please
          visit the Support page.
        </p>
      </div>
    </div>
  );
}
EOF