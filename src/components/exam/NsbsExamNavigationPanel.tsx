// src/components/exam/NsbsExamNavigationPanel.tsx
// Developed by Luccas A E | 2025
// Purpose: Provides a navigation panel for an exam, allowing users to see question status and jump to questions.
// Features: Grid of question numbers, visual status indicators (unanswered, answered, flagged for review), click to navigate.
// UI/UX Focus: Improves exam-taking experience by providing a clear overview and easy navigation for complex exams.
// Adherence to NSBS Principles: Supports a structured and clear assessment process.

'use client'; // For interactive state

import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility

export type QuestionStatus = 'unanswered' | 'answered' | 'flagged';

export interface ExamQuestionNavItem {
  questionNumber: number;
  status: QuestionStatus;
}

export interface NsbsExamNavigationPanelProps {
  questions: ExamQuestionNavItem[];
  currentQuestionNumber: number;
  onNavigateToQuestion: (questionNumber: number) => void;
  onFlagQuestion?: (questionNumber: number, isFlagged: boolean) => void; // Optional flagging
  className?: string;
  title?: string;
}

export const NsbsExamNavigationPanel: React.FC<NsbsExamNavigationPanelProps> = ({
  questions,
  currentQuestionNumber,
  onNavigateToQuestion,
  onFlagQuestion,
  className,
  title = "Exam Progress",
}) => {
  const getStatusClasses = (status: QuestionStatus, isCurrent: boolean): string => {
    let base = "border-2 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out";
    if (isCurrent) {
      base += " ring-2 ring-offset-1 dark:ring-offset-gray-800 ring-blue-500 dark:ring-blue-400 scale-110";
    }
    switch (status) {
      case 'answered':
        return cn(base, "bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-700 text-white hover:bg-green-600 dark:hover:bg-green-700");
      case 'flagged':
        return cn(base, "bg-yellow-400 dark:bg-yellow-500 border-yellow-500 dark:border-yellow-600 text-gray-800 dark:text-gray-900 hover:bg-yellow-500 dark:hover:bg-yellow-600");
      case 'unanswered':
      default:
        return cn(base, "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600");
    }
  };

  return (
    <div className={cn("nsbs-exam-navigation-panel bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700", className)}>
      {title && <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center sm:text-left">{title}</h3>}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5 sm:gap-2">
        {questions.map((q) => (
          <button
            key={q.questionNumber}
            onClick={() => onNavigateToQuestion(q.questionNumber)}
            className={getStatusClasses(q.status, q.questionNumber === currentQuestionNumber)}
            aria-label={`Go to question ${q.questionNumber}. Status: ${q.status}`}
            aria-current={q.questionNumber === currentQuestionNumber ? 'step' : undefined}
          >
            {q.questionNumber}
          </button>
        ))}
      </div>
      {onFlagQuestion && (
        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          You can flag questions for review later. (Flagging UI not part of this panel, handled by question display)
        </p>
      )}
    </div>
  );
};

export default NsbsExamNavigationPanel;
