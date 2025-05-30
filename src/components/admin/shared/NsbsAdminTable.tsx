// src/components/admin/shared/NsbsAdminTable.tsx
// Developed by Luccas A E | 2025
// Purpose: A reusable, configurable data table for admin sections to display lists of resources (users, courses, etc.).
// Features: Customizable columns, sortable headers, optional pagination (hooks for data fetching/pagination logic would be passed as props), action column for edit/delete.
// UI/UX Focus: Clear data presentation, easy scanning of information, intuitive controls for sorting and actions.
// Adherence to NSBS Principles: Facilitates efficient platform administration.

import React, { ReactNode, useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Edit3, Trash2, Eye } from 'lucide-react'; // More icons
import { NsbsButton } from '@/components/ui/NsbsButton'; // Assuming NsbsButton
import { cn } from '@/lib/utils'; // Assuming cn utility

export interface ColumnDefinition<T> {
  key: keyof T | string; // Can be a key of T or a custom string for rendered columns
  header: string;
  render?: (item: T) => ReactNode; // Custom render function for a cell
  sortable?: boolean;
  className?: string; // For th/td
  headerClassName?: string; // For th only
}

export interface ActionItem<T> {
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  variant?: VariantProps<typeof NsbsButton.buttonVariants>['variant']; // Use NsbsButton variants
  className?: string; // Additional class for the button
  disabled?: (item: T) => boolean;
}

type SortDirection = 'asc' | 'desc';

export interface NsbsAdminTableProps<T extends { id: string | number }> {
  columns: ColumnDefinition<T>[];
  data: T[];
  actions?: ActionItem<T>[]; // Row-specific actions
  onSort?: (sortKey: keyof T | string, sortDirection: SortDirection) => void; // For server-side sorting
  initialSortKey?: keyof T | string;
  initialSortDirection?: SortDirection;
  isLoading?: boolean;
  emptyStateMessage?: string;
  // Pagination props (data fetching for pagination would be handled by parent)
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const NsbsAdminTable = <T extends { id: string | number }>({
  columns,
  data,
  actions,
  onSort,
  initialSortKey,
  initialSortDirection,
  isLoading = false,
  emptyStateMessage = "No data available.",
  currentPage,
  totalPages,
  onPageChange,
}: NsbsAdminTableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | string | undefined>(initialSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(initialSortDirection);

  const handleSort = (key: keyof T | string) => {
    if (onSort) {
      const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
      setSortKey(key);
      setSortDirection(newDirection);
      onSort(key, newDirection);
    }
    // Client-side sorting could be added here if 'onSort' is not provided,
    // but for admin tables, server-side is often preferred for large datasets.
  };
  
  const sortedData = useMemo(() => {
    if (!onSort && sortKey && data) { // Basic client-side sort if no onSort prop
        return [...data].sort((a, b) => {
            const aVal = a[sortKey as keyof T];
            const bVal = b[sortKey as keyof T];
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }
    return data;
  }, [data, sortKey, sortDirection, onSort]);


  return (
    <div className="nsbs-admin-table-wrapper flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black dark:ring-gray-700 ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      scope="col"
                      className={cn(
                        "py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6",
                        col.headerClassName,
                        col.sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : ""
                      )}
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                      aria-sort={sortKey === col.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <div className="flex items-center group">
                        {col.header}
                        {col.sortable && (
                          <span className="ml-2 flex-none rounded text-gray-400 dark:text-gray-500">
                            {sortKey === col.key ? (
                              sortDirection === 'asc' ? (
                                <ChevronUp className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100" aria-hidden="true" /> // Show on hover
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  {actions && actions.length > 0 && (
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-sm font-semibold text-gray-900 dark:text-white">
                      <span className="sr-only">Actions</span>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-900">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, rowIndex) => ( // Skeleton loader rows
                    <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                      {columns.map((col) => (
                        <td key={String(col.key)} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                        </td>
                      ))}
                      {actions && actions.length > 0 && (
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (actions ? 1 : 0)} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      {emptyStateMessage}
                    </td>
                  </tr>
                ) : (
                  sortedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      {columns.map((col) => (
                        <td
                          key={`${item.id}-${String(col.key)}`}
                          className={cn("whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700 dark:text-gray-300 sm:pl-6", col.className)}
                        >
                          {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                        </td>
                      ))}
                      {actions && actions.length > 0 && (
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                          {actions.map((action) => (
                            <NsbsButton
                              key={action.label}
                              variant={action.variant || 'ghost'}
                              size="sm"
                              onClick={() => action.onClick(item)}
                              className={cn("p-1 h-auto", action.className)}
                              disabled={action.disabled ? action.disabled(item) : false}
                              title={action.label} // Tooltip
                            >
                              {action.icon || action.label}
                            </NsbsButton>
                          ))}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Basic Pagination Example - can be enhanced */}
            {currentPage !== undefined && totalPages !== undefined && totalPages > 1 && onPageChange && (
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <NsbsButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>Previous</NsbsButton>
                        <NsbsButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</NsbsButton>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <NsbsButton
                                    variant="outline"
                                    size="sm"
                                    className="rounded-r-none"
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                >
                                    Previous
                                </NsbsButton>
                                {/* Numbered pages can be added here for more complex pagination */}
                                <NsbsButton
                                    variant="outline"
                                    size="sm"
                                    className="rounded-l-none"
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    Next
                                </NsbsButton>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NsbsAdminTable;

// Example Action Icons (can be passed into actions prop):
// export const ViewActionIcon = () => <Eye className="w-4 h-4" />;
// export const EditActionIcon = () => <Edit3 className="w-4 h-4" />;
// export const DeleteActionIcon = () => <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />;
