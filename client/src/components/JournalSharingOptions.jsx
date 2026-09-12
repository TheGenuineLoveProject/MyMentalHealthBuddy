import { useId } from "react";
import { Share2 } from "lucide-react";
import "../styles/mmhb-ui-controls.css";

export default function JournalSharingOptions({
  shareWithCommunity, setShareWithCommunity, shareAnonymously, setShareAnonymously,
}) {
  const id = useId();
  return (
    <div className="mmhb-journal-sharing" data-testid="journal-sharing-options">
      <label className="mmhb-sharing-row" htmlFor={`${id}-share`}>
        <span className="mmhb-sharing-copy">
          <Share2 aria-hidden="true" />
          <span>
            <span className="mmhb-sharing-title">Share with Community</span>
            <span className="mmhb-sharing-help" id={`${id}-help`}>
              Optional. Review your entry before sharing.
            </span>
          </span>
        </span>
        <input id={`${id}-share`} type="checkbox" checked={shareWithCommunity}
          onChange={(event) => setShareWithCommunity(event.target.checked)}
          aria-describedby={`${id}-help`} data-testid="toggle-share" />
      </label>
      {shareWithCommunity && (
        <label className="mmhb-sharing-anonymous" htmlFor={`${id}-anonymous`}>
          <input id={`${id}-anonymous`} type="checkbox" checked={shareAnonymously}
            onChange={(event) => setShareAnonymously(event.target.checked)}
            data-testid="toggle-anonymous" />
          <span>Share anonymously (hide your name)</span>
        </label>
      )}
    </div>
  );
}
