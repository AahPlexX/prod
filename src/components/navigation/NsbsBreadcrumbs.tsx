// src/components/navigation/NsbsBreadcrumbs.tsx
// Developed by Luccas A E | 2025
// Purpose: A dedicated and dynamic breadcrumbs component for enhanced navigation hierarchy.
// Features: Customizable separator, icon support, generation from path or explicit list, ARIA labels for accessibility.
// UI/UX Focus: Clear navigational context, helps users understand their location within the site structure.
// Adherence to NSBS Principles: Supports intuitive navigation in a clean interface.

import React, { ReactNode } from 'react';
// Assume a Link component from Next.js or your router
// import Link from 'next/link';
const Link = ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>; // Placeholder

import { ChevronRight, Home } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils'; // Assuming cn utility

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface NsbsBreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  homeHref?: string; // Optional link for a "Home" icon at the start
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
}

export const NsbsBreadcrumbs: React.FC<NsbsBreadcrumbsProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />,
  homeHref = "/",
  className,
  itemClassName,
  activeItemClassName,
  separatorClassName,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("nsbs-breadcrumbs text-sm", className)}>
      <ol role="list" className="flex items-center space-x-1.5 sm:space-x-2">
        {homeHref && (
          <li className="flex items-center">
            <Link
              href={homeHref}
              className={cn("text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors", itemClassName)}
              title="Go to homepage"
            >
              <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
            {items.length > 0 && (
              <span className={cn("mx-1.5 sm:mx-2", separatorClassName)} aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        )}
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className={cn("text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors", itemClassName)}
              >
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "font-medium text-gray-700 dark:text-gray-200",
                  activeItemClassName || itemClassName // activeItemClassName takes precedence
                )}
                aria-current="page"
              >
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className={cn("mx-1.5 sm:mx-2", separatorClassName)} aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default NsbsBreadcrumbs;
