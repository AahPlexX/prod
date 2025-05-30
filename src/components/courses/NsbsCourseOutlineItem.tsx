// src/components/courses/NsbsCourseOutlineItem.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays a single item (module or lesson title) in a course outline.
// Features: Indentation for lessons, icons for modules/lessons, optional completion status indicators for enrolled users.
// UI/UX Focus: Clear hierarchical structure, easy to scan, differentiates modules from lessons visually.
// Adherence to NSBS Principles: Supports clear presentation of course structure on preview and overview pages[cite: 647, 650].

import React, { ReactNode } from 'react';
import { Folder, FileText, CheckCircle, CircleDashed } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';

export type OutlineItemType = 'module' | 'lesson';

export interface NsbsCourseOutlineItemProps {
  type: OutlineItemType;
  title: string;
  isCompleted?: boolean; // For enrolled user views
  isActive?: boolean; // For highlighting current item in navigation
  isLocked?: boolean; // For lessons/modules not yet accessible
  itemNumber?: string; // e.g., "1.1" or "Module 1"
  onClick?: () => void; // For interactive outlines
  className?: string;
  customIcon?: ReactNode;
}

export const NsbsCourseOutlineItem: React.FC<NsbsCourseOutlineItemProps> = ({
  type,
  title,
  isCompleted,
  isActive,
  isLocked,
  itemNumber,
  onClick,
  className,
  customIcon,
}) => {
  const baseClasses = "flex items-center py-2.5 px-3 rounded-md transition-colors w-full text-left";
  const activeClasses = isActive ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700/50";
  const lockedClasses = isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer";
  
  const indentationClass = type === 'lesson' ? 'ml-6' : '';

  let StatusIcon;
  if (isLocked) {
    // No specific lock icon here yet, defer to parent styling or generic icon
  } else if (isCompleted) {
    StatusIcon = <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />;
  } else if (isActive) {
     // Active but not complete might show a different icon or rely on bg color
    StatusIcon = <CircleDashed className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 animate-pulse" />;
  }


  const TypeIcon = customIcon ? customIcon : 
                   type === 'module' ? <Folder className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0" /> : 
                   <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />;

  return (
    <button
      onClick={onClick}
      disabled={isLocked || !onClick}
      className={cn(
        baseClasses,
        activeClasses,
        !isLocked && onClick ? 'cursor-pointer' : '',
        isLocked ? lockedClasses : '',
        indentationClass,
        className
      )}
      aria-current={isActive ? 'step' : undefined}
      aria-disabled={isLocked}
    >
      <span className="mr-3">{TypeIcon}</span>
      {itemNumber && <span className="mr-2 text-sm text-gray-500 dark:text-gray-400 min-w-[2.5rem] text-right">{itemNumber}</span>}
      <span className="flex-grow text-sm text-gray-800 dark:text-gray-200 truncate" title={title}>
        {title}
      </span>
      {StatusIcon && <span className="ml-auto pl-2">{StatusIcon}</span>}
    </button>
  );
};

export default NsbsCourseOutlineItem;
