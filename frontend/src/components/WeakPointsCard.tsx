import { AlertTriangle, BookOpen, Lightbulb, ListChecks } from 'lucide-react';
import type { WeakPoint } from '../services/weakPoints';

interface Props {
  weakPoints: WeakPoint[];
}

const CATEGORY_LABEL: Record<WeakPoint['category'], string> = {
  knowledge: 'Knowledge Gap',
  communication: 'Communication',
  relevance: 'Answer Focus',
  confidence: 'Confidence',
  general: 'General',
};

export default function WeakPointsCard({ weakPoints }: Props) {
  if (weakPoints.length === 0) {
    return (
      <div className="card-static animate-fade-up bg-gradient-to-br from-green-50 to-lime-50 dark:from-gray-800 dark:to-gray-900 border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-gray-700 flex items-center justify-center">
            <ListChecks className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-darkgreen dark:text-lime-100">Areas to Improve <span className="text-green-600 dark:text-green-400">— Focus on These 👇</span></h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              No weak points detected — excellent performance!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-static animate-fade-up bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 border-orange-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-extrabold text-xl text-darkgreen dark:text-lime-100 flex items-center gap-2">
            Areas to Improve <span className="text-orange-600 dark:text-orange-400">— Focus on These 👇</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Each weak area is paired with a concrete improvement tip
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {weakPoints.map((wp, i) => {
          const Icon = wp.icon;
          const label = CATEGORY_LABEL[wp.category];
          return (
            <li
              key={i}
              className="group relative rounded-2xl border-2 border-orange-200 bg-white/80 hover:bg-white hover:border-orange-300 transition-all p-4 sm:p-5 dark:border-gray-600 dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:hover:border-orange-400"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-gray-700 dark:to-gray-700 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider dark:bg-gray-700 dark:text-orange-400">
                      <BookOpen className="w-3 h-3" />
                      {label}
                    </span>
                    {wp.questionNumbers.length > 0 && (
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Q: {wp.questionNumbers.join(', ')}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-darkgreen dark:text-lime-100 mb-1.5 leading-snug">
                    {wp.area}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <Lightbulb className="w-4 h-4 text-lime-600 dark:text-lime-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="font-semibold text-lime-700 dark:text-lime-400">
                        Tip:{' '}
                      </span>
                      {wp.suggestion}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
