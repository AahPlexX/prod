// src/components/exam/NsbsExamAnswerReviewItem.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays a single question from a completed exam, showing the question, options, user's answer, correct answer, and an optional explanation.
// Features: Clear visual distinction for correct/incorrect user answers, highlights correct option, displays rationale if provided.
// UI/UX Focus: Facilitates learning from past exam attempts by providing detailed feedback on each question.
// Adherence to NSBS Principles: Supports educational effectiveness by allowing review of exam performance.

import React from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ExamReviewOption {
  id: string; // e.g., 'A', 'B', 'C', 'D'
  text: string;
}

export interface NsbsExamAnswerReviewItemProps {
  questionNumber: number;
  questionText: string;
  options: ExamReviewOption[];
  userAnswerId?: string | null; // ID of the option the user selected
  correctAnswerId: string; // ID of the correct option
  explanation?: string | null; // Rationale for the correct answer
  className?: string;
}

export const NsbsExamAnswerReviewItem: React.FC<NsbsExamAnswerReviewItemProps> = ({
  questionNumber,
  questionText,
  options,
  userAnswerId,
  correctAnswerId,
  explanation,
  className,
}) => {
  const isUserCorrect = userAnswerId === correctAnswerId;

  return (
    <div
      className={cn(
        "nsbs-exam-answer-review-item p-5 sm:p-6 rounded-lg border bg-white dark:bg-gray-800",
        isUserCorrect ? "border-green-400 dark:border-green-600" : (userAnswerId ? "border-red-400 dark:border-red-600" : "border-gray-300 dark:border-gray-600"),
        className
      )}
    >
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Question {questionNumber}
        </p>
        {/* Assume questionText is pre-sanitized if HTML, or plain text */}
        <p className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white" dangerouslySetInnerHTML={{ __html: questionText }} />
      </div>

      <div className="space-y-3 mb-5">
        {options.map((option) => {
          const isThisUserAnswer = userAnswerId === option.id;
          const isThisCorrectAnswer = correctAnswerId === option.id;
          let optionStyle = "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300";
          let Icon: React.ElementType | null = null;

          if (isThisCorrectAnswer) {
            optionStyle = "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-medium ring-2 ring-green-500 dark:ring-green-400";
            Icon = CheckCircle;
          } else if (isThisUserAnswer && !isThisCorrectAnswer) {
            optionStyle = "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 font-medium ring-2 ring-red-500 dark:ring-red-400";
            Icon = XCircle;
          }

          return (
            <div
              key={option.id}
              className={cn(
                "flex items-center p-3 rounded-md border text-sm",
                optionStyle
              )}
            >
              {Icon && <Icon className={cn("h-5 w-5 mr-2.5 flex-shrink-0", isThisCorrectAnswer ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-300")} />}
              {!Icon && <div className="w-5 h-5 mr-2.5 flex-shrink-0" /> /* Placeholder for alignment */}
              {/* Assume option.text is pre-sanitized if HTML, or plain text */}
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: option.text }} />
            </div>
          );
        })}
      </div>

      {explanation && (
        <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-900/40 rounded-md border border-sky-200 dark:border-sky-700">
          <h4 className="text-sm font-semibold text-sky-800 dark:text-sky-200 mb-1.5 flex items-center">
            <HelpCircle className="w-4 h-4 mr-2 text-sky-600 dark:text-sky-300" />
            Explanation
          </h4>
          {/* Assume explanation is pre-sanitized if HTML, or plain text */}
          <p className="text-sm text-sky-700 dark:text-sky-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: explanation }}/>
        </div>
      )}
    </div>
  );
};

export default NsbsExamAnswerReviewItem;
