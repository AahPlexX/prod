// src/components/ui/NsbsButton.tsx
// Developed by Luccas A E | 2025
// Purpose: A highly customizable and themeable button component for consistent UI across the NSBS platform.
// Features: Multiple variants (primary, secondary, outline, ghost, link), sizes, loading state, icon support, full theming (Light, Dark, SynapticGlow, Color Blind variants).
// UI/UX Focus: Clear affordance, accessible (ARIA attributes), consistent styling, satisfying interaction feedback.
// Adherence to NSBS Principles: Provides consistent UI elements supporting a clean and professional interface.

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Assuming a 'cn' utility for merging Tailwind classes (like in Shadcn/ui)
import { Loader2 } from 'lucide-react';

// Define base styles and variants using class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white dark:ring-offset-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        // Standard Theme (Light/Dark aware via Tailwind)
        default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
        destructive: "bg-red-500 text-gray-50 hover:bg-red-500/90 dark:bg-red-700 dark:text-red-50 dark:hover:bg-red-700/90",
        outline: "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50",
        link: "text-gray-900 dark:text-gray-50 underline-offset-4 hover:underline",
        // SynapticGlow Theme (Creative Theme)
        // In a real setup, these would use CSS variables defined by the theme.
        // For this example, direct classes are used. Prefixed with 'sg-' for SynapticGlow.
        'sg-primary': "bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg hover:from-purple-700 hover:to-indigo-800 focus-visible:ring-indigo-500",
        'sg-secondary': "border border-purple-500 text-purple-600 hover:bg-purple-500/10 focus-visible:ring-purple-400",
        // Color Blind Themes
        // Protanopia: Reduced sensitivity to red light. Focus on blue/yellow contrasts.
        'cb-protanopia-primary': "bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-500", // Strong blue
        'cb-protanopia-secondary': "border border-yellow-500 text-yellow-700 hover:bg-yellow-500/10 focus-visible:ring-yellow-400", // Strong yellow contrast
        // Deuteranopia: Reduced sensitivity to green light. Similar to Protanopia.
        'cb-deuteranopia-primary': "bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-500", // Different shade of blue
        'cb-deuteranopia-secondary': "border border-orange-500 text-orange-600 hover:bg-orange-500/10 focus-visible:ring-orange-400", // Orange for contrast
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const NsbsButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, disabled, children, iconLeft, iconRight, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const effectiveDisabled = isLoading || disabled;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={effectiveDisabled}
        aria-busy={isLoading}
        aria-disabled={effectiveDisabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children}
        {!isLoading && iconRight && <span className="ml-2">{iconRight}</span>}
      </Comp>
    );
  }
);
NsbsButton.displayName = "NsbsButton";

export { NsbsButton, buttonVariants };

// Example of cn utility function (often in a separate lib/utils.ts file)
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
// Make sure to install clsx and tailwind-merge if not already.
// This component assumes such a utility exists at '@/lib/utils'.
