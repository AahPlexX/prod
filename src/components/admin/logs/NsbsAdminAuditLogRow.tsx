// src/components/admin/logs/NsbsAdminAuditLogRow.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays a single row in a system audit log table, formatted for readability and clarity.
// Features: Clearly presents timestamp, user, action, target resource, and status/details of a log entry.
// UI/UX Focus: Easy scanning of log information, highlights important details, helps in tracing administrative actions.
// Adherence to NSBS Principles: Supports platform integrity and accountability for administrative tasks[cite: 65].

import React, { ReactNode } from 'react';
import { User, Edit3, Trash2, ShieldCheck, Info, AlertCircle } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';
import { NsbsAccessibleTooltip } from '@/components/ui/NsbsAccessibleTooltip'; // Assuming this component

// Define a more specific type for Audit Log Entries
// This would typically match your database schema or API response for audit logs.
export interface AuditLogEntry {
  id: string;
  timestamp: string | Date; // ISO string or Date object
  actor?: { // User performing the action
    id?: string;
    name?: string; // e.g., "Admin User", "System"
    email?: string;
  } | string; // Could be just a name string like "System"
  action: string; // e.g., "COURSE_CREATED", "USER_ROLE_UPDATED", "CERTIFICATE_REVOKED"
  target?: {
    type?: string; // e.g., "Course", "User", "Certificate"
    id?: string;
    name?: string; // e.g., Course Title, User Email
  };
  details?: string | Record<string, any>; // Additional JSON details or a summary string
  status?: 'SUCCESS' | 'FAILURE' | 'PENDING' | 'INFO';
  ipAddress?: string;
}

export interface NsbsAdminAuditLogRowProps {
  logEntry: AuditLogEntry;
  // Props for custom rendering or actions can be added if needed
}

// Helper to format date - use date-fns in a real app (dependency in package.json [cite: 306])
const formatLogTimestamp = (timestamp: string | Date): string => {
  try {
    return new Date(timestamp).toLocaleString(undefined, { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  } catch {
    return String(timestamp);
  }
};

// Helper to get an icon based on action or status
const getActionIcon = (action: string, status?: string): ReactNode => {
  if (status === 'FAILURE') return <AlertCircle className="w-4 h-4 text-red-500" />;
  if (action.includes('DELETE') || action.includes('REVOKED')) return <Trash2 className="w-4 h-4 text-orange-600" />;
  if (action.includes('UPDATE') || action.includes('EDIT')) return <Edit3 className="w-4 h-4 text-blue-600" />;
  if (action.includes('CREATE') || action.includes('ISSUED')) return <ShieldCheck className="w-4 h-4 text-green-600" />;
  if (action.includes('LOGIN') || action.includes('USER')) return <User className="w-4 h-4 text-indigo-600" />;
  return <Info className="w-4 h-4 text-gray-500" />;
};

export const NsbsAdminAuditLogRow: React.FC<NsbsAdminAuditLogRowProps> = ({ logEntry }) => {
  const actorDisplay = typeof logEntry.actor === 'string' 
    ? logEntry.actor 
    : logEntry.actor?.name || logEntry.actor?.email || logEntry.actor?.id || 'N/A';
  
  const targetDisplay = logEntry.target?.name || 
                        (logEntry.target?.type && logEntry.target?.id ? `${logEntry.target.type} (${logEntry.target.id})` : 
                         logEntry.target?.id || 'N/A');

  let detailsNode: ReactNode = null;
  if (typeof logEntry.details === 'string') {
    detailsNode = <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={logEntry.details}>{logEntry.details}</p>;
  } else if (typeof logEntry.details === 'object' && logEntry.details !== null) {
    // Simple display for object details, could be more sophisticated
    const detailString = JSON.stringify(logEntry.details, null, 2);
    detailsNode = (
      <NsbsAccessibleTooltip content={<pre className="text-xs max-w-xs whitespace-pre-wrap">{detailString}</pre>}>
        <span className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-help">View Details</span>
      </NsbsAccessibleTooltip>
    );
  }
  
  const statusColors: Record<string, string> = {
    SUCCESS: "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300",
    FAILURE: "bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300",
    PENDING: "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300",
    INFO: "bg-blue-100 dark:bg-blue-700/30 text-blue-700 dark:text-blue-300",
  };


  // This component is meant to be a <tr> or a set of <td>s within NsbsAdminTable or similar.
  // For standalone usage, we'll wrap it in a div for now, but ideally it contributes cells to a table.
  // Let's assume this is used to render custom cells within NsbsAdminTable.
  // The output will be an array of ReactNodes representing table cells.
  // Alternatively, it can be a full <tr> if used directly. For flexibility:

  return (
    <>
      <td className="whitespace-nowrap py-3 px-3 text-xs text-gray-600 dark:text-gray-400">
        {formatLogTimestamp(logEntry.timestamp)}
      </td>
      <td className="whitespace-nowrap py-3 px-3 text-xs">
        <div className="flex items-center gap-1.5">
            {typeof logEntry.actor === 'object' && logEntry.actor !== null && <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"/> }
            <span className="font-medium text-gray-800 dark:text-gray-200 truncate" title={typeof logEntry.actor === 'object' ? logEntry.actor?.email || actorDisplay : actorDisplay}>
                {actorDisplay}
            </span>
        </div>
      </td>
      <td className="whitespace-nowrap py-3 px-3 text-xs">
        <div className="flex items-center gap-1.5">
          {getActionIcon(logEntry.action, logEntry.status)}
          <span className="text-gray-700 dark:text-gray-300">{logEntry.action.replace(/_/g, ' ').toLocaleLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
        </div>
      </td>
      <td className="whitespace-nowrap py-3 px-3 text-xs text-gray-600 dark:text-gray-400 truncate" title={targetDisplay}>
        {targetDisplay}
      </td>
      <td className="py-3 px-3 text-xs">
        {logEntry.status && (
            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", statusColors[logEntry.status] || "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200")}>
                {logEntry.status}
            </span>
        )}
      </td>
      <td className="py-3 px-3 text-xs text-gray-600 dark:text-gray-400">
        {detailsNode || logEntry.ipAddress || 'N/A'} 
        {detailsNode && logEntry.ipAddress && <span className="text-gray-400 dark:text-gray-500 block mt-0.5 text-[0.7rem]">IP: {logEntry.ipAddress}</span>}
      </td>
    </>
  );
};

// To use NsbsAdminAuditLogRow with NsbsAdminTable, you'd configure columns:
// const auditLogColumns: ColumnDefinition<AuditLogEntry>[] = [
//   { key: 'timestamp', header: 'Timestamp', render: (item) => formatLogTimestamp(item.timestamp) },
//   { key: 'actor', header: 'Actor', render: (item) => typeof item.actor === 'string' ? item.actor : item.actor?.name || item.actor?.email || 'N/A' },
//   { key: 'action', header: 'Action' },
//   { key: 'target', header: 'Target', render: (item) => item.target?.name || item.target?.id || 'N/A' },
//   { key: 'status', header: 'Status', render: (item) => item.status ? <span className={...}>{item.status}</span> : null },
//   { key: 'details', header: 'Details/IP', render: (item) => item.details ? String(item.details).substring(0,50) : item.ipAddress },
// ];
// <NsbsAdminTable columns={auditLogColumns} data={logData} />
// OR, a more direct rendering:
// {logData.map(log => <tr key={log.id}><NsbsAdminAuditLogRow logEntry={log} /></tr>)}

export default NsbsAdminAuditLogRow;
