// src/components/admin/dashboard/NsbsAdminMetricCard.tsx
// Developed by Luccas A E | 2025
// Purpose: An enhanced display card for key metrics on the Admin Analytics Dashboard.
// Features: Displays title, value, description, status indicator (good, warning, poor), optional trend icon/percentage, link for details.
// UI/UX Focus: At-a-glance understanding of metrics, clear visual cues for status, professional presentation.
// Adherence to NSBS Principles: Supports data-informed decision-making for platform administration.

import React from 'react';
import { NsbsButton } from '@/components/ui/NsbsButton'; // Assuming NsbsButton
import { TrendingUp, TrendingDown, ArrowRight, Info } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';

export type MetricStatus = 'good' | 'warning' | 'poor' | 'neutral';

export interface NsbsAdminMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  status?: MetricStatus;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage?: number; // e.g., 5 for 5%
    period?: string; // e.g., "vs last month"
  };
  icon?: React.ReactNode; // Custom icon for the metric
  detailsLink?: string;
  tooltip?: string; // For extra information on hover
  isLoading?: boolean;
}

const statusStyles: Record<MetricStatus, { border: string; bg: string; text: string; iconBg: string }> = {
  good: {
    border: 'border-green-500 dark:border-green-400',
    bg: 'bg-green-50 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    iconBg: 'bg-green-100 dark:bg-green-800',
  },
  warning: {
    border: 'border-yellow-500 dark:border-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    iconBg: 'bg-yellow-100 dark:bg-yellow-800',
  },
  poor: {
    border: 'border-red-500 dark:border-red-400',
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    iconBg: 'bg-red-100 dark:bg-red-800',
  },
  neutral: {
    border: 'border-gray-300 dark:border-gray-700',
    bg: 'bg-gray-50 dark:bg-gray-800/30',
    text: 'text-gray-700 dark:text-gray-300',
    iconBg: 'bg-gray-100 dark:bg-gray-700',
  },
};

export const NsbsAdminMetricCard: React.FC<NsbsAdminMetricCardProps> = ({
  title,
  value,
  description,
  status = 'neutral',
  trend,
  icon,
  detailsLink,
  tooltip,
  isLoading = false,
}) => {
  const currentStatusStyles = statusStyles[status];

  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : null;
  const trendColor = trend?.direction === 'up' ? 'text-green-600 dark:text-green-400' : trend?.direction === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400';

  if (isLoading) {
    return (
      <div className={cn(
        "nsbs-admin-metric-card p-6 rounded-xl shadow-lg border-2 animate-pulse",
        currentStatusStyles.border, 
        currentStatusStyles.bg
      )}>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
        <div className="h-10 bg-gray-400 dark:bg-gray-500 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "nsbs-admin-metric-card p-5 sm:p-6 rounded-xl shadow-lg border-2 flex flex-col justify-between h-full",
      currentStatusStyles.border,
      currentStatusStyles.bg // Apply background to the whole card
    )}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate" title={title}>
            {title}
          </h3>
          {icon && (
            <div className={cn("p-2 rounded-full", currentStatusStyles.iconBg, currentStatusStyles.text)}>
              {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
            </div>
          )}
        </div>

        <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1 truncate" title={String(value)}>
          {value}
        </p>

        {trend && (
          <div className="flex items-center text-xs sm:text-sm mb-3">
            {TrendIcon && <TrendIcon className={cn("w-4 h-4 sm:w-5 sm:h-5 mr-1", trendColor)} />}
            {trend.percentage !== undefined && (
                <span className={cn("font-medium", trendColor)}>{trend.percentage > 0 ? '+' : ''}{trend.percentage}%</span>
            )}
            {trend.period && <span className="ml-1 text-gray-500 dark:text-gray-400">{trend.period}</span>}
          </div>
        )}

        {description && (
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {detailsLink ? (
          <NsbsButton
            variant="link"
            size="sm"
            onClick={() => window.location.href = detailsLink} // Or use Next.js Link component if passed as prop
            className={cn("p-0 h-auto font-medium", currentStatusStyles.text, "hover:underline")}
            aria-label={`View details for ${title}`}
          >
            View Details <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
          </NsbsButton>
        ) : <div/> /* Empty div to keep layout consistent if no link */}
        
        {tooltip && (
          <div className="relative group">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 cursor-help" />
            <span 
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 dark:bg-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
              role="tooltip"
            >
              {tooltip}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NsbsAdminMetricCard;
