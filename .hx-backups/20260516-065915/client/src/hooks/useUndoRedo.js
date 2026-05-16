import { useState, useCallback } from "react";

export function useUndoRedo(initialState, maxHistory = 50) {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];

  const setState = useCallback((newState) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(typeof newState === "function" ? newState(currentState) : newState);
    
    if (newHistory.length > maxHistory) {
      newHistory.shift();
      setCurrentIndex(newHistory.length - 1);
    } else {
      setCurrentIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [history, currentIndex, currentState, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const reset = useCallback((newInitialState) => {
    setHistory([newInitialState ?? initialState]);
    setCurrentIndex(0);
  }, [initialState]);

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historyLength: history.length
  };
}
