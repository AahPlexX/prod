// src/components/admin/courses/editor/NsbsCourseContentEditorLayout.tsx
// Developed by Luccas A E | 2025
// Purpose: A layout component for the course content editing interface (e.g., lesson editor page).
// Features: Arranges the WYSIWYG editor, metadata input fields, and potentially a live preview panel.
// UI/UX Focus: Provides an efficient and ergonomic workspace for administrators to create and manage lesson content.
// Adherence to NSBS Principles: Supports the creation of high-quality, text-focused educational material.

import React, { ReactNode } from 'react';
import { NsbsPageHeader, NsbsPageHeaderProps } from '@/components/layout/NsbsPageHeader';
import { NsbsAdminFormWrapper } from '@/components/admin/shared/NsbsAdminFormWrapper'; // For save/cancel buttons
import { cn } from '@/lib/utils';

export interface NsbsCourseContentEditorLayoutProps {
  pageHeaderProps: NsbsPageHeaderProps;
  editorSlot: ReactNode; // Slot for the WYSIWYG editor (e.g., wysiwyg-editor.tsx from knowledge base)
  metadataSlot?: ReactNode; // Slot for lesson metadata form fields (title, order, etc.)
  previewSlot?: ReactNode; // Optional slot for a live preview of the content
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  saveButtonText?: string;
  className?: string;
  globalError?: string | null;
  lastSavedTimestamp?: string | null;
}

export const NsbsCourseContentEditorLayout: React.FC<NsbsCourseContentEditorLayoutProps> = ({
  pageHeaderProps,
  editorSlot,
  metadataSlot,
  previewSlot,
  onSave,
  onCancel,
  isSaving = false,
  saveButtonText = "Save Lesson Content",
  className,
  globalError,
  lastSavedTimestamp,
}) => {
  const formActions = (
    <>
        {lastSavedTimestamp && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-auto self-center">
                Last saved: {lastSavedTimestamp}
            </span>
        )}
        <NsbsButton type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
        </NsbsButton>
        <NsbsButton type="button" onClick={onSave} isLoading={isSaving} disabled={isSaving}>
            {saveButtonText}
        </NsbsButton>
    </>
  );

  return (
    <div className={cn("nsbs-course-content-editor-layout flex flex-col h-full overflow-hidden", className)}>
      <NsbsPageHeader {...pageHeaderProps} />
      
      {globalError && (
        <div className="p-4 m-4 sm:m-6 lg:m-8 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
          {globalError}
        </div>
      )}

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Main Content Area: Editor and Metadata */}
        <div className={cn("lg:col-span-2 space-y-6 flex flex-col", !previewSlot && "lg:col-span-3")}>
          {metadataSlot && (
            <section aria-labelledby="lesson-metadata-heading">
              <h2 id="lesson-metadata-heading" className="sr-only">Lesson Metadata</h2>
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                {metadataSlot}
              </div>
            </section>
          )}
          <section aria-labelledby="lesson-content-editor-heading" className="flex-grow flex flex-col">
            <h2 id="lesson-content-editor-heading" className="sr-only">Lesson Content Editor</h2>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 flex-grow flex flex-col">
              {/* Editor slot needs to handle its own internal height/scrolling if necessary */}
              {editorSlot}
            </div>
          </section>
        </div>

        {/* Optional Preview Panel */}
        {previewSlot && (
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <section aria-labelledby="lesson-preview-heading">
                <h2 id="lesson-preview-heading" className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Content Preview
                </h2>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 border border-gray-200 dark:border-gray-700 max-h-[70vh] overflow-y-auto">
                  {previewSlot}
                </div>
              </section>
            </div>
          </aside>
        )}
      </div>
      
      {/* Sticky Footer for Actions - might be better inside the form wrapper if that makes sense */}
      <footer className="flex-shrink-0 p-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-x-3">
           {lastSavedTimestamp && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-auto">
                    Last saved: {lastSavedTimestamp}
                </span>
            )}
            <NsbsButton type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                Cancel
            </NsbsButton>
            <NsbsButton type="button" onClick={onSave} isLoading={isSaving} disabled={isSaving}>
                {saveButtonText}
            </NsbsButton>
        </div>
      </footer>
    </div>
  );
};

export default NsbsCourseContentEditorLayout;
