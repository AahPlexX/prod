// src/components/notifications/NsbsNotificationItem.tsx
// Developed by Luccas A E | 2025
// Purpose: Renders an individual notification/toast message (e.g., success, error, info, warning).
// Features: Different styles per type, icon, title, description, close button. Designed to be used with a toast provider like Radix Toast.
// UI/UX Focus: Clear, concise feedback to user actions, easily dismissible, accessible.
// Adherence to NSBS Principles: Provides essential system feedback without being overly intrusive.

import React, { ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast'; // Using Radix Toast as an example, as it's in package.json
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NsbsButton } from '@/components/ui/NsbsButton';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NsbsNotificationItemProps {
  id?: string; // For programmatic control via a toast provider
  type: NotificationType;
  title: string;
  description?: string;
  onDismiss?: (id?: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const typeStyles: Record<NotificationType, { icon: ReactNode; iconColor: string; borderColor: string; bgColor: string }> = {
  success: {
    icon: <CheckCircle className="h-6 w-6" />,
    iconColor: 'text-green-500 dark:text-green-400',
    borderColor: 'border-green-500 dark:border-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/50',
  },
  error: {
    icon: <XCircle className="h-6 w-6" />,
    iconColor: 'text-red-500 dark:text-red-400',
    borderColor: 'border-red-500 dark:border-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/50',
  },
  info: {
    icon: <Info className="h-6 w-6" />,
    iconColor: 'text-blue-500 dark:text-blue-400',
    borderColor: 'border-blue-500 dark:border-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/50',
  },
  warning: {
    icon: <AlertTriangle className="h-6 w-6" />,
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    borderColor: 'border-yellow-500 dark:border-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/50',
  },
};

// This component is designed to be the content of a Radix Toast.Viewport > ToastPrimitive.Root
export const NsbsNotificationItemContent: React.FC<NsbsNotificationItemProps> = ({
  id,
  type,
  title,
  description,
  onDismiss,
  action,
}) => {
  const styles = typeStyles[type];

  return (
    <div className={cn("w-full flex items-start p-4 space-x-3 rounded-lg shadow-2xl border-l-4", styles.borderColor, styles.bgColor)}>
      <div className={cn("flex-shrink-0 pt-0.5", styles.iconColor)}>
        {styles.icon}
      </div>
      <div className="flex-1">
        <ToastPrimitive.Title className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </ToastPrimitive.Title>
        {description && (
          <ToastPrimitive.Description className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {description}
          </ToastPrimitive.Description>
        )}
        {action && (
          <div className="mt-3">
             <NsbsButton variant="link" size="sm" onClick={action.onClick} className={cn("p-0 h-auto", styles.iconColor, "hover:underline")}>
              {action.label}
            </NsbsButton>
          </div>
        )}
      </div>
      <div className="flex-shrink-0">
        <ToastPrimitive.Close asChild>
          <button
            type="button"
            onClick={() => onDismiss?.(id)}
            className="inline-flex rounded-md p-1 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            aria-label="Dismiss notification"
          >
            <X className="h-5 w-5" />
          </button>
        </ToastPrimitive.Close>
      </div>
    </div>
  );
};

// Example Usage with Radix Toast (Provider setup would be in your app's root layout)
// const MyPage = () => {
//   const [open, setOpen] = React.useState(false);
//   return (
//     <ToastPrimitive.Provider swipeDirection="right">
//       <button onClick={() => setOpen(true)}>Show Notification</button>
//       <ToastPrimitive.Root open={open} onOpenChange={setOpen} className="radix-toast-root-class-if-any">
//         <NsbsNotificationItemContent
//           type="success"
//           title="Profile Updated!"
//           description="Your changes have been saved successfully."
//           onDismiss={() => setOpen(false)}
//         />
//       </ToastPrimitive.Root>
//       <ToastPrimitive.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-3 w-[380px] max-w-[100vw] m-0 z-[2147483647] outline-none" />
//     </ToastPrimitive.Provider>
//   );
// };

export default NsbsNotificationItemContent; // Exporting the content part, to be used within Radix Toast Root
