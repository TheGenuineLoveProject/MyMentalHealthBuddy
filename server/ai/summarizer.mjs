// server/ai/summarizer.mjs

export async function summarizeWithAI({ openai, history }) {
	try {
		const text = history
			.map(m => `${m.role}: ${m.content}`)
			.join("\n");

		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"Summarize the user's emotional patterns, key themes, and needs. Be concise, structured, and preserve meaning."
				},
				{
					role: "user",
					content: text
				}
			],
			temperature: 0.3
		});

		return response.choices?.[0]?.message?.content || "";
	} catch (err) {
		console.warn("AI summary failed:", err.message);
		return "";
	}
}