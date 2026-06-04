import React from "react";

interface ReflectionFooterProps {
  text?: string;
}

export default function ReflectionFooter({
  text = "Take a deep breath and be gentle with yourself.",
}: ReflectionFooterProps) {
  return (
    <div className="w-full text-center text-sm text-gray-500 py-4">
      {text}
    </div>
  );
}