// ─────────────────────────────────────────────
// FILE: client/src/components/FloatingButton.tsx
// Small round button in bottom-right corner
// ─────────────────────────────────────────────
import React from "react";

type FloatingButtonProps = {
  onOpen: () => void;
};

export default function FloatingButton({ onOpen }: FloatingButtonProps) {
  return (
    <button
      onClick={onOpen}
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "1.5rem",
        padding: "0.75rem 1.25rem",
        borderRadius: "999px",
        border: "none",
        background: "#4f46e5",
        color: "white",
        fontWeight: 600,
        boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
        cursor: "pointer",
        zIndex: 50,
      }}
    >
      Chat with Buddy
    </button>
  );
}