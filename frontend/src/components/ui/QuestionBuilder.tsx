import { useState } from 'react';
import type { QuestionAndChoice, QuestionType } from '@/types';

interface QuestionBuilderProps {
  questions: QuestionAndChoice[];
  onChange: (questions: QuestionAndChoice[]) => void;
  maxQuestions?: number;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'stars', label: 'Star Rating' },
];

export function QuestionBuilder({
  questions,
  onChange,
  maxQuestions = 10,
}: QuestionBuilderProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addQuestion = () => {
    if (questions.length >= maxQuestions) return;

    const newQuestion: QuestionAndChoice = {
      question: '',
      question_type: 'radio',
      choices: ['', ''],
    };
    onChange([...questions, newQuestion]);
    setExpandedIndex(questions.length);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    onChange(newQuestions);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const updateQuestion = (index: number, updates: Partial<QuestionAndChoice>) => {
    const newQuestions = questions.map((q, i) => {
      if (i === index) {
        return { ...q, ...updates };
      }
      return q;
    });
    onChange(newQuestions);
  };

  const addChoice = (questionIndex: number) => {
    const question = questions[questionIndex];
    updateQuestion(questionIndex, {
      choices: [...question.choices, ''],
    });
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const question = questions[questionIndex];
    if (question.choices.length <= 2) return; // Minimum 2 choices
    updateQuestion(questionIndex, {
      choices: question.choices.filter((_, i) => i !== choiceIndex),
    });
  };

  const updateChoice = (questionIndex: number, choiceIndex: number, value: string) => {
    const question = questions[questionIndex];
    const newChoices = question.choices.map((c, i) =>
      i === choiceIndex ? value : c
    );
    updateQuestion(questionIndex, { choices: newChoices });
  };

  return (
    <div className="space-y-4">
      {questions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No custom questions added yet.</p>
      ) : (
        <div className="space-y-3">
          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* Question Header */}
              <div
                className="flex items-center justify-between p-3 bg-muted cursor-pointer"
                onClick={() => setExpandedIndex(expandedIndex === qIndex ? null : qIndex)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {question.question || `Question ${qIndex + 1}`}
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {QUESTION_TYPES.find((t) => t.value === question.question_type)?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(qIndex);
                    }}
                    className="text-danger hover:text-danger/80 text-sm"
                  >
                    Remove
                  </button>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedIndex === qIndex ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Question Details (Expandable) */}
              {expandedIndex === qIndex && (
                <div className="p-4 space-y-4 border-t border-border">
                  {/* Question Text */}
                  <div className="space-y-2">
                    <label className="label">Question Text</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(qIndex, { question: e.target.value })
                      }
                      className="input"
                      placeholder="Enter your question"
                    />
                  </div>

                  {/* Question Type */}
                  <div className="space-y-2">
                    <label className="label">Question Type</label>
                    <select
                      value={question.question_type}
                      onChange={(e) =>
                        updateQuestion(qIndex, {
                          question_type: e.target.value as QuestionType,
                        })
                      }
                      className="input"
                    >
                      {QUESTION_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Choices (for radio and dropdown) */}
                  {question.question_type !== 'stars' && (
                    <div className="space-y-2">
                      <label className="label">Choices</label>
                      <div className="space-y-2">
                        {question.choices.map((choice, cIndex) => (
                          <div key={cIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={choice}
                              onChange={(e) =>
                                updateChoice(qIndex, cIndex, e.target.value)
                              }
                              className="input flex-1"
                              placeholder={`Choice ${cIndex + 1}`}
                            />
                            {question.choices.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeChoice(qIndex, cIndex)}
                                className="text-danger hover:text-danger/80"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addChoice(qIndex)}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        + Add Choice
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Question Button */}
      {questions.length < maxQuestions && (
        <button
          type="button"
          onClick={addQuestion}
          className="btn-outline w-full"
        >
          + Add Custom Question
        </button>
      )}

      {questions.length >= maxQuestions && (
        <p className="text-sm text-muted-foreground text-center">
          Maximum {maxQuestions} questions allowed
        </p>
      )}
    </div>
  );
}

export default QuestionBuilder;
