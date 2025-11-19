/**
 * Pagination Component
 * Accessible pagination with page navigation
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  showPageSize?: boolean;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  'data-testid'?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  totalItems,
  showPageSize = false,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  'data-testid': testId,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Maximum page numbers to show

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between gap-4" data-testid={testId}>
      {/* Items info */}
      {totalItems !== undefined && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{' '}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
        </div>
      )}

      {/* Page size selector */}
      {showPageSize && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            data-testid={`${testId}-page-size`}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          data-testid={`${testId}-first`}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          data-testid={`${testId}-previous`}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`
                  px-3 py-1 min-w-[40px] rounded-md transition-colors
                  ${
                    page === currentPage
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                data-testid={`${testId}-page-${page}`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          data-testid={`${testId}-next`}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          data-testid={`${testId}-last`}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Simple Pagination (just prev/next)
 */
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  'data-testid'?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  'data-testid': testId,
}: SimplePaginationProps) {
  return (
    <div className="flex items-center justify-between" data-testid={testId}>
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        data-testid={`${testId}-previous`}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        data-testid={`${testId}-next`}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
