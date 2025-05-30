// src/components/forms/NsbsInputWithIcon.tsx
// Developed by Luccas A E | 2025
// Purpose: A common form input pattern: an input field with an icon positioned inside (left or right).
// Features: Supports left/right icon placement, integrates with standard input props, consistent styling.
// UI/UX Focus: Enhances input field clarity and aesthetics by associating icons with input purpose (e.g., search, email, password).
// Adherence to NSBS Principles: Clean and functional form elements.

import React, { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface NsbsInputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  wrapperClassName?: string; // Class for the div wrapping input and icon
  inputClassName?: string; // Class for the input element itself
  iconClassName?: string; // Class for the icon span
  // For external label and error messages, typically handled by a parent form field component like NsbsProfileFormField
  // 'name', 'id', 'aria-describedby', 'aria-invalid' should be passed down.
}

export const NsbsInputWithIcon = React.forwardRef<HTMLInputElement, NsbsInputWithIconProps>(
  ({
    icon,
    iconPosition = 'left',
    wrapperClassName,
    inputClassName,
    iconClassName,
    className, // This will be applied to the input by default from ...props
    ...props
  }, ref) => {
    const hasIcon = Boolean(icon);

    return (
      <div className={cn("nsbs-input-with-icon relative flex items-center", wrapperClassName)}>
        {hasIcon && iconPosition === 'left' && (
          <span className={cn("absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", iconClassName)}>
            {React.cloneElement(icon as React.ReactElement, { className: cn('h-5 w-5 text-gray-400 dark:text-gray-500', (icon as React.ReactElement).props.className) })}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "block w-full rounded-md border-0 py-2.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
            "text-gray-900 dark:text-white dark:bg-gray-700",
            "ring-gray-300 dark:ring-gray-600 focus:ring-blue-600 dark:focus:ring-blue-500",
            hasIcon && iconPosition === 'left' && "pl-10",
            hasIcon && iconPosition === 'right' && "pr-10",
            inputClassName, // Specific input class from prop
            className // Class from ...props (applied to input)
          )}
          {...props}
        />
        {hasIcon && iconPosition === 'right' && (
          <span className={cn("absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", iconClassName)}>
             {React.cloneElement(icon as React.ReactElement, { className: cn('h-5 w-5 text-gray-400 dark:text-gray-500', (icon as React.ReactElement).props.className) })}
          </span>
        )}
      </div>
    );
  }
);
NsbsInputWithIcon.displayName = "NsbsInputWithIcon";

export default NsbsInputWithIcon;
