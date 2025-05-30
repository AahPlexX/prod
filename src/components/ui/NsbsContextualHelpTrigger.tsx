// src/components/ui/NsbsContextualHelpTrigger.tsx
// Developed by Luccas A E | 2025
// Purpose: A small icon trigger that shows a tooltip or popover with contextual help text.
// Features: Uses NsbsAccessibleTooltip or a Radix Popover, customizable icon and help content.
// UI/UX Focus: Provides non-intrusive help for specific UI elements or form fields, improving usability.
// Adherence to NSBS Principles: Enhances clarity without cluttering the interface.

import React, { ReactNode } from 'react';
import { NsbsAccessibleTooltip, NsbsAccessibleTooltipProps } from './NsbsAccessibleTooltip'; // Assuming this path
import { HelpCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
// For Popover variant, Radix Popover would be imported if used directly
// import * as PopoverPrimitive from '@radix-ui/react-popover';

export interface NsbsContextualHelpTriggerProps {
  helpContent: ReactNode;
  triggerIcon?: ReactNode;
  variant?: 'tooltip' | 'popover'; // Popover variant would be more complex to implement here fully
  tooltipProps?: Partial<Omit<NsbsAccessibleTooltipProps, 'children' | 'content'>>;
  // popoverProps?: Partial<PopoverPrimitive.PopoverProps & { contentProps?: PopoverPrimitive.PopoverContentProps }>; // For popover variant
  className?: string; // Applied to the trigger button/span
  triggerAriaLabel?: string;
}

export const NsbsContextualHelpTrigger: React.FC<NsbsContextualHelpTriggerProps> = ({
  helpContent,
  triggerIcon = <HelpCircle className="w-4 h-4" />,
  variant = 'tooltip', // Default to tooltip for simplicity
  tooltipProps,
  // popoverProps,
  className,
  triggerAriaLabel = "View help",
}) => {
  const triggerElement = (
    <button
      type="button"
      className={cn(
        "nsbs-contextual-help-trigger inline-flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full p-0.5",
        className
      )}
      aria-label={triggerAriaLabel}
    >
      {triggerIcon}
    </button>
  );

  if (variant === 'tooltip') {
    return (
      <NsbsAccessibleTooltip content={helpContent} delayDuration={100} {...tooltipProps}>
        {triggerElement}
      </NsbsAccessibleTooltip>
    );
  }

  // Basic Popover structure (would need Radix Popover and more styling for full implementation)
  // if (variant === 'popover' && PopoverPrimitive) {
  //   return (
  //     <PopoverPrimitive.Root {...popoverProps}>
  //       <PopoverPrimitive.Trigger asChild>
  //         {triggerElement}
  //       </PopoverPrimitive.Trigger>
  //       <PopoverPrimitive.Portal>
  //         <PopoverPrimitive.Content
  //           sideOffset={5}
  //           className={cn(
  //             "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  //             // Add specific popover styling here
  //           )}
  //           {...popoverProps?.contentProps}
  //         >
  //           {helpContent}
  //           <PopoverPrimitive.Close 
  //               className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-white dark:ring-offset-gray-950 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-700 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800"
  //               aria-label="Close popover"
  //           >
  //               <X className="h-4 w-4" />
  //           </PopoverPrimitive.Close>
  //           <PopoverPrimitive.Arrow className="fill-popover" />
  //         </PopoverPrimitive.Content>
  //       </PopoverPrimitive.Portal>
  //     </PopoverPrimitive.Root>
  //   );
  // }

  // Fallback to tooltip if popover is selected but not fully implemented or PopoverPrimitive is missing
  return (
    <NsbsAccessibleTooltip content={helpContent} delayDuration={100} {...tooltipProps}>
      {triggerElement}
    </NsbsAccessibleTooltip>
  );
};

export default NsbsContextualHelpTrigger;
