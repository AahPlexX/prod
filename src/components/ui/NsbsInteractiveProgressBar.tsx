// src/components/ui/NsbsInteractiveProgressBar.tsx
// Developed by Luccas A E | 2025
// Purpose: A visually appealing and configurable progress bar.
// Features: Displays percentage, customizable colors, sizes, optional label, animated fill.
// UI/UX Focus: Clear visual feedback of progress, smooth animations, accessible.
// Adherence to NSBS Principles: Supports clear progress tracking for learners.

import React from 'react';
import { cn } from '@/lib/utils'; // Assumed utility

export interface NsbsInteractiveProgressBarProps {
  value: number; // Percentage value (0-100)
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showPercentageText?: boolean;
  labelText?: string;
  className?: string;
  barClassName?: string;
  animated?: boolean;
  ['aria-label']?: string; // Allow explicit aria-label
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorClasses = {
  primary: 'bg-blue-600 dark:bg-blue-500',
  secondary: 'bg-gray-600 dark:bg-gray-500',
  success: 'bg-green-500 dark:bg-green-400',
  warning: 'bg-yellow-500 dark:bg-yellow-400',
  danger: 'bg-red-600 dark:bg-red-500',
};

export const NsbsInteractiveProgressBar: React.FC<NsbsInteractiveProgressBarProps> = ({
  value,
  size = 'md',
  color = 'primary',
  showPercentageText = true,
  labelText,
  className,
  barClassName,
  animated = true,
  ['aria-label']: ariaLabelProp,
  ...props
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const defaultAriaLabel = labelText ? `Progress for ${labelText}: ${clampedValue}%` : `Progress: ${clampedValue}%`;

  return (
    <div className={cn("nsbs-progress-bar w-full", className)} {...props}>
      {(labelText || showPercentageText) && (
        <div className="flex justify-between mb-1">
          {labelText && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{labelText}</span>}
          {showPercentageText && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-auto">
              {clampedValue.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabelProp || defaultAriaLabel}
      >
        <div
          className={cn(
            "h-full rounded-full",
            colorClasses[color],
            animated ? "transition-all duration-500 ease-out" : "",
            barClassName
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

export default NsbsInteractiveProgressBar;
