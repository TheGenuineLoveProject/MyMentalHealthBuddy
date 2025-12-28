import { Community } from "@/features/community/Community";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white dark:from-sage-950 dark:to-sage-900">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-serif text-sage-800 dark:text-sage-100 mb-2">
            Shared Presence
          </h1>
          <p className="text-sage-600 dark:text-sage-400">
            Anonymous reflections from others on the same path. No performance, no comparison — just shared humanity.
          </p>
        </header>

        <Community />
      </div>
    </div>
  );
}
