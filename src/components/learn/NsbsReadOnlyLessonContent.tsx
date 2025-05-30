// src/components/learn/NsbsReadOnlyLessonContent.tsx
// Developed by Luccas A E | 2025
// Purpose: Renders sanitized HTML lesson content in a clean, readable, and accessible format.
// Features: Typography optimized for readability, supports basic HTML from WYSIWYG, responsive.
// UI/UX Focus: Excellent readability, comfortable for long reading sessions, accessible text.
// Adherence to NSBS Principles: Core component for text-based learning, distraction-free content presentation.

import React from 'react';

export interface NsbsReadOnlyLessonContentProps {
  htmlContent: string; // Sanitized HTML string
  className?: string;
}

export const NsbsReadOnlyLessonContent: React.FC<NsbsReadOnlyLessonContentProps> = ({
  htmlContent,
  className = '',
}) => {
  // IMPORTANT: Security Consideration
  // The 'htmlContent' prop MUST be sanitized on the server-side before being passed to this component
  // if it originates from user input (e.g., WYSIWYG editor). Using dangerouslySetInnerHTML
  // without proper sanitization is a security risk (XSS).
  // NSBS schema [cite: 5] for lessons.content indicates "Rich text, sanitized HTML".
  // This component assumes that sanitization has already occurred.

  return (
    <article
      className={`nsbs-lesson-content prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white 
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-strong:text-gray-800 dark:prose-strong:text-gray-200
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-blue-500 dark:prose-blockquote:border-l-blue-400 
                  prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                  prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-blue-500
                  prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:text-blue-500
                  ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      aria-label="Lesson Content"
    />
  );
};

// This component relies on Tailwind CSS Typography plugin (@tailwindcss/typography).
// Ensure it's installed and configured in your tailwind.config.js:
// plugins: [require('@tailwindcss/typography')],

export default NsbsReadOnlyLessonContent;
