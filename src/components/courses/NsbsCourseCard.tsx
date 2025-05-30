// src/components/courses/NsbsCourseCard.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays an individual course with rich details and interactive elements for course catalogs and dashboards.
// Features: Responsive design, hover effects, price display, tags (e.g., "NEW", "POPULAR"), call-to-action button.
// UI/UX Focus: Clear information hierarchy, engaging visuals, accessible for screen readers.
// Adherence to NSBS Principles: Focuses on clear presentation of course information, avoids distracting animations.

import React from 'react';
import { CreditCard, Zap, Eye } from 'lucide-react'; // Example icons

export interface NsbsCourseCardProps {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  imageUrl?: string; // Optional: NSBS is text-focused, but a small, relevant, static image might be permissible for branding/UI.
  // Example: imageUrl could be a generic icon for the course category if actual images are excluded.
  category: string;
  enrollmentLink: string;
  onViewDetails: (id: string) => void;
  tags?: string[];
  // For dashboard scenarios
  progressPercentage?: number; 
  isEnrolled?: boolean;
  continueLearningLink?: string;
}

export const NsbsCourseCard: React.FC<NsbsCourseCardProps> = ({
  id,
  title,
  description,
  priceCents,
  imageUrl,
  category,
  enrollmentLink,
  onViewDetails,
  tags,
  progressPercentage,
  isEnrolled = false,
  continueLearningLink,
}) => {
  const formattedPrice = `${(priceCents / 100).toFixed(2)}`;

  return (
    <div className="nsbs-course-card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={`Visual representation for ${title}`} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
          <span className="inline-block bg-sky-100 dark:bg-sky-700 text-sky-600 dark:text-sky-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            {category}
          </span>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
            {description}
          </p>
          {tags && tags.length > 0 && (
            <div className="mb-4">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-200 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {isEnrolled && progressPercentage !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
                aria-label={`Course progress: ${progressPercentage}%`}
              ></div>
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              ${formattedPrice}
            </p>
            <CreditCard className="h-7 w-7 text-gray-400 dark:text-gray-500" />
          </div>

          {isEnrolled ? (
            <a
              href={continueLearningLink || '#'}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              aria-label={`Continue learning ${title}`}
            >
              <Zap className="w-5 h-5 mr-2" /> Continue Learning
            </a>
          ) : (
            <div className="space-y-3">
              <a
                href={enrollmentLink}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label={`Enroll in ${title}`}
              >
                Enroll Now
              </a>
               <button
                onClick={() => onViewDetails(id)}
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                aria-label={`View details for ${title}`}
              >
                <Eye className="w-5 h-5 mr-2" /> View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NsbsCourseCard;
