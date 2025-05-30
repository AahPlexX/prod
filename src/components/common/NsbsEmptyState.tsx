// src/components/common/NsbsEmptyState.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays a user-friendly message when no data or content is available in a section.
// Features: Customizable icon, title, message, and an optional call-to-action button.
// UI/UX Focus: Prevents user confusion from blank screens, provides guidance or next steps.
// Adherence to NSBS Principles: Clear communication, professional presentation.

import React, { ReactNode } from 'react';
import { NsbsButton } from '@/components/ui/NsbsButton'; // Assuming NsbsButton
import { Inbox, FileQuestion, SearchX } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';

export interface NsbsEmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  actionButton?: {
    text: string;
    onClick: () => void;
    variant?: VariantProps<typeof NsbsButton.buttonVariants>['variant'];
    icon?: ReactNode;
  };
  className?: string;
}

export const NsbsEmptyState: React.FC<NsbsEmptyStateProps> = ({
  icon = <Inbox className="h-12 w-12 text-gray-400 dark:text-gray-500" />, // Default icon
  title,
  message,
  actionButton,
  className,
}) => {
  return (
    <div
      className={cn(
        "nsbs-empty-state text-center py-12 px-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {message}
      </p>
      {actionButton && (
        <NsbsButton
          onClick={actionButton.onClick}
          variant={actionButton.variant || 'default'} // Or 'sg-primary'
          iconLeft={actionButton.icon}
        >
          {actionButton.text}
        </NsbsButton>
      )}
    </div>
  );
};

// Example presets (could be exported or used internally)
export const NoSearchResultsEmptyState: React.FC<Omit<NsbsEmptyStateProps, 'icon' | 'title' | 'message'>> = (props) => (
  <NsbsEmptyState
    icon={<SearchX className="h-12 w-12 text-gray-400 dark:text-gray-500" />}
    title="No Results Found"
    message="We couldn't find any items matching your search criteria. Try adjusting your filters or search terms."
    {...props}
  />
);

export const NoDataEmptyState: React.FC<Omit<NsbsEmptyStateProps, 'icon' | 'title' | 'message'>> = (props) => (
  <NsbsEmptyState
    icon={<FileQuestion className="h-12 w-12 text-gray-400 dark:text-gray-500" />}
    title="No Data Available"
    message="There is currently no data to display in this section. Please check back later or add new items if applicable."
    {...props}
  />
);


export default NsbsEmptyState;
