export default function Reflection() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">
        Daily Reflection
      </h1>

      <p className="text-muted-foreground mb-6">
        Take a quiet moment to check in with yourself. There's no right or wrong —
        just honesty.
      </p>

      <textarea
        className="w-full min-h-[200px] rounded-xl border p-4 focus:outline-none focus:ring"
        placeholder="What's on your mind today?"
      />

      <div className="mt-4 flex justify-end">
        <button
          disabled
          className="rounded-lg px-4 py-2 bg-muted text-muted-foreground cursor-not-allowed"
        >
          Save (coming soon)
        </button>
      </div>
    </div>
  );
}
