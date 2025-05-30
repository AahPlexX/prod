// src/components/layout/NsbsContentSection.tsx
// Developed by Luccas A E | 2025
// Purpose: A generic component for defining distinct content sections on a page, with optional title and consistent padding/margins.
// Features: Customizable title (supports different heading levels), optional subtitle/description, content area, background variants.
// UI/UX Focus: Provides clear visual hierarchy and grouping for page content, enhancing readability and structure.
// Adherence to NSBS Principles: Promotes organized and uncluttered presentation of information.

import React, { ReactNode, ElementType } from 'react';
import { cn } from '@/lib/utils';

export interface NsbsContentSectionProps {
  children: ReactNode;
  title?: string;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Semantic heading level for title
  subtitle?: string;
  className?: string; // For the main section wrapper
  containerClassName?: string; // For an inner container (e.g., max-w-7xl mx-auto)
  headerClassName?: string; // For the title/subtitle group
  contentClassName?: string; // For the children wrapper
  variant?: 'default' | 'subtle' | 'highlighted'; // Predefined background/style variants
  id?: string; // For linking/ARIA
}

export const NsbsContentSection: React.FC<NsbsContentSectionProps> = ({
  children,
  title,
  titleAs: TitleElement = 'h2', // Default to h2 for sections
  subtitle,
  className,
  containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", // Default container for centered content
  headerClassName,
  contentClassName,
  variant = 'default',
  id,
}) => {
  const variantStyles: Record<typeof variant, string> = {
    default: "py-8 sm:py-12 bg-white dark:bg-gray-900",
    subtle: "py-8 sm:py-12 bg-gray-50 dark:bg-gray-800/50",
    highlighted: "py-10 sm:py-16 bg-blue-600 dark:bg-blue-700 text-white dark:text-blue-50", // Example
  };
  
  const titleColor = variant === 'highlighted' ? "text-white dark:text-blue-100" : "text-gray-900 dark:text-white";
  const subtitleColor = variant === 'highlighted' ? "text-blue-100 dark:text-blue-200" : "text-gray-600 dark:text-gray-400";


  return (
    <section id={id} className={cn("nsbs-content-section", variantStyles[variant], className)} aria-labelledby={title && id ? `${id}-title` : undefined}>
      <div className={cn(containerClassName)}>
        {(title || subtitle) && (
          <header className={cn("mb-6 sm:mb-8 text-center", headerClassName)}>
            {title && (
              <TitleElement id={id ? `${id}-title` : undefined} className={cn("text-3xl sm:text-4xl font-bold tracking-tight", titleColor)}>
                {title}
              </TitleElement>
            )}
            {subtitle && (
              <p className={cn("mt-3 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto", subtitleColor)}>
                {subtitle}
              </p>
            )}
          </header>
        )}
        <div className={cn(contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default NsbsContentSection;
