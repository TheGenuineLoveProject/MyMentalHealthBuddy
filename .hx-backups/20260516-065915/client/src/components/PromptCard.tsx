type Props = { prompt: string };

export function PromptCard({ prompt }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-4 font-inter">
      <p className="text-lg">{prompt}</p>
    </div>
  );
}