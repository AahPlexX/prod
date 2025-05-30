// src/components/user/NsbsProfileFormField.tsx
// Developed by Luccas A E | 2025
// Purpose: A reusable form field component specifically for user profile forms, including label, input, and validation message area.
// Features: Supports various input types, integrates with React Hook Form (conceptual, actual integration depends on parent form), displays validation errors.
// UI/UX Focus: Clear labeling, accessible input fields, immediate validation feedback.
// Adherence to NSBS Principles: Supports essential user account management with clarity.

import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// For use with React Hook Form, you'd typically pass register and errors
// For simplicity, this example uses basic props for error display.
export interface NsbsProfileFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string; // HTML name attribute, also used for id
  helperText?: string;
  errorMessage?: string;
  labelSrOnly?: boolean;
  // For React Hook Form, you might pass:
  // register?: UseFormRegister<FieldValues>;
  // errors?: FieldErrors<FieldValues>;
  // For simplicity in this standalone component, using direct errorMessage prop.
  containerClassName?: string;
}

export const NsbsProfileFormField: React.FC<NsbsProfileFormFieldProps> = ({
  label,
  name,
  type = 'text',
  helperText,
  errorMessage,
  labelSrOnly = false,
  className,
  containerClassName,
  ...props
}) => {
  const inputId = `profile-${name}`;
  const hasError = !!errorMessage;

  return (
    <div className={cn("nsbs-profile-form-field", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          "block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 mb-1.5",
          labelSrOnly && "sr-only"
        )}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={inputId}
        className={cn(
          "block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
          "dark:bg-gray-700",
          hasError 
            ? "ring-red-500 dark:ring-red-400 focus:ring-red-500 dark:focus:ring-red-400" 
            : "ring-gray-300 dark:ring-gray-600 focus:ring-blue-600 dark:focus:ring-blue-500",
          className
        )}
        aria-describedby={errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        aria-invalid={hasError}
        {...props}
      />
      {errorMessage ? (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" id={`${inputId}-error`}>
          {errorMessage}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={`${inputId}-helper`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default NsbsProfileFormField;
