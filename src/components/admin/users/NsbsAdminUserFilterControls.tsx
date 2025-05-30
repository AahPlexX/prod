// src/components/admin/users/NsbsAdminUserFilterControls.tsx
// Developed by Luccas A E | 2025
// Purpose: Specific filter controls for the user management table in the admin section.
// Features: Filter by role, email verification status, search by name/email. Extends NsbsFilterSortControls concepts.
// UI/UX Focus: Enables administrators to efficiently find and manage specific users or groups of users.
// Adherence to NSBS Principles: Supports precise and effective user administration.

'use client';

import React, { useState, useEffect } from 'react';
import { NsbsFilterSortControls, FilterOption, SortOption } from '@/components/common/NsbsFilterSortControls';
import { UserRole, availableRoles as allPlatformRoles } from './NsbsUserRoleManagementUI'; // Assuming this path and type
// availableRoles from NsbsUserRoleManagementUI might need adjustment if GUEST is included or not filterable.

export interface UserFilters {
  role?: UserRole | '';
  emailVerified?: 'true' | 'false' | '';
  searchTerm?: string; // For name or email
}

export type UserSortKey = 'name' | 'email' | 'role' | 'created_at' | 'last_login_at';

export interface NsbsAdminUserFilterControlsProps {
  initialFilters?: UserFilters;
  onFilterChange: (filters: UserFilters) => void;
  // onSortChange can be added if NsbsFilterSortControls is enhanced or sorting is separate
  // availableSortOptions?: SortOption[];
  className?: string;
}

export const NsbsAdminUserFilterControls: React.FC<NsbsAdminUserFilterControlsProps> = ({
  initialFilters = { role: '', emailVerified: '', searchTerm: '' },
  onFilterChange,
  // availableSortOptions,
  className,
}) => {
  const [currentFilters, setCurrentFilters] = useState<UserFilters>(initialFilters);

  useEffect(() => {
    // Debounce or direct call, depending on desired behavior for live filtering
    onFilterChange(currentFilters);
  }, [currentFilters, onFilterChange]);

  const handleFilterChange = (filterId: keyof UserFilters, value: string) => {
    setCurrentFilters(prev => ({ ...prev, [filterId]: value }));
  };
  
  const handleSearchChange = (term: string) => {
     handleFilterChange('searchTerm', term);
  };
  
  const handleClearFilters = () => {
      const clearedFilters = { role: '' as UserRole | '', emailVerified: '' as 'true' | 'false' | '', searchTerm: ''};
      setCurrentFilters(clearedFilters);
      onFilterChange(clearedFilters); // Explicitly call onFilterChange for immediate update
  };


  const roleFilterOptions: FilterOption[] = allPlatformRoles
    .filter(role => role.value !== 'GUEST') // Exclude GUEST from assignable/filterable roles perhaps
    .map(role => ({ value: role.value, label: role.label }));

  const emailVerifiedOptions: FilterOption[] = [
    { value: 'true', label: 'Verified' },
    { value: 'false', label: 'Not Verified' },
  ];

  const filterConfig = [
    { 
      id: 'role', 
      label: 'Filter by Role', 
      options: roleFilterOptions, 
      currentValue: currentFilters.role || '', 
      onChange: (id: string, val: string) => handleFilterChange(id as keyof UserFilters, val), 
      placeholder: 'All Roles' 
    },
    { 
      id: 'emailVerified', 
      label: 'Email Status', 
      options: emailVerifiedOptions, 
      currentValue: currentFilters.emailVerified || '', 
      onChange: (id: string, val: string) => handleFilterChange(id as keyof UserFilters, val), 
      placeholder: 'Any Email Status' 
    },
  ];

  return (
    <NsbsFilterSortControls
      filters={filterConfig}
      searchTerm={currentFilters.searchTerm}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search by name or email..."
      onClearFilters={handleClearFilters} // Pass the clear handler
      className={className}
      showLabels={true} // Example: Show labels above dropdowns
      // Pass sort options and handlers here if sorting is integrated
    />
  );
};

export default NsbsAdminUserFilterControls;
