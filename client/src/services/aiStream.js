export async function streamAI(message, mood = null, onChunk) {
  const response = await fetch("/api/ai-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, mood }),
  });

  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });

    text
      .split("\n")
      .filter((line) => line.startsWith("data: "))
      .forEach((line) => {
        const chunk = line.replace("data: ", "");
        onChunk(chunk);
      });
  }
}