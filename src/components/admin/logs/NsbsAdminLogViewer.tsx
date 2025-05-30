// src/components/admin/logs/NsbsAdminLogViewer.tsx
// Developed by Luccas A E | 2025
// Purpose: A component for displaying and interacting with logs (e.g., system logs, audit logs).
// Features: Log entry rendering (using NsbsAdminAuditLogRow or similar), filtering controls, search within logs, pagination.
// UI/UX Focus: Provides administrators with a powerful and clear interface for inspecting log data.
// Adherence to NSBS Principles: Supports platform monitoring and troubleshooting for administrators.

'use client';

import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import { NsbsAdminAuditLogRow, AuditLogEntry } from './NsbsAdminAuditLogRow'; // Assuming this component
import { NsbsPaginator, NsbsPaginatorProps } from '@/components/common/NsbsPaginator';
import { NsbsFilterSortControls, FilterOption, SortOption } from '@/components/common/NsbsFilterSortControls';
import { NsbsLoadingSpinner } from '@/components/ui/NsbsLoadingSpinner';
import { NsbsEmptyState } from '@/components/common/NsbsEmptyState';
import { cn } from '@/lib/utils';

// Define filter and sort types specific to logs
export interface LogFilters {
  level?: string; // e.g., 'INFO', 'ERROR', 'WARN'
  actor?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}
export type LogSortKey = 'timestamp' | 'actor' | 'action' | 'level'; // Example sortable keys

export interface NsbsAdminLogViewerProps {
  logs: AuditLogEntry[]; // The raw log data
  isLoading?: boolean;
  totalLogs?: number; // For pagination if server-side
  itemsPerPage?: number;
  initialPage?: number;
  onQueryChange?: (params: { page: number; filters: LogFilters; sortKey?: LogSortKey; sortDirection?: 'asc' | 'desc' }) => void; // For server-side fetching
  availableFilterOptions?: {
    levels?: FilterOption[];
    actions?: FilterOption[];
    // Add more as needed
  };
  className?: string;
  title?: string;
  renderLogEntry?: (logEntry: AuditLogEntry) => ReactNode; // Custom row renderer
}

const DEFAULT_ITEMS_PER_PAGE = 25;

export const NsbsAdminLogViewer: React.FC<NsbsAdminLogViewerProps> = ({
  logs: initialLogs,
  isLoading = false,
  totalLogs, // If provided, assumes server-side pagination
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  initialPage = 1,
  onQueryChange,
  availableFilterOptions,
  className,
  title = "System Logs",
  renderLogEntry = (log) => <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"><NsbsAdminAuditLogRow logEntry={log} /></tr>,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [filters, setFilters] = useState<LogFilters>({});
  // Add sort state if client-side sorting is needed, or manage via props for server-side

  // Client-side filtering and pagination (if onQueryChange is not provided)
  const processedLogs = useMemo(() => {
    if (onQueryChange) return initialLogs; // Server handles processing

    let filtered = [...initialLogs];
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        JSON.stringify(log).toLowerCase().includes(term) // Simple global search
      );
    }
    if (filters.level) {
      filtered = filtered.filter(log => (log.status || 'INFO').toUpperCase() === filters.level?.toUpperCase());
    }
    if (filters.actor) {
        const actorTerm = filters.actor.toLowerCase();
        filtered = filtered.filter(log => {
            const actorDisplay = typeof log.actor === 'string' ? log.actor : log.actor?.name || log.actor?.email || '';
            return actorDisplay.toLowerCase().includes(actorTerm);
        });
    }
    // Add more client-side filters as needed

    // Client-side sorting would go here if implemented

    return filtered;
  }, [initialLogs, filters, onQueryChange]);

  const paginatedLogs = useMemo(() => {
    if (onQueryChange) return processedLogs; // Server handles pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return processedLogs.slice(start, end);
  }, [processedLogs, currentPage, itemsPerPage, onQueryChange]);

  const effectiveTotalLogs = totalLogs !== undefined ? totalLogs : processedLogs.length;
  const totalPages = Math.ceil(effectiveTotalLogs / itemsPerPage);

  useEffect(() => {
    if (onQueryChange) {
      onQueryChange({ page: currentPage, filters /*, sort */ });
    }
  }, [currentPage, filters, /* sort */ onQueryChange]);

  const handleFilterChange = (filterId: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
    if (filterId !== 'searchTerm') setCurrentPage(1); // Reset to page 1 on filter change, except for search
  };
  
  const handleSearchChange = (term: string) => {
    setFilters(prev => ({...prev, searchTerm: term}));
    // Debouncing for search is in NsbsFilterSortControls; page reset also handled there or via useEffect if needed
    setCurrentPage(1);
  }

  const filterControlConfig = [
    ...(availableFilterOptions?.levels ? [{
      id: 'level', label: 'Level', options: availableFilterOptions.levels, currentValue: filters.level || '', onChange: handleFilterChange, placeholder: 'All Levels'
    }] : []),
    ...(availableFilterOptions?.actions ? [{
      id: 'action', label: 'Action Type', options: availableFilterOptions.actions, currentValue: filters.action || '', onChange: handleFilterChange, placeholder: 'All Actions'
    }] : []),
    // Add more controls for date range, actor search etc.
  ];
  
  return (
    <div className={cn("nsbs-admin-log-viewer space-y-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow", className)}>
      <header>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      </header>
      
      <NsbsFilterSortControls
        filters={filterControlConfig}
        onSearchChange={handleSearchChange} // Pass this for the search input
        searchTerm={filters.searchTerm}
        searchPlaceholder="Search logs..."
        // Add sort options and handlers if needed
      />

      {isLoading && <div className="flex justify-center py-10"><NsbsLoadingSpinner size="lg" loadingText="Loading logs..." /></div>}
      
      {!isLoading && paginatedLogs.length === 0 && (
        <NsbsEmptyState title="No Logs Found" message={filters.searchTerm || Object.keys(filters).some(k => filters[k as keyof LogFilters]) ? "No logs match your current filters." : "There are no logs to display."} />
      )}

      {!isLoading && paginatedLogs.length > 0 && (
        <div className="overflow-x-auto shadow ring-1 ring-black dark:ring-gray-700 ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {/* Define table headers based on NsbsAdminAuditLogRow structure */}
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Timestamp</th>
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Actor</th>
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Action</th>
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Target</th>
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Details / IP</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedLogs.map(log => renderLogEntry(log))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <NsbsPaginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={effectiveTotalLogs}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default NsbsAdminLogViewer;
