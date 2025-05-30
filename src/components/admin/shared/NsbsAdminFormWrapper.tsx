// src/components/admin/shared/NsbsAdminFormWrapper.tsx
// Developed by Luccas A E | 2025
// Purpose: Provides a consistent layout and functionality wrapper for admin forms (e.g., creating/editing courses, modules).
// Features: Standardized header, action buttons (Save, Cancel), optional loading state, error message display area.
// UI/UX Focus: Consistent admin experience, clear calls to action, feedback mechanisms.
// Adherence to NSBS Principles: Supports efficient content management by administrators.

import React, { ReactNode } from 'react';
import { NsbsButton } from '@/components/ui/NsbsButton'; // Assuming NsbsButton is created
import { AlertTriangle, CheckCircle } from 'lucide-react';

export interface NsbsAdminFormWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  saveButtonText?: string;
  cancelButtonText?: string;
  errorMessage?: string | null;
  successMessage?: string | null;
  formActions?: ReactNode; // For additional custom actions
}

export const NsbsAdminFormWrapper: React.FC<NsbsAdminFormWrapperProps> = ({
  title,
  description,
  children,
  onSave,
  onCancel,
  isSaving = false,
  saveButtonText = 'Save Changes',
  cancelButtonText = 'Cancel',
  errorMessage,
  successMessage,
  formActions,
}) => {
  return (
    <div className="nsbs-admin-form-wrapper bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-6">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success</h3>
              <div className="mt-1 text-sm text-green-700 dark:text-green-300">
                <p>{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-8">
        {children}

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-8 flex items-center justify-end gap-x-4">
          {formActions}
          <NsbsButton
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            {cancelButtonText}
          </NsbsButton>
          <NsbsButton
            type="submit"
            variant="default" // Or your primary theme variant e.g., 'sg-primary'
            isLoading={isSaving}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : saveButtonText}
          </NsbsButton>
        </div>
      </form>
    </div>
  );
};

export default NsbsAdminFormWrapper;
