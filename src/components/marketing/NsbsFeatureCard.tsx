// src/components/marketing/NsbsFeatureCard.tsx
// Developed by Luccas A E | 2025
// Purpose: A card component to highlight a specific feature or benefit of the NSBS platform or a course.
// Features: Icon, title, description, optional link/CTA. Designed for homepages or informational sections.
// UI/UX Focus: Visually engaging way to present key selling points or important information concisely.
// Adherence to NSBS Principles: Can be used to clearly communicate platform value propositions without hype.

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
// Assume a Link component from Next.js or your router
const Link = ({ href, children, className, ...props }: any) => <a href={href} className={className} {...props}>{children}</a>; // Placeholder
import { ArrowRight } from 'lucide-react';


export interface NsbsFeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  link?: {
    href: string;
    text: string;
    isExternal?: boolean;
  };
  className?: string;
  variant?: 'default' | 'outlined' | 'filled'; // Style variants
}

export const NsbsFeatureCard: React.FC<NsbsFeatureCardProps> = ({
  icon,
  title,
  description,
  link,
  className,
  variant = 'default',
}) => {
  const variantClasses: Record<typeof variant, string> = {
    default: "bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700",
    outlined: "bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-xl",
    filled: "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl",
  };

  return (
    <div className={cn("nsbs-feature-card p-6 text-center h-full flex flex-col", variantClasses[variant], className)}>
      {icon && (
        <div className={cn(
            "mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-5",
            variant === 'filled' ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        )}>
          {React.cloneElement(icon as React.ReactElement, { className: 'h-6 w-6' })}
        </div>
      )}
      <h3 className={cn(
          "text-lg sm:text-xl font-semibold mb-2",
          variant === 'filled' ? "text-blue-800 dark:text-blue-100" : "text-gray-900 dark:text-white"
        )}
      >
        {title}
      </h3>
      <p className={cn(
          "text-sm text-gray-600 dark:text-gray-300 flex-grow",
          variant === 'filled' && "dark:text-blue-200"
        )}
      >
        {description}
      </p>
      {link && (
        <div className="mt-6">
          <Link
            href={link.href}
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            className={cn(
              "inline-flex items-center text-sm font-medium group",
              variant === 'filled' ? "text-blue-700 dark:text-blue-200 hover:text-blue-800 dark:hover:text-blue-100" : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            )}
          >
            {link.text}
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NsbsFeatureCard;
