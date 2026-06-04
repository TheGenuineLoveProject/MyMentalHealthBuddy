import React from "react";

interface UpsellModalProps {
  open?: boolean;
  onClose?: () => void;
  toolName?: string;
}

export default function UpsellModal({
  open = false,
  onClose,
  toolName,
}: UpsellModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          Upgrade
        </h2>

        <p className="mb-4">
          {toolName
            ? `Premium features for ${toolName} are coming soon.`
            : "Premium features coming soon."}
        </p>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}