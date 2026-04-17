const sessions = new Map();

export function getSession(userId) {
	if (!sessions.has(userId)) {
		sessions.set(userId, []);
	}
	return sessions.get(userId);
}

export function addMessage(userId, role, content) {
	const session = getSession(userId);

	session.push({ role, content });

	// limit memory (prevent crash)
	if (session.length > 20) {
		session.shift();
	}
}