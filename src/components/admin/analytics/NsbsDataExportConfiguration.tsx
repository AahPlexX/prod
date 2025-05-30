// src/components/admin/analytics/NsbsDataExportConfiguration.tsx
// Developed by Luccas A E | 2025
// Purpose: UI for configuring and initiating data exports from the admin analytics section.
// Features: Select data type (e.g., users, enrollments, payments), date range, export format (CSV, JSON - conceptual).
// UI/UX Focus: Clear options for data export, intuitive process for administrators to retrieve platform data.
// Adherence to NSBS Principles: Supports administrative needs for data analysis and record-keeping.

'use client';

import React, { useState, FormEvent } from 'react';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { DownloadCloud, Calendar, ListFilter, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
// Assume a date range picker component might be used, or simple date inputs.
// For this example, we'll use basic date inputs.

export type ExportDataType = 'users' | 'enrollments' | 'payments' | 'courses' | 'certificates' | 'all_analytics';
export type ExportFormat = 'csv' | 'json'; // PDF might be more complex, report generation

export interface DataExportOptions {
  dataType: ExportDataType;
  format: ExportFormat;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  // Add more specific filters as needed per dataType
}

export interface NsbsDataExportConfigurationProps {
  availableDataTypes: Array<{ value: ExportDataType; label: string }>;
  availableFormats: Array<{ value: ExportFormat; label: string }>;
  onExport: (options: DataExportOptions) => Promise<void>; // Handler to initiate export
  isExporting?: boolean;
  className?: string;
  defaultOptions?: Partial<DataExportOptions>;
}

export const NsbsDataExportConfiguration: React.FC<NsbsDataExportConfigurationProps> = ({
  availableDataTypes,
  availableFormats,
  onExport,
  isExporting = false,
  className,
  defaultOptions = { dataType: availableDataTypes[0]?.value, format: availableFormats[0]?.value },
}) => {
  const [dataType, setDataType] = useState<ExportDataType>(defaultOptions.dataType || availableDataTypes[0]?.value);
  const [format, setFormat] = useState<ExportFormat>(defaultOptions.format || availableFormats[0]?.value);
  const [dateFrom, setDateFrom] = useState<string>(defaultOptions.dateFrom || '');
  const [dateTo, setDateTo] = useState<string>(defaultOptions.dateTo || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
        setError("'Date From' cannot be after 'Date To'.");
        return;
    }
    const options: DataExportOptions = { dataType, format, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined };
    await onExport(options);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("nsbs-data-export-config space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700", className)}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
        <ListFilter className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        Configure Data Export
      </h3>

      {error && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Data Type Selection */}
      <div>
        <label htmlFor="export-data-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Type</label>
        <select
          id="export-data-type"
          value={dataType}
          onChange={(e) => setDataType(e.target.value as ExportDataType)}
          disabled={isExporting}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50"
        >
          {availableDataTypes.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
        </select>
      </div>

      {/* Date Range Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="export-date-from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400"/> Date From (Optional)
          </label>
          <input
            type="date"
            id="export-date-from"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            disabled={isExporting}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50"
          />
        </div>
        <div>
          <label htmlFor="export-date-to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400"/> Date To (Optional)
          </label>
          <input
            type="date"
            id="export-date-to"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            disabled={isExporting}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50"
          />
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <label htmlFor="export-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <FileText className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400"/> Export Format
        </label>
        <select
          id="export-format"
          value={format}
          onChange={(e) => setFormat(e.target.value as ExportFormat)}
          disabled={isExporting}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50"
        >
          {availableFormats.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      <div className="pt-5">
        <NsbsButton
          type="submit"
          variant="default"
          isLoading={isExporting}
          disabled={isExporting}
          className="w-full sm:w-auto"
          iconLeft={<DownloadCloud className="w-4 h-4"/>}
        >
          {isExporting ? "Exporting Data..." : "Start Export"}
        </NsbsButton>
      </div>
    </form>
  );
};

export default NsbsDataExportConfiguration;
