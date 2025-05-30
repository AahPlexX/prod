// src/components/ui/NsbsFullScreenLoadingOverlay.tsx
// Developed by Luccas A E | 2025
// Purpose: An overlay that covers the entire screen with a loading indicator for critical page transitions or initial app load.
// Features: Uses NsbsLoadingSpinner, customizable message, translucent background.
// UI/UX Focus: Clearly communicates a global loading state, preventing user interaction with stale content.
// Adherence to NSBS Principles: Professional feedback mechanism during loading states.

import React from 'react';
import { NsbsLoadingSpinner, NsbsLoadingSpinnerProps } from './NsbsLoadingSpinner'; // Assuming this path
import { cn } from '@/lib/utils';

export interface NsbsFullScreenLoadingOverlayProps {
  isLoading: boolean; // Controls visibility
  loadingText?: string;
  spinnerProps?: Partial<NsbsLoadingSpinnerProps>;
  overlayClassName?: string;
  zIndex?: number;
}

export const NsbsFullScreenLoadingOverlay: React.FC<NsbsFullScreenLoadingOverlayProps> = ({
  isLoading,
  loadingText = "Loading, please wait...",
  spinnerProps = { size: 'lg', color: 'text-white' },
  overlayClassName,
  zIndex = 100, // High z-index to cover everything
}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={cn(
        "nsbs-fullscreen-loading-overlay fixed inset-0 flex flex-col items-center justify-center bg-gray-900/70 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none",
        overlayClassName
      )}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
      aria-label={loadingText}
    >
      <NsbsLoadingSpinner {...spinnerProps} loadingText={undefined} /> 
      {/* loadingText is part of the overlay, not passed directly to spinner again unless desired */}
      <p className="mt-4 text-lg font-medium text-white">{loadingText}</p>
    </div>
  );
};

export default NsbsFullScreenLoadingOverlay;
