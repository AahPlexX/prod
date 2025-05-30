// src/components/user/dashboard/NsbsUserActivityListItem.tsx
// Developed by Luccas A E | 2025
// Purpose: Renders a single item in a user's activity list (e.g., for an admin viewing user history or a user's own simple activity log if ever implemented).
// Features: Displays activity type, description, timestamp, and an icon.
// UI/UX Focus: Clear, scannable presentation of individual activity records.
// Adherence to NSBS Principles: If used for admin, supports oversight. If for users, must be carefully considered against engagement metric exclusions. Currently more suited for admin user detail views.

import React, { ReactNode } from 'react';
import { ArrowRightCircle, CheckCircle, Award, Edit3, LogIn, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

// More specific activity types can be defined based on what's tracked
export type ActivityType = 
  | 'ENROLLMENT_CREATED' 
  | 'LESSON_COMPLETED' 
  | 'EXAM_STARTED' 
  | 'EXAM_SUBMITTED' 
  | 'CERTIFICATE_ISSUED'
  | 'PROFILE_UPDATED'
  | 'USER_LOGIN'
  | 'VOUCHER_PURCHASED'
  | 'VOUCHER_USED'
  | 'ADMIN_ACTION'; // Generic admin action

export interface NsbsUserActivityListItemProps {
  activity: {
    id: string;
    type: ActivityType;
    timestamp: string | Date;
    description: string; // e.g., "Enrolled in 'Advanced Business Strategy'" or "Completed lesson 'Market Analysis'"
    targetLink?: string; // Optional link to the related item (e.g., course, lesson, certificate)
    actor?: string; // For admin logs, who performed the action
  };
  className?: string;
}

const activityIconMap: Record<ActivityType, ReactNode> = {
  ENROLLMENT_CREATED: <BookOpen className="w-5 h-5 text-blue-500" />,
  LESSON_COMPLETED: <CheckCircle className="w-5 h-5 text-green-500" />,
  EXAM_STARTED: <Edit3 className="w-5 h-5 text-orange-500" />,
  EXAM_SUBMITTED: <CheckCircle className="w-5 h-5 text-purple-500" />,
  CERTIFICATE_ISSUED: <Award className="w-5 h-5 text-yellow-500" />,
  PROFILE_UPDATED: <User className="w-5 h-5 text-indigo-500" />,
  USER_LOGIN: <LogIn className="w-5 h-5 text-sky-500" />,
  VOUCHER_PURCHASED: <ArrowRightCircle className="w-5 h-5 text-teal-500" />,
  VOUCHER_USED: <CheckCircle className="w-5 h-5 text-lime-500" />,
  ADMIN_ACTION: <UserCog className="w-5 h-5 text-slate-500" />, // UserCog icon from another component
};

// Helper to format dates (should be centralized)
const formatActivityTimestamp = (timestamp: string | Date): string => {
  if (!timestamp) return 'N/A';
  try { return new Date(timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); }
  catch { return String(timestamp); }
};


export const NsbsUserActivityListItem: React.FC<NsbsUserActivityListItemProps> = ({
  activity,
  className,
}) => {
  const Icon = activityIconMap[activity.type] || <ArrowRightCircle className="w-5 h-5 text-gray-500" />;

  return (
    <li className={cn("nsbs-user-activity-list-item relative flex gap-x-4 py-3 px-1 items-start", className)}>
      <div className="relative mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        {Icon}
      </div>
      <div className="flex-auto">
        <p className="text-sm leading-6 text-gray-800 dark:text-gray-100">
          <span className="font-medium">{activity.actor ? `${activity.actor} ` : ''}</span>
          {activity.description}
        </p>
        <time dateTime={new Date(activity.timestamp).toISOString()} className="flex-none text-xs text-gray-500 dark:text-gray-400">
          {formatActivityTimestamp(activity.timestamp)}
        </time>
        {activity.targetLink && (
          <a href={activity.targetLink} className="mt-0.5 block text-xs text-blue-600 dark:text-blue-400 hover:underline">
            View Details
          </a>
        )}
      </div>
    </li>
  );
};

export default NsbsUserActivityListItem;
