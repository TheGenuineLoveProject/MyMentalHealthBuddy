import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * Pagination Component
 * Accessible pagination with page navigation
 */
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/Button';
export function Pagination({ currentPage, totalPages, onPageChange, pageSize = 10, totalItems, showPageSize = false, onPageSizeChange, pageSizeOptions = [10, 25, 50, 100], 'data-testid': testId, }) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 7; // Maximum page numbers to show
        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            // Show first page
            pages.push(1);
            // Calculate middle pages
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            // Add ellipsis if needed
            if (start > 2) {
                pages.push('...');
            }
            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }
            // Show last page
            pages.push(totalPages);
        }
        return pages;
    };
    const handlePageClick = (page) => {
        if (typeof page === 'number' && page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };
    const pageNumbers = getPageNumbers();
    return (_jsxs("div", { className: "flex items-center justify-between gap-4", "data-testid": testId, children: [totalItems !== undefined && (_jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Showing ", Math.min((currentPage - 1) * pageSize + 1, totalItems), " to", ' ', Math.min(currentPage * pageSize, totalItems), " of ", totalItems, " items"] })), showPageSize && onPageSizeChange && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Items per page:" }), _jsx("select", { value: pageSize, onChange: (e) => onPageSizeChange(Number(e.target.value)), className: "px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500", "data-testid": `${testId}-page-size`, children: pageSizeOptions.map((size) => (_jsx("option", { value: size, children: size }, size))) })] })), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onPageChange(1), disabled: currentPage === 1, "aria-label": "First page", "data-testid": `${testId}-first`, children: _jsx(ChevronsLeft, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, "aria-label": "Previous page", "data-testid": `${testId}-previous`, children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx("div", { className: "flex items-center gap-1", children: pageNumbers.map((page, index) => {
                            if (page === '...') {
                                return (_jsx("span", { className: "px-3 py-1 text-gray-500", children: "..." }, `ellipsis-${index}`));
                            }
                            return (_jsx("button", { onClick: () => handlePageClick(page), className: `
                  px-3 py-1 min-w-[40px] rounded-md transition-colors
                  ${page === currentPage
                                    ? 'bg-blue-600 text-white font-medium'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `, "aria-label": `Page ${page}`, "aria-current": page === currentPage ? 'page' : undefined, "data-testid": `${testId}-page-${page}`, children: page }, page));
                        }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, "aria-label": "Next page", "data-testid": `${testId}-next`, children: _jsx(ChevronRight, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onPageChange(totalPages), disabled: currentPage === totalPages, "aria-label": "Last page", "data-testid": `${testId}-last`, children: _jsx(ChevronsRight, { className: "h-4 w-4" }) })] })] }));
}
export function SimplePagination({ currentPage, totalPages, onPageChange, 'data-testid': testId, }) {
    return (_jsxs("div", { className: "flex items-center justify-between", "data-testid": testId, children: [_jsxs(Button, { variant: "ghost", onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, "data-testid": `${testId}-previous`, children: [_jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }), "Previous"] }), _jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Page ", currentPage, " of ", totalPages] }), _jsxs(Button, { variant: "ghost", onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, "data-testid": `${testId}-next`, children: ["Next", _jsx(ChevronRight, { className: "h-4 w-4 ml-1" })] })] }));
}
