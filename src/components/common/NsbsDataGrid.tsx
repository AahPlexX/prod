// src/components/common/NsbsDataGrid.tsx
// Developed by Luccas A E | 2025
// Purpose: An advanced data grid component, extending NsbsAdminTable with features like row selection and potentially more complex cell renderers.
// Features: Row selection (checkboxes), customizable cell rendering, hooks for actions on selected rows, robust typing.
// UI/UX Focus: Efficient display and interaction with large, complex datasets, particularly in admin areas.
// Adherence to NSBS Principles: Supports powerful data management for administrators where clarity and precision are key.

'use client'; // For stateful interactions like selection

import React, { useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { NsbsAdminTable, ColumnDefinition, ActionItem } from '@/components/admin/shared/NsbsAdminTable'; // Assuming this path
import { NsbsButton } from '@/components/ui/NsbsButton';
import { cn } from '@/lib/utils';
import { Trash2, Copy, AlertCircle } from 'lucide-react'; // Example icons for bulk actions

// Define a generic type for items, must have an id
type Identifiable = { id: string | number; [key: string]: any };

export interface NsbsDataGridProps<T extends Identifiable> {
  columns: ColumnDefinition<T>[];
  data: T[];
  rowActions?: ActionItem<T>[]; // Same as NsbsAdminTable for individual row actions
  bulkActions?: ActionItem<T[]>[]; // Actions that operate on an array of selected items
  onSort?: (sortKey: keyof T | string, sortDirection: 'asc' | 'desc') => void;
  initialSortKey?: keyof T | string;
  initialSortDirection?: 'asc' | 'desc';
  isLoading?: boolean;
  emptyStateMessage?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSelectionChange?: (selectedItems: T[]) => void; // Callback for when selection changes
  rowKeyField?: keyof T; // Field to use as the key for rows, defaults to 'id'
  selectableRows?: boolean; // Enable/disable row selection
  className?: string;
  tableClassName?: string;
}

export const NsbsDataGrid = <T extends Identifiable>({
  columns: propColumns,
  data,
  rowActions,
  bulkActions,
  onSort,
  initialSortKey,
  initialSortDirection,
  isLoading,
  emptyStateMessage,
  currentPage,
  totalPages,
  onPageChange,
  onSelectionChange,
  rowKeyField = 'id',
  selectableRows = false,
  className,
  tableClassName,
}: NsbsDataGridProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string | number>>(new Set());

  const toggleRowSelection = useCallback((rowKey: string | number) => {
    setSelectedRowKeys(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(rowKey)) {
        newSelection.delete(rowKey);
      } else {
        newSelection.add(rowKey);
      }
      return newSelection;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedRowKeys.size === data.length) {
      setSelectedRowKeys(new Set());
    } else {
      setSelectedRowKeys(new Set(data.map(item => item[rowKeyField] as string | number)));
    }
  }, [data, rowKeyField, selectedRowKeys.size]);

  useEffect(() => {
    if (onSelectionChange) {
      const selectedItems = data.filter(item => selectedRowKeys.has(item[rowKeyField] as string | number));
      onSelectionChange(selectedItems);
    }
  }, [selectedRowKeys, data, onSelectionChange, rowKeyField]);
  
  // Reset selection if data changes significantly (e.g., page change)
  useEffect(() => {
    setSelectedRowKeys(new Set());
  }, [data]);


  const gridColumns: ColumnDefinition<T>[] = useMemo(() => {
    if (!selectableRows) return propColumns;
    return [
      {
        key: '__select__',
        header: (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-100 dark:bg-gray-700"
            checked={data.length > 0 && selectedRowKeys.size === data.length}
            indeterminate={data.length > 0 && selectedRowKeys.size > 0 && selectedRowKeys.size < data.length}
            onChange={toggleSelectAll}
            aria-label="Select all rows"
          />
        ),
        render: (item: T) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-100 dark:bg-gray-700"
            checked={selectedRowKeys.has(item[rowKeyField] as string | number)}
            onChange={() => toggleRowSelection(item[rowKeyField] as string | number)}
            onClick={(e) => e.stopPropagation()} // Prevent row click if any
            aria-label={`Select row for ${item[rowKeyField] || 'item'}`}
          />
        ),
        className: 'w-12 text-center', // Fixed width for checkbox column
        headerClassName: 'w-12 text-center',
      },
      ...propColumns,
    ];
  }, [selectableRows, propColumns, data, selectedRowKeys, toggleSelectAll, toggleRowSelection, rowKeyField]);

  const selectedItems = data.filter(item => selectedRowKeys.has(item[rowKeyField] as string | number));

  return (
    <div className={cn("nsbs-data-grid space-y-4", className)}>
      {selectableRows && selectedItems.length > 0 && bulkActions && bulkActions.length > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md flex items-center justify-between">
          <p className="text-sm text-blue-700 dark:text-blue-200">
            <span className="font-semibold">{selectedItems.length}</span> item(s) selected.
          </p>
          <div className="space-x-2">
            {bulkActions.map(action => (
              <NsbsButton
                key={action.label}
                variant={action.variant || 'secondary'}
                size="sm"
                onClick={() => action.onClick(selectedItems)}
                iconLeft={action.icon}
                disabled={action.disabled ? action.disabled(selectedItems) : false}
              >
                {action.label}
              </NsbsButton>
            ))}
          </div>
        </div>
      )}
      <NsbsAdminTable<T>
        columns={gridColumns}
        data={data}
        actions={rowActions}
        onSort={onSort}
        initialSortKey={initialSortKey}
        initialSortDirection={initialSortDirection}
        isLoading={isLoading}
        emptyStateMessage={emptyStateMessage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        // NsbsAdminTable doesn't have its own className prop in this definition, so pass tableClassName to it if needed
        // Or modify NsbsAdminTable to accept a wrapperClassName
      />
    </div>
  );
};

// Example Bulk Action Icons
// export const BulkDeleteIcon = () => <Trash2 className="w-4 h-4 mr-2" />;
// export const BulkDuplicateIcon = () => <Copy className="w-4 h-4 mr-2" />;

export default NsbsDataGrid;
