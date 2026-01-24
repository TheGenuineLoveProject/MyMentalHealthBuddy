const API_BASE = import.meta.env.VITE_API_URL || "";

export async function aiChat(userId: string, message: string) {
  const res = await fetch(`${API_BASE}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, message }),
  });

  return res.json();
}

export async function aiHistory(userId: string) {
  const res = await fetch(`${API_BASE}/api/ai/history/${userId}`);
  return res.json();
}