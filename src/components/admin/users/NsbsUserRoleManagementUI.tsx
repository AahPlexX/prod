// src/components/admin/users/NsbsUserRoleManagementUI.tsx
// Developed by Luccas A E | 2025
// Purpose: A UI component for administrators to manage a user's roles.
// Features: Displays current role, allows selection from available roles (dropdown or radio), handles save/update action.
// UI/UX Focus: Clear presentation of roles, intuitive selection, confirmation of changes.
// Adherence to NSBS Principles: Supports critical user management functions for administrators[cite: 2, 53, 179].

'use client'; // For state and interaction

import React, { useState, useEffect } from 'react';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { ShieldCheck, UserCog } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';

// User roles as defined in the knowledge base (e.g., additional_knowledge_base.txt) [cite: 2, 179]
export type UserRole = 'GUEST' | 'USER' | 'ENROLLED_USER' | 'CERTIFICATE_OWNER' | 'ADMIN';

export const availableRoles: Array<{ value: UserRole; label: string; description?: string }> = [
  { value: 'USER', label: 'User', description: 'Standard user with access to purchased courses.' },
  { value: 'ENROLLED_USER', label: 'Enrolled User', description: 'User with active course enrollments (often managed automatically).' },
  { value: 'CERTIFICATE_OWNER', label: 'Certificate Owner', description: 'User who has earned certificates (often managed automatically).' },
  { value: 'ADMIN', label: 'Administrator', description: 'Full platform administrative privileges.' },
  // GUEST is typically implicit for unauthenticated users, not assignable.
];

export interface NsbsUserRoleManagementUIProps {
  userId: string;
  currentRole: UserRole;
  onUpdateRole: (userId: string, newRole: UserRole) => Promise<boolean>; // Returns true on success
  disabled?: boolean;
  className?: string;
}

export const NsbsUserRoleManagementUI: React.FC<NsbsUserRoleManagementUIProps> = ({
  userId,
  currentRole,
  onUpdateRole,
  disabled = false,
  className,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setSelectedRole(currentRole); // Sync with prop changes
  }, [currentRole]);

  const handleSaveRole = async () => {
    if (selectedRole === currentRole || disabled) return;
    setIsSaving(true);
    setFeedbackMessage(null);
    try {
      const success = await onUpdateRole(userId, selectedRole);
      if (success) {
        setFeedbackMessage({ type: 'success', message: 'User role updated successfully.' });
        // currentRole prop should ideally be updated by parent, re-triggering useEffect
      } else {
        setFeedbackMessage({ type: 'error', message: 'Failed to update user role.' });
        setSelectedRole(currentRole); // Revert on failure if parent doesn't handle
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setFeedbackMessage({ type: 'error', message: errorMessage });
      setSelectedRole(currentRole); // Revert
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("nsbs-user-role-management space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800", className)}>
      <div className="flex items-center gap-2">
        <UserCog className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100">Manage User Role</h4>
      </div>
      
      {feedbackMessage && (
        <div className={cn(
          "p-3 rounded-md text-sm",
          feedbackMessage.type === 'success' ? "bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-200" : 
                                              "bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-200"
        )}>
          {feedbackMessage.message}
        </div>
      )}

      <div>
        <label htmlFor={`role-select-${userId}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Role:
        </label>
        <select
          id={`role-select-${userId}`}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          disabled={disabled || isSaving}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50"
        >
          {availableRoles.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        {availableRoles.find(r => r.value === selectedRole)?.description && (
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {availableRoles.find(r => r.value === selectedRole)?.description}
            </p>
        )}
      </div>

      <div className="flex justify-end">
        <NsbsButton
          onClick={handleSaveRole}
          disabled={selectedRole === currentRole || isSaving || disabled}
          isLoading={isSaving}
          variant="default"
          size="sm"
        >
          <ShieldCheck className="w-4 h-4 mr-2"/>
          Update Role
        </NsbsButton>
      </div>
    </div>
  );
};

export default NsbsUserRoleManagementUI;
