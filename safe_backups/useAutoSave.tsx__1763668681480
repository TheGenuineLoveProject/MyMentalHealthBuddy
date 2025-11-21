/**
 * Auto-Save Hook - 360° Content Management Enhancement
 * Automatically saves content as user types with smart debouncing
 */
import React from "react";

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number; // Debounce delay in milliseconds
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  saveNow: () => Promise<void>;
  hasPendingChanges: boolean;
}

/**
 * Auto-save hook with smart debouncing
 * Saves data automatically after user stops typing
 */
export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<T>(data);
  const savingRef = useRef(false);

  // Save function
  const save = useCallback(async () => {
    if (savingRef.current || !enabled) return;

    try {
      savingRef.current = true;
      setIsSaving(true);
      setHasPendingChanges(false);

      await onSave(data);

      setLastSaved(new Date());
      lastDataRef.current = data;

      console.log('[AUTO-SAVE] Content saved successfully');
    } catch (error) {
      console.error('[AUTO-SAVE] Failed to save:', error);
      setHasPendingChanges(true); // Mark as pending on error
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }, [data, onSave, enabled]);

  // Save immediately (for manual save)
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  // Auto-save on data change
  useEffect(() => {
    if (!enabled) return;

    // Check if data has actually changed
    const dataChanged = JSON.stringify(data) !== JSON.stringify(lastDataRef.current);
    if (!dataChanged) return;

    setHasPendingChanges(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  // Save before page unload
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasPendingChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        
        // Try to save before leaving (may not work in all browsers)
        save();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasPendingChanges, enabled, save]);

  return {
    isSaving,
    lastSaved,
    saveNow,
    hasPendingChanges
  };
}

/**
 * Format last saved time for display
 */
export function formatLastSaved(lastSaved: Date | null): string {
  if (!lastSaved) return 'Never saved';

  const now = new Date();
  const diff = now.getTime() - lastSaved.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;

  return lastSaved.toLocaleString();
}

/**
 * Auto-save indicator component
 */
interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasPendingChanges: boolean;
}

export function AutoSaveIndicator({ isSaving, lastSaved, hasPendingChanges }: AutoSaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="autosave-indicator">
      {isSaving ? (
        <>
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          <span>Saving...</span>
        </>
      ) : hasPendingChanges ? (
        <>
          <div className="h-2 w-2 bg-yellow-500 rounded-full" />
          <span>Unsaved changes</span>
        </>
      ) : lastSaved ? (
        <>
          <div className="h-2 w-2 bg-green-500 rounded-full" />
          <span>Saved {formatLastSaved(lastSaved)}</span>
        </>
      ) : (
        <>
          <div className="h-2 w-2 bg-gray-400 rounded-full" />
          <span>Not saved</span>
        </>
      )}
    </div>
  );
}
