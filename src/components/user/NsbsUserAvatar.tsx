// src/components/user/NsbsUserAvatar.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays a user's avatar, falling back to initials or a generic icon if no image is available.
// Features: Customizable size, shape (circle/square), optional status indicator, dropdown menu for profile/logout (Radix DropdownMenu).
// UI/UX Focus: Provides clear user identification, consistent visual representation.
// Adherence to NSBS Principles: Subtle user identification, not a social profile focus.

import React, { ReactNode } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { User as UserIcon, LogOut, Settings } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils'; // Assuming cn utility
// Assume a Link component from Next.js or your router
const Link = ({ href, children, className, ...props }: any) => <a href={href} className={className} {...props}>{children}</a>; // Placeholder


export interface AvatarMenuItem {
  label: string;
  icon?: ReactNode;
  href?: string; // For navigation links
  onClick?: () => void; // For actions
  isSeparator?: boolean;
}
export interface NsbsUserAvatarProps {
  src?: string | null;
  name?: string | null; // Used for fallback initials and alt text
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  className?: string;
  status?: 'online' | 'offline' | 'away'; // Optional status indicator
  menuItems?: AvatarMenuItem[]; // For dropdown menu
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const getInitials = (name?: string | null): string => {
  if (!name) return '';
  const names = name.split(' ');
  let initials = names[0] ? names[0][0] : '';
  if (names.length > 1 && names[names.length - 1]) {
    initials += names[names.length - 1][0];
  }
  return initials.toUpperCase();
};

export const NsbsUserAvatar: React.FC<NsbsUserAvatarProps> = ({
  src,
  name,
  size = 'md',
  shape = 'circle',
  className,
  status,
  menuItems = [ // Default menu items if none provided, adjust as per NSBS user auth flow
    { label: 'Profile', href: '/dashboard/profile', icon: <Settings className="w-4 h-4 mr-2" /> }, // Example path
    { isSeparator: true },
    { label: 'Logout', onClick: () => { /* Implement logout logic via props or context */ alert('Logout clicked'); }, icon: <LogOut className="w-4 h-4 mr-2" /> },
  ],
}) => {
  const avatarContent = (
    <AvatarPrimitive.Root
      className={cn(
        "nsbs-user-avatar relative inline-flex select-none items-center justify-center overflow-hidden align-middle",
        sizeClasses[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-md',
        className
      )}
    >
      <AvatarPrimitive.Image
        src={src || undefined} // Pass undefined if src is null/empty to trigger fallback
        alt={name ? `Avatar of ${name}` : 'User avatar'}
        className="h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        delayMs={300} // Delay before showing fallback if image fails to load
        className={cn(
          "flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700 font-medium text-gray-700 dark:text-gray-300",
          sizeClasses[size] // Ensure fallback text size matches avatar size
        )}
      >
        {name ? getInitials(name) : <UserIcon className={cn(size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6')} />}
      </AvatarPrimitive.Fallback>
      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900",
            status === 'online' && 'bg-green-500',
            status === 'offline' && 'bg-gray-400',
            status === 'away' && 'bg-yellow-400',
            size === 'sm' ? 'h-2 w-2' : '',
            size === 'lg' ? 'h-3 w-3' : ''
          )}
          title={`Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
        />
      )}
    </AvatarPrimitive.Root>
  );

  if (menuItems && menuItems.length > 0) {
    return (
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button type="button" aria-label="User menu" className={cn(shape === 'circle' ? 'rounded-full' : 'rounded-md', 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800')}>
            {avatarContent}
          </button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            align="end"
            sideOffset={5}
            className={cn(
              "z-50 min-w-[12rem] overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 text-gray-900 dark:text-gray-100 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {menuItems.map((item, index) => 
              item.isSeparator ? (
                <DropdownMenuPrimitive.Separator key={index} className="h-px my-1 bg-gray-200 dark:bg-gray-700" />
              ) : (
                <DropdownMenuPrimitive.Item
                  key={item.label || index}
                  asChild={!!item.href}
                  onSelect={item.onClick ? (e) => { e.preventDefault(); item.onClick?.(); } : undefined}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                    "focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  )}
                >
                  {item.href ? (
                    <Link href={item.href}>
                      {item.icon}{item.label}
                    </Link>
                  ) : (
                    <button type="button" className="flex items-center w-full">
                      {item.icon}{item.label}
                    </button>
                  )}
                </DropdownMenuPrimitive.Item>
              )
            )}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    );
  }

  return avatarContent;
};

export default NsbsUserAvatar;
