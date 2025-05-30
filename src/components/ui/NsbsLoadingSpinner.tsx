// src/components/ui/NsbsLoadingSpinner.tsx
// Developed by Luccas A E | 2025
// Purpose: A visually appealing and on-brand loading spinner/indicator for use during data fetching or transitions.
// Features: Customizable size, color, optional loading text, uses SVG for sharp rendering.
// UI/UX Focus: Provides clear feedback on loading states, reduces perceived wait time, consistent branding.
// Adherence to NSBS Principles: Professional and unobtrusive, avoids distracting animations.

import React from 'react';
import { cn } from '@/lib/utils';

export interface NsbsLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string; // Tailwind color class e.g., 'text-blue-600'
  loadingText?: string;
  className?: string; // For the container div
  spinnerClassName?: string; // For the spinner element itself
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export const NsbsLoadingSpinner: React.FC<NsbsLoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-blue-600 dark:text-blue-400',
  loadingText,
  className,
  spinnerClassName,
}) => {
  return (
    <div role="status" aria-live="polite" className={cn("nsbs-loading-spinner flex flex-col items-center justify-center gap-3", className)}>
      <svg
        className={cn(
          "animate-spin",
          sizeMap[size],
          color,
          spinnerClassName
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {loadingText && <p className={cn("text-sm font-medium", color === 'text-blue-600 dark:text-blue-400' ? 'text-gray-700 dark:text-gray-300' : color)}>{loadingText}</p>}
      <span className="sr-only">{loadingText || 'Loading...'}</span>
    </div>
  );
};

export default NsbsLoadingSpinner;
