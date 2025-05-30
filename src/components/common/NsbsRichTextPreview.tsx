// src/components/common/NsbsRichTextPreview.tsx
// Developed by Luccas A E | 2025
// Purpose: Renders a preview of sanitized rich text (HTML) content, potentially with constrained height and a "read more" option.
// Features: Uses NsbsRichTextRenderer internally, can truncate content, distinct styling for preview contexts.
// UI/UX Focus: Provides a glimpse of rich text content, useful in admin lists or summaries.
// Adherence to NSBS Principles: Clear textual communication, assumes server-side sanitization.

import React, { useState } from 'react';
import { NsbsRichTextRenderer, NsbsRichTextRendererProps } from './NsbsRichTextRenderer'; // Assuming this path
import { NsbsButton } from '@/components/ui/NsbsButton';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NsbsRichTextPreviewProps extends NsbsRichTextRendererProps {
  maxHeightLines?: number; // Approximate number of lines to show before truncating (CSS line-clamp)
  expandable?: boolean; // If true, shows a "Read more" button
  previewWrapperClassName?: string;
}

export const NsbsRichTextPreview: React.FC<NsbsRichTextPreviewProps> = ({
  htmlContent,
  className, // Passed to NsbsRichTextRenderer
  proseSize = 'sm', // Default to smaller prose for previews
  maxHeightLines = 5, // Default line clamp
  expandable = false,
  previewWrapperClassName,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!expandable); // If not expandable, it's always "expanded"

  // Style for line clamping. Requires Tailwind's line-clamp plugin or custom CSS.
  // Example tailwind.config.js: plugins: [require('@tailwindcss/line-clamp')]
  const lineClampStyle: React.CSSProperties = !isExpanded && expandable ? { 
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: maxHeightLines,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
  } : {};

  if (!htmlContent) {
    return <p className={cn("text-xs italic text-gray-400 dark:text-gray-500", previewWrapperClassName)}>No content preview available.</p>;
  }
  
  // Check if content actually overflows (simple check based on length, more robust check would be via measuring element)
  const mightOverflow = expandable && htmlContent.length > maxHeightLines * 100; // Rough heuristic

  return (
    <div className={cn("nsbs-rich-text-preview relative", previewWrapperClassName)}>
      <div style={lineClampStyle} className={cn(!isExpanded && expandable && "pb-2") /* Add padding for fade if used */}>
        <NsbsRichTextRenderer htmlContent={htmlContent} className={className} proseSize={proseSize} />
      </div>
      {expandable && mightOverflow && !isExpanded && (
        // Optional: add a fade-out effect at the bottom of clamped text
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
      )}
      {expandable && mightOverflow && (
        <div className="mt-2 text-right">
          <NsbsButton variant="link" size="sm" onClick={() => setIsExpanded(!isExpanded)} iconLeft={isExpanded ? <EyeOff className="w-3.5 h-3.5"/> : <Eye className="w-3.5 h-3.5"/>}>
            {isExpanded ? "Show Less" : "Read More"}
          </NsbsButton>
        </div>
      )}
    </div>
  );
};

export default NsbsRichTextPreview;
