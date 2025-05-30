// src/components/settings/NsbsSettingsToggle.tsx
// Developed by Luccas A E | 2025
// Purpose: A reusable toggle switch component for on/off settings, wrapping Radix UI Switch for accessibility.
// Features: Label, optional description, on/off state management (controlled via props), ARIA attributes.
// UI/UX Focus: Clear visual indication of setting state, easy interaction, accessible for keyboard and screen reader users.
// Adherence to NSBS Principles: Can be used for essential, non-distracting user preferences (e.g., theme selection if implemented this way).

'use client'; // Radix Switch can use client features

import React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface NsbsSettingsToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string; // For the wrapper div
  labelClassName?: string;
  descriptionClassName?: string;
  switchClassName?: string; // For the SwitchPrimitives.Root
  thumbClassName?: string; // For the SwitchPrimitives.Thumb
}

export const NsbsSettingsToggle: React.FC<NsbsSettingsToggleProps> = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className,
  labelClassName,
  descriptionClassName,
  switchClassName,
  thumbClassName,
}) => {
  return (
    <div className={cn("nsbs-settings-toggle flex items-center justify-between py-3 sm:py-4", className, disabled && "opacity-60")}>
      <div className="flex flex-col mr-4">
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium text-gray-900 dark:text-gray-100",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            labelClassName
          )}
        >
          {label}
        </label>
        {description && (
          <p className={cn("text-xs text-gray-500 dark:text-gray-400", descriptionClassName, disabled && "cursor-not-allowed")}>
            {description}
          </p>
        )}
      </div>
      <SwitchPrimitives.Root
        id={id}
        checked={checked}
        onCheckedChange={disabled ? undefined : onCheckedChange}
        disabled={disabled}
        className={cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500',
          'data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600',
          switchClassName
        )}
        aria-label={label}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-white dark:bg-gray-200 shadow-lg ring-0 transition-transform',
            'data-[state=checked]:translate-x-5',
            'data-[state=unchecked]:translate-x-0',
            thumbClassName
          )}
        />
      </SwitchPrimitives.Root>
    </div>
  );
};

export default NsbsSettingsToggle;
