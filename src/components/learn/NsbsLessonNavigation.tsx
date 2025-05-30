// src/components/learn/NsbsLessonNavigation.tsx
// Developed by Luccas A E | 2025
// Purpose: Provides a collapsible, interactive sidebar for navigating course modules and lessons.
// Features: Displays modules, lessons with completion status, highlights current lesson, sequential unlocking logic (props-driven), responsive.
// UI/UX Focus: Intuitive navigation, clear progress indication, smooth transitions, keyboard accessible.
// Adherence to NSBS Principles: Facilitates self-paced learning by providing clear structure, text-focused.

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Lock, BookOpen } from 'lucide-react'; // Example icons

export interface LessonItem {
  id: string;
  title: string;
  isCompleted: boolean;
  isAccessible: boolean; // Based on sequential completion of previous lessons/modules
}

export interface ModuleItem {
  id: string;
  title: string;
  lessons: LessonItem[];
  isCompleted: boolean; // True if all its lessons are completed
  isAccessible: boolean; // Based on completion of previous modules
  orderIndex: number;
}

export interface NsbsLessonNavigationProps {
  courseTitle: string;
  modules: ModuleItem[];
  currentLessonId?: string;
  onLessonClick: (lessonId: string) => void;
  courseProgressPercentage: number;
}

export const NsbsLessonNavigation: React.FC<NsbsLessonNavigationProps> = ({
  courseTitle,
  modules,
  currentLessonId,
  onLessonClick,
  courseProgressPercentage,
}) => {
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  // Initially open the module containing the current lesson
  React.useEffect(() => {
    if (currentLessonId) {
      const currentModule = modules.find(module => module.lessons.some(lesson => lesson.id === currentLessonId));
      if (currentModule && !openModules.has(currentModule.id)) {
        setOpenModules(prev => new Set(prev).add(currentModule.id));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLessonId, modules]); // Only run when currentLessonId or modules change

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  return (
    <aside className="nsbs-lesson-navigation w-full md:w-80 lg:w-96 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full p-4" aria-label="Course Navigation">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate" title={courseTitle}>
          {courseTitle}
        </h2>
        <div className="mt-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Overall Progress</span>
            <span>{courseProgressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${courseProgressPercentage}%` }}
              aria-valuenow={courseProgressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
              aria-label={`Course progress: ${courseProgressPercentage}%`}
            ></div>
          </div>
        </div>
      </div>

      <nav className="flex-grow overflow-y-auto space-y-2 pr-1">
        {modules.sort((a, b) => a.orderIndex - b.orderIndex).map((module) => (
          <div key={module.id} className="py-1">
            <button
              onClick={() => module.isAccessible && toggleModule(module.id)}
              disabled={!module.isAccessible}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg transition-colors
                          ${module.isAccessible 
                            ? 'hover:bg-gray-200 dark:hover:bg-gray-700 focus:bg-gray-200 dark:focus:bg-gray-700' 
                            : 'opacity-50 cursor-not-allowed'}
                          ${openModules.has(module.id) && module.isAccessible ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}
              aria-expanded={openModules.has(module.id)}
              aria-controls={`module-content-${module.id}`}
            >
              <span className="flex items-center">
                {!module.isAccessible ? (
                  <Lock className="w-4 h-4 mr-2.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                ) : module.isCompleted ? (
                  <CheckCircle className="w-4 h-4 mr-2.5 text-green-500 dark:text-green-400 flex-shrink-0" />
                ) : (
                  openModules.has(module.id) ? 
                  <ChevronDown className="w-4 h-4 mr-2.5 text-gray-500 dark:text-gray-400 flex-shrink-0" /> :
                  <ChevronRight className="w-4 h-4 mr-2.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                )}
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate" title={module.title}>
                  {module.title}
                </span>
              </span>
              {module.isAccessible && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {module.lessons.filter(l => l.isCompleted).length}/{module.lessons.length}
                </span>
              )}
            </button>
            {module.isAccessible && openModules.has(module.id) && (
              <ul id={`module-content-${module.id}`} className="mt-1 space-y-0.5 pl-4 border-l-2 border-gray-200 dark:border-gray-600 ml-3.5">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (lesson.isAccessible) {
                          onLessonClick(lesson.id);
                        }
                      }}
                      className={`flex items-center pl-5 pr-3 py-2.5 text-sm rounded-md group transition-colors
                                  ${!lesson.isAccessible 
                                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                                    : currentLessonId === lesson.id 
                                      ? 'bg-blue-100 dark:bg-blue-700/60 text-blue-700 dark:text-blue-200 font-medium' 
                                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}
                                `}
                      aria-current={currentLessonId === lesson.id ? 'page' : undefined}
                      aria-disabled={!lesson.isAccessible}
                    >
                      {lesson.isAccessible ? (
                        lesson.isCompleted ? (
                          <CheckCircle className="w-3.5 h-3.5 mr-2.5 text-green-500 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <BookOpen className="w-3.5 h-3.5 mr-2.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 flex-shrink-0" />
                        )
                      ) : (
                        <Lock className="w-3.5 h-3.5 mr-2.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      )}
                      <span className="truncate" title={lesson.title}>{lesson.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default NsbsLessonNavigation;
