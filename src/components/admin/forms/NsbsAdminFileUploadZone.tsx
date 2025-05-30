// src/components/admin/forms/NsbsAdminFileUploadZone.tsx
// Developed by Luccas A E | 2025
// Purpose: Provides a drag-and-drop file upload zone for administrative tasks (e.g., bulk course import [cite: 58]).
// Features: Drag & drop functionality, file type validation (prop-driven), preview of selected file(s) (conceptual), progress indication (conceptual).
// UI/UX Focus: Intuitive file selection, clear visual feedback on hover and selection, error handling for invalid files.
// Adherence to NSBS Principles: Supports efficient admin operations for tasks like bulk data import.

'use client'; // Needs client-side interaction for drag/drop and file APIs

import React, { useState, useCallback, ChangeEvent, DragEvent, ReactNode } from 'react';
import { UploadCloud, FileText as FileIcon, XCircle, CheckCircle } from 'lucide-react';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { NsbsInteractiveProgressBar } from '@/components/ui/NsbsInteractiveProgressBar';
import { cn } from '@/lib/utils';

type FileValidationFunction = (file: File) => string | null; // Returns error message string or null if valid

export interface NsbsAdminFileUploadZoneProps {
  onFilesUploaded: (files: File[]) => Promise<void>; // Handler for when files are ready for upload
  acceptedFileTypes?: string; // e.g., '.csv, application/json, image/png'
  maxFileSizeMB?: number;
  multiple?: boolean;
  maxFiles?: number;
  customValidation?: FileValidationFunction;
  label?: string;
  uploadButtonText?: string;
  disabled?: boolean;
  className?: string;
}

interface UploadedFileState {
  file: File;
  preview?: string; // For image previews, if applicable
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number; // 0-100 for 'uploading' status
  errorMessage?: string;
}

