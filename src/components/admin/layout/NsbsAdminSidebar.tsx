// src/components/admin/layout/NsbsAdminSidebar.tsx
// Developed by Luccas A E | 2025
// Purpose: The main navigation sidebar for the NSBS administrative section.
// Features: Collapsible, sectioned links, active state highlighting, icons for menu items.
// UI/UX Focus: Easy navigation of admin functions, clear structure, responsive for smaller admin viewports (if needed).
// Adherence to NSBS Principles: Provides organized access to platform management tools.

import React, { ReactNode } from 'react';
// Assume a Link component from Next.js or your router
// import Link from 'next/link'; 
const Link = ({ href, children, className, ...props }: any) => <a href={href} className={className} {...props}>{children}</a>; // Placeholder

import { Home, BookCopy, Users, Award, BarChart3, Settings, DollarSign, ShieldAlert, FileCog } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminSidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
  isActive?: (pathname: string) => boolean; // Function to determine if link is active
  children?: AdminSidebarLink[]; // For nested menus
}

export interface NsbsAdminSidebarProps {
  logoUrl?: string; // Path to admin logo
  siteName?: string;
  pathname: string; // Current route pathname for active state
  isCollapsed?: boolean; // Controlled from parent if sidebar is collapsible
}

const adminNavLinks: AdminSidebarLink[] = [
  { href: '/admin', label: 'Dashboard', icon: <Home className="w-5 h-5" />, isActive: (p) => p === '/admin' },
  { 
    href: '/admin/courses', 
    label: 'Courses', 
    icon: <BookCopy className="w-5 h-5" />, 
    isActive: (p) => p.startsWith('/admin/courses') 
  },
  { 
    href: '/admin/users', 
    label: 'Users', 
    icon: <Users className="w-5 h-5" />, 
    isActive: (p) => p.startsWith('/admin/users') 
  },
  { 
    href: '/admin/certificates', 
    label: 'Certificates', 
    icon: <Award className="w-5 h-5" />, 
    isActive: (p) => p.startsWith('/admin/certificates') 
  },
  { 
    href: '/admin/payments', 
    label: 'Payments', 
    icon: <DollarSign className="w-5 h-5" />, 
    isActive: (p) => p.startsWith('/admin/payments') 
  },
  { 
    href: '/admin/analytics', 
    label: 'Analytics', 
    icon: <BarChart3 className="w-5 h-5" />, 
    isActive: (p) => p.startsWith('/admin/analytics') 
  },
  { 
    href: '/admin/system', 
    label: 'System', 
    icon: <FileCog className="w-5 h-5" />, 
    isActive: (p) => p.startsWith('/admin/system'),
    // Example children (sub-menu)
    // children: [
    //   { href: '/admin/system/settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, isActive: (p) => p === '/admin/system/settings' },
    //   { href: '/admin/system/logs', label: 'Logs', icon: <ShieldAlert className="w-4 h-4" />, isActive: (p) => p === '/admin/system/logs' },
    // ]
  },
];


export const NsbsAdminSidebar: React.FC<NsbsAdminSidebarProps> = ({
  logoUrl = "/nsbs-admin-logo.png", // Placeholder
  siteName = "NSBS Admin",
  pathname,
  isCollapsed = false,
}) => {
  return (
    <aside
      className={cn(
        "nsbs-admin-sidebar flex flex-col bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
      aria-label="Admin main navigation"
    >
      <div className={cn("flex items-center h-16 border-b border-gray-700 px-4 shrink-0", isCollapsed ? "justify-center" : "justify-start")}>
        <img src={logoUrl} alt={`${siteName} Logo`} className={cn("h-8 w-auto", isCollapsed ? "" : "mr-3")} />
        {!isCollapsed && <span className="text-xl font-semibold whitespace-nowrap">{siteName}</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "flex items-center rounded-md text-sm font-medium transition-colors group",
              link.isActive && link.isActive(pathname)
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white",
              isCollapsed ? "justify-center h-12" : "px-3 py-2.5"
            )}
            title={isCollapsed ? link.label : undefined} // Show full label on hover when collapsed
            aria-current={link.isActive && link.isActive(pathname) ? 'page' : undefined}
          >
            <span className={cn(isCollapsed ? "" : "mr-3")}>{link.icon}</span>
            {!isCollapsed && <span className="truncate">{link.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Optional: User profile / logout section at the bottom */}
      {/* <div className="mt-auto p-4 border-t border-gray-700"> ... </div> */}
    </aside>
  );
};

export default NsbsAdminSidebar;
