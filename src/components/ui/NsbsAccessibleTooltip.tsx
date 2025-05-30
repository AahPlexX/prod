// src/components/ui/NsbsAccessibleTooltip.tsx
// Developed by Luccas A E | 2025
// Purpose: A wrapper around Radix UI Tooltip primitive for creating accessible and consistently styled tooltips.
// Features: Customizable content, trigger element, delay, side, alignment.
// UI/UX Focus: Provides contextual information on hover/focus without cluttering the UI, fully accessible.
// Adherence to NSBS Principles: Enhances clarity where needed in a non-intrusive way.

import React, { ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export interface NsbsAccessibleTooltipProps {
  children: ReactNode; // The trigger element
  content: ReactNode; // The tooltip content (can be string or JSX)
  delayDuration?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  className?: string; // For the tooltip content
  providerProps?: Omit<TooltipPrimitive.TooltipProviderProps, 'children'>;
  portalProps?: TooltipPrimitive.TooltipPortalProps;
  contentProps?: TooltipPrimitive.TooltipContentProps;
}

export const NsbsAccessibleTooltip: React.FC<NsbsAccessibleTooltipProps> = ({
  children,
  content,
  delayDuration = 300,
  side = 'top',
  align = 'center',
  sideOffset = 4,
  className,
  providerProps,
  portalProps,
  contentProps,
}) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration} {...providerProps}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal {...portalProps}>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={cn(
              "z-50 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 shadow-xl animate-in fade-in-0 zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className
            )}
            {...contentProps}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-white dark:fill-gray-800" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default NsbsAccessibleTooltip;
