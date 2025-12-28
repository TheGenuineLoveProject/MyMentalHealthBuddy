import { JournalMirror } from "@/features/mirror/JournalMirror";

export default function MirrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white dark:from-sage-950 dark:to-sage-900">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-serif text-sage-800 dark:text-sage-100 mb-2">
            Gentle Mirror
          </h1>
          <p className="text-sage-600 dark:text-sage-400">
            A space to see your own words reflected back — without interpretation or judgment.
          </p>
        </header>

        <JournalMirror />

        <footer className="mt-8 text-center">
          <p className="text-sm text-sage-500 dark:text-sage-400 italic">
            The mirror does not tell you what to think. It simply offers back what you've already expressed.
          </p>
        </footer>
      </div>
    </div>
  );
}
