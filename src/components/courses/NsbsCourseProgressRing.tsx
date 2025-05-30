// src/components/courses/NsbsCourseProgressRing.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays course progress as a circular ring, visually distinct from a linear bar.
// Features: Animated fill, customizable size and colors, displays percentage text in the center.
// UI/UX Focus: Provides an engaging and modern way to visualize progress for dashboards or course cards.
// Adherence to NSBS Principles: Clear progress visualization supporting self-paced learning feedback.

import React from 'react';
import { cn } from '@/lib/utils';

export interface NsbsCourseProgressRingProps {
  percentage: number; // 0-100
  size?: number; // Diameter of the ring in pixels
  strokeWidth?: number;
  color?: string; // Tailwind class for the progress arc, e.g., 'text-blue-600'
  trailColor?: string; // Tailwind class for the background track, e.g., 'text-gray-200 dark:text-gray-700'
  textColor?: string; // Tailwind class for the percentage text
  showText?: boolean;
  className?: string; // For the container
  ariaLabel?: string;
}

export const NsbsCourseProgressRing: React.FC<NsbsCourseProgressRingProps> = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  color = 'text-blue-600 dark:text-blue-500',
  trailColor = 'text-gray-200 dark:text-gray-700',
  textColor = 'text-gray-700 dark:text-gray-200',
  showText = true,
  className,
  ariaLabel,
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercentage / 100) * circumference;

  const defaultAriaLabel = ariaLabel || `Course progress: ${clampedPercentage.toFixed(0)}%`;

  return (
    <div
      className={cn("nsbs-course-progress-ring relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={defaultAriaLabel}
    >
      <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle (Trail) */}
        <circle
          className={cn("stroke-current", trailColor)}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          className={cn("stroke-current transition-all duration-500 ease-out", color)}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" 
        />
      </svg>
      {showText && (
        <span className={cn("absolute text-sm font-semibold", textColor, size < 60 && "text-xs")}>
          {clampedPercentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
};

export default NsbsCourseProgressRing;
