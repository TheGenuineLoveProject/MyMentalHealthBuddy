import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
let toastCounter = 0;
const ToastContext = createContext(undefined);
/**
 * Toast Provider - Manages global toast state
 * Wraps the app to provide toast functionality to all components
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const removeToast = useCallback((toastId) => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, []);
    const showToast = useCallback((type, title, message, duration) => {
        const id = `toast-${++toastCounter}`;
        const toast = {
            id,
            type,
            title,
            message,
            duration,
            onClose: removeToast,
        };
        setToasts((prev) => [...prev, toast]);
        return id;
    }, [removeToast]);
    const success = useCallback((title, message, duration) => showToast('success', title, message, duration), [showToast]);
    const error = useCallback((title, message, duration) => showToast('error', title, message, duration), [showToast]);
    const info = useCallback((title, message, duration) => showToast('info', title, message, duration), [showToast]);
    const warning = useCallback((title, message, duration) => showToast('warning', title, message, duration), [showToast]);
    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const dismissAll = useCallback(() => {
        setToasts([]);
    }, []);
    const value = {
        toasts,
        success,
        error,
        info,
        warning,
        dismiss,
        dismissAll,
    };
    return _jsx(ToastContext.Provider, { value: value, children: children });
}
/**
 * Hook to access toast functionality
 * Must be used within ToastProvider
 */
export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
