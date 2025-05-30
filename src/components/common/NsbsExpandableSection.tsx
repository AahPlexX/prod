// src/components/common/NsbsExpandableSection.tsx
// Developed by Luccas A E | 2025
// Purpose: A generic component that allows content to be collapsed/expanded with a title/trigger. Simpler than a full accordion for single sections.
// Features: Clickable trigger to show/hide content, optional icon for open/close state, smooth transition (CSS).
// UI/UX Focus: Useful for progressively disclosing information or hiding less critical details by default.
// Adherence to NSBS Principles: Can help maintain a clean UI by hiding secondary information until requested.

'use client';

import React, { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NsbsExpandableSectionProps {
  triggerContent: ReactNode; // Content for the clickable trigger area
  children: ReactNode; // Content to be expanded/collapsed
  initialOpen?: boolean;
  className?: string; // For the main wrapper
  triggerClassName?: string;
  contentClassName?: string;
  iconPosition?: 'left' | 'right';
  onOpenChange?: (isOpen: boolean) => void;
}

export const NsbsExpandableSection: React.FC<NsbsExpandableSectionProps> = ({
  triggerContent,
  children,
  initialOpen = false,
  className,
  triggerClassName,
  contentClassName,
  iconPosition = 'right',
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };
  
  const triggerId = React.useId();
  const contentId = React.useId();

  return (
    <div className={cn("nsbs-expandable-section border border-gray-200 dark:border-gray-700 rounded-md", className)}>
      <button
        type="button"
        onClick={toggleOpen}
        className={cn(
          "flex w-full items-center justify-between p-3 sm:p-4 text-left text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-colors",
          isOpen && "bg-gray-50 dark:bg-gray-700/50",
          triggerClassName
        )}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={triggerId}
      >
        {iconPosition === 'left' && (
          <ChevronDown
            className={cn(
              "h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        )}
        <span className="flex-grow font-medium text-sm sm:text-base">{triggerContent}</span>
        {iconPosition === 'right' && (
          <ChevronDown
            className={cn(
              "h-5 w-5 text-gray-500 dark:text-gray-400 ml-2 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        )}
      </button>
      {/* For smooth transition, ensure CSS handles height/opacity changes based on data-state or a class */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
        className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "animate-accordion-down" : "animate-accordion-up", // Uses Radix-like animation names
            contentClassName
        )}
        // The animate-accordion-down/up classes would be defined in global CSS or Tailwind config
        // Example: 
        // @keyframes accordion-down { from { height: 0; opacity: 0; } to { height: var(--radix-accordion-content-height); opacity: 1; } }
        // @keyframes accordion-up { from { height: var(--radix-accordion-content-height); opacity: 1; } to { height: 0; opacity: 0; } }
        // animation: { 'accordion-down': 'accordion-down 0.2s ease-out', 'accordion-up': 'accordion-up 0.2s ease-out' }
        // For non-Radix, manage height via JS or use grid-template-rows: 0fr -> 1fr
      >
        {/* Inner div for padding, so it's not affected by height:0 */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
            {children}
        </div>
      </div>
    </div>
  );
};

export default NsbsExpandableSection;
