// src/components/forms/NsbsFormSection.tsx
// Developed by Luccas A E | 2025
// Purpose: A component to group related input fields within a larger form, providing a section title and description.
// Features: Clear visual separation for form sections, title, descriptive text, content area for form fields.
// UI/UX Focus: Improves form readability and organization, guides user through complex forms.
// Adherence to NSBS Principles: Supports clarity in administrative interfaces.

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface NsbsFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode; // Form fields for this section
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  hasBorder?: boolean; // Add a top border for separation
}

export const NsbsFormSection: React.FC<NsbsFormSectionProps> = ({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
  contentClassName,
  hasBorder = false,
}) => {
  return (
    <section
      className={cn(
        "nsbs-form-section",
        hasBorder && "border-t border-gray-200 dark:border-gray-700 pt-8 mt-8",
        className
      )}
      aria-labelledby={`section-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 id={`section-title-${title.toLowerCase().replace(/\s+/g, '-')}`} className={cn("text-lg font-medium leading-6 text-gray-900 dark:text-white", titleClassName)}>
            {title}
          </h3>
          {description && (
            <p className={cn("mt-1 text-sm text-gray-600 dark:text-gray-400", descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
        <div className={cn("mt-5 md:mt-0 md:col-span-2 space-y-6", contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default NsbsFormSection;
