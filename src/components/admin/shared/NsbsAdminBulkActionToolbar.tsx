// src/components/admin/shared/NsbsAdminBulkActionToolbar.tsx
// Developed by Luccas A E | 2025
// Purpose: A toolbar that appears when items are selected in a data grid (like NsbsDataGrid), offering bulk actions.
// Features: Displays number of selected items, provides buttons for bulk actions (e.g., delete, publish, unpublish).
// UI/UX Focus: Efficiently perform operations on multiple items, clear indication of selection context.
// Adherence to NSBS Principles: Enhances administrative efficiency for managing platform data.

import React, { ReactNode } from 'react';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { Trash2, CheckSquare, XSquare } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';

export interface BulkAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void; // Action operates on the selected items (passed via parent context or state)
  variant?: VariantProps<typeof NsbsButton.buttonVariants>['variant'];
  disabled?: boolean;
  isLoading?: boolean; // If a specific action is loading
}

export interface NsbsAdminBulkActionToolbarProps {
  selectedItemCount: number;
  actions: BulkAction[];
  onClearSelection?: () => void; // Optional: action to clear current selection
  className?: string;
  isVisible?: boolean; // Controlled by parent based on selection count > 0
}

export const NsbsAdminBulkActionToolbar: React.FC<NsbsAdminBulkActionToolbarProps> = ({
  selectedItemCount,
  actions,
  onClearSelection,
  className,
  isVisible, // Default to true if selectedItemCount > 0
}) => {
  const showToolbar = isVisible === undefined ? selectedItemCount > 0 : isVisible;

  if (!showToolbar) {
    return null;
  }

  return (
    <div
      className={cn(
        "nsbs-admin-bulk-action-toolbar fixed inset-x-0 bottom-0 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl z-40", // Position at bottom, centered on sm+
        "p-3 sm:p-4 bg-gray-800 dark:bg-gray-900 text-white rounded-none sm:rounded-lg shadow-2xl border border-gray-700 dark:border-black",
        "transition-transform duration-300 ease-out data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full",
        className
      )}
      data-state={showToolbar ? "open" : "closed"} // For animations if desired
      role="toolbar"
      aria-label="Bulk actions"
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          {onClearSelection && (
            <NsbsButton 
                variant="ghost" 
                size="icon" 
                onClick={onClearSelection} 
                className="text-gray-300 hover:bg-gray-700 hover:text-white h-8 w-8 p-0"
                title="Clear selection"
            >
                <XSquare className="w-5 h-5" />
            </NsbsButton>
          )}
          <p className="text-sm font-medium">
            <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs mr-1.5">{selectedItemCount}</span>
            selected
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          {actions.map((action) => (
            <NsbsButton
              key={action.label}
              variant={action.variant || 'secondary'}
              size="sm"
              onClick={action.onClick}
              iconLeft={action.icon}
              disabled={action.disabled || action.isLoading}
              isLoading={action.isLoading}
              className="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600" // Adjust dark theme for secondary on dark bg
            >
              {action.label}
            </NsbsButton>
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage of icons for actions:
// export const BulkDeleteActionIcon = () => <Trash2 className="w-4 h-4 mr-1.5" />;
// export const BulkPublishActionIcon = () => <CheckSquare className="w-4 h-4 mr-1.5" />;
// export const BulkUnpublishActionIcon = () => <XSquare className="w-4 h-4 mr-1.5" />;

export default NsbsAdminBulkActionToolbar;
