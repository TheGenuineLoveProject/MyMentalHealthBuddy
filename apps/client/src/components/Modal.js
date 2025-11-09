import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Modal Component
 * Accessible modal dialogs with focus management
 */
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/Button';
import { FocusTrap } from '@/components/FocusTrap';
export function Modal({ isOpen, onClose, title, children, size = 'md', showCloseButton = true, closeOnOverlayClick = true, closeOnEscape = true, footer, 'data-testid': testId, }) {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };
    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        else {
            // Restore body scroll
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    const handleOverlayClick = () => {
        if (closeOnOverlayClick) {
            onClose();
        }
    };
    const handleEscape = () => {
        if (closeOnEscape) {
            onClose();
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in", onClick: handleOverlayClick, ...(testId && { 'data-testid': testId }), children: _jsx(FocusTrap, { active: isOpen, onEscape: handleEscape, children: _jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title", className: `
            bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizes[size]}
            max-h-[90vh] flex flex-col animate-scale-in
          `, onClick: (e) => e.stopPropagation(), ...(testId && { 'data-testid': `${testId}-content` }), children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h2", { id: "modal-title", className: "text-xl font-semibold", children: title }), showCloseButton && (_jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors", "aria-label": "Close modal", ...(testId && { 'data-testid': `${testId}-close` }), children: _jsx(X, { className: "h-5 w-5" }) }))] }), _jsx("div", { className: "p-6 overflow-y-auto flex-1", children: children }), footer && (_jsx("div", { className: "flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700", children: footer }))] }) }) }));
}
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'primary', 'data-testid': testId, }) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: title, size: "sm", ...(testId && { 'data-testid': testId }), footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: onClose, ...(testId && { 'data-testid': `${testId}-cancel` }), children: cancelText }), _jsx(Button, { variant: variant === 'danger' ? 'danger' : variant === 'warning' ? 'danger' : 'primary', onClick: handleConfirm, ...(testId && { 'data-testid': `${testId}-confirm` }), children: confirmText })] }), children: _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: message }) }));
}
