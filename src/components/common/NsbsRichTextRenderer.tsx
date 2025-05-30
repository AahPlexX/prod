// src/components/common/NsbsRichTextRenderer.tsx
// Developed by Luccas A E | 2025
// Purpose: A generic component for rendering sanitized rich text (HTML) content across various parts of the application.
// Features: Uses Tailwind Typography plugin for consistent styling, assumes input HTML is pre-sanitized. More generic than NsbsReadOnlyLessonContent.
// UI/UX Focus: Ensures consistent and accessible display of rich text content wherever it appears.
// Adherence to NSBS Principles: Supports clear textual communication, relies on server-side sanitization.

import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility

export interface NsbsRichTextRendererProps {
  htmlContent: string; // Sanitized HTML string
  className?: string; // Class for the root element
  // Base prose classes can be customized via Tailwind config.
  // Specific prose size classes can be added if needed, e.g. prose-sm, prose-lg
  proseSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
}

export const NsbsRichTextRenderer: React.FC<NsbsRichTextRendererProps> = ({
  htmlContent,
  className,
  proseSize = 'base', // Default to base prose size
}) => {
  // IMPORTANT: Security Consideration
  // The 'htmlContent' prop MUST be sanitized on the server-side before being passed to this component
  // if it originates from user input. Using dangerouslySetInnerHTML without proper sanitization is an XSS risk.
  // This component assumes that sanitization has already occurred.

  const sizeClassMap: Record<typeof proseSize, string> = {
    sm: 'prose-sm',
    base: 'prose-base', // Tailwind's default 'prose' is prose-base
    lg: 'prose-lg',
    xl: 'prose-xl',
    '2xl': 'prose-2xl',
  };

  return (
    <div
      className={cn(
        "nsbs-rich-text-renderer prose dark:prose-invert max-w-none",
        sizeClassMap[proseSize],
        // Base styles for links, blockquotes etc. are defined by @tailwindcss/typography
        // Can add more specific overrides here if needed, e.g.,
        // "prose-a:text-custom-blue dark:prose-a:text-custom-blue-dark hover:prose-a:underline",
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      aria-live="polite" // If content can change dynamically, otherwise remove
    />
  );
};

// This component relies on Tailwind CSS Typography plugin (@tailwindcss/typography).
// Ensure it's installed and configured in your tailwind.config.js:
// plugins: [require('@tailwindcss/typography')],

export default NsbsRichTextRenderer;
