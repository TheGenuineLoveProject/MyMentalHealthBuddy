import { ReflectionPrompt } from "@/components/wellness/ReflectionPrompt";

export default function ReflectionPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Reflection</h1>
        <p className="text-muted-foreground">
          A quiet space to check in with yourself.
        </p>
      </header>

      <ReflectionPrompt />
    </main>
  );
}