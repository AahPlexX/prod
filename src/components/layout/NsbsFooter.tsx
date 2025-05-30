// src/components/layout/NsbsFooter.tsx
// Developed by Luccas A E | 2025
// Purpose: Provides a consistent site footer with copyright information and optional navigation links.
// Features: Clean layout, copyright notice, potentially links to privacy policy, terms of service.
// UI/UX Focus: Unobtrusive, provides essential information, maintains brand consistency.
// Adherence to NSBS Principles: Professional, simple, and clear, without unnecessary clutter.

import React from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface NsbsFooterProps {
  siteName?: string;
  primaryLinks?: FooterLink[]; // e.g., About Us, Contact (if applicable per NSBS exclusions)
  secondaryLinks?: FooterLink[]; // e.g., Privacy Policy, Terms of Service
  customText?: string; // For specific disclaimers or additional info
}

export const NsbsFooter: React.FC<NsbsFooterProps> = ({
  siteName = "NSBS Certification Platform",
  primaryLinks = [ /* Default links can be added here if always present */ ],
  secondaryLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" }, // Example, ensure these pages exist if linked
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
  customText,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="nsbs-footer bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            {/* Social links are excluded per NSBS principles[cite: 389]. Placeholder for other icons if needed. */}
            {/* Example: A link to a help/support page if that exists and is allowed */}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} {siteName}. All rights reserved.
            </p>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
              Developed by Luccas A E | 2025
            </p>
          </div>
        </div>
        
        {(primaryLinks.length > 0 || secondaryLinks.length > 0) && (
            <nav className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6" aria-label="Footer navigation">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
                    {primaryLinks.map((link) => (
                        <a key={link.label} href={link.href} className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline">
                            {link.label}
                        </a>
                    ))}
                    {secondaryLinks.map((link) => (
                        <a key={link.label} href={link.href} className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline">
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>
        )}

        {customText && (
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            {customText}
          </p>
        )}
      </div>
    </footer>
  );
};

export default NsbsFooter;
