import { useEffect, useState } from "react";
import { isSaved, toggleSave } from "../../content/saves/savesStore";

export function SaveButton({ routeKey }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setSaved(isSaved(routeKey));
    } catch {
      setSaved(false);
    }
  }, [routeKey]);

  return (
    <button
      onClick={() => {
        toggleSave(routeKey);
        setSaved((s) => !s);
      }}
      className="rounded-xl border border-sage-200 dark:border-white/10 bg-sage-100 dark:bg-white/10 px-3 py-2 text-sm hover:bg-sage-200 dark:hover:bg-white/15 transition min-h-[44px]"
      data-testid="button-save"
      aria-label={saved ? "Remove from saved" : "Save this page"}
    >
      {saved ? "Saved ★" : "Save"}
    </button>
  );
}

export default SaveButton;
