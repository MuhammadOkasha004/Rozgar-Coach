import { useState } from 'react';
import { ChevronDown, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import type { FeedbackItem } from '../services/types';

interface Props {
  item: FeedbackItem;
}

export default function QAReview({ item }: Props) {
  const [open, setOpen] = useState(false);

  const scoreColor =
    item.feedback.questionScore >= 80
      ? 'text-green-600 bg-green-50 border-green-300 dark:bg-gray-800 dark:text-green-400 dark:border-green-600'
      : item.feedback.questionScore >= 60
      ? 'text-lime-700 bg-lime-50 border-lime-400 dark:bg-gray-800 dark:text-lime-400 dark:border-lime-600'
      : item.feedback.questionScore >= 40
      ? 'text-yellow-700 bg-yellow-50 border-yellow-300 dark:bg-gray-800 dark:text-yellow-400 dark:border-yellow-600'
      : 'text-orange-600 bg-orange-50 border-orange-300 dark:bg-gray-800 dark:text-orange-400 dark:border-orange-600';

  return (
    <div className="border border-lime-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-lime-50 dark:hover:bg-gray-800 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1">
          <div
            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-lg ${scoreColor}`}
          >
            {item.feedback.questionScore}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-lime-700 dark:text-lime-400 uppercase tracking-wider mb-1">
              Question {item.questionNumber}
            </div>
            <div className="text-sm text-darkgreen dark:text-lime-100 font-medium line-clamp-1">{item.question}</div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-lime-700 dark:text-lime-400 transition-transform flex-shrink-0 ml-2 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-lime-200 dark:border-gray-700 bg-lime-50/30 dark:bg-gray-800/50 p-5 space-y-4 animate-fade-in">
          <div>
            <div className="text-xs font-bold text-darkgreen dark:text-lime-100 uppercase mb-1.5">Your Answer</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900 p-3 rounded-lg border border-lime-100 dark:border-gray-700">
              {item.userAnswer}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold text-darkgreen dark:text-lime-100 uppercase mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              AI Feedback
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900 p-3 rounded-lg border border-lime-100 dark:border-gray-700">
              {item.feedback.detailedFeedback}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold text-darkgreen dark:text-lime-100 uppercase mb-1.5">Ideal Answer</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-lime-100/50 dark:bg-gray-800 p-3 rounded-lg border border-lime-200 dark:border-gray-600 italic">
              {item.feedback.idealAnswer}
            </p>
          </div>

          {item.feedback.strongPoints.length > 0 && (
            <div>
              <div className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-1.5">Strong Points</div>
              <ul className="space-y-1">
                {item.feedback.strongPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.feedback.improvementAreas.length > 0 && (
            <div>
              <div className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase mb-1.5">Improvement Areas</div>
              <ul className="space-y-1">
                {item.feedback.improvementAreas.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-orange-500 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
