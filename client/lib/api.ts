export async function sendMessage(message: string) {
	const res = await fetch("/api/ai/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ message })
	});

	if (!res.ok) throw new Error("Request failed");

	return res.json();
}