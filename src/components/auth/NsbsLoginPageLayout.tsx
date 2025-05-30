// src/components/auth/NsbsLoginPageLayout.tsx
// Developed by Luccas A E | 2025
// Purpose: Provides a specific visual structure for login and registration pages.
// Features: Centered content area (card-like), site branding/logo display, consistent background.
// UI/UX Focus: Creates a professional and focused environment for authentication tasks.
// Adherence to NSBS Principles: Simple, clean interface for a critical user flow.

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
// Assume a Link component from Next.js or your router
const Link = ({ href, children, className, ...props }: any) => <a href={href} className={className} {...props}>{children}</a>; // Placeholder

export interface NsbsLoginPageLayoutProps {
  children: ReactNode; // The authentication form (e.g., NsbsUserAuthForm)
  siteName?: string;
  logoUrl?: string; // Path to site logo
  tagline?: string;
  className?: string;
  cardClassName?: string;
}

export const NsbsLoginPageLayout: React.FC<NsbsLoginPageLayoutProps> = ({
  children,
  siteName = "NSBS Certification Platform",
  logoUrl = "/nsbs-logo-color.png", // Placeholder - ensure this asset exists
  tagline = "Unlock Your Professional Potential.",
  className,
  cardClassName,
}) => {
  return (
    <div className={cn("nsbs-login-page-layout min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8", className)}>
      <div className="w-full max-w-md space-y-8">
        <header className="text-center">
          <Link href="/" className="inline-block">
            <img
              className="mx-auto h-12 sm:h-16 w-auto"
              src={logoUrl}
              alt={`${siteName} Logo`}
            />
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {siteName}
          </h1>
          {tagline && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {tagline}
            </p>
          )}
        </header>
        
        <main className={cn("bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 sm:p-10 border border-gray-200 dark:border-gray-700", cardClassName)}>
            {children}
        </main>

        <footer className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
        </footer>
      </div>
    </div>
  );
};

export default NsbsLoginPageLayout;
