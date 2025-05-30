// src/components/layout/NsbsPageHeader.tsx
// Developed by Luccas A E | 2025
// Purpose: Provides a consistent and prominent header for main pages and sections within the NSBS platform.
// Features: Displays page title, optional breadcrumbs for navigation context, and an optional slot for action buttons or controls.
// UI/UX Focus: Establishes clear context for the user, aids navigation, maintains visual consistency.
// Adherence to NSBS Principles: Clean, functional, and supports a distraction-free professional interface.

import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface NsbsPageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actionSlot?: ReactNode; // Slot for buttons like "Create New", "Export", etc.
  className?: string;
}

export const NsbsPageHeader: React.FC<NsbsPageHeaderProps> = ({
  title,
  breadcrumbs,
  actionSlot,
  className = '',
}) => {
  return (
    <header className={`nsbs-page-header bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-gray-400 dark:text-gray-500 mx-0.5 sm:mx-1" aria-hidden="true" />
                  )}
                  {crumb.href && !crumb.isCurrent ? (
                    <a
                      href={crumb.href}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span
                      className={`${crumb.isCurrent ? 'text-gray-700 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                      aria-current={crumb.isCurrent ? 'page' : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white truncate" title={title}>
            {title}
          </h1>
          {actionSlot && <div className="flex-shrink-0">{actionSlot}</div>}
        </div>
      </div>
    </header>
  );
};

export default NsbsPageHeader;
