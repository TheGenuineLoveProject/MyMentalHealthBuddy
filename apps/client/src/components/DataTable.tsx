/**
 * Advanced Data Table Component
 * Sortable, filterable, paginated table with selection
 */

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { Checkbox } from '@/components/Checkbox';

export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  pageSize?: number;
  searchable?: boolean;
  emptyMessage?: string;
  'data-testid'?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  selectable = false,
  onSelectionChange,
  pageSize = 10,
  searchable = true,
  emptyMessage = 'No data available',
  'data-testid': testId,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<any>>(new Set());

  // Process data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchQuery) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = typeof col.accessor === 'function'
            ? col.accessor(row)
            : row[col.accessor];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = getColumnValue(a, sortConfig.key, columns);
        const bVal = getColumnValue(b, sortConfig.key, columns);

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, columns, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (columnId: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== columnId) {
        return { key: columnId, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key: columnId, direction: 'desc' };
      }
      return null;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = new Set(selected);
    
    if (e.target.checked) {
      // Add all current page rows to selection
      paginatedData.forEach((row) => newSelected.add(row[keyField]));
    } else {
      // Remove all current page rows from selection
      paginatedData.forEach((row) => newSelected.delete(row[keyField]));
    }
    
    setSelected(newSelected);
    // Pass full selection set, not just current page
    onSelectionChange?.(data.filter((r) => newSelected.has(r[keyField])));
  };

  const handleSelectRow = (row: T, e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = new Set(selected);
    if (e.target.checked) {
      newSelected.add(row[keyField]);
    } else {
      newSelected.delete(row[keyField]);
    }
    setSelected(newSelected);
    onSelectionChange?.(data.filter((r) => newSelected.has(r[keyField])));
  };

  const allSelected = paginatedData.length > 0 && paginatedData.every((row) =>
    selected.has(row[keyField])
  );
  const someSelected = paginatedData.some((row) => selected.has(row[keyField]));

  return (
    <div className="w-full" data-testid={testId}>
      {/* Search */}
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              data-testid="input-table-search"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={!allSelected && someSelected}
                    onChange={handleSelectAll}
                    data-testid="checkbox-select-all"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.id)}
                      className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      data-testid={`button-sort-${column.id}`}
                    >
                      {column.header}
                      {sortConfig?.key === column.id ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 opacity-40" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={String(row[keyField])}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  data-testid={`table-row-${row[keyField]}`}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.has(row[keyField])}
                        onChange={(e) => handleSelectRow(row, e)}
                        data-testid={`checkbox-row-${row[keyField]}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const value = getColumnValue(row, column.id, columns);
                    return (
                      <td key={column.id} className="px-4 py-3 text-sm">
                        {column.render ? column.render(value, row) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of{' '}
            {processedData.length} results
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              data-testid="button-prev-page"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  data-testid={`button-page-${page}`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              data-testid="button-next-page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getColumnValue<T>(row: T, columnId: string, columns: Column<T>[]): any {
  const column = columns.find((c) => c.id === columnId);
  if (!column) return '';
  
  return typeof column.accessor === 'function'
    ? column.accessor(row)
    : row[column.accessor];
}
