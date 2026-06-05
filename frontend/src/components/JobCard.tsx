import { Check } from 'lucide-react';
import { getIcon } from '../services/jobData';
import type { JobCategory } from '../services/types';

interface Props {
  job: JobCategory;
  selected: boolean;
  onSelect: () => void;
}

const difficultyColors = {
  beginner: 'badge-green',
  intermediate: 'badge-lime',
  expert: 'badge-orange',
};

export default function JobCard({ job, selected, onSelect }: Props) {
  const Icon = getIcon(job.icon);
  return (
    <button
      onClick={onSelect}
      className={`group relative w-full text-left card overflow-hidden transition-all duration-300 ${
        selected
          ? 'border-lime-500 ring-2 ring-lime-400 shadow-lime -translate-y-1'
          : 'hover:-translate-y-1'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-7 h-7 bg-lime-500 rounded-full flex items-center justify-center shadow-lime">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}

      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>

      <h3 className="font-bold text-lg text-darkgreen dark:text-lime-100 mb-1">{job.title}</h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{job.description}</p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-lime-100 dark:border-gray-700">
        <span className={difficultyColors[job.difficulty]}>
          {job.difficulty.charAt(0).toUpperCase() + job.difficulty.slice(1)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {job.questionCount}+ Questions
        </span>
      </div>
    </button>
  );
}
