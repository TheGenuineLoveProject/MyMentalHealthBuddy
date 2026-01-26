import { useEffect, useCallback } from "react";
import { useLocation } from "wouter";

const defaultShortcuts = {
  "g h": "/",
  "g d": "/dashboard",
  "g t": "/tools",
  "g j": "/journal",
  "g c": "/chat",
  "g s": "/settings",
  "g p": "/profile",
  "g ?": "/help"
};

export function useKeyboardNav(customShortcuts = {}, options = {}) {
  const [, setLocation] = useLocation();
  const { enabled = true, onShortcut } = options;
  
  const shortcuts = { ...defaultShortcuts, ...customShortcuts };
  
  const handleKeySequence = useCallback((sequence) => {
    const action = shortcuts[sequence];
    
    if (action) {
      if (typeof action === "function") {
        action();
      } else if (typeof action === "string") {
        setLocation(action);
      }
      onShortcut?.(sequence, action);
      return true;
    }
    return false;
  }, [shortcuts, setLocation, onShortcut]);

  useEffect(() => {
    if (!enabled) return;

    let keySequence = "";
    let sequenceTimeout = null;

    const handleKeyDown = (event) => {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      
      if (tagName === "input" || tagName === "textarea" || target.isContentEditable) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();
      
      if (key === "escape") {
        keySequence = "";
        return;
      }

      if (key.length === 1 && /[a-z0-9?/]/.test(key)) {
        keySequence += keySequence ? ` ${key}` : key;
        
        clearTimeout(sequenceTimeout);
        sequenceTimeout = setTimeout(() => {
          keySequence = "";
        }, 1000);

        if (handleKeySequence(keySequence)) {
          event.preventDefault();
          keySequence = "";
          clearTimeout(sequenceTimeout);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(sequenceTimeout);
    };
  }, [enabled, handleKeySequence]);
}

export function useArrowNav(items, options = {}) {
  const { onSelect, loop = true, orientation = "vertical" } = options;
  
  const handleKeyDown = useCallback((event, currentIndex) => {
    let nextIndex = currentIndex;
    
    const isVertical = orientation === "vertical";
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

    if (event.key === prevKey) {
      event.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : (loop ? items.length - 1 : 0);
    } else if (event.key === nextKey) {
      event.preventDefault();
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (loop ? 0 : items.length - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = items.length - 1;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(items[currentIndex], currentIndex);
      return currentIndex;
    }

    return nextIndex;
  }, [items, loop, orientation, onSelect]);

  return { handleKeyDown };
}

export default useKeyboardNav;
