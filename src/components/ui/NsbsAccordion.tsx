// src/components/ui/NsbsAccordion.tsx
// Developed by Luccas A E | 2025
// Purpose: A custom-styled accordion component, wrapping Radix UI Accordion for accessibility and functionality.
// Features: Supports single or multiple open items, customizable trigger and content styling, smooth animations.
// UI/UX Focus: Organizes content into collapsible sections, useful for FAQs or detailed breakdowns.
// Adherence to NSBS Principles: Can be used to present complex information cleanly without overwhelming the user initially.

'use client'; // Radix primitives often use client features

import React, { ReactNode } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemProps {
  value: string; // Unique value for the item
  triggerContent: ReactNode;
  children: ReactNode; // Content of the accordion panel
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export const NsbsAccordionItem: React.FC<AccordionItemProps> = ({
  value,
  triggerContent,
  children,
  itemClassName,
  triggerClassName,
  contentClassName,
}) => {
  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn(
        "nsbs-accordion-item border-b border-gray-200 dark:border-gray-700 last:border-b-0",
        itemClassName
      )}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            "flex flex-1 items-center justify-between py-4 px-1 font-medium text-gray-800 dark:text-gray-100 transition-all hover:underline group",
            "[&[data-state=open]>svg]:rotate-180", // Rotate icon when open
            triggerClassName
          )}
          aria-label={typeof triggerContent === 'string' ? triggerContent : 'Accordion trigger'}
        >
          {triggerContent}
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={cn(
          "overflow-hidden text-sm text-gray-700 dark:text-gray-300 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          contentClassName
        )}
      >
        <div className="pb-4 pt-1 px-1">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
};


export interface NsbsAccordionProps {
  items: AccordionItemProps[]; // Array of item configurations
  type?: 'single' | 'multiple';
  defaultValue?: string | string[]; // For single or multiple type
  collapsible?: boolean; // For single type, if it can be fully closed
  className?: string; // Class for the root Accordion element
  orientation?: 'vertical' | 'horizontal';
}

export const NsbsAccordion: React.FC<NsbsAccordionProps> = ({
  items,
  type = 'single',
  defaultValue,
  collapsible = true,
  className,
  orientation = 'vertical',
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Radix recommends casting for the type prop if using a string union like this
  const rootProps = {
    type: type as 'single' | 'multiple',
    defaultValue: defaultValue,
    collapsible: type === 'single' ? collapsible : undefined, // Collapsible only valid for single type
    orientation: orientation,
    className: cn("nsbs-accordion w-full rounded-md border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800", className),
  };


  return (
    <AccordionPrimitive.Root {...rootProps}>
      {items.map((item) => (
        <NsbsAccordionItem
          key={item.value}
          value={item.value}
          triggerContent={item.triggerContent}
          itemClassName={item.itemClassName}
          triggerClassName={item.triggerClassName}
          contentClassName={item.contentClassName}
        >
          {item.children}
        </NsbsAccordionItem>
      ))}
    </AccordionPrimitive.Root>
  );
};

// Note: Tailwind CSS animation keyframes for accordion-down and accordion-up would be needed:
// In tailwind.config.js or a global CSS file:
// keyframes: {
//   'accordion-down': {
//     from: { height: '0px', opacity: '0' }, // Ensure height is '0px' not just 0
//     to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
//   },
//   'accordion-up': {
//     from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
//     to: { height: '0px', opacity: '0' }, // Ensure height is '0px' not just 0
//   },
// },
// animation: {
//   'accordion-down': 'accordion-down 0.2s ease-out',
//   'accordion-up': 'accordion-up 0.2s ease-out',
// },

export default NsbsAccordion;
