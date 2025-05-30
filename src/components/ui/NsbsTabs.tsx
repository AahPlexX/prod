// src/components/ui/NsbsTabs.tsx
// Developed by Luccas A E | 2025
// Purpose: A styled wrapper around @radix-ui/react-tabs for consistent tabbed navigation/content display.
// Features: Customizable tabs and content panels, accessible, supports keyboard navigation.
// UI/UX Focus: Organizes content into selectable sections, reducing clutter and improving navigation within a view.
// Adherence to NSBS Principles: Clean and functional for presenting structured information.

'use client'; // Radix UI components often use client features

import React, { ReactNode } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils'; // Assuming cn utility

export interface TabItem {
  value: string;
  triggerContent: ReactNode;
  panelContent: ReactNode;
  disabled?: boolean;
}

export interface NsbsTabsProps {
  tabs: TabItem[];
  defaultValue: string; // The value of the tab to be active by default
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual'; // 'automatic' activates on focus, 'manual' on click/enter
  className?: string; // Class for the TabsPrimitive.Root
  listClassName?: string; // Class for the TabsPrimitive.List (triggers container)
  triggerClassName?: string; // Base class for each TabsPrimitive.Trigger
  activeTriggerClassName?: string; // Additional class for the active TabsPrimitive.Trigger
  panelClassName?: string; // Class for each TabsPrimitive.Content panel
}

export const NsbsTabs: React.FC<NsbsTabsProps> = ({
  tabs,
  defaultValue,
  orientation = 'horizontal',
  activationMode = 'automatic',
  className,
  listClassName,
  triggerClassName,
  activeTriggerClassName = 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300',
  panelClassName,
}) => {
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue}
      orientation={orientation}
      activationMode={activationMode}
      className={cn("nsbs-tabs w-full", className)}
    >
      <TabsPrimitive.List
        className={cn(
          "flex border-b border-gray-200 dark:border-gray-700",
          orientation === 'vertical' && "flex-col border-b-0 border-r",
          listClassName
        )}
        aria-label="Tab Navigation"
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              "px-4 py-2.5 -mb-px text-sm font-medium border-b-2 border-transparent transition-colors",
              "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-800 rounded-t-md",
              "data-[state=active]:font-semibold",
              "data-[state=active]:" + activeTriggerClassName, // Apply active class from props
              "disabled:opacity-50 disabled:cursor-not-allowed",
              orientation === 'vertical' && "border-b-0 border-r-2 -mr-px data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700",
              triggerClassName
            )}
          >
            {tab.triggerContent}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className={cn("py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400", panelClassName)}
        >
          {tab.panelContent}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};

export default NsbsTabs;
