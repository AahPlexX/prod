// src/components/admin/courses/NsbsCourseContentIntegrityCheck.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays the status of a course's content integrity check for administrators.
// Features: Shows current hash, expected hash (if available), status (match/mismatch/unchecked), timestamp of last check.
// UI/UX Focus: Provides a clear visual indicator of content integrity, aiding in quality control.
// Adherence to NSBS Principles: Supports platform integrity by providing tools to verify course content hash.

import React from 'react';
import { CheckShield, ShieldAlert, HelpCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { NsbsAccessibleTooltip } from '@/components/ui/NsbsAccessibleTooltip';

export type IntegrityStatus = 'match' | 'mismatch' | 'unchecked' | 'checking';

export interface NsbsCourseContentIntegrityCheckProps {
  courseId: string;
  status: IntegrityStatus;
  currentHash?: string | null; // Hash computed from current lesson content
  storedHash?: string | null; // Hash stored in the database courses.content_hash [cite: 3]
  lastCheckedAt?: string | Date | null; // Timestamp of the last verification
  onVerifyNow?: (courseId: string) => Promise<void>; // Callback to trigger a new verification
  isLoadingVerification?: boolean;
  className?: string;
}

export const NsbsCourseContentIntegrityCheck: React.FC<NsbsCourseContentIntegrityCheckProps> = ({
  courseId,
  status,
  currentHash,
  storedHash,
  lastCheckedAt,
  onVerifyNow,
  isLoadingVerification = false,
  className,
}) => {
  const statusConfig: Record<IntegrityStatus, { icon: React.ReactNode; text: string; colorClasses: string; description: string }> = {
    match: {
      icon: <CheckShield className="w-6 h-6" />,
      text: "Content Integrity: Match",
      colorClasses: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600",
      description: "The stored content hash matches the dynamically computed hash of all lesson content. Content is verified.",
    },
    mismatch: {
      icon: <ShieldAlert className="w-6 h-6" />,
      text: "Content Integrity: Mismatch",
      colorClasses: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-600",
      description: "Warning! The stored content hash does NOT match the computed hash. Course content may have been altered outside the normal update process or there's an issue with the hash calculation.",
    },
    unchecked: {
      icon: <HelpCircle className="w-6 h-6" />,
      text: "Content Integrity: Unchecked",
      colorClasses: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 border-gray-400 dark:border-gray-600",
      description: "Content integrity has not been verified yet for this course version or since the last significant update.",
    },
    checking: {
      icon: <RefreshCw className="w-6 h-6 animate-spin" />,
      text: "Content Integrity: Verifying...",
      colorClasses: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600",
      description: "The content integrity check is currently in progress.",
    },
  };

  const currentStatusInfo = statusConfig[status];
  const formattedLastChecked = lastCheckedAt ? new Date(lastCheckedAt).toLocaleString() : 'N/A';

  return (
    <div className={cn("nsbs-content-integrity-check p-4 sm:p-5 rounded-lg border", currentStatusInfo.colorClasses, className)}>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0 mt-0.5">{currentStatusInfo.icon}</div>
        <div className="flex-grow">
          <h4 className="text-sm sm:text-md font-semibold">{currentStatusInfo.text}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{currentStatusInfo.description}</p>
        </div>
        {onVerifyNow && (
          <NsbsButton
            variant="outline"
            size="sm"
            onClick={() => onVerifyNow(courseId)}
            isLoading={isLoadingVerification}
            disabled={isLoadingVerification || status === 'checking'}
            className="ml-auto flex-shrink-0"
          >
            <RefreshCw className={cn("w-4 h-4", !isLoadingVerification && "mr-2")} />
            {!isLoadingVerification && (status === 'checking' ? "Verifying..." : "Verify Now")}
          </NsbsButton>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-[currentColor] opacity-60 text-xs space-y-1">
        {storedHash && (
            <p>Stored Hash: <NsbsAccessibleTooltip content={storedHash}><span className="font-mono break-all cursor-help">{storedHash.substring(0,12)}...</span></NsbsAccessibleTooltip></p>
        )}
        {currentHash && (
            <p>Computed Hash: <NsbsAccessibleTooltip content={currentHash}><span className="font-mono break-all cursor-help">{currentHash.substring(0,12)}...</span></NsbsAccessibleTooltip></p>
        )}
        <p>Last Checked: {formattedLastChecked}</p>
      </div>
    </div>
  );
};

export default NsbsCourseContentIntegrityCheck;
