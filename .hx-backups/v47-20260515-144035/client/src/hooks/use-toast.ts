import { useState, useCallback, useEffect } from "react";

type ToastVariant = "default" | "destructive" | "success";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_VALUE;
  return toastCount.toString();
}

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(toast: Omit<Toast, "id">) {
  const id = genId();
  const newToast = { ...toast, id };
  memoryState = { toasts: [...memoryState.toasts, newToast] };
  listeners.forEach((listener) => listener(memoryState));
  
  setTimeout(() => {
    memoryState = {
      toasts: memoryState.toasts.filter((t) => t.id !== id),
    };
    listeners.forEach((listener) => listener(memoryState));
  }, 5000);

  return id;
}

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
      return dispatch({ title, description, variant });
    },
    []
  );

  const dismiss = useCallback((toastId?: string) => {
    memoryState = {
      toasts: toastId
        ? memoryState.toasts.filter((t) => t.id !== toastId)
        : [],
    };
    listeners.forEach((listener) => listener(memoryState));
  }, []);

  return {
    ...state,
    toast,
    dismiss,
  };
}

export { type Toast, type ToastVariant };
