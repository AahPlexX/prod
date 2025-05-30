// src/components/common/NsbsDataCard.tsx
// Developed by Luccas A E | 2025
// Purpose: A generic card component for displaying pieces of data in a structured and visually appealing manner.
// Features: Customizable header (icon, title, actions), content area, optional footer.
// UI/UX Focus: Flexible for various data display needs, consistent styling, clear information presentation.
// Adherence to NSBS Principles: Clean and professional for displaying information without clutter.

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface NsbsDataCardProps {
  title?: string;
  icon?: ReactNode;
  headerActions?: ReactNode; // Slot for buttons or controls in the header
  children: ReactNode; // Main content of the card
  footerContent?: ReactNode;
  className?: string; // Class for the card root
  contentClassName?: string; // Class for the content area
  headerClassName?: string;
  footerClassName?: string;
  variant?: 'default' | 'elevated' | 'ghost'; // Predefined style variants
}

export const NsbsDataCard: React.FC<NsbsDataCardProps> = ({
  title,
  icon,
  headerActions,
  children,
  footerContent,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  variant = 'default',
}) => {
  const cardBaseClasses = "nsbs-data-card rounded-lg overflow-hidden flex flex-col";
  const variantClasses = {
    default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md",
    elevated: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl",
    ghost: "bg-transparent dark:bg-transparent", // Minimal styling, relies on parent background
  };

  return (
    <div className={cn(cardBaseClasses, variantClasses[variant], className)}>
      {(title || icon || headerActions) && (
        <header
          className={cn(
            "px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between",
            headerClassName,
            variant === 'ghost' && 'border-b-0 pb-2' // Adjust for ghost
          )}
        >
          <div className="flex items-center">
            {icon && <span className="mr-3 text-gray-600 dark:text-gray-400">{React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}</span>}
            {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{title}</h3>}
          </div>
          {headerActions && <div className="ml-4 flex-shrink-0">{headerActions}</div>}
        </header>
      )}

      <div className={cn("p-4 sm:p-6 flex-grow", contentClassName, variant === 'ghost' && 'p-0')}>
        {children}
      </div>

      {footerContent && (
        <footer className={cn("px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50", footerClassName, variant === 'ghost' && 'border-t-0 pt-2 bg-transparent dark:bg-transparent')}>
          {footerContent}
        </footer>
      )}
    </div>
  );
};

export default NsbsDataCard;
