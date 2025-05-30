// src/components/admin/system/NsbsAdminSystemInfoWidget.tsx
// Developed by Luccas A E | 2025
// Purpose: A widget for the admin system page to display key system information.
// Features: Shows data like platform version, environment, DB status (conceptual), last backup time.
// UI/UX Focus: Provides a quick overview of system health and configuration for administrators.
// Adherence to NSBS Principles: Supports administrative oversight of the platform[cite: 63, 65].

import React from 'react';
import { NsbsDataCard } from '@/components/common/NsbsDataCard';
import { NsbsLabeledData, LabeledDataPair } from '@/components/common/NsbsLabeledData';
import { Info, Server, Database, HardDrive, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SystemInfo {
  platformVersion?: string;
  environment?: 'development' | 'staging' | 'production' | string;
  nodeVersion?: string;
  nextJsVersion?: string;
  databaseStatus?: 'online' | 'offline' | 'degraded' | 'unknown';
  lastDatabaseBackup?: string | Date | null; // ISO string or Date
  // Add more specific info as needed
  additionalInfo?: LabeledDataPair[];
}

export interface NsbsAdminSystemInfoWidgetProps {
  systemInfo: SystemInfo;
  isLoading?: boolean;
  className?: string;
}

const formatDateNullable = (dateInput?: string | Date | null): string => {
  if (!dateInput) return 'N/A';
  try { return new Date(dateInput).toLocaleString(); }
  catch { return 'Invalid Date'; }
};

export const NsbsAdminSystemInfoWidget: React.FC<NsbsAdminSystemInfoWidgetProps> = ({
  systemInfo,
  isLoading = false,
  className,
}) => {
  const infoItems: LabeledDataPair[] = [
    ...(systemInfo.platformVersion ? [{ label: "Platform Version", value: systemInfo.platformVersion, icon: <Info className="w-4 h-4"/> }] : []),
    ...(systemInfo.environment ? [{ label: "Environment", value: <span className="font-semibold uppercase">{systemInfo.environment}</span>, icon: <Server className="w-4 h-4"/> }] : []),
    ...(systemInfo.nodeVersion ? [{ label: "Node.js Version", value: systemInfo.nodeVersion, icon: <Server className="w-4 h-4"/> }] : []),
    ...(systemInfo.nextJsVersion ? [{ label: "Next.js Version", value: systemInfo.nextJsVersion, icon: <Server className="w-4 h-4"/> }] : []),
    ...(systemInfo.databaseStatus ? [{ 
        label: "Database Status", 
        value: <span className={cn(
            "font-semibold",
            systemInfo.databaseStatus === 'online' && "text-green-600 dark:text-green-400",
            systemInfo.databaseStatus === 'offline' && "text-red-600 dark:text-red-400",
            systemInfo.databaseStatus === 'degraded' && "text-yellow-600 dark:text-yellow-400",
        )}>{systemInfo.databaseStatus.toUpperCase()}</span>,
        icon: <Database className="w-4 h-4"/> 
    }] : []),
    ...(systemInfo.lastDatabaseBackup !== undefined ? [{ label: "Last DB Backup", value: formatDateNullable(systemInfo.lastDatabaseBackup), icon: <HardDrive className="w-4 h-4"/> }] : []),
    ...(systemInfo.additionalInfo || []),
  ];
  
  if (isLoading) {
    return (
        <NsbsDataCard title="System Information" icon={<Info className="w-5 h-5 text-blue-600 dark:text-blue-400"/>} className={cn("animate-pulse", className)}>
            <div className="space-y-3">
                {Array.from({length: 5}).map((_,i) => <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md"></div>)}
            </div>
        </NsbsDataCard>
    );
  }

  return (
    <NsbsDataCard title="System Information" icon={<Info className="w-5 h-5 text-blue-600 dark:text-blue-400"/>} className={className}>
      {infoItems.length > 0 ? (
        <NsbsLabeledData data={infoItems} layout="grid" gridCols={1} dlClassName="sm:grid-cols-2" />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">System information is currently unavailable.</p>
      )}
    </NsbsDataCard>
  );
};

export default NsbsAdminSystemInfoWidget;
