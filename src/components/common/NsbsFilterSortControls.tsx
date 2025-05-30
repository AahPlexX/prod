// src/components/common/NsbsFilterSortControls.tsx
// Developed by Luccas A E | 2025
// Purpose: Provides a set of UI controls for filtering and sorting data lists (e.g., course catalog, admin tables).
// Features: Dropdowns for selecting filter categories and sort orders, optional search input.
// UI/UX Focus: Intuitive controls, clear visual feedback on active filters/sorts, easily extendable.
// Adherence to NSBS Principles: Supports efficient data interaction on pages like Course Catalog.

import React, { useState, ChangeEvent, ReactNode } from 'react';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { Filter, ListFilter, SortAsc, SortDesc, Search, XCircle } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortOption {
  value: string; // e.g., 'title_asc', 'price_desc'
  label: string;
}

export interface NsbsFilterSortControlsProps {
  filters?: {
    id: string;
    label: string;
    options: FilterOption[];
    currentValue: string;
    onChange: (filterId: string, value: string) => void;
    placeholder?: string;
  }[];
  sortOptions?: SortOption[];
  currentSortValue?: string;
  onSortChange?: (value: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onClearFilters?: () => void;
  searchPlaceholder?: string;
  className?: string;
  showLabels?: boolean; // Show labels above select/input or use placeholders
}

export const NsbsFilterSortControls: React.FC<NsbsFilterSortControlsProps> = ({
  filters = [],
  sortOptions = [],
  currentSortValue,
  onSortChange,
  searchTerm,
  onSearchChange,
  onClearFilters,
  searchPlaceholder = "Search...",
  className,
  showLabels = false,
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm || '');

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInternalSearchTerm(e.target.value);
    if (onSearchChange) { // Debounce this in a real app for performance
        onSearchChange(e.target.value);
    }
  };
  
  const hasActiveFilters = filters.some(f => f.currentValue && f.currentValue !== '') || (searchTerm && searchTerm !== '');

  return (
    <div className={cn("nsbs-filter-sort-controls bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:items-end gap-4">
        {onSearchChange !== undefined && (
          <div className="lg:flex-grow">
            {showLabels && (
              <label htmlFor="global-search" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="search"
                id="global-search"
                name="global-search"
                value={internalSearchTerm}
                onChange={handleSearchInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder={searchPlaceholder}
              />
            </div>
          </div>
        )}

        {filters.map((filter) => (
          <div key={filter.id}>
            {showLabels && (
              <label htmlFor={filter.id} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {filter.label}
              </label>
            )}
            <select
              id={filter.id}
              name={filter.id}
              value={filter.currentValue}
              onChange={(e) => filter.onChange(filter.id, e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm"
            >
              <option value="">{filter.placeholder || }</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}

        {sortOptions.length > 0 && onSortChange && (
          <div>
            {showLabels && (
              <label htmlFor="sort-order" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort by
              </label>
            )}
            <select
              id="sort-order"
              name="sort-order"
              value={currentSortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm"
            >
              {/* <option value="">Default Order</option> */}
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
        
        {onClearFilters && hasActiveFilters && (
            <div className="lg:ml-auto pt-3 lg:pt-0 flex items-end">
                 <NsbsButton
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    iconLeft={<XCircle className="w-3.5 h-3.5"/>}
                >
                    Clear Filters
                </NsbsButton>
            </div>
        )}
      </div>
    </div>
  );
};

export default NsbsFilterSortControls;
