type FloatingButtonProps = {
  onOpen: () => void;
  isOpen?: boolean;
};

export default function FloatingButton({ onOpen, isOpen = false }: FloatingButtonProps) {
  if (isOpen) return null;

  return (
    <button
      onClick={onOpen}
      data-testid="button-chat-floating"
      type="button"
      aria-label="Open chat with AI Buddy"
      aria-expanded={isOpen}
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "1.5rem",
        padding: "0.85rem 1.5rem",
        borderRadius: "999px",
        border: "none",
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        color: "white",
        fontWeight: 600,
        fontSize: "0.95rem",
        boxShadow: "0 10px 25px rgba(79, 70, 229, 0.35)",
        cursor: "pointer",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 14px 30px rgba(79, 70, 229, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(79, 70, 229, 0.35)";
      }}
    >
      <span aria-hidden="true">💬</span>
      <span>Chat with Buddy</span>
    </button>
  );
}
