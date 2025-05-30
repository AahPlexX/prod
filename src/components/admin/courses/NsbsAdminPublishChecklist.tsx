// src/components/admin/courses/NsbsAdminPublishChecklist.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays a checklist of pre-publication requirements for a course in the admin panel.
// Features: Lists criteria (e.g., content complete, exam ready), status indicators (pass/fail/warning), links to relevant admin sections for fixes.
// UI/UX Focus: Provides administrators with a clear overview of course readiness for publication, guiding them through necessary steps.
// Adherence to NSBS Principles: Ensures quality and completeness of courses before they go live[cite: 58].

import React, { ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
// Assume a Link component from Next.js or your router
const Link = ({ href, children, className, ...props }: any) => <a href={href} className={className} {...props}>{children}</a>; // Placeholder


export interface ChecklistItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning' | 'info' | 'pending';
  message?: string; // Additional information or reason for status
  actionLink?: {
    href: string;
    text: string;
  };
}

export interface NsbsAdminPublishChecklistProps {
  items: ChecklistItem[];
  title?: string;
  onRefreshChecks?: () => void; // Optional callback to re-run checks
  isLoading?: boolean;
  className?: string;
}

export const NsbsAdminPublishChecklist: React.FC<NsbsAdminPublishChecklistProps> = ({
  items,
  title = "Course Publication Readiness",
  onRefreshChecks,
  isLoading = false,
  className,
}) => {
  const getStatusIconAndColor = (status: ChecklistItem['status']): { icon: ReactNode; colorClasses: string } => {
    switch (status) {
      case 'pass':
        return { icon: <CheckCircle className="w-5 h-5" />, colorClasses: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-600" };
      case 'fail':
        return { icon: <XCircle className="w-5 h-5" />, colorClasses: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600" };
      case 'warning':
        return { icon: <AlertTriangle className="w-5 h-5" />, colorClasses: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600" };
      case 'info':
      case 'pending':
      default:
        return { icon: <AlertTriangle className="w-5 h-5" />, colorClasses: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600" };
    }
  };

  return (
    <div className={cn("nsbs-admin-publish-checklist bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {onRefreshChecks && (
          <button onClick={onRefreshChecks} disabled={isLoading} className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50">
            {isLoading ? "Refreshing..." : "Refresh Checks"}
          </button>
        )}
      </div>
      {isLoading && items.length === 0 ? (
         <div className="space-y-3 animate-pulse">
            {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            ))}
         </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No checklist items available.</p>
      ) : (
        <ul role="list" className="space-y-3">
          {items.map((item) => {
            const { icon, colorClasses } = getStatusIconAndColor(item.status);
            return (
              <li
                key={item.id}
                className={cn(
                  "p-3 sm:p-4 rounded-md border flex items-start gap-3 sm:gap-4",
                  colorClasses
                )}
              >
                <div className="flex-shrink-0 mt-0.5">{icon}</div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.label}</p>
                  {item.message && <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{item.message}</p>}
                </div>
                {item.actionLink && (
                  <Link
                    href={item.actionLink.href}
                    className="ml-auto flex-shrink-0 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    {item.actionLink.text} <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NsbsAdminPublishChecklist;
