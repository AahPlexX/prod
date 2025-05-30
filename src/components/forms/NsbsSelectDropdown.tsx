// src/components/forms/NsbsSelectDropdown.tsx
// Developed by Luccas A E | 2025
// Purpose: A styled wrapper around @radix-ui/react-select for consistent dropdown select menus.
// Features: Customizable options, placeholder, accessible, integrates with form patterns.
// UI/UX Focus: Provides a clean and standard way for users to select from a list of options.
// Adherence to NSBS Principles: Ensures form elements are clear, functional, and professional.

'use client';

import React, { ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode; // Optional icon for the option
}

export interface SelectOptGroup {
  label: string;
  options: SelectOption[];
}

export type NsbsSelectDropdownProps = SelectPrimitive.SelectProps & {
  options: (SelectOption | SelectOptGroup)[];
  placeholder?: string;
  label?: string; // Optional visible label
  id?: string;
  className?: string; // Class for the SelectPrimitive.Root wrapper
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  error?: string | null; // For displaying validation errors
  // For react-hook-form, usually used with Controller:
  // value, onValueChange, onBlur, disabled, name are passed by Controller
};

export const NsbsSelectDropdown = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  NsbsSelectDropdownProps
>(({ 
  options, 
  placeholder, 
  label, 
  id,
  className,
  triggerClassName, 
  contentClassName,
  itemClassName,
  labelClassName,
  error,
  value, 
  onValueChange, 
  disabled,
  name, // For form submission and react-hook-form Controller
  ...props 
}, ref) => {
  const triggerId = id || (name ? `select-trigger-${name}` : undefined);
  const labelId = label && triggerId ? `${triggerId}-label` : undefined;

  return (
    <div className={cn("nsbs-select-dropdown w-full", className)}>
      {label && (
        <label htmlFor={triggerId} id={labelId} className={cn("block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", labelClassName)}>
          {label}
        </label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled} name={name} {...props}>
        <SelectPrimitive.Trigger
          ref={ref}
          id={triggerId}
          aria-labelledby={labelId}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 dark:border-red-400 ring-red-500 dark:ring-red-400",
            triggerClassName
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${triggerId}-error` : undefined}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
              contentClassName
            )}
            position="popper" // Default, can be 'item-aligned'
            sideOffset={4}
          >
            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
              <ChevronUp className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-1 max-h-[200px]">
              {options.map((optionOrGroup, index) => 
                'options' in optionOrGroup ? ( // It's an OptGroup
                  <SelectPrimitive.Group key={optionOrGroup.label || index}>
                    <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">{optionOrGroup.label}</SelectPrimitive.Label>
                    {optionOrGroup.options.map(opt => (
                      <NsbsSelectItem key={opt.value} value={opt.value} disabled={opt.disabled} className={itemClassName}>
                        {opt.icon && <span className="mr-2 h-4 w-4">{opt.icon}</span>}
                        {opt.label}
                      </NsbsSelectItem>
                    ))}
                  </SelectPrimitive.Group>
                ) : ( // It's a single SelectOption
                  <NsbsSelectItem key={optionOrGroup.value} value={optionOrGroup.value} disabled={optionOrGroup.disabled} className={itemClassName}>
                    {optionOrGroup.icon && <span className="mr-2 h-4 w-4">{optionOrGroup.icon}</span>}
                    {optionOrGroup.label}
                  </NsbsSelectItem>
                )
              )}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
              <ChevronDown className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p id={`${triggerId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
});
NsbsSelectDropdown.displayName = "NsbsSelectDropdown";


// Helper component for SelectItem styling
const NsbsSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectPrimitive.SelectItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 dark:focus:bg-gray-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
NsbsSelectItem.displayName = "NsbsSelectItem";


export default NsbsSelectDropdown;
