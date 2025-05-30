// src/components/dashboard/NsbsDashboardWidgetWrapper.tsx
// Developed by Luccas A E | 2025
// Purpose: A standardized wrapper for displaying individual widgets on dashboards (user or admin).
// Features: Consistent styling, optional title, optional action slot in the header (e.g., for a settings cog or refresh button).
// UI/UX Focus: Provides a clear, contained visual structure for dashboard elements, promoting organization and scannability.
// Adherence to NSBS Principles: Clean and professional presentation, contributes to a focused UI.

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility

export interface NsbsDashboardWidgetWrapperProps {
  title?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  actionSlot?: ReactNode; // For icons or small buttons in the header
  isLoading?: boolean;
}

export const NsbsDashboardWidgetWrapper: React.FC<NsbsDashboardWidgetWrapperProps> = ({
  title,
  children,
  className,
  contentClassName,
  headerClassName,
  actionSlot,
  isLoading = false,
}) => {
  return (
    <section
      className={cn(
        "nsbs-dashboard-widget bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col",
        className
      )}
      aria-labelledby={title ? `widget-title-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined}
    >
      {(title || actionSlot) && (
        <header
          className={cn(
            "px-4 py-3 sm:px-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between",
            headerClassName
          )}
        >
          {title && (
            <h3 id={title ? `widget-title-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined} className="text-md sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
              {title}
            </h3>
          )}
          {actionSlot && <div className="ml-4 flex-shrink-0">{actionSlot}</div>}
        </header>
      )}
      <div className={cn("p-4 sm:p-5 flex-grow relative", contentClassName)}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10">
            {/* Re-use NsbsLoadingSpinner or a simpler one here */}
            <svg
              className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
};

export default NsbsDashboardWidgetWrapper;
