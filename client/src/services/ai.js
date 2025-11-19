export async function askAI(message) {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    return data.reply;
  } catch (err) {
    console.error("AI fetch error:", err);
    return "I'm here for you, but something went wrong connecting. Try again? 💚";
  }
}