export const NsbsAdminFileUploadZone: React.FC<NsbsAdminFileUploadZoneProps> = ({
  onFilesUploaded,
  acceptedFileTypes = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json, text/plain", // Example relevant for bulk course import
  maxFileSizeMB = 10,
  multiple = false,
  maxFiles = 1,
  customValidation,
  label = "Drag & drop files here, or click to select files",
  uploadButtonText = "Upload Files",
  disabled = false,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<UploadedFileState[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (maxFileSizeMB && file.size > maxFileSizeMB * 1024 * 1024) {
      return `File "${file.name}" exceeds maximum size of ${maxFileSizeMB}MB.`;
    }
    // Basic type validation from 'acceptedFileTypes' string
    if (acceptedFileTypes) {
        const typesArray = acceptedFileTypes.split(',').map(type => type.trim().toLowerCase());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const fileMimeType = file.type.toLowerCase();
        
        const isValidType = typesArray.some(type => {
            if (type.startsWith('.')) { // It's an extension
                return fileExtension === type;
            }
            if (type.includes('/')) { // It's a MIME type
                if (type.endsWith('/*')) { // Wildcard MIME type like image/*
                    return fileMimeType.startsWith(type.slice(0, -2));
                }
                return fileMimeType === type;
            }
            return false;
        });
        if (!isValidType) {
            return `File "${file.name}" has an invalid type. Accepted types: ${acceptedFileTypes}`;
        }
    }
    if (customValidation) {
      return customValidation(file);
    }
    return null;
  }, [acceptedFileTypes, maxFileSizeMB, customValidation]);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return;
    setGlobalError(null);
    const newFiles: File[] = Array.from(files);
    const processedFiles: UploadedFileState[] = [];
    let currentError: string | null = null;

    if (!multiple && newFiles.length > 1) {
        currentError = "Only a single file is allowed.";
    } else if (multiple && maxFiles && (selectedFiles.length + newFiles.length) > maxFiles) {
        currentError = `Cannot select more than ${maxFiles} files.`;
    }

    if (currentError) {
        setGlobalError(currentError);
        return;
    }

    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        currentError = error; // Show first error encountered for simplicity
        break;
      }
      processedFiles.push({ file, status: 'pending' });
    }

    if (currentError) {
        setGlobalError(currentError);
        setSelectedFiles([]); // Clear selection on error
    } else {
        setSelectedFiles(prev => multiple ? [...prev, ...processedFiles].slice(0, maxFiles || undefined) : processedFiles.slice(0,1));
    }
  }, [validateFile, multiple, maxFiles, selectedFiles.length]);

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
    e.stopPropagation();
    if (!disabled && !isDragging) setIsDragging(true);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFileChange(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
    e.target.value = ''; // Reset input to allow selecting the same file again
  };
  
  const removeFile = (fileName: string) => {
    setSelectedFiles(prev => prev.filter(f => f.file.name !== fileName));
    if (selectedFiles.length === 1 && globalError) setGlobalError(null); // Clear global error if last error-causing file is removed
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || disabled) return;
    
    // Set all to uploading (visual only, actual upload one by one or in parallel)
    setSelectedFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as 'uploading', progress: 0 })));

    const filesToUpload = selectedFiles.map(sf => sf.file);
    try {
      await onFilesUploaded(filesToUpload); // Parent handles actual upload logic
      // Parent should update status/progress of individual files if it wants granular feedback
      // For this component, we'll just mark all as success upon promise resolution for simplicity
      setSelectedFiles(prev => prev.map(f => ({ ...f, status: 'success' as 'success', progress: 100 })));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed.';
      setGlobalError(errorMessage);
      setSelectedFiles(prev => prev.map(f => ({ ...f, status: 'error' as 'error', errorMessage })));
    }
  };

  return (
    <div className={cn("nsbs-admin-file-upload-zone space-y-4", className)}>
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn(
          "relative block w-full border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-colors",
          disabled ? "bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed" : 
            isDragging ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30" :
            "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/30"
        )}
        onClick={() => !disabled && document.getElementById('file-upload-input')?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={label}
      >
        <UploadCloud className={cn("mx-auto h-10 w-10 sm:h-12 sm:w-12", isDragging ? "text-blue-600 dark:text-blue-300" : "text-gray-400 dark:text-gray-500")} />
        <span className={cn("mt-2 block text-sm font-medium", isDragging ? "text-blue-700 dark:text-blue-200" : "text-gray-700 dark:text-gray-300")}>
          {label}
        </span>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {acceptedFileTypes ? `Accepted: ${acceptedFileTypes}. ` : ""} Max size: {maxFileSizeMB}MB.
        </p>
        <input
          id="file-upload-input"
          type="file"
          className="sr-only"
          accept={acceptedFileTypes}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      {globalError && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
          {globalError}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Selected File(s):</h4>
          {selectedFiles.map((sf) => (
            <div key={sf.file.name} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
              <div className="flex items-center truncate">
                {sf.status === 'success' ? <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> : 
                 sf.status === 'error' ? <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" /> :
                 <FileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />}
                <span className="truncate text-gray-700 dark:text-gray-300" title={sf.file.name}>{sf.file.name}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({(sf.file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              {sf.status !== 'uploading' && sf.status !== 'success' && (
                <button type="button" onClick={() => removeFile(sf.file.name)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400" title="Remove file">
                  <XCircle className="w-5 h-5" />
                </button>
              )}
              {sf.status === 'uploading' && sf.progress !== undefined && (
                <div className="w-24 ml-2"> <NsbsInteractiveProgressBar value={sf.progress} size="sm" showPercentageText={false} /> </div>
              )}
            </div>
          ))}
          <NsbsButton
            onClick={handleUpload}
            disabled={selectedFiles.some(f => f.status === 'uploading' || f.status === 'success') || disabled}
            isLoading={selectedFiles.some(f => f.status === 'uploading')}
            className="w-full sm:w-auto"
          >
            {uploadButtonText}
          </NsbsButton>
        </div>
      )}
    </div>
  );
};

export default NsbsAdminFileUploadZone;
