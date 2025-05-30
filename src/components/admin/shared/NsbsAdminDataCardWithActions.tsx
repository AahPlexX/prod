// src/components/admin/shared/NsbsAdminDataCardWithActions.tsx
// Developed by Luccas A E | 2025
// Purpose: An extension or variant of NsbsDataCard for admin contexts, often including common action buttons in the header or footer.
// Features: Similar to NsbsDataCard, but with dedicated slots or props for common admin actions (e.g., Edit, Delete, View).
// UI/UX Focus: Provides quick access to relevant actions directly on data display cards in admin interfaces.
// Adherence to NSBS Principles: Streamlines administrative workflows.

import React, { ReactNode } from 'react';
import { NsbsDataCard, NsbsDataCardProps } from '@/components/common/NsbsDataCard'; // Assuming this path
import { NsbsButton } from '@/components/ui/NsbsButton';
import { Edit3, Trash2, Eye, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define a standard type for an action button configuration
export interface CardAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: VariantProps<typeof NsbsButton.buttonVariants>['variant'];
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export interface NsbsAdminDataCardWithActionsProps extends NsbsDataCardProps {
  primaryAction?: CardAction; // A prominent action, e.g., "Edit"
  secondaryActions?: CardAction[]; // Array of other actions
  actionsPosition?: 'header' | 'footer'; // Where to place the action buttons
}

export const NsbsAdminDataCardWithActions: React.FC<NsbsAdminDataCardWithActionsProps> = ({
  primaryAction,
  secondaryActions,
  actionsPosition = 'header', // Default to header for admin cards
  headerActions: existingHeaderActions, // Allow passing through existing headerActions prop
  footerContent: existingFooterContent, // Allow passing through existing footerContent prop
  ...dataCardProps // Rest of NsbsDataCardProps
}) => {
  const renderActions = (): ReactNode => {
    if (!primaryAction && (!secondaryActions || secondaryActions.length === 0)) {
      return null;
    }
    return (
      <div className="flex items-center space-x-2">
        {secondaryActions?.map((action, index) => (
          <NsbsButton
            key={action.label || index}
            variant={action.variant || 'ghost'}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled || action.isLoading}
            isLoading={action.isLoading}
            iconLeft={action.icon}
            className={cn("p-1.5 h-auto", action.className)} // Smaller padding for icon buttons
            title={action.label} // Tooltip for icon-only buttons
          >
            {action.label && !action.icon ? action.label : (action.icon ? null : action.label) }
          </NsbsButton>
        ))}
        {primaryAction && (
          <NsbsButton
            variant={primaryAction.variant || 'default'}
            size="sm"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.isLoading}
            isLoading={primaryAction.isLoading}
            iconLeft={primaryAction.icon}
            className={primaryAction.className}
          >
            {primaryAction.label}
          </NsbsButton>
        )}
      </div>
    );
  };

  const actionsNode = renderActions();

  let effectiveHeaderActions = existingHeaderActions;
  if (actionsPosition === 'header' && actionsNode) {
    effectiveHeaderActions = (
      <>
        {existingHeaderActions}
        {actionsNode}
      </>
    );
  }

  let effectiveFooterContent = existingFooterContent;
  if (actionsPosition === 'footer' && actionsNode) {
    effectiveFooterContent = (
      <div className="flex items-center justify-end w-full">
        {existingFooterContent && <div className="mr-auto">{existingFooterContent}</div>}
        {actionsNode}
      </div>
    );
  }

  return (
    <NsbsDataCard
      {...dataCardProps}
      headerActions={effectiveHeaderActions}
      footerContent={effectiveFooterContent}
    />
  );
};

// Example Icons for actions
// export const EditActionIcon = () => <Edit3 className="w-4 h-4" />;
// export const DeleteActionIcon = () => <Trash2 className="w-4 h-4" />;
// export const ViewActionIcon = () => <Eye className="w-4 h-4" />;
// export const AddActionIcon = () => <PlusCircle className="w-4 h-4" />;

export default NsbsAdminDataCardWithActions;
