interface Props {
  label: string;
  score: number;
  comment?: string;
  color?: string;
}

export default function ScoreBar({ label, score, comment, color = 'bg-lime-500' }: Props) {
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-darkgreen dark:text-lime-100 text-sm">{label}</span>
        <span className="text-lg font-extrabold text-lime-700 dark:text-lime-400">{score}<span className="text-xs text-gray-500 dark:text-gray-400">/100</span></span>
      </div>
      <div className="w-full h-2.5 bg-lime-50 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {comment && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 italic">{comment}</p>}
    </div>
  );
}
