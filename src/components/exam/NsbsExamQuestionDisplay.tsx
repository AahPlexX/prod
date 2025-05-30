// src/components/exam/NsbsExamQuestionDisplay.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays a single multiple-choice exam question and handles user answer selection.
// Features: Clear question presentation, radio button options, selected state, accessibility for inputs.
// UI/UX Focus: Minimizes cognitive load, easy selection, clear feedback on interaction.
// Adherence to NSBS Principles: Text-focused, distraction-free assessment item.

import React from 'react';

export interface ExamOption {
  id: string; // e.g., 'A', 'B', 'C', 'D'
  text: string;
}

export interface NsbsExamQuestionDisplayProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: ExamOption[];
  selectedAnswer?: string; // The id of the selected option
  onAnswerSelect: (optionId: string) => void;
  isReviewMode?: boolean; // If true, disable inputs and show correct/incorrect answers
  correctAnswer?: string; // Option ID of the correct answer, for review mode
  userAnswer?: string; // User's submitted answer, for review mode
}

export const NsbsExamQuestionDisplay: React.FC<NsbsExamQuestionDisplayProps> = ({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedAnswer,
  onAnswerSelect,
  isReviewMode = false,
  correctAnswer,
  userAnswer,
}) => {
  return (
    <div className="nsbs-exam-question bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
          Question {questionNumber} of {totalQuestions}
        </p>
        {/* Using dangerouslySetInnerHTML for rich text questions from WYSIWYG. Ensure content is sanitized before storing/passing. */}
        {/* For NSBS, question_text is TEXT, so this might not be needed unless it's later changed to allow HTML. */}
        {/* For now, assume plain text or pre-sanitized simple HTML. */}
        <p 
            className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white leading-relaxed"
            dangerouslySetInnerHTML={{ __html: questionText }} // Ensure questionText is sanitized if it contains HTML
        />
      </div>

      <fieldset aria-labelledby={}>
        <legend id={} className="sr-only">{}</legend>
        <div className="space-y-4">
          {options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrectInReview = isReviewMode && correctAnswer === option.id;
            const isIncorrectInReview = isReviewMode && userAnswer === option.id && correctAnswer !== option.id;

            let ringColor = 'focus:ring-blue-500 dark:focus:ring-blue-400';
            let bgColor = 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
            let textColor = 'text-gray-800 dark:text-gray-200';
            let borderColor = 'border-gray-300 dark:border-gray-600';
            
            if (isSelected && !isReviewMode) {
              bgColor = 'bg-blue-100 dark:bg-blue-700/60';
              borderColor = 'border-blue-500 dark:border-blue-400';
              textColor = 'text-blue-700 dark:text-blue-200';
            }

            if (isReviewMode) {
                if (isCorrectInReview) {
                    bgColor = 'bg-green-100 dark:bg-green-800';
                    borderColor = 'border-green-500 dark:border-green-400';
                    textColor = 'text-green-700 dark:text-green-200 font-semibold';
                } else if (isIncorrectInReview) {
                    bgColor = 'bg-red-100 dark:bg-red-800';
                    borderColor = 'border-red-500 dark:border-red-400';
                    textColor = 'text-red-700 dark:text-red-200 font-semibold';
                } else {
                    // Non-selected, non-correct/incorrect options in review mode
                    bgColor = 'bg-gray-100 dark:bg-gray-700';
                }
            }


            return (
              <label
                key={option.id}
                htmlFor={}
                className={`
                  flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-150
                  ${borderColor} ${bgColor} ${textColor}
                  ${isReviewMode ? 'cursor-default' : ''}
                  ${isSelected && !isReviewMode ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                  ${isCorrectInReview ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}
                  ${isIncorrectInReview ? 'ring-2 ring-red-500 dark:ring-red-400' : ''}
                `}
              >
                <input
                  type="radio"
                  id={}
                  name={}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => !isReviewMode && onAnswerSelect(option.id)}
                  disabled={isReviewMode}
                  className="h-5 w-5 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 focus:ring-offset-0 focus:ring-2 mr-4 disabled:opacity-70"
                />
                {/* Assume option.text is plain text. If it can be HTML, sanitize it. */}
                <span className="text-sm sm:text-base flex-1" dangerouslySetInnerHTML={{ __html: option.text }} />
                {isCorrectInReview && <span className="ml-2 text-xs font-bold text-green-600 dark:text-green-300">(Correct)</span>}
                {isIncorrectInReview && <span className="ml-2 text-xs font-bold text-red-600 dark:text-red-300">(Your Answer - Incorrect)</span>}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};

export default NsbsExamQuestionDisplay;
