// src/components/forms/NsbsFormStepper.tsx
// Developed by Luccas A E | 2025
// Purpose: Provides a visual stepper for multi-step forms, guiding users through a sequence of form sections.
// Features: Clickable steps (if allowed), current step highlighting, completion status indicators for past steps.
// UI/UX Focus: Improves user experience for long or complex forms by breaking them into manageable, logical steps.
// Adherence to NSBS Principles: Can simplify complex administrative data entry tasks.

'use client';

import React from 'react';
import { Check, Circle } from 'lucide-react'; // Using Circle as a generic step icon
import { cn } from '@/lib/utils';

export interface FormStep {
  id: string;
  name: string;
  isCompleted: boolean;
  isAccessible: boolean; // Can the user click to navigate to this step?
  onClick?: (stepId: string) => void; // Optional: if steps are clickable
}

export interface NsbsFormStepperProps {
  steps: FormStep[];
  currentStepId: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const NsbsFormStepper: React.FC<NsbsFormStepperProps> = ({
  steps,
  currentStepId,
  className,
  orientation = 'horizontal',
}) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);

  return (
    <nav aria-label="Progress" className={cn("nsbs-form-stepper", className)}>
      <ol
        role="list"
        className={cn(
          "flex",
          orientation === 'horizontal' ? "items-center space-x-2 sm:space-x-4" : "flex-col space-y-3"
        )}
      >
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={cn(orientation === 'horizontal' ? "relative flex-1" : "relative flex items-start")}>
            {/* Connecting line for horizontal stepper (except for the last step) */}
            {orientation === 'horizontal' && stepIdx < steps.length - 1 && (
              <div
                className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center"
                aria-hidden="true"
              >
                <div className={cn(
                    "h-0.5 w-full",
                    stepIdx < currentStepIndex || step.isCompleted ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                )} />
              </div>
            )}
             {/* Connecting line for vertical stepper (except for the last step) */}
             {orientation === 'vertical' && stepIdx < steps.length - 1 && (
              <div className="absolute left-3.5 top-5 -ml-px mt-0.5 h-full w-0.5 
                              bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600" aria-hidden="true" />
            )}


            <button
              type="button"
              onClick={step.isAccessible && step.onClick ? () => step.onClick?.(step.id) : undefined}
              disabled={!step.isAccessible || !step.onClick}
              className={cn(
                "relative flex items-center text-left transition-colors group",
                orientation === 'horizontal' ? "flex-col w-full py-2" : "py-1 w-full",
                step.isAccessible && step.onClick ? "cursor-pointer" : "cursor-default"
              )}
              aria-current={step.id === currentStepId ? 'step' : undefined}
            >
              <span className={cn(
                "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2",
                orientation === 'horizontal' ? "mb-2 sm:mb-3" : "mr-3 sm:mr-4 flex-shrink-0",
                step.id === currentStepId 
                  ? "border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500" 
                  : step.isCompleted 
                    ? "border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500" 
                    : step.isAccessible 
                      ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-gray-400 dark:group-hover:border-gray-500" 
                      : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
              )}>
                {step.isCompleted && step.id !== currentStepId ? (
                  <Check className="h-4 w-4 text-white dark:text-gray-900" />
                ) : (
                  <span className={cn(
                    "text-xs sm:text-sm font-medium",
                    step.id === currentStepId || step.isCompleted ? "text-white dark:text-gray-900" : 
                    step.isAccessible ? "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" :
                    "text-gray-400 dark:text-gray-500"
                  )}>
                    {stepIdx + 1}
                  </span>
                )}
              </span>
              <span className={cn(
                  "text-xs sm:text-sm font-medium min-w-0",
                  orientation === 'horizontal' ? "text-center" : "",
                  step.id === currentStepId ? "text-blue-700 dark:text-blue-200" : 
                  step.isCompleted ? "text-gray-800 dark:text-gray-100" : 
                  step.isAccessible ? "text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" :
                  "text-gray-400 dark:text-gray-500",
                  "truncate"
              )} title={step.name}>
                {step.name}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default NsbsFormStepper;
