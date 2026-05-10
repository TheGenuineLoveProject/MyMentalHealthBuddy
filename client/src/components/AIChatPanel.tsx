/**
 * Compatibility re-export.
 *
 * The canonical AIChatPanel implementation lives at
 * `client/src/components/chat/AIChatPanel.tsx` (Section 4.4 of the v6.0
 * upgrade — sentiment-driven colorMode + AI-state-driven pose via
 * detectChatSentiment / aiStateToPose). This file existed earlier as a
 * raw spec snippet that broke type-checking and had no importers; we keep
 * the path alive as a thin re-export so any future stale imports resolve
 * cleanly to the real component.
 */
export { default } from "./chat/AIChatPanel";
