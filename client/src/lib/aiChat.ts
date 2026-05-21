// Phase 3 identity fix (v1.19): all three AI fetch calls now attach the
// canonical user JWT (`mmhb_token`) as a Bearer token when present, while
// preserving the `x-guest-id` fallback header so guest users keep working.
// Backend selects identity via `req.dbUserId || getGuestId(req) || "anonymous"`,
// so an authenticated user with both headers correctly resolves to their real
// userId — no more fragmented guest memory files for logged-in users.
//
// STRICT scope: ONLY frontend request headers. No server changes, no
// orchestrator changes, no memory/profile changes, no crisis logic changes.

const GUEST_ID_KEY = "mmhb_guest_id";
const TOKEN_KEY = "mmhb_token";

function getGuestId() {
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    try { localStorage.setItem(GUEST_ID_KEY, id); } catch (err) { console.warn("[storage-safe-write]", err); }
  }
  return id;
}

function authHeaders(): Record<string, string> {
  const guestId = getGuestId();
  // localStorage.getItem can throw in some sandboxed iframe / private-mode
  // contexts. Fail silently to guest mode rather than break chat.
  let token: string | null = null;
  try {
    token = localStorage.getItem(TOKEN_KEY);
  } catch {
    /* noop — guest mode preserved */
  }
  const headers: Record<string, string> = { "x-guest-id": guestId };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function sendAIMessage(message: string) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ message }),
  });

  return res.json();
}

export async function getAIHistory() {
  const res = await fetch("/api/ai/history", {
    headers: authHeaders(),
  });

  return res.json();
}

export async function clearAIHistory() {
  const res = await fetch("/api/ai/history", {
    method: "DELETE",
    headers: authHeaders(),
  });

  return res.json();
}
