const GUEST_ID_KEY = "mmhb_guest_id";

function getGuestId() {
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export async function sendAIMessage(message: string) {
  const guestId = getGuestId();

  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-guest-id": guestId
    },
    body: JSON.stringify({ message })
  });

  return res.json();
}

export async function getAIHistory() {
  const guestId = getGuestId();

  const res = await fetch("/api/ai/history", {
    headers: {
      "x-guest-id": guestId
    }
  });

  return res.json();
}

export async function clearAIHistory() {
  const guestId = getGuestId();

  const res = await fetch("/api/ai/history", {
    method: "DELETE",
    headers: {
      "x-guest-id": guestId
    }
  });

  return res.json();
}
