// src/components/ui/NsbsSeparator.tsx
// Developed by Luccas A E | 2025
// Purpose: A styled wrapper around @radix-ui/react-separator for consistent visual dividers.
// Features: Supports horizontal and vertical orientations, decorative or semantic.
// UI/UX Focus: Visually separates content sections or groups of items, improving layout clarity.
// Adherence to NSBS Principles: Subtle UI element contributing to a clean and organized interface.

'use client';

import React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

export type NsbsSeparatorProps = SeparatorPrimitive.SeparatorProps & {
  // No additional props needed currently, but can be extended
  // For example, could add 'thickness' or 'colorVariant' props
};

export const NsbsSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  NsbsSeparatorProps
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "nsbs-separator shrink-0 bg-gray-200 dark:bg-gray-700",
      orientation === 'horizontal' ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
));
NsbsSeparator.displayName = SeparatorPrimitive.Root.displayName;

export default NsbsSeparator;
