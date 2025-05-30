// src/components/courses/learn/NsbsCourseModuleHeader.tsx
// Developed by Luccas A E | 2025
// Purpose: A specific header component for displaying module titles and optional progress within a course's learning view.
// Features: Displays module title, number, optional completion status or progress bar for the module.
// UI/UX Focus: Clearly delineates modules within the course content, provides contextual progress information.
// Adherence to NSBS Principles: Supports structured learning and clear presentation of course components.

import React from 'react';
import { NsbsInteractiveProgressBar } from '@/components/ui/NsbsInteractiveProgressBar'; // Assuming component
import { FolderOpen, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NsbsCourseModuleHeaderProps {
  moduleNumber?: number; // e.g., 1, 2, 3
  title: string;
  description?: string;
  progressPercentage?: number; // 0-100 for the module's progress
  isCompleted?: boolean;
  className?: string;
}

export const NsbsCourseModuleHeader: React.FC<NsbsCourseModuleHeaderProps> = ({
  moduleNumber,
  title,
  description,
  progressPercentage,
  isCompleted,
  className,
}) => {
  return (
    <header className={cn("nsbs-course-module-header py-5 px-1 sm:px-0 border-b border-gray-200 dark:border-gray-700 mb-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center">
          <FolderOpen className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 mr-3 sm:mr-4 flex-shrink-0" />
          <div>
            {moduleNumber && (
              <p className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                Module {moduleNumber}
              </p>
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
        </div>
        {isCompleted && (
          <div className="flex items-center text-green-600 dark:text-green-400 flex-shrink-0 ml-auto sm:ml-0">
            <CheckCircle className="w-5 h-5 mr-1.5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
          {description}
        </p>
      )}
      {progressPercentage !== undefined && !isCompleted && (
        <div className="mt-4 max-w-sm">
          <NsbsInteractiveProgressBar 
            value={progressPercentage} 
            size="md" 
            labelText={moduleNumber ? `Module ${moduleNumber} Progress` : "Module Progress"} 
          />
        </div>
      )}
    </header>
  );
};

export default NsbsCourseModuleHeader;
