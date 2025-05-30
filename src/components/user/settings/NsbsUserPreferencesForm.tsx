// src/components/user/settings/NsbsUserPreferencesForm.tsx
// Developed by Luccas A E | 2025
// Purpose: A form for users to manage their preferences (e.g., theme, notification settings).
// Features: Uses NsbsSettingsToggle for theme, potentially other controls for future preferences.
// UI/UX Focus: Clear and simple interface for users to customize their platform experience where appropriate.
// Adherence to NSBS Principles: Focuses on essential, non-distracting preferences (like theme for accessibility).

'use client';

import React, { FormEvent } from 'react';
import { useNsbsTheme, Theme } from '@/components/theme/NsbsThemeProvider'; // Assuming this path
import { NsbsSettingsToggle } from '@/components/settings/NsbsSettingsToggle';
import { NsbsButton } from '@/components/ui/NsbsButton';
import { NsbsFormSection } from '@/components/forms/NsbsFormSection';
import { Palette, Bell } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';

// Example notification preferences - can be expanded
export interface UserNotificationPreferences {
  courseUpdates?: boolean; // e.g., new lesson added to enrolled course
  platformAnnouncements?: boolean; // Major NSBS platform news
}

export interface UserPreferences {
  theme: Theme;
  notifications: UserNotificationPreferences;
}

export interface NsbsUserPreferencesFormProps {
  initialPreferences: UserPreferences;
  onSavePreferences: (preferences: UserPreferences) => Promise<boolean>; // Returns true on success
  isSaving?: boolean;
  className?: string;
}

export const NsbsUserPreferencesForm: React.FC<NsbsUserPreferencesFormProps> = ({
  initialPreferences,
  onSavePreferences,
  isSaving = false,
  className,
}) => {
  const { theme: currentContextTheme, setTheme: setContextTheme, availableThemes } = useNsbsTheme();
  // Form state should manage selected theme before saving to context/backend
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>(initialPreferences.theme || currentContextTheme);
  const [notificationPrefs, setNotificationPrefs] = React.useState<UserNotificationPreferences>(initialPreferences.notifications || {});

  const [feedback, setFeedback] = React.useState<{type: 'success' | 'error', message: string} | null>(null);

  // Sync form state if initialPreferences prop changes
  React.useEffect(() => {
    setSelectedTheme(initialPreferences.theme || currentContextTheme);
    setNotificationPrefs(initialPreferences.notifications || {});
  }, [initialPreferences, currentContextTheme]);


  const handleThemeChange = (themeId: Theme) => {
    setSelectedTheme(themeId);
  };

  const handleNotificationToggle = (key: keyof UserNotificationPreferences, checked: boolean) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: checked }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    const newPreferences: UserPreferences = { theme: selectedTheme, notifications: notificationPrefs };
    const success = await onSavePreferences(newPreferences);
    if (success) {
      setContextTheme(selectedTheme); // Update global theme context on successful save
      setFeedback({type: 'success', message: 'Preferences saved successfully!'});
    } else {
      setFeedback({type: 'error', message: 'Failed to save preferences. Please try again.'});
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("nsbs-user-preferences-form space-y-8", className)}>
      {feedback && (
         <div className={cn(
          "p-3 rounded-md text-sm",
          feedback.type === 'success' ? "bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-200" : 
                                              "bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-200"
        )}>
          {feedback.message}
        </div>
      )}

      <NsbsFormSection title="Appearance" description="Customize the look and feel of the platform.">
        <div className="space-y-2">
          <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <Palette className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            Select Theme
          </label>
          <select
            id="theme-select"
            value={selectedTheme}
            onChange={(e) => handleThemeChange(e.target.value as Theme)}
            disabled={isSaving}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50"
          >
            {availableThemes.map(th => (
              <option key={th.id} value={th.id}>{th.name}</option>
            ))}
          </select>
        </div>
      </NsbsFormSection>

      {/* Example Notification Preferences Section - Expand as needed */}
      <NsbsFormSection 
        title="Notifications" 
        description="Manage your email notification preferences."
        hasBorder={true}
      >
        <NsbsSettingsToggle
          id="notif-course-updates"
          label="Course Updates"
          description="Receive email notifications about new lessons or updates to your enrolled courses."
          checked={!!notificationPrefs.courseUpdates}
          onCheckedChange={(checked) => handleNotificationToggle('courseUpdates', checked)}
          disabled={isSaving}
        />
        <NsbsSettingsToggle
          id="notif-platform-announcements"
          label="Platform Announcements"
          description="Receive occasional emails about important NSBS platform news or updates."
          checked={!!notificationPrefs.platformAnnouncements}
          onCheckedChange={(checked) => handleNotificationToggle('platformAnnouncements', checked)}
          disabled={isSaving}
        />
      </NsbsFormSection>


      <div className="flex justify-end pt-5">
        <NsbsButton type="submit" variant="default" isLoading={isSaving} disabled={isSaving}>
          Save Preferences
        </NsbsButton>
      </div>
    </form>
  );
};

export default NsbsUserPreferencesForm;
