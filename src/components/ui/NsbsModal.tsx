// src/components/ui/NsbsModal.tsx
// Developed by Luccas A E | 2025
// Purpose: A reusable, accessible modal/dialog component using Radix UI Dialog primitive for robust functionality.
// Features: Customizable title, content, footer actions, controlled open/close state, accessible (ARIA, focus trap).
// UI/UX Focus: Interrupts flow for critical information/actions, consistent styling, keyboard navigable.
// Adherence to NSBS Principles: Can be used for critical confirmations or information display without unnecessary complexity.

import React, { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility

interface NsbsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string; // Optional description below the title
  children: ReactNode; // Modal content
  footerContent?: ReactNode; // Optional slot for footer buttons/actions
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  hideCloseButton?: boolean;
  className?: string; // Class for DialogContent
}

const modalSizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export const NsbsModal: React.FC<NsbsModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footerContent,
  size = 'md',
  hideCloseButton = false,
  className,
}) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%]",
            "gap-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl rounded-lg duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            modalSizeClasses[size],
            className
          )}
        >
          {(title || !hideCloseButton) && (
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              {title && (
                <DialogPrimitive.Title className="text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
          )}
          
          <div className="modal-content flex-grow overflow-y-auto max-h-[60vh] pr-2"> {/* Added padding-right for scrollbar */}
            {children}
          </div>

          {footerContent && (
            <div className="modal-footer mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              {footerContent}
            </div>
          )}

          {!hideCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white dark:ring-offset-gray-950 transition-opacity",
                "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-700 focus:ring-offset-2",
                "disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800"
              )}
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default NsbsModal;
