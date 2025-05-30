// src/components/admin/dashboard/NsbsAdminDashboardSummaryCard.tsx
// Developed by Luccas A E | 2025
// Purpose: A specialized card for the main admin dashboard displaying key summary figures.
// Features: Icon, title (metric name), large value, optional sub-text/comparison, link to detailed view. More focused than NsbsAdminMetricCard for high-level summaries.
// UI/UX Focus: Quick, scannable overview of vital platform statistics for administrators.
// Adherence to NSBS Principles: Supports efficient information access for platform oversight.

import React, { ReactNode } from 'react';
import { ArrowRightCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
// Assume a Link component from Next.js or your router
const Link = ({ href, children, className, ...props }: any) => <a href={href} className={className} {...props}>{children}</a>; // Placeholder


export interface NsbsAdminDashboardSummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode; // Mandatory icon for visual representation
  link?: {
    href: string;
    text?: string; // Defaults to "View Details"
  };
  subText?: string; // e.g., "+5 this week", "vs last month"
  colorScheme?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'gray'; // Predefined color schemes
  className?: string;
  isLoading?: boolean;
}

export const NsbsAdminDashboardSummaryCard: React.FC<NsbsAdminDashboardSummaryCardProps> = ({
  title,
  value,
  icon,
  link,
  subText,
  colorScheme = 'blue',
  className,
  isLoading = false,
}) => {
  const colorStyles: Record<NonNullable<NsbsAdminDashboardSummaryCardProps['colorScheme']>, { bg: string; text: string; iconContainerBg: string; hoverBg: string }> = {
    blue:   { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", iconContainerBg: "bg-blue-100 dark:bg-blue-800", hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-800/60"},
    green:  { bg: "bg-green-50 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", iconContainerBg: "bg-green-100 dark:bg-green-800", hoverBg: "hover:bg-green-100 dark:hover:bg-green-800/60"},
    purple: { bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", iconContainerBg: "bg-purple-100 dark:bg-purple-800", hoverBg: "hover:bg-purple-100 dark:hover:bg-purple-800/60"},
    red:    { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", iconContainerBg: "bg-red-100 dark:bg-red-800", hoverBg: "hover:bg-red-100 dark:hover:bg-red-800/60"},
    yellow: { bg: "bg-yellow-50 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", iconContainerBg: "bg-yellow-100 dark:bg-yellow-800", hoverBg: "hover:bg-yellow-100 dark:hover:bg-yellow-800/60"},
    gray:   { bg: "bg-gray-100 dark:bg-gray-800/50", text: "text-gray-700 dark:text-gray-300", iconContainerBg: "bg-gray-200 dark:bg-gray-700", hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-700/70"},
  };
  const currentColors = colorStyles[colorScheme];

  const CardContent: React.FC = () => (
    <>
      <div className={cn("p-3 rounded-full inline-flex mb-4", currentColors.iconContainerBg, currentColors.text)}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6 sm:w-7 sm:h-7' })}
      </div>
      <h3 className="text-sm sm:text-md font-medium text-gray-500 dark:text-gray-400 truncate" title={title}>
        {title}
      </h3>
      <p className={cn("text-2xl sm:text-3xl font-bold my-1 truncate", currentColors.text)} title={String(value)}>
        {isLoading ? <span className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 inline-block animate-pulse"></span> : value}
      </p>
      {subText && !isLoading && <p className="text-xs text-gray-500 dark:text-gray-400">{subText}</p>}
      {isLoading && <span className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 inline-block animate-pulse mt-1"></span>}
      {link && !isLoading && (
        <div className="mt-auto pt-3 text-xs font-medium flex items-center group-hover:underline">
          {link.text || "View Details"}
          <ArrowRightCircle className={cn("w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5", currentColors.text)} />
        </div>
      )}
    </>
  );

  const cardClasses = cn(
    "nsbs-admin-dashboard-summary-card p-4 sm:p-5 rounded-xl shadow-lg border border-transparent flex flex-col h-full group transition-all",
    currentColors.bg,
    link ? cn("cursor-pointer", currentColors.hoverBg) : "",
    className
  );

  if (isLoading) {
     return (
        <div className={cn(cardClasses, "animate-pulse")}>
           <div className={cn("p-3 rounded-full inline-flex mb-4 w-12 h-12 sm:w-14 sm:h-14", currentColors.iconContainerBg)}></div>
           <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/5 mb-2"></div>
           <div className="h-8 bg-gray-400 dark:bg-gray-500 rounded w-2/5 mb-1"></div>
           <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        </div>
     );
  }
  
  return link ? (
    <Link href={link.href} className={cardClasses}>
      <CardContent />
    </Link>
  ) : (
    <div className={cardClasses}>
      <CardContent />
    </div>
  );
};

export default NsbsAdminDashboardSummaryCard;
