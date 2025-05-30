// src/components/admin/shared/NsbsAdminActionConfirmModal.tsx
// Developed by Luccas A E | 2025
// Purpose: A specialized modal for confirming potentially destructive actions in the admin panel (e.g., delete, revoke).
// Features: Uses NsbsModal, themed for confirmation (e.g., warning/danger colors for confirm button), clear messaging.
// UI/UX Focus: Prevents accidental destructive actions, ensures user is certain before proceeding.
// Adherence to NSBS Principles: Supports safe and reliable platform administration.

import React, { ReactNode } from 'react';
import { NsbsModal, NsbsModalProps } from '@/components/ui/NsbsModal'; // Assuming NsbsModal
import { NsbsButton } from '@/components/ui/NsbsButton';
import { AlertTriangle } from 'lucide-react';

export interface NsbsAdminActionConfirmModalProps extends Omit<NsbsModalProps, 'children' | 'footerContent'> {
  actionType?: 'delete' | 'revoke' | 'warning' | 'custom';
  itemName?: string; // Name of the item being acted upon (e.g., "this course", "user John Doe")
  customMessage?: ReactNode;
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isConfirming?: boolean; // For loading state on confirm button
}

export const NsbsAdminActionConfirmModal: React.FC<NsbsAdminActionConfirmModalProps> = ({
  isOpen,
  onOpenChange,
  title = "Confirm Action",
  actionType = 'warning',
  itemName,
  customMessage,
  onConfirm,
  confirmButtonText,
  cancelButtonText = "Cancel",
  isConfirming = false,
  ...modalProps
}) => {
  let effectiveTitle = title;
  let message: ReactNode = customMessage || "Are you sure you want to proceed with this action?";
  let effectiveConfirmButtonText = confirmButtonText || "Confirm";
  let confirmButtonVariant: VariantProps<typeof NsbsButton.buttonVariants>['variant'] = 'default';
  let IconComponent = <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mr-3" />;

  switch (actionType) {
    case 'delete':
      effectiveTitle = title === "Confirm Action" ? `Delete ${itemName || 'Item'}` : title;
      message = customMessage || <>Are you absolutely sure you want to delete <strong>{itemName || 'this item'}</strong>? This action cannot be undone.</>;
      effectiveConfirmButtonText = confirmButtonText || "Yes, Delete";
      confirmButtonVariant = 'destructive';
      IconComponent = <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400 mr-3" />;
      break;
    case 'revoke':
      effectiveTitle = title === "Confirm Action" ? `Revoke ${itemName || 'Access'}` : title;
      message = customMessage || <>Are you sure you want to revoke <strong>{itemName || 'this item/access'}</strong>? This may have significant consequences.</>;
      effectiveConfirmButtonText = confirmButtonText || "Yes, Revoke";
      confirmButtonVariant = 'destructive'; // Or a specific warning variant
      IconComponent = <AlertTriangle className="h-6 w-6 text-orange-500 dark:text-orange-400 mr-3" />;
      break;
    case 'warning':
       // Default icon and title are fine
      break;
  }

  return (
    <NsbsModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={effectiveTitle}
      size="md"
      {...modalProps}
    >
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 sm:mx-0 sm:h-10 sm:w-10">
          {IconComponent}
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          {/* Title is now part of NsbsModal props, so it's in the header there. */}
          {/* We can re-iterate a stronger title here if NsbsModal title is generic */}
          {/* <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
            {effectiveTitle}
          </h3> */}
          <div className="mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="modal-footer mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <NsbsButton
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isConfirming}
        >
          {cancelButtonText}
        </NsbsButton>
        <NsbsButton
          type="button"
          variant={confirmButtonVariant}
          onClick={onConfirm}
          isLoading={isConfirming}
          disabled={isConfirming}
        >
          {effectiveConfirmButtonText}
        </NsbsButton>
      </div>
    </NsbsModal>
  );
};

export default NsbsAdminActionConfirmModal;
